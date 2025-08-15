import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Save, Trash2 } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useFinance } from '@/hooks/finance-store';

import { formatCurrency } from '@/utils/currency';

export default function EditAccountScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { accounts, updateAccount, deleteAccount, getAccountBalance, addTransaction } = useFinance();
  
  const account = accounts.find(a => a.id === id);
  const currentBalance = account ? getAccountBalance(account.id) : 0;
  
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [isSavings, setIsSavings] = useState(false);
  const [balanceAdjustment, setBalanceAdjustment] = useState('');
  
  useEffect(() => {
    if (account) {
      setName(account.name);
      setInstitution(account.institution);
      setIsSavings(account.isSavings);
    }
  }, [account]);
  
  if (!account) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Account not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Account name is required');
      return;
    }
    
    updateAccount(account.id, {
      name: name.trim(),
      institution: institution.trim(),
      isSavings,
    });
    
    // Handle balance adjustment if provided
    if (balanceAdjustment.trim()) {
      const adjustment = parseFloat(balanceAdjustment);
      if (!isNaN(adjustment) && adjustment !== 0) {
        const targetBalance = adjustment;
        const currentBal = getAccountBalance(account.id);
        const difference = targetBalance - currentBal;
        
        if (difference !== 0) {
          // Create a balance adjustment transaction
          const transactionId = Date.now().toString();
          addTransaction({
            date: new Date(),
            payee: 'Balance Adjustment',
            memo: `Adjusted ${account.name} balance`,
            splits: [
              {
                id: Date.now().toString(),
                transactionId,
                accountId: account.id,
                amount: difference,
                ownerId: '1', // Me
              },
              {
                id: (Date.now() + 1).toString(),
                transactionId,
                accountId: 'equity-balancer', // We'll need to create this virtual account
                amount: -difference,
                ownerId: '1', // Me
              },
            ],
          });
        }
      }
    }
    
    router.back();
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${account.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              deleteAccount(account.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete account');
            }
          },
        },
      ]
    );
  };
  
  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'assetCash': return 'Cash Asset';
      case 'assetInvestment': return 'Investment Asset';
      case 'liabilityFriend': return 'Friend Liability';
      case 'liabilityCredit': return 'Credit Liability';
      default: return type;
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit Account',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Account name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Institution</Text>
            <TextInput
              style={styles.input}
              value={institution}
              onChangeText={setInstitution}
              placeholder="Bank or institution"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{getAccountTypeLabel(account.type)}</Text>
            </View>
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Currency</Text>
            <View style={styles.readOnlyField}>
              <Text style={styles.readOnlyText}>{account.currency}</Text>
            </View>
          </View>
          
          {account.type === 'assetCash' && (
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsSavings(!isSavings)}
            >
              <View style={[styles.checkbox, isSavings && styles.checkboxChecked]}>
                {isSavings && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>This is a savings account</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance</Text>
          
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={[styles.balanceAmount, { color: currentBalance >= 0 ? colors.positive : colors.negative }]}>
              {formatCurrency(currentBalance, account.currency)}
            </Text>
          </View>
          
          <View style={styles.field}>
            <Text style={styles.label}>Set New Balance</Text>
            <TextInput
              style={styles.input}
              value={balanceAdjustment}
              onChangeText={setBalanceAdjustment}
              placeholder="Enter new balance amount"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
            <Text style={styles.helpText}>
              Leave empty to keep current balance. Enter a number to set the exact balance.
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color={colors.danger} />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Save size={20} color={colors.textPrimary} />
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  readOnlyField: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  readOnlyText: {
    fontSize: 16,
    color: colors.textTertiary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceInfo: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});