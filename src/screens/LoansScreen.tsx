import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Button, Card, IconChip, SectionHeader, withAlpha } from '../components/ui';
import { useCredit } from '../context/CreditContext';
import { deriveReminders } from '../services/appData';
import { OFFERS } from '../services/bureau';
import type { Offer, Reminder } from '../services/bureau/types';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';
import { dueLabel, formatRupees, formatRupeesShort } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function LoansScreen() {
  const navigation = useNavigation<Nav>();
  const { report, loading, refreshing, refresh } = useCredit();

  // Autopay toggles are local UI state layered over the reported accounts.
  const [autopay, setAutopay] = useState<Record<string, boolean>>({});

  const reminders = useMemo(
    () => (report ? deriveReminders(report.accounts) : []),
    [report],
  );

  if (loading && !report) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!report) {
    return (
      <Screen>
        <Text style={styles.empty}>No accounts to show yet. Pull to refresh.</Text>
      </Screen>
    );
  }

  const activeLoans = report.accounts.filter(
    (a) => a.type !== 'Credit Card' && a.status !== 'Closed',
  );
  const totalOutstanding = report.accounts
    .filter((a) => a.status !== 'Closed')
    .reduce((s, a) => s + a.balance, 0);
  const monthlyEmi = activeLoans.reduce((s, a) => s + (a.emiAmount ?? 0), 0);
  const overdue = reminders.filter((r) => r.overdue);
  const eligibleOffers = OFFERS.filter((o) => report.score.value >= o.minScore);

  const isAutopay = (r: Reminder) => autopay[r.accountId] ?? r.autopay;

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Text style={styles.h1}>Loans & EMIs</Text>

      {/* Portfolio summary */}
      <Card>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatRupeesShort(totalOutstanding)}</Text>
            <Text style={styles.summaryLabel}>Total outstanding</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{formatRupeesShort(monthlyEmi)}</Text>
            <Text style={styles.summaryLabel}>Monthly EMI</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{activeLoans.length}</Text>
            <Text style={styles.summaryLabel}>Active loans</Text>
          </View>
        </View>
      </Card>

      {/* FR-14: overdue alert */}
      {overdue.length > 0 ? (
        <View style={styles.overdue}>
          <Ionicons name="alert-circle" size={20} color={colors.danger} />
          <Text style={styles.overdueText}>
            {overdue.length} payment{overdue.length > 1 ? 's are' : ' is'} overdue. Pay now to avoid a
            score drop and late fees.
          </Text>
        </View>
      ) : null}

      {/* FR-12: upcoming reminders + FR-13 autopay */}
      <SectionHeader title="Upcoming payments" />
      {reminders.map((r) => (
        <Card key={r.id} style={r.overdue ? styles.overdueCard : undefined}>
          <View style={styles.reminderHead}>
            <IconChip
              name={r.label === 'EMI' ? 'cash' : 'card'}
              color={r.overdue ? colors.danger : colors.primary}
            />
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>
                {r.lender} · {r.label}
              </Text>
              <Text style={[styles.rowSub, r.overdue && { color: colors.danger }]}>
                {dueLabel(r.dueDate)}
              </Text>
            </View>
            <Text style={styles.amount}>{formatRupees(r.amount)}</Text>
          </View>
          <View style={styles.reminderFooter}>
            <View style={styles.autopayRow}>
              <Text style={styles.autopayLabel}>Autopay</Text>
              <Switch
                value={isAutopay(r)}
                onValueChange={(v) => setAutopay((prev) => ({ ...prev, [r.accountId]: v }))}
                trackColor={{ true: colors.primary, false: colors.border }}
                thumbColor={colors.surface}
              />
            </View>
            <Button
              label={r.overdue ? 'Pay now' : 'Pay'}
              variant={r.overdue ? 'primary' : 'secondary'}
              onPress={() => navigation.navigate('Tabs', { screen: 'Pay' })}
              style={styles.payBtn}
            />
          </View>
        </Card>
      ))}

      {/* FR-16: savings calculator entry */}
      <Pressable onPress={() => navigation.navigate('SavingsCalculator')}>
        <Card style={styles.calcCard}>
          <IconChip name="calculator" color={colors.accent} size={22} />
          <View style={styles.flex}>
            <Text style={styles.rowTitle}>Loan savings calculator</Text>
            <Text style={styles.rowSub}>See how much a better score could save you.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </Card>
      </Pressable>

      {/* FR-15: offers */}
      <SectionHeader title="Offers for your score" />
      {eligibleOffers.map((o) => (
        <OfferCard key={o.id} offer={o} />
      ))}
    </Screen>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  return (
    <Card>
      <View style={styles.offerHead}>
        <IconChip name={offerIcon(offer.type)} color={colors.primary} size={22} />
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>{offer.title}</Text>
          <Text style={styles.rowSub}>{offer.provider}</Text>
        </View>
        <Badge label="Pre-approved" color={colors.success} />
      </View>
      <Text style={styles.offerHighlight}>{offer.highlight}</Text>
      <View style={styles.offerMeta}>
        {offer.interestRate ? <Text style={styles.offerMetaText}>💸 {offer.interestRate}</Text> : null}
        {offer.fee ? <Text style={styles.offerMetaText}>🏷️ {offer.fee}</Text> : null}
      </View>
      <Button label="Check eligibility" variant="secondary" style={styles.offerBtn} />
    </Card>
  );
}

function offerIcon(type: Offer['type']): keyof typeof import('@expo/vector-icons').Ionicons.glyphMap {
  switch (type) {
    case 'Credit Card':
      return 'card';
    case 'Personal Loan':
      return 'cash';
    case 'Home Loan':
      return 'home';
    case 'Balance Transfer':
      return 'swap-horizontal';
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  h1: { ...typography.h1, color: colors.textPrimary },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { ...typography.h3, color: colors.textPrimary },
  summaryLabel: { ...typography.tiny, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.border },
  overdue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: withAlpha(colors.danger, 0.08),
    borderRadius: radius.md,
    padding: spacing.md,
  },
  overdueText: { ...typography.caption, color: colors.danger, flex: 1, lineHeight: 18 },
  overdueCard: { borderWidth: 1, borderColor: withAlpha(colors.danger, 0.35) },
  reminderHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  rowSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  amount: { ...typography.h3, color: colors.textPrimary },
  reminderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  autopayRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  autopayLabel: { ...typography.caption, color: colors.textSecondary },
  payBtn: { paddingVertical: 8, paddingHorizontal: spacing.lg },
  calcCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  offerHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  offerHighlight: { ...typography.body, color: colors.textPrimary, marginTop: spacing.sm },
  offerMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs, flexWrap: 'wrap' },
  offerMetaText: { ...typography.caption, color: colors.textSecondary },
  offerBtn: { marginTop: spacing.md },
});
