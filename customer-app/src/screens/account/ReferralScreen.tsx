import React from 'react';
import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, Divider, Row } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme/theme';

const CODE = 'RIDER-RK-2026';

/** Referral program — generate & share code, track rewards (FR-15). */
export const ReferralScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const share = async () => {
    try {
      await Share.share({
        message: `Get your bike serviced at your doorstep! Use my code ${CODE} on Doorstep Bike Service for ₹100 off your first booking.`,
      });
    } catch {
      Alert.alert('Share', 'Could not open the share sheet.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Account</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Refer & Earn</Text>
        <View style={{ width: 70 }} />
      </View>

      <View style={styles.body}>
        <Text style={styles.hero}>🎁</Text>
        <Text style={styles.headline}>Give ₹100, Get ₹100</Text>
        <Text style={styles.sub}>
          Your friend gets ₹100 off their first service. You earn ₹100 credit
          once they complete it.
        </Text>

        <Card style={styles.codeCard}>
          <Text style={styles.codeLabel}>Your referral code</Text>
          <Text style={styles.code}>{CODE}</Text>
          <Button title="Share code" onPress={share} style={{ marginTop: spacing.md }} full />
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <Row style={{ justifyContent: 'space-around' }}>
            <Stat value="3" label="Friends joined" />
            <View style={styles.vLine} />
            <Stat value="₹300" label="Rewards earned" />
          </Row>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 70 },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, alignItems: 'center' },
  hero: { fontSize: 56, marginTop: spacing.lg },
  headline: { fontSize: font.h1, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  sub: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
    paddingHorizontal: spacing.md,
  },
  codeCard: { alignSelf: 'stretch', marginTop: spacing.xl, alignItems: 'center' },
  codeLabel: { fontSize: font.small, color: colors.textMuted },
  code: {
    fontSize: font.h2,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
    marginTop: 6,
  },
  vLine: { width: 1, height: 36, backgroundColor: colors.divider },
  statValue: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2 },
});
