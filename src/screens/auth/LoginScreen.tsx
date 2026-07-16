import { Ionicons } from '@expo/vector-icons';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { requestOtp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [pan, setPan] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mobileValid = /^\d{10}$/.test(mobile);
  const nameValid = fullName.trim().length >= 2;
  const panValid = pan.length === 0 || PAN_RE.test(pan.toUpperCase());
  const canSubmit = mobileValid && nameValid && panValid && consent && !submitting;

  async function onContinue() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const code = await requestOtp(mobile);
      navigation.navigate('Otp', {
        mobile,
        fullName,
        pan: pan ? pan.toUpperCase() : undefined,
        // In a real app the code is delivered by SMS, never returned. We pass
        // it through only so the demo can prefill it on the next screen.
        demoCode: code,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>

        <Text style={styles.title}>Let’s get your score</Text>
        <Text style={styles.subtitle}>
          We’ll send an OTP to verify your mobile number. Your details are used
          only to fetch your credit report.
        </Text>

        <Field label="Full name (as per PAN)">
          <TextInput
            style={styles.input}
            placeholder="Aarav Sharma"
            placeholderTextColor={colors.textMuted}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </Field>

        <Field label="Mobile number">
          <View style={styles.mobileRow}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={[styles.input, styles.mobileInput]}
              placeholder="10-digit number"
              placeholderTextColor={colors.textMuted}
              value={mobile}
              onChangeText={(t) => setMobile(t.replace(/\D/g, '').slice(0, 10))}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>
        </Field>

        <Field label="PAN (optional, speeds up your report)">
          <TextInput
            style={[styles.input, !panValid && styles.inputError]}
            placeholder="ABCDE1234F"
            placeholderTextColor={colors.textMuted}
            value={pan}
            onChangeText={(t) => setPan(t.toUpperCase().slice(0, 10))}
            autoCapitalize="characters"
            maxLength={10}
          />
          {!panValid ? <Text style={styles.fieldError}>Enter a valid PAN or leave blank.</Text> : null}
        </Field>

        <Pressable style={styles.consent} onPress={() => setConsent((c) => !c)}>
          <View style={[styles.checkbox, consent && styles.checkboxOn]}>
            {consent ? <Ionicons name="checkmark" size={14} color={colors.textInverse} /> : null}
          </View>
          <Text style={styles.consentText}>
            I authorise GoodCredit to fetch my credit report from the bureau on my
            behalf. I can withdraw this consent anytime from Settings.
          </Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label="Send OTP"
          onPress={onContinue}
          disabled={!canSubmit}
          loading={submitting}
          style={styles.submit}
        />
        <Text style={styles.legal}>
          By continuing you agree to our Terms & Privacy Policy. Checking your own
          score is a soft enquiry and never affects it.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 21, marginBottom: spacing.sm },
  field: { gap: spacing.xs },
  label: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    ...typography.body,
    color: colors.textPrimary,
  },
  inputError: { borderColor: colors.danger },
  fieldError: { ...typography.caption, color: colors.danger },
  mobileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prefix: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  mobileInput: { flex: 1 },
  consent: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, alignItems: 'flex-start' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  consentText: { ...typography.caption, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  error: { ...typography.caption, color: colors.danger },
  submit: { marginTop: spacing.sm },
  legal: { ...typography.tiny, color: colors.textMuted, textAlign: 'center', lineHeight: 16 },
});
