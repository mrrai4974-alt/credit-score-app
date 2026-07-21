import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Job } from '../types';
import { colors, font, radius, spacing } from '../theme/theme';
import { inr, withGst } from '../utils/format';
import { Badge, Button, Card, Row } from './ui';
import { JobStatusPill } from './JobStatusPill';

export const JobCard: React.FC<{
  job: Job;
  onPress: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}> = ({ job, onPress, onAccept, onDecline }) => {
  const isOffer = job.status === 'available';

  return (
    <Card style={styles.card}>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.code}>#{job.code}</Text>
          <Text style={styles.service} numberOfLines={1}>
            {job.serviceName}
          </Text>
        </View>
        <JobStatusPill status={job.status} />
      </Row>

      <View style={styles.metaRow}>
        <Badge label={job.category} tone="brand" />
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.meta}>{job.inspectionPoints}-point</Text>
        <Text style={styles.metaDot}>•</Text>
        <Text style={styles.meta}>{job.estimatedDurationMin} min</Text>
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLine}>🏍  {job.vehicle}</Text>
          <Text style={styles.infoLine}>📍  {job.address}</Text>
          <Text style={styles.infoLine}>🕑  {job.scheduledSlot}</Text>
        </View>
      </TouchableOpacity>

      <Row style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Payout · incl. GST</Text>
          <Text style={styles.price}>{inr(withGst(job.basePrice))}</Text>
        </View>
        <View style={styles.distancePill}>
          <Text style={styles.distanceText}>{job.distanceKm} km away</Text>
        </View>
      </Row>

      {isOffer ? (
        <Row style={{ gap: spacing.sm, marginTop: spacing.md }}>
          <Button
            title="Decline"
            variant="outline"
            onPress={onDecline ?? (() => {})}
            style={{ flex: 1 }}
          />
          <Button
            title="Accept job"
            onPress={onAccept ?? (() => {})}
            style={{ flex: 1.4 }}
          />
        </Row>
      ) : (
        <Button
          title="Open job"
          variant="secondary"
          onPress={onPress}
          style={{ marginTop: spacing.md }}
          full
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  code: { fontSize: font.tiny, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  service: { fontSize: font.h3, fontWeight: '700', color: colors.text, marginTop: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  meta: { fontSize: font.small, color: colors.textMuted },
  metaDot: { color: colors.textMuted, marginHorizontal: 6 },
  infoBlock: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: 6,
  },
  infoLine: { fontSize: font.small, color: colors.text },
  footer: { justifyContent: 'space-between', marginTop: spacing.md },
  priceLabel: { fontSize: font.tiny, color: colors.textMuted },
  price: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  distancePill: {
    backgroundColor: colors.infoSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  distanceText: { color: colors.info, fontWeight: '700', fontSize: font.small },
});
