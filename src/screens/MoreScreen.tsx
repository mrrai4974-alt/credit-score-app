import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Card, ListRow, withAlpha } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { env } from '../config/env';
import type { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing, typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function MoreScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();

  const initials = (user?.fullName ?? 'GC')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function confirmSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  }

  function withdrawConsent() {
    Alert.alert(
      'Withdraw consent',
      'This revokes permission to fetch your credit report and signs you out. You can grant it again anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Withdraw & sign out', style: 'destructive', onPress: () => void signOut() },
      ],
    );
  }

  return (
    <Screen>
      {/* Profile header */}
      <Card>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.contact}>+91 {user?.mobile}</Text>
            {user?.pan ? <Text style={styles.contact}>PAN · {maskPan(user.pan)}</Text> : null}
          </View>
          <Badge label="Free plan" color={colors.primary} />
        </View>
      </Card>

      {/* Premium upsell (monetisation) */}
      <Card style={styles.premium}>
        <Ionicons name="star" size={22} color={colors.warning} />
        <View style={styles.flex}>
          <Text style={styles.premiumTitle}>Go Premium</Text>
          <Text style={styles.premiumSub}>
            Unlimited expert chat, priority dispute resolution & more.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Card>

      {/* Advisory & support (FR-7 to FR-10) */}
      <Text style={styles.groupLabel}>Advisory & support</Text>
      <Card>
        <ListRow
          icon="trending-up"
          iconColor={colors.accent}
          title="Score improvement plan"
          subtitle="Your personalised step-by-step plan"
          onPress={() => navigation.navigate('ImprovementPlan')}
        />
        <Divider />
        <ListRow
          icon="headset"
          iconColor="#8B5CF6"
          title="Talk to a credit expert"
          subtitle="Book a 1-on-1 consultation"
          onPress={() => navigation.navigate('Consultation')}
        />
        <Divider />
        <ListRow
          icon="chatbubbles"
          iconColor={colors.primary}
          title="Chat support"
          subtitle="24x7 help with your credit"
          onPress={() => navigation.navigate('Chat')}
        />
        <Divider />
        <ListRow
          icon="shield-checkmark"
          iconColor={colors.warning}
          title="My disputes"
          subtitle="Track report errors & fake accounts"
          onPress={() => navigation.navigate('Disputes')}
        />
      </Card>

      {/* Account */}
      <Text style={styles.groupLabel}>Account</Text>
      <Card>
        <ListRow
          icon="notifications"
          iconColor={colors.primary}
          title="Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <Divider />
        <ListRow
          icon="lock-closed"
          iconColor={colors.textSecondary}
          title="Data consent"
          subtitle={`Bureau: ${env.bureauProvider} · consent active`}
          onPress={withdrawConsent}
        />
        <Divider />
        <ListRow
          icon="log-out"
          iconColor={colors.danger}
          title="Sign out"
          onPress={confirmSignOut}
        />
      </Card>

      {/* Trust badges (NFR: security/compliance) */}
      <View style={styles.trust}>
        <TrustBadge icon="lock-closed" label="256-bit encryption" />
        <TrustBadge icon="ribbon" label="PCI-DSS" />
        <TrustBadge icon="checkmark-circle" label="SOC-2" />
      </View>
      <Text style={styles.version}>GoodCredit · v1.0.0 (demo)</Text>
    </Screen>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function TrustBadge({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.trustBadge}>
      <Ionicons name={icon} size={16} color={colors.textSecondary} />
      <Text style={styles.trustLabel}>{label}</Text>
    </View>
  );
}

function maskPan(pan: string): string {
  if (pan.length < 10) return pan;
  return `${pan.slice(0, 3)}xxxx${pan.slice(-1)}`;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: withAlpha(colors.primary, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.h2, color: colors.primary },
  name: { ...typography.h3, color: colors.textPrimary },
  contact: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: withAlpha(colors.warning, 0.4),
    backgroundColor: withAlpha(colors.warning, 0.06),
  },
  premiumTitle: { ...typography.bodyStrong, color: colors.textPrimary },
  premiumSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  groupLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 52 },
  trust: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md, marginTop: spacing.md },
  trustBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trustLabel: { ...typography.tiny, color: colors.textSecondary },
  version: { ...typography.tiny, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
