import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PaymentMethod = 'afrimoney' | 'orange_money' | 'visa' | 'cash';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  addMoney: (amount: number, method: PaymentMethod) => Promise<void>;
  withdraw: (amount: number, method: PaymentMethod) => Promise<void>;
  sendMoney: (amount: number, phone: string) => Promise<void>;
  payForService: (amount: number, service: string) => Promise<void>;
  addPaymentMethod: (method: PaymentMethod) => Promise<void>;
  removePaymentMethod: (method: PaymentMethod) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock initial data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    amount: 100000,
    description: 'Wallet Top-up',
    paymentMethod: 'afrimoney',
    date: new Date().toISOString(),
    status: 'completed',
  },
  {
    id: '2',
    type: 'debit',
    amount: 15000,
    description: 'TRITNA RAYD - Ride to Downtown',
    paymentMethod: 'cash',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
  },
  {
    id: '3',
    type: 'debit',
    amount: 45000,
    description: "TRITNA FOOD - Order from Mama's Kitchen",
    paymentMethod: 'orange_money',
    date: new Date(Date.now() - 172800000).toISOString(),
    status: 'completed',
  },
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(250000);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(['afrimoney', 'orange_money', 'visa']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const savedBalance = await AsyncStorage.getItem('tritna-balance');
      const savedTransactions = await AsyncStorage.getItem('tritna-transactions');
      
      if (savedBalance) setBalance(parseInt(savedBalance, 10));
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const saveWalletData = async (newBalance: number, newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem('tritna-balance', newBalance.toString());
      await AsyncStorage.setItem('tritna-transactions', JSON.stringify(newTransactions));
    } catch (error) {
      console.error('Error saving wallet data:', error);
    }
  };

  const addMoney = async (amount: number, method: PaymentMethod) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'credit',
        amount,
        description: 'Wallet Top-up',
        paymentMethod: method,
        date: new Date().toISOString(),
        status: 'completed',
      };

      const newBalance = balance + amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      await saveWalletData(newBalance, newTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (amount: number, method: PaymentMethod) => {
    setIsLoading(true);
    try {
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description: 'Withdrawal',
        paymentMethod: method,
        date: new Date().toISOString(),
        status: 'completed',
      };

      const newBalance = balance - amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      await saveWalletData(newBalance, newTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMoney = async (amount: number, phone: string) => {
    setIsLoading(true);
    try {
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description: `Sent to ${phone}`,
        paymentMethod: 'afrimoney',
        date: new Date().toISOString(),
        status: 'completed',
      };

      const newBalance = balance - amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      await saveWalletData(newBalance, newTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const payForService = async (amount: number, service: string) => {
    setIsLoading(true);
    try {
      if (amount > balance) {
        throw new Error('Insufficient balance');
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'debit',
        amount,
        description: service,
        paymentMethod: 'afrimoney',
        date: new Date().toISOString(),
        status: 'completed',
      };

      const newBalance = balance - amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      await saveWalletData(newBalance, newTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (method: PaymentMethod) => {
    if (!paymentMethods.includes(method)) {
      setPaymentMethods([...paymentMethods, method]);
    }
  };

  const removePaymentMethod = async (method: PaymentMethod) => {
    setPaymentMethods(paymentMethods.filter(m => m !== method));
  };

  const refreshTransactions = async () => {
    // In a real app, this would fetch from API
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        paymentMethods,
        isLoading,
        addMoney,
        withdraw,
        sendMoney,
        payForService,
        addPaymentMethod,
        removePaymentMethod,
        refreshTransactions,
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
