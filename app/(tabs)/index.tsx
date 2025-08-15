import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { MetricCard } from '@/components/MetricCard';
import { AccountRow } from '@/components/AccountRow';
import { useFinance } from '@/hooks/finance-store';

export default function HomeScreen() {
  const { accounts, metrics, getAccountBalance, isLoading } = useFinance();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.title}>Paisabad</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <MetricCard
              title="Available Cash"
              amount={metrics.availableCash}
              color={colors.primary}
              subtitle="Your money"
            />
          </View>
          <View style={styles.metricItem}>
            <MetricCard
              title="Temporary Holdings"
              amount={metrics.temporaryHoldings}
              color={colors.warning}
              subtitle="Friends' money"
            />
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <MetricCard
              title="Real Savings"
              amount={metrics.realSavings}
              color={colors.success}
              subtitle="Investments + Savings"
            />
          </View>
          <View style={styles.metricItem}>
            <MetricCard
              title="Net Worth"
              amount={metrics.netWorth}
              color={metrics.netWorth >= 0 ? colors.positive : colors.negative}
              subtitle="Assets - Liabilities"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <TouchableOpacity onPress={() => router.push('/accounts')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {accounts.filter(a => a.id !== 'equity-balancer').slice(0, 4).map(account => (
          <AccountRow
            key={account.id}
            account={account}
            balance={getAccountBalance(account.id)}
            onPress={() => router.push(`/edit-account?id=${account.id}`)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/add-transaction')}
        activeOpacity={0.8}
      >
        <Plus size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricsGrid: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricItem: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});