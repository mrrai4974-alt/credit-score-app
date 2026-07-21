import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { membershipPlans } from '../../data/catalog';
import { colors, font, radius, spacing } from '../../theme/theme';
import { inr } from '../../utils/format';

/** Membership/subscription plans with entitlements (FR-12). */
export const MembershipScreen: React.FC = () => {
  const { membershipId, subscribe } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Membership</Text>
        <Text style={styles.sub}>Save more on every doorstep service</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {membershipPlans.map((p) => {
          const active = membershipId === p.id;
          return (
            <Card
              key={p.id}
              style={[
                styles.plan,
                p.highlighted && styles.planHighlight,
                active && styles.planActive,
              ]}
            >
              <View style={styles.planHead}>
                <View>
                  <Text style={styles.planName}>{p.name}</Text>
                  <Text style={styles.planTag}>{p.tagline}</Text>
                </View>
                {p.highlighted && !active && <Badge label="Popular" tone="brand" />}
                {active && <Badge label="Active" tone="success" />}
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{inr(p.price)}</Text>
                <Text style={styles.per}>/ year</Text>
              </View>

              <View style={styles.perks}>
                {p.perks.map((perk) => (
                  <View key={perk} style={styles.perkRow}>
                    <Text style={styles.perkCheck}>✓</Text>
                    <Text style={styles.perkText}>{perk}</Text>
                  </View>
                ))}
              </View>

              <Button
                title={active ? 'Current plan' : `Get ${p.name}`}
                variant={active ? 'outline' : p.highlighted ? 'primary' : 'secondary'}
                onPress={() => subscribe(p.id)}
                disabled={active}
                style={{ marginTop: spacing.md }}
                full
              />
            </Card>
          );
        })}
        <Text style={styles.note}>
          Plans auto-renew yearly. Cancel anytime from your account.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  sub: { fontSize: font.body, color: colors.textMuted, marginTop: 2 },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  plan: { marginBottom: spacing.lg },
  planHighlight: { borderWidth: 2, borderColor: colors.primary },
  planActive: { borderWidth: 2, borderColor: colors.success },
  planHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  planTag: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.md },
  price: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  per: { fontSize: font.body, color: colors.textMuted, marginLeft: 4, marginBottom: 4 },
  perks: { marginTop: spacing.md, gap: 8 },
  perkRow: { flexDirection: 'row', alignItems: 'center' },
  perkCheck: { color: colors.success, fontWeight: '900', marginRight: spacing.md },
  perkText: { fontSize: font.body, color: colors.text },
  note: { fontSize: font.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
