import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScoreGauge } from '../components/ScoreGauge';
import { ScoreHistoryChart } from '../components/ScoreHistoryChart';
import { Button, Card, IconChip, SectionHeader, withAlpha } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useCredit } from '../context/CreditContext';
import { NOTIFICATIONS } from '../services/appData';
import { OFFERS } from '../services/bureau';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';
import { formatDate } from '../utils/format';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_ACTIONS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route: keyof RootStackParamList;
}[] = [
  { icon: 'trending-up', label: 'Improve\nscore', color: colors.accent, route: 'ImprovementPlan' },
  { icon: 'shield-checkmark', label: 'Raise\ndispute', color: colors.warning, route: 'Disputes' },
  { icon: 'calculator', label: 'Loan\ncalculator', color: colors.primary, route: 'SavingsCalculator' },
  { icon: 'headset', label: 'Talk to\nexpert', color: '#8B5CF6', route: 'Consultation' },
];

export function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const { report, loading, refreshing, error, refresh } = useCredit();

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const firstName = (user?.fullName ?? 'there').split(' ')[0];

  if (loading && !report) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Fetching your credit report…</Text>
      </View>
    );
  }

  const change = report?.score.change ?? 0;
  const changeUp = change >= 0;

  return (
    <View style={styles.flex}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hi {firstName} 👋</Text>
            <Text style={styles.greetingSub}>Here’s your credit health</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            hitSlop={8}
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textInverse} />
            {unread > 0 ? (
              <View style={styles.bellDot}>
                <Text style={styles.bellDotText}>{unread}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollableBody
        refreshing={refreshing}
        onRefresh={refresh}
        insetBottom={insets.bottom}
      >
        {/* Score card floating over the header */}
        <Card style={styles.scoreCard}>
          {error && !report ? (
            <View style={styles.errorBox}>
              <Ionicons name="cloud-offline-outline" size={28} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
              <Button label="Retry" variant="secondary" onPress={refresh} />
            </View>
          ) : report ? (
            <>
              <View style={styles.gaugeWrap}>
                <ScoreGauge score={report.score.value} />
              </View>
              <View style={styles.changeRow}>
                <View
                  style={[
                    styles.changePill,
                    { backgroundColor: withAlpha(changeUp ? colors.success : colors.danger, 0.12) },
                  ]}
                >
                  <Ionicons
                    name={changeUp ? 'arrow-up' : 'arrow-down'}
                    size={14}
                    color={changeUp ? colors.success : colors.danger}
                  />
                  <Text
                    style={[styles.changeText, { color: changeUp ? colors.success : colors.danger }]}
                  >
                    {Math.abs(change)} pts this month
                  </Text>
                </View>
              </View>
              <Text style={styles.updated}>
                {report.score.provider === 'Mock' ? 'Demo data' : report.score.provider} · Updated{' '}
                {formatDate(report.score.lastUpdated)}
              </Text>
            </>
          ) : null}
        </Card>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map((a) => (
            <Pressable
              key={a.label}
              style={styles.quickItem}
              onPress={() => navigation.navigate(a.route as never)}
            >
              <View style={[styles.quickIcon, { backgroundColor: withAlpha(a.color, 0.14) }]}>
                <Ionicons name={a.icon} size={22} color={a.color} />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {report ? (
          <>
            {/* Score trend */}
            <Card>
              <SectionHeader title="Score trend" />
              <ScoreHistoryChart data={report.score.history} width={width - spacing.md * 2 - spacing.md * 2} />
            </Card>

            {/* Credit story (FR-6 personalised advisory) */}
            <Pressable onPress={() => navigation.navigate('ImprovementPlan')}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.story}
              >
                <View style={styles.storyIcon}>
                  <Ionicons name="play-circle" size={26} color={colors.textInverse} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.storyTitle}>Your Credit Story</Text>
                  <Text style={styles.storySub}>
                    A personalised breakdown of what’s helping and hurting your score.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textInverse} />
              </LinearGradient>
            </Pressable>

            {/* Top factors preview */}
            <Card>
              <SectionHeader
                title="What’s affecting your score"
                action="See all"
                onAction={() => navigation.navigate('Tabs', { screen: 'Report' })}
              />
              {report.factors.slice(0, 3).map((f) => (
                <View key={f.id} style={styles.factorRow}>
                  <IconChip name={factorIcon(f.id)} color={statusColor(f.status)} />
                  <View style={styles.flex}>
                    <Text style={styles.factorName}>{f.name}</Text>
                    <Text style={styles.factorValue}>{f.displayValue}</Text>
                  </View>
                  <View style={[styles.dot, { backgroundColor: statusColor(f.status) }]} />
                </View>
              ))}
            </Card>

            {/* Offer teaser */}
            <Card>
              <SectionHeader
                title="Recommended for you"
                action="View offers"
                onAction={() => navigation.navigate('Tabs', { screen: 'Loans' })}
              />
              <View style={styles.offerRow}>
                <IconChip name="card" color={colors.primary} size={22} />
                <View style={styles.flex}>
                  <Text style={styles.factorName}>{OFFERS[0].title}</Text>
                  <Text style={styles.factorValue}>{OFFERS[0].highlight}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </View>
            </Card>
          </>
        ) : null}
      </ScrollableBody>
    </View>
  );
}

// A thin wrapper so the gradient header can stay fixed above the scroll area.
function ScrollableBody({
  children,
  refreshing,
  onRefresh,
  insetBottom,
}: {
  children: React.ReactNode;
  refreshing: boolean;
  onRefresh: () => void;
  insetBottom: number;
}) {
  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.body, { paddingBottom: insetBottom + spacing.xxl }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {children}
    </ScrollView>
  );
}

export function factorIcon(id: string): keyof typeof Ionicons.glyphMap {
  switch (id) {
    case 'payment-history':
      return 'time';
    case 'credit-utilisation':
      return 'pie-chart';
    case 'credit-age':
      return 'hourglass';
    case 'credit-mix':
      return 'layers';
    case 'enquiries':
      return 'search';
    default:
      return 'ellipse';
  }
}

export function statusColor(status: 'excellent' | 'good' | 'fair' | 'poor'): string {
  switch (status) {
    case 'excellent':
      return colors.success;
    case 'good':
      return '#7AC943';
    case 'fair':
      return colors.warning;
    case 'poor':
      return colors.danger;
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, gap: spacing.md },
  loaderText: { ...typography.body, color: colors.textSecondary },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
    backgroundColor: colors.primary,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { ...typography.h2, color: colors.textInverse },
  greetingSub: { ...typography.body, color: colors.textInverse, opacity: 0.85, marginTop: 2 },
  bell: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: withAlpha('#FFFFFF', 0.18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bellDotText: { ...typography.tiny, color: colors.textInverse, fontSize: 10 },
  body: { paddingHorizontal: spacing.md, gap: spacing.md, marginTop: -spacing.xxl },
  scoreCard: { alignItems: 'center', paddingVertical: spacing.lg },
  gaugeWrap: { alignItems: 'center' },
  changeRow: { marginTop: spacing.xs },
  changePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  changeText: { ...typography.bodyStrong },
  updated: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  errorBox: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  errorText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  quickItem: { flex: 1, alignItems: 'center', gap: spacing.xs },
  quickIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: { ...typography.tiny, color: colors.textSecondary, textAlign: 'center' },
  story: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  storyIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  storyTitle: { ...typography.h3, color: colors.textInverse },
  storySub: { ...typography.caption, color: colors.textInverse, opacity: 0.9, marginTop: 2 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  factorName: { ...typography.bodyStrong, color: colors.textPrimary },
  factorValue: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
