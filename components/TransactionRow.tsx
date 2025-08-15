import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/currency';
import { Transaction, Account } from '@/types/finance';

interface TransactionRowProps {
  transaction: Transaction;
  accounts: Account[];
  onPress: () => void;
}

export function TransactionRow({ transaction, accounts, onPress }: TransactionRowProps) {
  // Calculate total amount (absolute value of first split)
  const amount = Math.abs(transaction.splits[0]?.amount || 0);
  const isIncome = transaction.splits[0]?.amount > 0;
  
  // Get account names for display
  const accountNames = transaction.splits
    .map(split => accounts.find(a => a.id === split.accountId)?.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(' → ');

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-EU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: isIncome ? colors.success + '20' : colors.danger + '20' }]}>
        {isIncome ? (
          <ArrowDownLeft size={20} color={colors.success} />
        ) : (
          <ArrowUpRight size={20} color={colors.danger} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.payee} numberOfLines={1}>
          {transaction.payee || accountNames}
        </Text>
        <Text style={styles.memo} numberOfLines={1}>
          {transaction.memo || formatDate(transaction.date)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.positive : colors.negative }]}>
        {isIncome ? '+' : '-'}{formatCurrency(amount, 'EUR')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  payee: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  memo: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});