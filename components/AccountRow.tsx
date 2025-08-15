import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Wallet, TrendingUp, Users, CreditCard } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/currency';
import { Account } from '@/types/finance';

interface AccountRowProps {
  account: Account;
  balance: number;
  onPress: () => void;
}

export function AccountRow({ account, balance, onPress }: AccountRowProps) {
  const getIcon = () => {
    switch (account.type) {
      case 'assetCash':
        return <Wallet size={20} color={colors.primary} />;
      case 'assetInvestment':
        return <TrendingUp size={20} color={colors.success} />;
      case 'liabilityFriend':
        return <Users size={20} color={colors.warning} />;
      case 'liabilityCredit':
        return <CreditCard size={20} color={colors.danger} />;
    }
  };

  const getBalanceColor = () => {
    if (account.type.startsWith('liability')) {
      return balance < 0 ? colors.negative : colors.textPrimary;
    }
    return balance >= 0 ? colors.positive : colors.negative;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.institution}>{account.institution}</Text>
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.balance, { color: getBalanceColor() }]}>
          {formatCurrency(balance, account.currency)}
        </Text>
        <ChevronRight size={20} color={colors.textTertiary} />
      </View>
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
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  institution: {
    fontSize: 13,
    color: colors.textTertiary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
  },
});