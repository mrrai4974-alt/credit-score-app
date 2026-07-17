import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingStatusPill } from '../../components/shared';
import { Badge, Card, Row } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { colors, font, radius, spacing } from '../../theme/theme';
import { inr, withGst } from '../../utils/format';

export const BookingsScreen: React.FC<{
  onOpen: (bookingId: string) => void;
}> = ({ onOpen }) => {
  const { bookings } = useApp();
  const active = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My bookings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {bookings.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🗓️</Text>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyBody}>
              Book a doorstep service and track it here.
            </Text>
          </View>
        )}

        {active.length > 0 && <Text style={styles.section}>Active</Text>}
        {active.map((b) => (
          <BookingItem key={b.id} b={b} onPress={() => onOpen(b.id)} />
        ))}

        {past.length > 0 && <Text style={styles.section}>History</Text>}
        {past.map((b) => (
          <BookingItem key={b.id} b={b} onPress={() => onOpen(b.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const BookingItem: React.FC<{ b: any; onPress: () => void }> = ({ b, onPress }) => {
  const needsAction =
    b.status === 'awaiting_approval' ||
    (b.status === 'completed' && !b.rating) ||
    (b.status === 'completed' && !b.paid);
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.card}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={styles.code}>#{b.code}</Text>
          <BookingStatusPill status={b.status} />
        </Row>
        <Text style={styles.svc}>{b.service.name}</Text>
        <Text style={styles.meta}>
          {b.vehicle.brand} {b.vehicle.model} · {b.slot}
        </Text>
        <Row style={{ justifyContent: 'space-between', marginTop: spacing.md }}>
          <Text style={styles.price}>{inr(withGst(b.service.price ?? 0))}</Text>
          {needsAction ? (
            <Badge label="Action needed" tone="warning" />
          ) : (
            <Text style={styles.open}>View ›</Text>
          )}
        </Row>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontSize: font.h1, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  section: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  card: { marginBottom: spacing.lg },
  code: { fontSize: font.tiny, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  svc: { fontSize: font.h3, fontWeight: '700', color: colors.text, marginTop: 6 },
  meta: { fontSize: font.small, color: colors.textMuted, marginTop: 4 },
  price: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  open: { color: colors.primary, fontWeight: '700', fontSize: font.body },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl * 1.5 },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text, marginTop: spacing.md },
  emptyBody: { fontSize: font.body, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
});
