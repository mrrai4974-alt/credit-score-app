import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../theme/theme';

export const LoginScreen: React.FC<{ onRegister: () => void }> = ({
  onRegister,
}) => {
  const { requestOtp, verifyOtp } = useApp();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async () => {
    if (phone.replace(/\D/g, '').length < 10) return;
    setBusy(true);
    setError(null);
    try {
      const devOtp = await requestOtp(phone);
      setOtp(devOtp);
      setOtpSent(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setError(null);
    try {
      await verifyOtp(phone, otp);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.navy }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandBlock}>
          <View style={styles.logo}>
            <Text style={styles.logoMark}>🔧</Text>
          </View>
          <Text style={styles.title}>Bike Mistri</Text>
          <Text style={styles.subtitle}>
            Doorstep two-wheeler service partner app
          </Text>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Partner login</Text>
          <Text style={styles.sheetSub}>
            Sign in with the mobile number registered with operations.
          </Text>

          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!otpSent}
          />

          {otpSent && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="6-digit code (any value works in demo)"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />
            </>
          )}

          {error && <Text style={styles.error}>{error}</Text>}

          {!otpSent ? (
            <Button title={busy ? 'Sending…' : 'Send OTP'} onPress={sendOtp} disabled={busy} full />
          ) : (
            <Button title={busy ? 'Signing in…' : 'Verify & sign in'} onPress={verify} disabled={busy} full />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>New mistri? </Text>
            <TouchableOpacity onPress={onRegister}>
              <Text style={styles.footerLink}>Become a partner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'flex-end' },
  brandBlock: { alignItems: 'center', paddingVertical: spacing.xxl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoMark: { fontSize: 34 },
  title: { color: colors.textInverse, fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#AEB9C9', fontSize: font.body, marginTop: 4 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  sheetSub: {
    fontSize: font.small,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
    fontSize: font.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  footerText: { color: colors.textMuted, fontSize: font.body },
  footerLink: { color: colors.primary, fontSize: font.body, fontWeight: '700' },
  error: { color: colors.danger, fontSize: font.small, marginBottom: spacing.sm, textAlign: 'center' },
});
