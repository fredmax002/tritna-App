import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

const { width, height } = Dimensions.get('window');
const splashLogo = require('../assets/images/splash-logo.png');

export default function SplashScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for 2 seconds, then navigate
    const timer = setTimeout(() => {
      setShowSplash(false);
      
      if (!isLoading) {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading]);

  // If still loading auth state, wait
  useEffect(() => {
    if (!showSplash && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, isAuthenticated, showSplash]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0B0F5B" />
      <Image 
        source={splashLogo} 
        style={styles.logo} 
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F5B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
});
