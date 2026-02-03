import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface User {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sendOTP: (phone: string) => Promise<{ success: boolean; otp?: string; message?: string }>;
  verifyOTP: (phone: string, otp: string, userData?: { first_name?: string; last_name?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'tritna-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Refresh user data from server
        try {
          const freshUser = await authAPI.getUser(parsedUser.id);
          const updatedUser = {
            id: freshUser.id,
            phone: freshUser.phone,
            first_name: freshUser.first_name,
            last_name: freshUser.last_name,
            email: freshUser.email,
            role: freshUser.role,
          };
          setUser(updatedUser);
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phone: string) => {
    try {
      const response = await authAPI.sendOTP(phone);
      return {
        success: response.success,
        otp: response.otp, // For development - remove in production
        message: response.message,
      };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Failed to send OTP',
      };
    }
  };

  const verifyOTP = async (
    phone: string,
    otp: string,
    userData?: { first_name?: string; last_name?: string; email?: string }
  ) => {
    try {
      const response = await authAPI.verifyOTP({
        phone,
        otp,
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        email: userData?.email,
      });

      if (response.success && response.user) {
        const newUser: User = {
          id: response.user.id,
          phone: response.user.phone,
          first_name: response.user.first_name,
          last_name: response.user.last_name,
          email: response.user.email,
          role: response.user.role,
        };

        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.response?.data?.detail || 'Verification failed');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Not logged in');

    try {
      const updatedUser = await authAPI.updateUser(user.id, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });

      const newUser: User = {
        id: updatedUser.id,
        phone: updatedUser.phone,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        role: updatedUser.role,
      };

      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        sendOTP,
        verifyOTP,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
