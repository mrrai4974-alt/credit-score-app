import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Booking, Service } from '../types';
import { colors, font, radius, spacing } from '../theme/theme';
import { inr, withGst } from '../utils/format';
import { Badge, Card, Row } from './ui';

/* -------------------------------------------------------------- Price tag */

export const PriceTag: React.FC<{ service: Service; size?: 'sm' | 'lg' }> = ({
  service,
  size = 'sm',
}) => {
  if (service.price === null) {
    return <Text style={[styles.quote, size === 'lg' && { fontSize: font.h3 }]}>Custom quote</Text>;
  }
  return (
    <View>
      <Text style={[styles.price, size === 'lg' && { fontSize: font.h1 }]}>
        {inr(withGst(service.price))}
      </Text>
      <Text style={styles.priceSub}>incl. GST</Text>
    </View>
  );
};

/* ------------------------------------------------------------ Service card */

export const ServiceRow: React.FC<{
  service: Service;
  onPress: () => void;
}> = ({ service, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <Card style={styles.serviceCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceDesc} numberOfLines={2}>
          {service.description}
        </Text>
        <Row style={{ marginTop: spacing.sm, gap: spacing.sm }}>
          <Badge label={`${service.durationMin} min`} />
          {service.inspectionPoints > 0 && (
            <Badge label={`${service.inspectionPoints}-point`} tone="brand" />
          )}
        </Row>
      </View>
      <View style={styles.serviceRight}>
        <PriceTag service={service} />
        <Text style={styles.chev}>›</Text>
      </View>
    </Card>
  </TouchableOpacity>
);

/* ----------------------------------------------------------- Booking status */

const STATUS_LABEL: Record<Booking['status'], { label: string; tone: any }> = {
  booked: { label: 'Booked', tone: 'info' },
  assigned: { label: 'Mechanic assigned', tone: 'info' },
  en_route: { label: 'En route', tone: 'info' },
  in_service: { label: 'In service', tone: 'warning' },
  awaiting_approval: { label: 'Needs your approval', tone: 'warning' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'danger' },
};

export const BookingStatusPill: React.FC<{ status: Booking['status'] }> = ({
  status,
}) => {
  const s = STATUS_LABEL[status];
  return <Badge label={s.label} tone={s.tone} />;
};

export const Stars: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 16,
}) => (
  <Text style={{ fontSize: size, color: colors.warning, letterSpacing: 1 }}>
    {'★'.repeat(Math.round(value))}
    <Text style={{ color: colors.border }}>{'★'.repeat(5 - Math.round(value))}</Text>
  </Text>
);

const styles = StyleSheet.create({
  price: { fontSize: font.h3, fontWeight: '800', color: colors.text, textAlign: 'right' },
  priceSub: { fontSize: font.tiny, color: colors.textMuted, textAlign: 'right' },
  quote: { fontSize: font.body, fontWeight: '800', color: colors.primary },
  serviceCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  serviceName: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  serviceDesc: { fontSize: font.small, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  serviceRight: { alignItems: 'flex-end', marginLeft: spacing.md },
  chev: { fontSize: 26, color: colors.textMuted, marginTop: spacing.sm },
});
