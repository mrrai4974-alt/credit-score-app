import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, KeyValue } from '../../components/ui';
import { Booking } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';

export const BookingConfirmedScreen: React.FC<{
  booking: Booking;
  onTrack: () => void;
  onHome: () => void;
}> = ({ booking, onTrack, onHome }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.center}>
      <View style={styles.badge}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.title}>Booking confirmed!</Text>
      <Text style={styles.sub}>
        A certified mechanic will be assigned shortly. We'll notify you at each
        step.
      </Text>

      <Card style={styles.card}>
        <KeyValue label="Booking ID" value={`#${booking.code}`} />
        <KeyValue label="Service" value={booking.service.name} />
        <KeyValue
          label="Vehicle"
          value={`${booking.vehicle.brand} ${booking.vehicle.model}`}
        />
        <KeyValue label="Slot" value={booking.slot} />
        <KeyValue
          label="Payment"
          value={booking.paymentMethod === 'online' ? 'Pay online (Razorpay)' : 'Pay after service'}
        />
      </Card>
    </View>

    <View style={styles.footer}>
      <Button title="Track my booking" onPress={onTrack} full />
      <Button
        title="Back to home"
        variant="ghost"
        onPress={onHome}
        style={{ marginTop: spacing.sm }}
        full
      />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  center: { flex: 1, justifyContent: 'center', padding: spacing.xl },
  badge: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  check: { color: '#fff', fontSize: 44, fontWeight: '900' },
  title: {
    fontSize: font.h1,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  sub: {
    fontSize: font.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 21,
  },
  card: { marginTop: spacing.xl },
  footer: { padding: spacing.lg },
});
