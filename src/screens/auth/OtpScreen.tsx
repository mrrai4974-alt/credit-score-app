import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
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

type Props = NativeStackScreenProps<RootStackParamList, 'Otp'>;

const OTP_LENGTH = 4;

export function OtpScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { mobile, fullName, pan, demoCode } = route.params;
  const { verifyOtp, requestOtp } = useAuth();

  const [code, setCode] = useState(demoCode ?? '');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(30);
  const [hint, setHint] = useState<string | undefined>(demoCode);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  async function onVerify() {
    if (code.length !== OTP_LENGTH) return;
    setVerifying(true);
    setError(null);
    try {
      await verifyOtp(mobile, code, { fullName, pan });
      // On success the AuthProvider sets `user`, and RootNavigator swaps to Tabs.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  }

  async function onResend() {
    if (seconds > 0) return;
    const next = await requestOtp(mobile);
    setHint(next);
    setCode(next);
    setSeconds(30);
    setError(null);
  }

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => code[i] ?? '');

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </Pressable>

      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to <Text style={styles.bold}>+91 {mobile}</Text>
      </Text>

      <Pressable style={styles.boxes} onPress={() => inputRef.current?.focus()}>
        {digits.map((d, i) => (
          <View
            key={i}
            style={[styles.box, i === code.length && styles.boxActive, d ? styles.boxFilled : null]}
          >
            <Text style={styles.boxText}>{d}</Text>
          </View>
        ))}
      </Pressable>

      {/* Hidden real input that drives the boxes above. */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        autoFocus
      />

      {hint ? (
        <View style={styles.demoHint}>
          <Ionicons name="information-circle-outline" size={16} color={colors.info} />
          <Text style={styles.demoHintText}>Demo mode: your OTP is {hint}</Text>
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label="Verify & continue"
        onPress={onVerify}
        disabled={code.length !== OTP_LENGTH || verifying}
        loading={verifying}
        style={styles.submit}
      />

      <Pressable onPress={onResend} disabled={seconds > 0} style={styles.resend}>
        <Text style={[styles.resendText, seconds === 0 && styles.resendActive]}>
          {seconds > 0 ? `Resend code in ${seconds}s` : 'Resend code'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  back: { marginBottom: spacing.sm },
  title: { ...typography.h1, color: colors.textPrimary },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  bold: { ...typography.bodyStrong, color: colors.textPrimary },
  boxes: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, justifyContent: 'center' },
  box: {
    width: 60,
    height: 68,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: { borderColor: colors.primary },
  boxFilled: { borderColor: colors.primary, backgroundColor: colors.surface },
  boxText: { ...typography.display, fontSize: 30, color: colors.textPrimary },
  hiddenInput: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  demoHint: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  demoHintText: { ...typography.caption, color: colors.info },
  error: { ...typography.caption, color: colors.danger, textAlign: 'center', marginTop: spacing.md },
  submit: { marginTop: spacing.xl },
  resend: { alignSelf: 'center', marginTop: spacing.lg },
  resendText: { ...typography.bodyStrong, color: colors.textMuted },
  resendActive: { color: colors.primary },
});
