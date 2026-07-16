import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Button, Card, IconChip, SectionHeader, withAlpha } from '../components/ui';
import { BILLERS, RECENT_TRANSACTIONS } from '../services/appData';
import type { BillCategory, Biller } from '../services/bureau/types';
import { colors, radius, spacing, typography } from '../theme';
import { dueLabel, formatRupees } from '../utils/format';

const CATEGORIES: { category: BillCategory | 'Recharge'; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { category: 'Electricity', icon: 'flash', color: '#F59E0B' },
  { category: 'Mobile Postpaid', icon: 'phone-portrait', color: '#3D5AFE' },
  { category: 'Recharge', icon: 'cellular', color: '#00BFA5' },
  { category: 'Broadband', icon: 'wifi', color: '#8B5CF6' },
  { category: 'Water', icon: 'water', color: '#06B6D4' },
  { category: 'DTH', icon: 'tv', color: '#EC4899' },
  { category: 'Gas', icon: 'flame', color: '#EF4444' },
  { category: 'Credit Card', icon: 'card', color: '#14B8A6' },
];

export function PayScreen() {
  // Locally track which billers have been "paid" this session.
  const [paid, setPaid] = useState<Record<string, boolean>>({});

  const rewardBalance = useMemo(
    () => RECENT_TRANSACTIONS.reduce((s, t) => s + t.cashback, 0) + 120,
    [],
  );

  function onPay(biller: Biller) {
    Alert.alert(
      'Confirm payment',
      `Pay ${formatRupees(biller.amountDue)} to ${biller.name} (${biller.account})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay',
          onPress: () => {
            setPaid((prev) => ({ ...prev, [biller.id]: true }));
            const cashback = Math.max(5, Math.round(biller.amountDue * 0.01));
            Alert.alert('Payment successful 🎉', `You earned ${formatRupees(cashback)} cashback!`);
          },
        },
      ],
    );
  }

  const dueBillers = BILLERS.filter((b) => !paid[b.id]);

  return (
    <Screen>
      <Text style={styles.h1}>Pay & Recharge</Text>

      {/* Rewards balance card (FR-19) */}
      <LinearGradient
        colors={['#00BFA5', '#0891B2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.rewards}
      >
        <View style={styles.flex}>
          <Text style={styles.rewardsLabel}>Reward balance</Text>
          <Text style={styles.rewardsValue}>{formatRupees(rewardBalance)}</Text>
          <Text style={styles.rewardsSub}>Earn cashback on every bill & recharge</Text>
        </View>
        <Ionicons name="gift" size={40} color={withAlpha('#FFFFFF', 0.9)} />
      </LinearGradient>

      {/* Category grid (FR-17, FR-18) */}
      <SectionHeader title="Pay a bill" />
      <View style={styles.grid}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c.category}
            style={styles.gridItem}
            onPress={() =>
              Alert.alert(c.category, 'This would open the biller flow via BBPS in the full app.')
            }
          >
            <View style={[styles.gridIcon, { backgroundColor: withAlpha(c.color, 0.14) }]}>
              <Ionicons name={c.icon} size={24} color={c.color} />
            </View>
            <Text style={styles.gridLabel}>{c.category}</Text>
          </Pressable>
        ))}
      </View>

      {/* Saved billers with dues */}
      <SectionHeader title="Your bills" />
      {dueBillers.length === 0 ? (
        <Card>
          <View style={styles.allClear}>
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
            <Text style={styles.allClearText}>All bills paid. You’re all caught up!</Text>
          </View>
        </Card>
      ) : (
        dueBillers.map((b) => (
          <Card key={b.id}>
            <View style={styles.billHead}>
              <IconChip name={categoryIcon(b.category)} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{b.name}</Text>
                <Text style={styles.rowSub}>{b.account}</Text>
              </View>
              <Badge label={dueLabel(b.dueDate)} color={colors.warning} />
            </View>
            <View style={styles.billFooter}>
              <Text style={styles.amount}>{formatRupees(b.amountDue)}</Text>
              <Button label="Pay now" onPress={() => onPay(b)} style={styles.payBtn} />
            </View>
          </Card>
        ))
      )}

      {/* Recent transactions */}
      <SectionHeader title="Recent transactions" />
      <Card>
        {RECENT_TRANSACTIONS.map((t, i) => (
          <View key={t.id} style={[styles.txnRow, i > 0 && styles.divider]}>
            <IconChip name={categoryIcon(t.category)} color={colors.textSecondary} />
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{t.label}</Text>
              <Text style={styles.rowSub}>{t.category}</Text>
            </View>
            <View style={styles.txnRight}>
              <Text style={styles.txnAmount}>{formatRupees(t.amount)}</Text>
              <Text style={styles.cashback}>+{formatRupees(t.cashback)} back</Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function categoryIcon(c: BillCategory | 'Recharge'): keyof typeof Ionicons.glyphMap {
  const found = CATEGORIES.find((x) => x.category === c);
  return found?.icon ?? 'receipt';
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  h1: { ...typography.h1, color: colors.textPrimary },
  rewards: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  rewardsLabel: { ...typography.caption, color: colors.textInverse, opacity: 0.9 },
  rewardsValue: { ...typography.display, fontSize: 30, color: colors.textInverse, marginTop: 2 },
  rewardsSub: { ...typography.caption, color: colors.textInverse, opacity: 0.9, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridItem: { width: '22%', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  gridIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridLabel: { ...typography.tiny, color: colors.textSecondary, textAlign: 'center' },
  billHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  rowSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  billFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  amount: { ...typography.h2, color: colors.textPrimary },
  payBtn: { paddingVertical: 10, paddingHorizontal: spacing.xl },
  allClear: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  allClearText: { ...typography.body, color: colors.textSecondary },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  txnRight: { alignItems: 'flex-end' },
  txnAmount: { ...typography.bodyStrong, color: colors.textPrimary },
  cashback: { ...typography.tiny, color: colors.success, marginTop: 2 },
});
