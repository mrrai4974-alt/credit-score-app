import React from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookingStatusPill } from '../../components/shared';
import {
  Badge,
  Button,
  Card,
  Divider,
  KeyValue,
  Row,
  SectionTitle,
} from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';
import { gstAmount, inr } from '../../utils/format';

const TIMELINE: { status: BookingStatus; label: string }[] = [
  { status: 'booked', label: 'Booking confirmed' },
  { status: 'assigned', label: 'Mechanic assigned' },
  { status: 'en_route', label: 'Mechanic en route' },
  { status: 'in_service', label: 'Service in progress' },
  { status: 'completed', label: 'Service completed' },
];

const ORDER: BookingStatus[] = [
  'booked',
  'assigned',
  'en_route',
  'in_service',
  'awaiting_approval',
  'completed',
];

export const TrackingScreen: React.FC<{
  bookingId: string;
  onBack: () => void;
}> = ({ bookingId, onBack }) => {
  const {
    bookings,
    refreshBookings,
    decideExtra,
    payBooking,
    rateBooking,
  } = useApp();

  const b = bookings.find((x) => x.id === bookingId);
  if (!b) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.missing}>Booking not found.</Text>
        <Button title="Back" onPress={onBack} />
      </SafeAreaView>
    );
  }

  const currentIdx = ORDER.indexOf(
    b.status === 'awaiting_approval' ? 'in_service' : b.status,
  );
  const base = b.service.price ?? 0;
  const extrasTotal = b.extras.reduce((s, e) => s + e.price, 0);
  const gross = base + extrasTotal;
  const total = Math.max(0, gross + gstAmount(gross) - b.discount);

  const call = () =>
    Linking.openURL('tel:+918000000000').catch(() =>
      Alert.alert('Call', 'Unable to place the call.'),
    );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Bookings</Text>
        </TouchableOpacity>
        <Text style={styles.topCode}>#{b.code}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.svc}>{b.service.name}</Text>
          </Row>
          <Row style={{ marginTop: 6 }}>
            <BookingStatusPill status={b.status} />
          </Row>
          <Divider />
          <KeyValue
            label="Vehicle"
            value={`${b.vehicle.brand} ${b.vehicle.model}`}
          />
          <KeyValue label="Slot" value={b.slot} />
          <KeyValue label="Address" value={b.address} />
        </Card>

        {/* Mechanic card */}
        {b.mechanicName && b.status !== 'completed' && (
          <Card style={{ marginTop: spacing.lg }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Row style={{ gap: spacing.md }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {b.mechanicName.split(' ').map((p) => p[0]).join('')}
                  </Text>
                </View>
                <View>
                  <Text style={styles.mechName}>{b.mechanicName}</Text>
                  <Text style={styles.mechMeta}>
                    ★ {b.mechanicRating} · Verified mistri
                  </Text>
                </View>
              </Row>
              <TouchableOpacity style={styles.callBtn} onPress={call}>
                <Text style={styles.callIcon}>📞</Text>
              </TouchableOpacity>
            </Row>
          </Card>
        )}

        {/* Timeline (FR-08) */}
        <Card style={{ marginTop: spacing.lg }}>
          <SectionTitle>Live tracking</SectionTitle>
          {TIMELINE.map((step, i) => {
            const stepIdx = ORDER.indexOf(step.status);
            const done = stepIdx <= currentIdx;
            const active = stepIdx === currentIdx && b.status !== 'completed';
            return (
              <Row key={step.status} style={styles.tlRow}>
                <View style={styles.tlLeft}>
                  <View
                    style={[
                      styles.tlDot,
                      done && styles.tlDotDone,
                      active && styles.tlDotActive,
                    ]}
                  >
                    {done && <Text style={styles.tlCheck}>✓</Text>}
                  </View>
                  {i < TIMELINE.length - 1 && (
                    <View style={[styles.tlLine, done && styles.tlLineDone]} />
                  )}
                </View>
                <Text style={[styles.tlLabel, done && styles.tlLabelDone]}>
                  {step.label}
                </Text>
              </Row>
            );
          })}

          {/* Status is driven by the mechanic app; pull the latest here. */}
          {b.status !== 'completed' && (
            <Button
              title="↻ Refresh status"
              variant="outline"
              onPress={() => refreshBookings()}
              style={{ marginTop: spacing.md }}
              full
            />
          )}
        </Card>

        {/* Approval flow (FR-09) */}
        {b.pendingExtras.length > 0 && (
          <Card style={[styles.approval, { marginTop: spacing.lg }]}>
            <Text style={styles.approvalTitle}>⚠️ Approval needed</Text>
            <Text style={styles.approvalSub}>
              Your mechanic found additional work. Nothing is billed without your
              approval.
            </Text>
            {b.pendingExtras.map((e) => (
              <View key={e.id} style={styles.extraRow}>
                <Text style={styles.extraTitle}>{e.title}</Text>
                <Text style={styles.extraPrice}>{inr(e.price)} + GST</Text>
                <Row style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                  <Button
                    title="Approve"
                    onPress={() => decideExtra(b.id, e.id, true)}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Decline"
                    variant="danger"
                    onPress={() => decideExtra(b.id, e.id, false)}
                    style={{ flex: 1 }}
                  />
                </Row>
              </View>
            ))}
          </Card>
        )}

        {/* Invoice / bill (FR-10) */}
        <Card style={{ marginTop: spacing.lg }}>
          <SectionTitle>Bill</SectionTitle>
          <KeyValue label="Service" value={inr(base)} />
          {b.extras.map((e) => (
            <KeyValue key={e.id} label={e.title} value={inr(e.price)} />
          ))}
          <KeyValue label="GST (18%)" value={inr(gstAmount(gross))} />
          {b.discount > 0 && (
            <KeyValue label={`Promo ${b.promoCode ?? ''}`} value={`- ${inr(b.discount)}`} />
          )}
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{inr(total)}</Text>
          </Row>
          <Row style={{ justifyContent: 'space-between', marginTop: spacing.sm }}>
            <Badge
              label={b.paid ? 'Paid' : 'Payment due'}
              tone={b.paid ? 'success' : 'warning'}
            />
            {b.paid && (
              <TouchableOpacity
                onPress={() => Alert.alert('Invoice', 'GST invoice downloaded (demo).')}
              >
                <Text style={styles.invoiceLink}>Download GST invoice</Text>
              </TouchableOpacity>
            )}
          </Row>
          {!b.paid && b.status !== 'cancelled' && (
            <Button
              title={`Pay ${inr(total)} securely`}
              onPress={() =>
                payBooking(b.id).catch((e) =>
                  Alert.alert('Payment', (e as Error).message),
                )
              }
              style={{ marginTop: spacing.md }}
              full
            />
          )}
        </Card>

        {/* Rating + warranty (FR-11) */}
        {b.status === 'completed' && (
          <Card style={{ marginTop: spacing.lg }}>
            <SectionTitle>Rate your service</SectionTitle>
            <Row style={{ justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.sm }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <TouchableOpacity key={n} onPress={() => rateBooking(b.id, n)}>
                  <Text style={[styles.star, n <= (b.rating ?? 0) && styles.starOn]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </Row>
            {b.rating ? (
              <Text style={styles.thanks}>Thanks for rating {b.rating}★!</Text>
            ) : (
              <Text style={styles.thanks}>Tap a star to rate your mistri.</Text>
            )}
            <Divider />
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={styles.warranty}>🛡️ Workmanship warranty</Text>
              <Badge label={`${b.warrantyDays} days active`} tone="success" />
            </Row>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  missing: { textAlign: 'center', margin: spacing.xl, color: colors.textMuted },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 60 },
  topCode: { fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  svc: { fontSize: font.h2, fontWeight: '800', color: colors.text, flex: 1 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800' },
  mechName: { fontSize: font.body, fontWeight: '700', color: colors.text },
  mechMeta: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  callBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.successSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: { fontSize: 20 },
  tlRow: { alignItems: 'flex-start' },
  tlLeft: { alignItems: 'center', width: 30 },
  tlDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tlDotDone: { backgroundColor: colors.success, borderColor: colors.success },
  tlDotActive: { borderColor: colors.primary, borderWidth: 3 },
  tlCheck: { color: '#fff', fontWeight: '900', fontSize: 12 },
  tlLine: { width: 2, height: 26, backgroundColor: colors.border },
  tlLineDone: { backgroundColor: colors.success },
  tlLabel: { fontSize: font.body, color: colors.textMuted, paddingTop: 1, flex: 1 },
  tlLabelDone: { color: colors.text, fontWeight: '600' },
  approval: { backgroundColor: colors.warningSoft },
  approvalTitle: { fontSize: font.h3, fontWeight: '800', color: colors.warning },
  approvalSub: { fontSize: font.small, color: colors.text, marginTop: 4, lineHeight: 18 },
  extraRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  extraTitle: { fontSize: font.body, fontWeight: '700', color: colors.text },
  extraPrice: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  totalLabel: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  invoiceLink: { color: colors.primary, fontWeight: '700', fontSize: font.small },
  star: { fontSize: 38, color: colors.border },
  starOn: { color: colors.warning },
  thanks: { textAlign: 'center', color: colors.textMuted, fontSize: font.small },
  warranty: { fontSize: font.body, color: colors.text, fontWeight: '600' },
});
