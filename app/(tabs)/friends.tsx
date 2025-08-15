import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { User } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useFinance } from '@/hooks/finance-store';
import { formatCurrency } from '@/utils/currency';
import { getFriendBalance } from '@/utils/calculations';

export default function FriendsScreen() {
  const { persons, transactions, accounts } = useFinance();
  const friends = persons.filter(p => p.isFriend);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Track money you're temporarily holding for friends
        </Text>
      </View>

      {friends.map(friend => {
        const friendAccount = accounts.find(a => a.name === friend.name);
        const balance = friendAccount ? getFriendBalance(friend.id, transactions) : 0;
        
        return (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.friendHeader}>
              <View style={styles.iconContainer}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendStatus}>
                  {balance > 0 ? 'You owe' : balance < 0 ? 'Owes you' : 'Settled'}
                </Text>
              </View>
              <Text style={[styles.balance, { color: balance > 0 ? colors.warning : colors.success }]}>
                {formatCurrency(Math.abs(balance), 'EUR')}
              </Text>
            </View>
            
            <View style={styles.recentActivity}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              {transactions
                .filter(t => t.splits.some(s => s.ownerId === friend.id))
                .slice(0, 3)
                .map(transaction => (
                  <View key={transaction.id} style={styles.activityItem}>
                    <Text style={styles.activityDate}>
                      {new Intl.DateTimeFormat('en-EU', { 
                        day: 'numeric', 
                        month: 'short' 
                      }).format(transaction.date)}
                    </Text>
                    <Text style={styles.activityMemo} numberOfLines={1}>
                      {transaction.memo || transaction.payee || 'Transfer'}
                    </Text>
                    <Text style={styles.activityAmount}>
                      {formatCurrency(
                        Math.abs(transaction.splits.find(s => s.ownerId === friend.id)?.amount || 0),
                        'EUR'
                      )}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  friendCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  friendStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  balance: {
    fontSize: 20,
    fontWeight: '700',
  },
  recentActivity: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  activityDate: {
    fontSize: 12,
    color: colors.textTertiary,
    width: 60,
  },
  activityMemo: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    marginHorizontal: spacing.sm,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});