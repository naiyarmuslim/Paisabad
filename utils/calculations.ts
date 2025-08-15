import { Account, Transaction, Split, Person, DashboardMetrics } from '@/types/finance';

export function calculateAccountBalance(
  accountId: string,
  transactions: Transaction[]
): number {
  let balance = 0;
  
  transactions.forEach(transaction => {
    transaction.splits.forEach(split => {
      if (split.accountId === accountId) {
        balance += split.amount;
      }
    });
  });
  
  return balance;
}

export function calculateMetrics(
  accounts: Account[],
  transactions: Transaction[],
  persons: Person[]
): DashboardMetrics {
  const balances = new Map<string, number>();
  
  // Calculate all account balances
  accounts.forEach(account => {
    balances.set(account.id, calculateAccountBalance(account.id, transactions));
  });
  
  // Calculate metrics
  let assetCashTotal = 0;
  let assetInvestmentTotal = 0;
  let liabilityFriendTotal = 0;
  let liabilityTotal = 0;
  let savingsTotal = 0;
  
  accounts.forEach(account => {
    const balance = balances.get(account.id) || 0;
    
    switch (account.type) {
      case 'assetCash':
        assetCashTotal += balance;
        if (account.isSavings) {
          savingsTotal += balance;
        }
        break;
      case 'assetInvestment':
        assetInvestmentTotal += balance;
        savingsTotal += balance;
        break;
      case 'liabilityFriend':
        liabilityFriendTotal += Math.abs(balance);
        liabilityTotal += Math.abs(balance);
        break;
      case 'liabilityCredit':
        liabilityTotal += Math.abs(balance);
        break;
    }
  });
  
  const temporaryHoldings = liabilityFriendTotal;
  const availableCash = assetCashTotal - temporaryHoldings;
  const realSavings = savingsTotal;
  const totalAssets = assetCashTotal + assetInvestmentTotal;
  const netWorth = totalAssets - liabilityTotal;
  
  return {
    availableCash,
    temporaryHoldings,
    realSavings,
    netWorth,
  };
}

export function getAccountsByType(
  accounts: Account[],
  type: Account['type']
): Account[] {
  return accounts.filter(account => account.type === type);
}

export function getFriendBalance(
  personId: string,
  transactions: Transaction[]
): number {
  let balance = 0;
  
  transactions.forEach(transaction => {
    transaction.splits.forEach(split => {
      if (split.ownerId === personId) {
        balance += split.amount;
      }
    });
  });
  
  return balance;
}