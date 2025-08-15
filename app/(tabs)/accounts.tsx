import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { AccountRow } from '@/components/AccountRow';
import { useFinance } from '@/hooks/finance-store';

export default function AccountsScreen() {
  const { accounts, getAccountBalance } = useFinance();
  const [selectedType, setSelectedType] = useState<string>('all');

  const accountTypes = [
    { id: 'all', label: 'All' },
    { id: 'assetCash', label: 'Cash' },
    { id: 'assetInvestment', label: 'Investments' },
    { id: 'liabilityFriend', label: 'Friends' },
  ];

  const visibleAccounts = accounts.filter(a => a.id !== 'equity-balancer');
  const filteredAccounts = selectedType === 'all' 
    ? visibleAccounts 
    : visibleAccounts.filter(a => a.type === selectedType);

  const totalBalance = filteredAccounts.reduce((sum, account) => {
    return sum + getAccountBalance(account.id);
  }, 0);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {accountTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterChip, selectedType === type.id && styles.filterChipActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={[styles.filterText, selectedType === type.id && styles.filterTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredAccounts.map(account => (
          <AccountRow
            key={account.id}
            account={account}
            balance={getAccountBalance(account.id)}
            onPress={() => router.push(`/edit-account?id=${account.id}`)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add-account')}
        activeOpacity={0.7}
      >
        <Plus size={20} color={colors.textPrimary} />
        <Text style={styles.addButtonText}>Add Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxHeight: 60,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.textPrimary,
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  addButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});