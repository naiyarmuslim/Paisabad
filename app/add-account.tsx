import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useFinance } from '@/hooks/finance-store';
import { Account } from '@/types/finance';

export default function AddAccountScreen() {
  const { addAccount } = useFinance();
  const [name, setName] = useState('');
  const [type, setType] = useState<Account['type']>('assetCash');
  const [institution, setInstitution] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [isSavings, setIsSavings] = useState(false);

  const accountTypes: { value: Account['type']; label: string }[] = [
    { value: 'assetCash', label: 'Cash' },
    { value: 'assetInvestment', label: 'Investment' },
    { value: 'liabilityFriend', label: 'Friend Liability' },
    { value: 'liabilityCredit', label: 'Credit' },
  ];

  const handleSave = () => {
    if (!name || !institution) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addAccount({
      name,
      type,
      institution,
      currency,
      isSavings,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Account Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., N26 Checking"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Account Type *</Text>
          <View style={styles.pickerContainer}>
            {accountTypes.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.pickerOption,
                  type === option.value && styles.pickerOptionSelected,
                ]}
                onPress={() => setType(option.value)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  type === option.value && styles.pickerOptionTextSelected,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Institution *</Text>
          <TextInput
            style={styles.input}
            value={institution}
            onChangeText={setInstitution}
            placeholder="e.g., N26, PayPal"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.pickerContainer}>
            {['EUR', 'USD', 'GBP'].map(curr => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.pickerOption,
                  currency === curr && styles.pickerOptionSelected,
                ]}
                onPress={() => setCurrency(curr)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  currency === curr && styles.pickerOptionTextSelected,
                ]}>
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(type === 'assetCash' || type === 'assetInvestment') && (
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.label}>Is Savings Account</Text>
                <Text style={styles.switchDescription}>
                  Mark if this account is for savings
                </Text>
              </View>
              <Switch
                value={isSavings}
                onValueChange={setIsSavings}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.textPrimary}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  form: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pickerOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pickerOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  saveButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});