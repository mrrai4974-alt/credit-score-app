import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Divider, KeyValue, Row } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { VerificationStatus } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';

const VERIFY: Record<VerificationStatus, { label: string; tone: any }> = {
  pending: { label: 'Not submitted', tone: 'neutral' },
  in_review: { label: 'Under review', tone: 'warning' },
  verified: { label: 'Verified partner', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
};

export const ProfileScreen: React.FC = () => {
  const { mechanic, logout } = useApp();
  const v = VERIFY[mechanic.verification];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{mechanic.avatarInitials}</Text>
          </View>
          <Text style={styles.name}>{mechanic.name}</Text>
          <Text style={styles.phone}>{mechanic.phone}</Text>
          <Badge label={v.label} tone={v.tone} style={{ marginTop: spacing.sm }} />
        </View>

        <Card>
          <Row style={{ justifyContent: 'space-around' }}>
            <Metric value={`★ ${mechanic.rating || '—'}`} label="Rating" />
            <View style={styles.vLine} />
            <Metric value={String(mechanic.jobsCompleted)} label="Jobs" />
            <View style={styles.vLine} />
            <Metric value={`${mechanic.serviceRadiusKm} km`} label="Radius" />
          </Row>
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <KeyValue label="City" value={mechanic.city} />
          <Divider />
          <Text style={styles.skillsLabel}>Skills</Text>
          <View style={styles.chips}>
            {mechanic.skills.map((s) => (
              <Badge key={s} label={s} tone="brand" style={{ marginRight: 6, marginBottom: 6 }} />
            ))}
          </View>
        </Card>

        <Card style={{ marginTop: spacing.lg, padding: 0 }}>
          <MenuRow icon="📄" label="KYC & documents" />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🏦" label="Bank & payout details" />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="📍" label="Service area & radius" />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🎧" label="Support & helpline" />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🌐" label="Language · English" />
        </Card>

        <Button
          title="Log out"
          variant="danger"
          onPress={logout}
          style={{ marginTop: spacing.xl }}
          full
        />
        <Text style={styles.version}>Bike Mistri · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Metric: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const MenuRow: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <Row style={styles.menuRow}>
    <Text style={styles.menuIcon}>{icon}</Text>
    <Text style={styles.menuLabel}>{label}</Text>
    <Text style={styles.menuChevron}>›</Text>
  </Row>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.textInverse, fontSize: 32, fontWeight: '800' },
  name: { fontSize: font.h2, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  phone: { fontSize: font.body, color: colors.textMuted, marginTop: 2 },
  vLine: { width: 1, height: 36, backgroundColor: colors.divider },
  metricValue: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  metricLabel: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2 },
  skillsLabel: { fontSize: font.small, color: colors.textMuted, fontWeight: '600', marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  menuRow: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  menuIcon: { fontSize: 18, width: 30 },
  menuLabel: { fontSize: font.body, color: colors.text, flex: 1 },
  menuChevron: { fontSize: 22, color: colors.textMuted },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: font.small, marginTop: spacing.lg },
});
