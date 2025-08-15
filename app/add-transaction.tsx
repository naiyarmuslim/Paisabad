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
} from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useFinance } from '@/hooks/finance-store';
import { parseCurrency, formatCurrency } from '@/utils/currency';
import { Split } from '@/types/finance';

export default function AddTransactionScreen() {
  const { accounts, persons, addTransaction } = useFinance();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [payee, setPayee] = useState('');
  const [memo, setMemo] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');

  const friends = persons.filter(p => p.isFriend);

  const handleSave = () => {
    if (!fromAccountId || !toAccountId || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountCents = parseCurrency(amount);
    if (amountCents <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    const splits: Split[] = [
      {
        id: Date.now().toString(),
        transactionId: '',
        accountId: fromAccountId,
        amount: -amountCents,
        ownerId: ownerId || undefined,
      },
      {
        id: (Date.now() + 1).toString(),
        transactionId: '',
        accountId: toAccountId,
        amount: amountCents,
        ownerId: ownerId || undefined,
      },
    ];

    addTransaction({
      date,
      payee,
      memo,
      splits,
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
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {date.toLocaleDateString('en-EU', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>From Account *</Text>
          <View style={styles.pickerContainer}>
            {accounts.map(account => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.pickerOption,
                  fromAccountId === account.id && styles.pickerOptionSelected,
                ]}
                onPress={() => setFromAccountId(account.id)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  fromAccountId === account.id && styles.pickerOptionTextSelected,
                ]}>
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>To Account *</Text>
          <View style={styles.pickerContainer}>
            {accounts.map(account => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.pickerOption,
                  toAccountId === account.id && styles.pickerOptionSelected,
                ]}
                onPress={() => setToAccountId(account.id)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  toAccountId === account.id && styles.pickerOptionTextSelected,
                ]}>
                  {account.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount (EUR) *</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Owner (for friend money)</Text>
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={[
                styles.pickerOption,
                ownerId === '' && styles.pickerOptionSelected,
              ]}
              onPress={() => setOwnerId('')}
            >
              <Text style={[
                styles.pickerOptionText,
                ownerId === '' && styles.pickerOptionTextSelected,
              ]}>
                None
              </Text>
            </TouchableOpacity>
            {friends.map(friend => (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.pickerOption,
                  ownerId === friend.id && styles.pickerOptionSelected,
                ]}
                onPress={() => setOwnerId(friend.id)}
              >
                <Text style={[
                  styles.pickerOptionText,
                  ownerId === friend.id && styles.pickerOptionTextSelected,
                ]}>
                  {friend.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Payee</Text>
          <TextInput
            style={styles.input}
            value={payee}
            onChangeText={setPayee}
            placeholder="e.g., Grocery Store"
            placeholderTextColor={colors.textTertiary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Memo</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={memo}
            onChangeText={setMemo}
            placeholder="Add notes..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
          />
        </View>
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
  inputText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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