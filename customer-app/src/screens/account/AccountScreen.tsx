import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Divider, Row } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { membershipPlans } from '../../data/catalog';
import { colors, font, radius, spacing } from '../../theme/theme';

export type AccountRoute = 'garage' | 'referral' | 'support';

export const AccountScreen: React.FC<{
  onNavigate: (route: AccountRoute) => void;
  onOpenMembership: () => void;
}> = ({ onNavigate, onOpenMembership }) => {
  const { name, city, vehicles, bookings, membershipId, authenticated, login, logout } =
    useApp();
  const plan = membershipPlans.find((p) => p.id === membershipId);
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{authenticated ? initials : '👤'}</Text>
          </View>
          <Text style={styles.name}>{authenticated ? name : 'Guest'}</Text>
          <Text style={styles.city}>📍 {city}</Text>
        </View>

        {!authenticated ? (
          <Card>
            <Text style={styles.guestTitle}>You're browsing as a guest</Text>
            <Text style={styles.guestSub}>Log in to book services and track them.</Text>
            <Button title="Login / Sign up" onPress={() => login()} style={{ marginTop: spacing.md }} full />
          </Card>
        ) : (
          <Card>
            <Row style={{ justifyContent: 'space-around' }}>
              <Stat value={String(vehicles.length)} label="Vehicles" />
              <View style={styles.vLine} />
              <Stat value={String(bookings.length)} label="Bookings" />
              <View style={styles.vLine} />
              <Stat value={plan ? plan.name : 'None'} label="Plan" />
            </Row>
          </Card>
        )}

        {/* Membership banner */}
        <TouchableOpacity activeOpacity={0.85} onPress={onOpenMembership}>
          <Card style={styles.memberCard}>
            <View style={{ flex: 1 }}>
              {plan ? (
                <>
                  <Badge label={`${plan.name} member`} tone="success" />
                  <Text style={styles.memberTitle}>You're saving on every service</Text>
                </>
              ) : (
                <>
                  <Badge label="Upgrade" tone="brand" />
                  <Text style={styles.memberTitle}>Join a membership & save up to 18%</Text>
                </>
              )}
            </View>
            <Text style={styles.memberChev}>›</Text>
          </Card>
        </TouchableOpacity>

        <Card style={{ marginTop: spacing.lg, padding: 0 }}>
          <MenuRow icon="🏍️" label="My Garage" onPress={() => onNavigate('garage')} />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🎁" label="Refer & Earn" onPress={() => onNavigate('referral')} />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🎧" label="Help & Support" onPress={() => onNavigate('support')} />
          <Divider style={{ marginVertical: 0 }} />
          <MenuRow icon="🌐" label="Language · English" onPress={() => {}} />
        </Card>

        {authenticated && (
          <Button
            title="Log out"
            variant="danger"
            onPress={logout}
            style={{ marginTop: spacing.xl }}
            full
          />
        )}
        <Text style={styles.version}>Doorstep Bike Service · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const MenuRow: React.FC<{ icon: string; label: string; onPress: () => void }> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Row style={styles.menuRow}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuLabel}>{label}</Text>
      <Text style={styles.menuChevron}>›</Text>
    </Row>
  </TouchableOpacity>
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
  avatarText: { color: colors.textInverse, fontSize: 30, fontWeight: '800' },
  name: { fontSize: font.h2, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  city: { fontSize: font.body, color: colors.textMuted, marginTop: 2 },
  guestTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  guestSub: { fontSize: font.small, color: colors.textMuted, marginTop: 4 },
  vLine: { width: 1, height: 36, backgroundColor: colors.divider },
  statValue: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: font.tiny, color: colors.textMuted, marginTop: 2 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.navy,
  },
  memberTitle: { color: colors.textInverse, fontSize: font.body, fontWeight: '700', marginTop: 8 },
  memberChev: { color: colors.textInverse, fontSize: 28 },
  menuRow: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
  menuIcon: { fontSize: 18, width: 30 },
  menuLabel: { fontSize: font.body, color: colors.text, flex: 1 },
  menuChevron: { fontSize: 22, color: colors.textMuted },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: font.small, marginTop: spacing.lg },
});
