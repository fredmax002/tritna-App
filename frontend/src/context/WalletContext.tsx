import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { walletAPI } from '../services/api';
import { useAuth } from './AuthContext';

export type PaymentMethod = 'afrimoney' | 'orange_money' | 'visa' | 'cash' | 'wallet';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  payment_method: string;
  status: string;
  created_at: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addMoney: (amount: number, method: PaymentMethod) => Promise<void>;
  withdraw: (amount: number, method: PaymentMethod) => Promise<void>;
  sendMoney: (amount: number, phone: string) => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshWallet = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const walletData = await walletAPI.getWallet(user.id);
      setBalance(walletData.balance || 0);
      setTransactions(walletData.transactions || []);
    } catch (err: any) {
      console.error('Error fetching wallet:', err);
      setError(err.response?.data?.detail || 'Failed to load wallet');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      refreshWallet();
    }
  }, [user?.id, refreshWallet]);

  const addMoney = async (amount: number, method: PaymentMethod) => {
    if (!user?.id) throw new Error('Not logged in');

    setIsLoading(true);
    setError(null);

    try {
      const result = await walletAPI.addMoney(user.id, {
        amount,
        payment_method: method,
      });

      if (result.success) {
        setBalance(result.new_balance);
        await refreshWallet(); // Refresh to get updated transactions
      } else {
        throw new Error(result.message || 'Failed to add money');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to add money';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (amount: number, method: PaymentMethod) => {
    if (!user?.id) throw new Error('Not logged in');

    setIsLoading(true);
    setError(null);

    try {
      const result = await walletAPI.withdraw(user.id, {
        amount,
        payment_method: method,
      });

      if (result.success) {
        setBalance(result.new_balance);
        await refreshWallet();
      } else {
        throw new Error(result.message || 'Failed to withdraw');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to withdraw';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMoney = async (amount: number, phone: string) => {
    if (!user?.id) throw new Error('Not logged in');

    setIsLoading(true);
    setError(null);

    try {
      const result = await walletAPI.sendMoney(user.id, {
        amount,
        phone,
      });

      if (result.success) {
        setBalance(result.new_balance);
        await refreshWallet();
      } else {
        throw new Error(result.message || 'Failed to send money');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to send money';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        error,
        addMoney,
        withdraw,
        sendMoney,
        refreshWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
