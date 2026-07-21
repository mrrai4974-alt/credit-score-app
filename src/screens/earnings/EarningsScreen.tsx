import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Divider, Row } from '../../components/ui';
import { earnings } from '../../data/mockData';
import { colors, font, radius, spacing } from '../../theme/theme';
import { inr } from '../../utils/format';

/** Earnings, payout schedule and incentive tracking — FR-23. */
export const EarningsScreen: React.FC = () => {
  const { paid, pending } = useMemo(() => {
    return {
      paid: earnings.filter((e) => e.status === 'paid').reduce((s, e) => s + e.amount, 0),
      pending: earnings
        .filter((e) => e.status === 'pending')
        .reduce((s, e) => s + e.amount, 0),
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available for payout</Text>
          <Text style={styles.balanceValue}>{inr(pending)}</Text>
          <Row style={{ justifyContent: 'space-between', marginTop: spacing.md }}>
            <View>
              <Text style={styles.subLabel}>Paid this week</Text>
              <Text style={styles.subValue}>{inr(paid)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.subLabel}>Next payout</Text>
              <Text style={styles.subValue}>Mon, 20 Jul</Text>
            </View>
          </Row>
          <Button
            title="Withdraw instantly"
            onPress={() => {}}
            style={{ marginTop: spacing.lg }}
            full
          />
        </Card>

        <Card style={styles.incentiveCard}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.incentiveTitle}>🎯 Weekly incentive</Text>
            <Badge label="+ ₹500" tone="success" />
          </Row>
          <Text style={styles.incentiveSub}>
            Complete 5 more jobs this week with a 4.5★+ rating.
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.incentiveHint}>3 of 8 jobs completed</Text>
        </Card>

        <Text style={styles.section}>Recent transactions</Text>
        <Card>
          {earnings.map((e, idx) => (
            <View key={e.id}>
              <Row style={styles.txRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txService} numberOfLines={1}>
                    {e.service}
                  </Text>
                  <Text style={styles.txMeta}>
                    #{e.jobCode} · {e.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.txAmount}>{inr(e.amount)}</Text>
                  <Badge
                    label={e.status}
                    tone={e.status === 'paid' ? 'success' : 'warning'}
                  />
                </View>
              </Row>
              {idx < earnings.length - 1 && <Divider style={{ marginVertical: 4 }} />}
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  headerTitle: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  balanceCard: { backgroundColor: colors.navy },
  balanceLabel: { color: '#AEB9C9', fontSize: font.small },
  balanceValue: { color: colors.textInverse, fontSize: 34, fontWeight: '800', marginTop: 4 },
  subLabel: { color: '#8996AB', fontSize: font.tiny },
  subValue: { color: colors.textInverse, fontSize: font.body, fontWeight: '700', marginTop: 2 },
  incentiveCard: { marginTop: spacing.lg },
  incentiveTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  incentiveSub: { fontSize: font.small, color: colors.textMuted, marginTop: 4 },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: colors.primary, borderRadius: radius.pill },
  incentiveHint: { fontSize: font.tiny, color: colors.textMuted, marginTop: 6 },
  section: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  txRow: { justifyContent: 'space-between', paddingVertical: spacing.sm },
  txService: { fontSize: font.body, fontWeight: '600', color: colors.text },
  txMeta: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: font.body, fontWeight: '800', color: colors.text, marginBottom: 4 },
});
