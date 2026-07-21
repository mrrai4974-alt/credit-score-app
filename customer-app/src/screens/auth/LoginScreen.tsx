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

/** Registration/login via mobile OTP; guest browsing allowed (FR-01). */
export const LoginScreen: React.FC<{ onGuest: () => void }> = ({ onGuest }) => {
  const { requestOtp, verifyOtp } = useApp();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
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
      setOtp(devOtp); // prefilled in demo
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
      await verifyOtp(phone, otp, name);
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
        <View style={styles.brand}>
          <Text style={styles.logo}>🏍️</Text>
          <Text style={styles.title}>Doorstep Bike Service</Text>
          <Text style={styles.subtitle}>
            Certified mechanics at your doorstep in 60 minutes
          </Text>
          <View style={styles.trustRow}>
            <Trust label="Verified\nmechanics" />
            <Trust label="Upfront\npricing" />
            <Trust label="10-day\nwarranty" />
          </View>
        </View>

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Login or sign up</Text>

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
              <Text style={styles.label}>Your name</Text>
              <TextInput
                style={styles.input}
                placeholder="What should we call you?"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                placeholder="Any 6 digits (demo)"
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
            <Button title={busy ? 'Verifying…' : 'Verify & continue'} onPress={verify} disabled={busy} full />
          )}

          <TouchableOpacity onPress={onGuest} style={styles.guest}>
            <Text style={styles.guestText}>Browse services as guest ›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Trust: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.trust}>
    <Text style={styles.trustCheck}>✓</Text>
    <Text style={styles.trustText}>{label.replace('\\n', '\n')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'flex-end' },
  brand: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  logo: { fontSize: 48 },
  title: { color: colors.textInverse, fontSize: 26, fontWeight: '800', marginTop: spacing.md, textAlign: 'center' },
  subtitle: { color: '#AEB9C9', fontSize: font.body, marginTop: 6, textAlign: 'center' },
  trustRow: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.xl },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustCheck: { color: colors.primary, fontWeight: '900', fontSize: 16 },
  trustText: { color: colors.textInverse, fontSize: font.tiny, fontWeight: '600', lineHeight: 14 },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  sheetTitle: { fontSize: font.h2, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
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
  guest: { alignItems: 'center', marginTop: spacing.lg },
  guestText: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  error: { color: colors.danger, fontSize: font.small, marginBottom: spacing.sm, textAlign: 'center' },
});
