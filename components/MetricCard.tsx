import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { formatCurrency } from '@/utils/currency';

interface MetricCardProps {
  title: string;
  amount: number;
  currency?: string;
  color?: string;
  subtitle?: string;
}

export function MetricCard({ 
  title, 
  amount, 
  currency = 'EUR', 
  color = colors.primary,
  subtitle 
}: MetricCardProps) {
  const isNegative = amount < 0;
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color: isNegative ? colors.negative : color }]}>
        {formatCurrency(amount, currency)}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});