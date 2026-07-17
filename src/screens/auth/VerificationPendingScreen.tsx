import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../theme/theme';

const STEPS = [
  { label: 'Application submitted', done: true },
  { label: 'Document verification', done: true },
  { label: 'Background & skill check', done: false },
  { label: 'Account activation', done: false },
];

/**
 * Shown while a freshly-registered mechanic is 'in_review'.
 * Enforces the "verified mechanic" gate before jobs are visible (FR-17).
 */
export const VerificationPendingScreen: React.FC = () => {
  const { mechanic, logout } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>⏳</Text>
        </View>
        <Text style={styles.title}>Verification in progress</Text>
        <Text style={styles.sub}>
          Thanks {mechanic.name.split(' ')[0]}! Our operations team is reviewing
          your documents. This usually takes 24–48 hours.
        </Text>

        <Card style={styles.card}>
          {STEPS.map((s, i) => (
            <View key={s.label} style={styles.step}>
              <View style={[styles.dot, s.done && styles.dotDone]}>
                {s.done && <Text style={styles.dotMark}>✓</Text>}
              </View>
              <Text style={[styles.stepLabel, s.done && styles.stepLabelDone]}>
                {s.label}
              </Text>
              {i === 2 && !s.done && (
                <Text style={styles.stepNow}>In progress</Text>
              )}
            </View>
          ))}
        </Card>

        <Text style={styles.note}>
          We'll notify you by SMS and push notification once your account is
          active.
        </Text>
      </View>

      <Button
        title="Log out"
        variant="outline"
        onPress={logout}
        style={{ margin: spacing.lg }}
        full
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  icon: { fontSize: 40 },
  title: {
    fontSize: font.h1,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  sub: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  card: { marginTop: spacing.xl, width: '100%' },
  step: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotMark: { color: '#fff', fontWeight: '900', fontSize: 13 },
  stepLabel: { fontSize: font.body, color: colors.textMuted, flex: 1 },
  stepLabelDone: { color: colors.text, fontWeight: '600' },
  stepNow: { fontSize: font.tiny, color: colors.warning, fontWeight: '700' },
  note: {
    fontSize: font.small,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 18,
  },
});
