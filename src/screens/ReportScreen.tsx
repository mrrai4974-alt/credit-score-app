import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Card, IconChip, ProgressBar, SectionHeader, withAlpha } from '../components/ui';
import { useCredit } from '../context/CreditContext';
import type { CreditAccount, ScoreFactor } from '../services/bureau/types';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';
import { formatDate, formatRupeesShort } from '../utils/format';
import { factorIcon, statusColor } from './DashboardScreen';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ReportScreen() {
  const navigation = useNavigation<Nav>();
  const { report, loading, refreshing, refresh } = useCredit();

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
        <Text style={styles.empty}>Your report isn’t available right now. Pull to refresh.</Text>
      </Screen>
    );
  }

  const suspected = report.accounts.filter((a) => a.suspected);
  const cards = report.accounts.filter((a) => a.type === 'Credit Card');
  const loans = report.accounts.filter((a) => a.type !== 'Credit Card');

  return (
    <Screen refreshing={refreshing} onRefresh={refresh}>
      <Text style={styles.h1}>Credit Report</Text>
      <Text style={styles.sub}>
        {report.score.provider === 'Mock' ? 'Sample report' : report.score.provider} · as of{' '}
        {formatDate(report.score.lastUpdated)}
      </Text>

      {/* FR-5: fraud / error alert */}
      {suspected.length > 0 ? (
        <Pressable onPress={() => navigation.navigate('Disputes')}>
          <View style={styles.alert}>
            <Ionicons name="warning" size={22} color={colors.danger} />
            <View style={styles.flex}>
              <Text style={styles.alertTitle}>
                {suspected.length} account{suspected.length > 1 ? 's' : ''}{' '}
                {suspected.length > 1 ? 'need' : 'needs'} your attention
              </Text>
              <Text style={styles.alertBody}>
                We spotted an account you may not recognise. Review and raise a dispute if it’s not
                yours.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </View>
        </Pressable>
      ) : null}

      {/* FR-3: score factors */}
      <SectionHeader title="Score factors" />
      {report.factors.map((f) => (
        <FactorCard key={f.id} factor={f} />
      ))}

      {/* FR-4: accounts */}
      <SectionHeader title={`Credit cards (${cards.length})`} />
      {cards.map((a) => (
        <AccountCard
          key={a.id}
          account={a}
          onDispute={() => navigation.navigate('FileDispute', { subjectLabel: `${a.lender} ${a.type}` })}
        />
      ))}

      <SectionHeader title={`Loans (${loans.length})`} />
      {loans.map((a) => (
        <AccountCard
          key={a.id}
          account={a}
          onDispute={() => navigation.navigate('FileDispute', { subjectLabel: `${a.lender} ${a.type}` })}
        />
      ))}

      {/* Enquiries */}
      <SectionHeader title={`Recent enquiries (${report.enquiries.length})`} />
      <Card>
        {report.enquiries.map((e, i) => (
          <View key={e.id} style={[styles.enqRow, i > 0 && styles.divider]}>
            <IconChip name="search" color={colors.textSecondary} />
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{e.lender}</Text>
              <Text style={styles.rowSub}>{e.purpose}</Text>
            </View>
            <Text style={styles.rowSub}>{formatDate(e.date)}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

function FactorCard({ factor }: { factor: ScoreFactor }) {
  const [open, setOpen] = useState(false);
  const color = statusColor(factor.status);
  return (
    <Card>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.factorHead}>
        <IconChip name={factorIcon(factor.id)} color={color} />
        <View style={styles.flex}>
          <View style={styles.factorTitleRow}>
            <Text style={styles.rowTitle}>{factor.name}</Text>
            <Badge label={`${factor.impact} impact`} color={color} />
          </View>
          <Text style={styles.rowSub}>{factor.displayValue}</Text>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
      </Pressable>
      <View style={styles.barWrap}>
        <ProgressBar value={factor.value} color={color} />
      </View>
      {open ? <Text style={styles.factorDesc}>{factor.description}</Text> : null}
    </Card>
  );
}

function AccountCard({
  account,
  onDispute,
}: {
  account: CreditAccount;
  onDispute: () => void;
}) {
  const isCard = account.type === 'Credit Card';
  const statusColorMap: Record<string, string> = {
    Active: colors.success,
    Closed: colors.textMuted,
    Overdue: colors.danger,
  };
  const utilisation = account.limit > 0 ? account.balance / account.limit : 0;

  return (
    <Card style={account.suspected ? styles.suspectCard : undefined}>
      <View style={styles.acctHead}>
        <IconChip
          name={isCard ? 'card' : 'home'}
          color={account.suspected ? colors.danger : colors.primary}
        />
        <View style={styles.flex}>
          <Text style={styles.rowTitle}>{account.lender}</Text>
          <Text style={styles.rowSub}>{account.type}</Text>
        </View>
        <Badge label={account.status} color={statusColorMap[account.status] ?? colors.textMuted} />
      </View>

      {account.suspected ? (
        <View style={styles.suspectBanner}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.suspectText}>
            You may not recognise this account. Raise a dispute if it isn’t yours.
          </Text>
        </View>
      ) : null}

      <View style={styles.acctStats}>
        <Stat label={isCard ? 'Limit' : 'Sanctioned'} value={formatRupeesShort(account.limit)} />
        <Stat label={isCard ? 'Used' : 'Outstanding'} value={formatRupeesShort(account.balance)} />
        <Stat
          label={isCard ? 'Utilisation' : 'On-time'}
          value={isCard ? `${Math.round(utilisation * 100)}%` : `${Math.round(account.onTimeRatio * 100)}%`}
        />
      </View>

      {isCard ? (
        <View style={styles.barWrap}>
          <ProgressBar
            value={utilisation * 100}
            color={utilisation < 0.3 ? colors.success : utilisation < 0.5 ? colors.warning : colors.danger}
          />
        </View>
      ) : null}

      <View style={styles.acctFooter}>
        <Text style={styles.rowSub}>Opened {formatDate(account.openedOn)}</Text>
        <Pressable onPress={onDispute} hitSlop={8}>
          <Text style={styles.disputeLink}>Report an issue</Text>
        </Pressable>
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  empty: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
  h1: { ...typography.h1, color: colors.textPrimary },
  sub: { ...typography.caption, color: colors.textSecondary, marginTop: -spacing.xs },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: withAlpha(colors.danger, 0.08),
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: withAlpha(colors.danger, 0.25),
  },
  alertTitle: { ...typography.bodyStrong, color: colors.danger },
  alertBody: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  factorHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  factorTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, justifyContent: 'space-between' },
  rowTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  rowSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  barWrap: { marginTop: spacing.sm },
  factorDesc: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  suspectCard: { borderWidth: 1, borderColor: withAlpha(colors.danger, 0.4) },
  acctHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  suspectBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: withAlpha(colors.danger, 0.08),
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.sm,
  },
  suspectText: { ...typography.caption, color: colors.danger, flex: 1 },
  acctStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  stat: { alignItems: 'flex-start' },
  statValue: { ...typography.bodyStrong, color: colors.textPrimary },
  statLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  acctFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  disputeLink: { ...typography.bodyStrong, color: colors.primary },
  enqRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
});
