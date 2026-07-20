import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../theme/theme';

const SKILLS = ['General', 'EV', 'Premium', 'Royal Enfield', 'Wiring'];

const DOCS = [
  { key: 'aadhaar', label: 'Aadhaar / Govt. ID' },
  { key: 'license', label: 'Driving licence' },
  { key: 'cert', label: 'Mechanic certification' },
  { key: 'photo', label: 'Passport photo' },
];

/**
 * Partner registration with document/skill verification — FR-17.
 * Gatekeeps the "verified mechanic" trust claim.
 */
export const RegisterScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { register } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [docs, setDocs] = useState<Record<string, boolean>>({});

  const toggleSkill = (s: string) =>
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const uploadDoc = (key: string) =>
    setDocs((prev) => ({ ...prev, [key]: true }));

  const uploadedCount = Object.values(docs).filter(Boolean).length;
  const canSubmit =
    name.trim().length > 1 &&
    phone.replace(/\D/g, '').length >= 10 &&
    city.trim().length > 1 &&
    skills.length > 0 &&
    uploadedCount === DOCS.length;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ Back to login</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Become a Bike Mistri</Text>
        <Text style={styles.sub}>
          Get verified to receive doorstep service jobs in your area.
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="As per your ID"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Bengaluru"
            placeholderTextColor={colors.textMuted}
            value={city}
            onChangeText={setCity}
          />
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.cardTitle}>Skills</Text>
          <Text style={styles.cardSub}>Select the services you can perform.</Text>
          <View style={styles.chipWrap}>
            {SKILLS.map((s) => {
              const active = skills.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSkill(s)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.cardTitle}>KYC & certification documents</Text>
          <Text style={styles.cardSub}>
            Required for background verification.
          </Text>
          {DOCS.map((d) => {
            const uploaded = docs[d.key];
            return (
              <View key={d.key} style={styles.docRow}>
                <Text style={styles.docLabel}>{d.label}</Text>
                <TouchableOpacity
                  onPress={() => uploadDoc(d.key)}
                  style={[styles.docBtn, uploaded && styles.docBtnDone]}
                >
                  <Text
                    style={[styles.docBtnText, uploaded && styles.docBtnTextDone]}
                  >
                    {uploaded ? '✓ Uploaded' : 'Upload'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </Card>

        <View style={{ marginTop: spacing.lg }}>
          <Button
            title="Submit for verification"
            onPress={() => {
              register(name, phone, city).catch((e) =>
                Alert.alert('Registration failed', (e as Error).message),
              );
            }}
            disabled={!canSubmit}
            full
          />
          <Text style={styles.disclaimer}>
            Our operations team reviews documents within 24–48 hours before
            activating your account.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  back: { marginBottom: spacing.md },
  backText: { color: colors.primary, fontSize: font.body, fontWeight: '600' },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted, marginTop: 4 },
  label: {
    fontSize: font.small,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    fontSize: font.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  cardTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  cardSub: { fontSize: font.small, color: colors.textMuted, marginTop: 2, marginBottom: spacing.md },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { color: colors.textMuted, fontWeight: '600', fontSize: font.small },
  chipTextActive: { color: colors.primaryDark },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  docLabel: { fontSize: font.body, color: colors.text },
  docBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  docBtnDone: { backgroundColor: colors.successSoft, borderColor: colors.success },
  docBtnText: { color: colors.primary, fontWeight: '700', fontSize: font.small },
  docBtnTextDone: { color: colors.success },
  disclaimer: {
    fontSize: font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
