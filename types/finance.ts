export interface Account {
  id: string;
  name: string;
  type: 'assetCash' | 'assetInvestment' | 'liabilityFriend' | 'liabilityCredit';
  institution: string;
  currency: string;
  isSavings: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Person {
  id: string;
  name: string;
  isFriend: boolean;
}

export interface Split {
  id: string;
  transactionId: string;
  accountId: string;
  amount: number; // Store as cents to avoid decimal issues
  ownerId?: string; // Person ID
}

export interface Transaction {
  id: string;
  date: Date;
  payee?: string;
  memo?: string;
  splits: Split[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceData {
  accounts: Account[];
  persons: Person[];
  transactions: Transaction[];
}

export interface DashboardMetrics {
  availableCash: number;
  temporaryHoldings: number;
  realSavings: number;
  netWorth: number;
}