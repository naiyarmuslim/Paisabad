import React, { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Account, Person, Transaction, FinanceData, DashboardMetrics } from '@/types/finance';
import { calculateMetrics, calculateAccountBalance } from '@/utils/calculations';

const STORAGE_KEY = 'paisabad_finance_data';

// Default accounts and persons
const defaultAccounts: Account[] = [
  {
    id: 'equity-balancer',
    name: 'Equity Balancer',
    type: 'assetCash',
    institution: 'System',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1',
    name: 'N26 Current',
    type: 'assetCash',
    institution: 'N26',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Other Bank',
    type: 'assetCash',
    institution: 'Other Bank',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'PayPal',
    type: 'assetCash',
    institution: 'PayPal',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'N26 Stocks',
    type: 'assetInvestment',
    institution: 'N26',
    currency: 'EUR',
    isSavings: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Friend A',
    type: 'liabilityFriend',
    institution: 'Personal',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Friend B',
    type: 'liabilityFriend',
    institution: 'Personal',
    currency: 'EUR',
    isSavings: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultPersons: Person[] = [
  { id: '1', name: 'Me', isFriend: false },
  { id: '2', name: 'Friend A', isFriend: true },
  { id: '3', name: 'Friend B', isFriend: true },
];

export const [FinanceProvider, useFinance] = createContextHook(() => {
  const [accounts, setAccounts] = useState<Account[]>(defaultAccounts);
  const [persons, setPersons] = useState<Person[]>(defaultPersons);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [accounts, persons, transactions, isLoading]);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: FinanceData = JSON.parse(stored);
        // Convert date strings back to Date objects
        const parsedTransactions = data.transactions.map(t => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }));
        const parsedAccounts = data.accounts.map(a => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }));
        setAccounts(parsedAccounts);
        setPersons(data.persons);
        setTransactions(parsedTransactions);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      const data: FinanceData = {
        accounts,
        persons,
        transactions,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving finance data:', error);
    }
  };

  const addAccount = (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAccounts(prev => [...prev, newAccount]);
    return newAccount;
  };

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account => 
      account.id === id 
        ? { ...account, ...updates, updatedAt: new Date() }
        : account
    ));
  };

  const deleteAccount = (id: string) => {
    // Check if account has transactions
    const hasTransactions = transactions.some(t => 
      t.splits.some(s => s.accountId === id)
    );
    if (hasTransactions) {
      throw new Error('Cannot delete account with transactions');
    }
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(transaction => 
      transaction.id === id 
        ? { ...transaction, ...updates, updatedAt: new Date() }
        : transaction
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const getAccountBalance = (accountId: string): number => {
    return calculateAccountBalance(accountId, transactions);
  };

  const metrics: DashboardMetrics = useMemo(() => {
    return calculateMetrics(accounts, transactions, persons);
  }, [accounts, transactions, persons]);

  return {
    accounts,
    persons,
    transactions,
    isLoading,
    metrics,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getAccountBalance,
  };
});