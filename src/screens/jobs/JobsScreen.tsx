import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JobCard } from '../../components/JobCard';
import { useApp } from '../../context/AppContext';
import { Job } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';
import { inr, withGst } from '../../utils/format';

type Tab = 'new' | 'active' | 'done';

export const JobsScreen: React.FC<{ onOpenJob: (jobId: string) => void }> = ({
  onOpenJob,
}) => {
  const { mechanic, jobs, setOnline, acceptJob, declineJob, refreshJobs } = useApp();
  const [tab, setTab] = useState<Tab>('new');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshJobs().catch(() => {});
  }, [refreshJobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshJobs().catch(() => {});
    setRefreshing(false);
  };

  const groups = useMemo(() => {
    const isActive = (j: Job) =>
      ['accepted', 'en_route', 'arrived', 'in_progress', 'awaiting_approval'].includes(
        j.status,
      );
    return {
      new: jobs.filter((j) => j.status === 'available'),
      active: jobs.filter(isActive),
      done: jobs.filter((j) => j.status === 'completed'),
    };
  }, [jobs]);

  const todayEarnings = groups.done.reduce(
    (sum, j) => sum + withGst(j.basePrice),
    0,
  );

  const list = groups[tab];

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'new', label: 'New', count: groups.new.length },
    { key: 'active', label: 'Active', count: groups.active.length },
    { key: 'done', label: 'Completed', count: groups.done.length },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.hello}>Namaste,</Text>
            <Text style={styles.name}>{mechanic.name}</Text>
          </View>
          <View style={styles.onlineWrap}>
            <Text
              style={[
                styles.onlineText,
                { color: mechanic.online ? colors.success : colors.textMuted },
              ]}
            >
              {mechanic.online ? 'Online' : 'Offline'}
            </Text>
            <Switch
              value={mechanic.online}
              onValueChange={setOnline}
              trackColor={{ true: colors.success, false: '#3A4759' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Today" value={inr(todayEarnings)} />
          <Stat label="Rating" value={`★ ${mechanic.rating || '—'}`} />
          <Stat label="Jobs" value={String(mechanic.jobsCompleted)} />
        </View>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label} {t.count > 0 ? `(${t.count})` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!mechanic.online && tab === 'new' ? (
          <Empty
            emoji="🌙"
            title="You're offline"
            body="Go online to start receiving doorstep service jobs near you."
          />
        ) : list.length === 0 ? (
          <Empty
            emoji="📭"
            title="Nothing here yet"
            body={
              tab === 'new'
                ? 'New job requests within your service radius will appear here.'
                : tab === 'active'
                ? 'Accepted jobs you are working on show up here.'
                : 'Completed jobs and their payouts appear here.'
            }
          />
        ) : (
          list.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => onOpenJob(job.id)}
              onAccept={() => {
                acceptJob(job.id).then(() => setTab('active')).catch(() => {});
              }}
              onDecline={() => declineJob(job.id)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Empty: React.FC<{ emoji: string; title: string; body: string }> = ({
  emoji,
  title,
  body,
}) => (
  <View style={styles.empty}>
    <Text style={styles.emptyEmoji}>{emoji}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyBody}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hello: { color: '#AEB9C9', fontSize: font.small },
  name: { color: colors.textInverse, fontSize: font.h2, fontWeight: '800' },
  onlineWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  onlineText: { fontWeight: '700', fontSize: font.small },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.navySoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { color: colors.textInverse, fontSize: font.h3, fontWeight: '800' },
  statLabel: { color: '#AEB9C9', fontSize: font.tiny, marginTop: 2 },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontWeight: '700', color: colors.textMuted, fontSize: font.small },
  tabTextActive: { color: colors.textInverse },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl * 1.5 },
  emptyEmoji: { fontSize: 44, marginBottom: spacing.md },
  emptyTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  emptyBody: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
});
