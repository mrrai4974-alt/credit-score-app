import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Badge, Button, Card, withAlpha } from '../components/ui';
import { colors, radius, spacing, typography } from '../theme';

interface Expert {
  id: string;
  name: string;
  title: string;
  rating: number;
  sessions: number;
  languages: string;
}

const EXPERTS: Expert[] = [
  { id: 'e1', name: 'Priya Nair', title: 'Senior Credit Advisor', rating: 4.9, sessions: 1240, languages: 'English, Hindi' },
  { id: 'e2', name: 'Rohan Mehta', title: 'Loan & Debt Specialist', rating: 4.8, sessions: 980, languages: 'English, Marathi' },
];

const SLOTS = ['Today 4:00 PM', 'Today 6:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 3:00 PM'];

export function ConsultationScreen() {
  const [expert, setExpert] = useState<string>(EXPERTS[0].id);
  const [slot, setSlot] = useState<string>('');

  function book() {
    const e = EXPERTS.find((x) => x.id === expert);
    Alert.alert(
      'Consultation booked ✅',
      `${e?.name} will call you at ${slot}. You’ll get a reminder 15 minutes before.`,
    );
    setSlot('');
  }

  return (
    <Screen topInset={false}>
      <Card style={styles.hero}>
        <Ionicons name="headset" size={26} color={colors.primary} />
        <View style={styles.flex}>
          <Text style={styles.heroTitle}>1-on-1 with a credit expert</Text>
          <Text style={styles.heroSub}>
            Get a personalised plan to raise your score and pick the right loan.
          </Text>
        </View>
      </Card>

      <Text style={styles.section}>Choose an expert</Text>
      {EXPERTS.map((e) => {
        const selected = expert === e.id;
        return (
          <Pressable key={e.id} onPress={() => setExpert(e.id)}>
            <Card style={selected ? styles.selectedCard : undefined}>
              <View style={styles.expertRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {e.name.split(' ').map((p) => p[0]).join('')}
                  </Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.name}>{e.name}</Text>
                  <Text style={styles.title}>{e.title}</Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="star" size={13} color={colors.warning} />
                    <Text style={styles.meta}>
                      {e.rating} · {e.sessions}+ sessions · {e.languages}
                    </Text>
                  </View>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color={colors.border} />
                )}
              </View>
            </Card>
          </Pressable>
        );
      })}

      <Text style={styles.section}>Pick a slot</Text>
      <View style={styles.slots}>
        {SLOTS.map((s) => {
          const selected = slot === s;
          return (
            <Pressable
              key={s}
              style={[styles.slot, selected && styles.slotOn]}
              onPress={() => setSlot(s)}
            >
              <Text style={[styles.slotText, selected && styles.slotTextOn]}>{s}</Text>
            </Pressable>
          );
        })}
      </View>

      <Card style={styles.priceCard}>
        <View style={styles.flex}>
          <Text style={styles.price}>₹499</Text>
          <Text style={styles.priceSub}>per 30-min call · free on Premium</Text>
        </View>
        <Badge label="Premium: Free" color={colors.success} />
      </Card>

      <Button label="Book consultation" onPress={book} disabled={!slot} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  heroTitle: { ...typography.h3, color: colors.textPrimary },
  heroSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  section: { ...typography.bodyStrong, color: colors.textPrimary, marginTop: spacing.sm },
  selectedCard: { borderWidth: 1, borderColor: colors.primary },
  expertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: withAlpha(colors.primary, 0.12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.bodyStrong, color: colors.primary },
  name: { ...typography.bodyStrong, color: colors.textPrimary },
  title: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  meta: { ...typography.tiny, color: colors.textMuted },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  slotOn: { borderColor: colors.primary, backgroundColor: withAlpha(colors.primary, 0.08) },
  slotText: { ...typography.caption, color: colors.textSecondary },
  slotTextOn: { color: colors.primary, fontWeight: '700' },
  priceCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  price: { ...typography.h2, color: colors.textPrimary },
  priceSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
