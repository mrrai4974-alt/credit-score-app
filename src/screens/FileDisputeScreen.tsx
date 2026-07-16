import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../components/ui';
import { useCredit } from '../context/CreditContext';
import { useDisputes } from '../context/DisputeContext';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FileDispute'>;

const REASONS = [
  'This account is not mine',
  'Incorrect balance or limit',
  'Wrongly marked as late/default',
  'Duplicate account',
  'Account should be closed',
  'Other',
];

export function FileDisputeScreen({ route, navigation }: Props) {
  const { report } = useCredit();
  const { fileDispute } = useDisputes();

  const disputableAccounts = report?.accounts ?? [];
  const [subject, setSubject] = useState<string>(
    route.params?.subjectLabel ?? '',
  );
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState('');

  const canSubmit = subject.length > 0 && reason.length > 0;

  function onSubmit() {
    if (!canSubmit) return;
    const fullReason = details.trim() ? `${reason} — ${details.trim()}` : reason;
    fileDispute(subject, fullReason);
    navigation.replace('Disputes');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Which account?</Text>
        <View style={styles.chips}>
          {disputableAccounts.map((a) => {
            const label = `${a.lender} ${a.type}`;
            const selected = subject === label;
            return (
              <Pressable
                key={a.id}
                style={[styles.chip, selected && styles.chipOn]}
                onPress={() => setSubject(label)}
              >
                <Text style={[styles.chipText, selected && styles.chipTextOn]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>What’s wrong?</Text>
        <View style={styles.reasons}>
          {REASONS.map((r) => {
            const selected = reason === r;
            return (
              <Pressable
                key={r}
                style={[styles.reasonRow, selected && styles.reasonRowOn]}
                onPress={() => setReason(r)}
              >
                <View style={[styles.radio, selected && styles.radioOn]}>
                  {selected ? <View style={styles.radioInner} /> : null}
                </View>
                <Text style={styles.reasonText}>{r}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Add details (optional)</Text>
        <TextInput
          style={styles.textarea}
          placeholder="Tell us what happened…"
          placeholderTextColor={colors.textMuted}
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Button label="Submit dispute" onPress={onSubmit} disabled={!canSubmit} style={styles.submit} />
        <Text style={styles.note}>
          We’ll raise this with the bureau on your behalf and keep you updated on the status.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  label: { ...typography.bodyStrong, color: colors.textPrimary, marginTop: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  chipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextOn: { color: colors.textInverse, fontWeight: '600' },
  reasons: { gap: spacing.xs },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  reasonRowOn: { borderColor: colors.primary },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  reasonText: { ...typography.body, color: colors.textPrimary },
  textarea: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 100,
    ...typography.body,
    color: colors.textPrimary,
  },
  submit: { marginTop: spacing.lg },
  note: { ...typography.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
