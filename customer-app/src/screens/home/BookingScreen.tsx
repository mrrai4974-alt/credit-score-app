import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, Divider, Row, SectionTitle } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { brands } from '../../data/catalog';
import { Booking, Service, Vehicle } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';
import { gstAmount, inr } from '../../utils/format';

const SLOTS = [
  'Today · 2:00 PM',
  'Today · 4:30 PM',
  'Tomorrow · 10:00 AM',
  'Tomorrow · 12:30 PM',
  'Tomorrow · 3:00 PM',
];

export const BookingScreen: React.FC<{
  service: Service;
  onBack: () => void;
  onConfirmed: (booking: Booking) => void;
}> = ({ service, onBack, onConfirmed }) => {
  const { vehicles, addVehicle, applyPromo, createBooking, city } = useApp();

  const [vehicleId, setVehicleId] = useState<string | null>(
    vehicles[0]?.id ?? null,
  );
  const [slot, setSlot] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<'online' | 'cod'>('online');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | undefined>();

  // inline add-vehicle
  const [showAdd, setShowAdd] = useState(vehicles.length === 0);
  const [newBrand, setNewBrand] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newReg, setNewReg] = useState('');

  const base = service.price ?? 0;
  const gst = gstAmount(base);
  const total = useMemo(
    () => Math.max(0, base + gst - discount),
    [base, gst, discount],
  );

  const tryPromo = () => {
    const value = applyPromo(promo);
    if (value === null) {
      Alert.alert('Invalid code', 'That promo code is not valid.');
      setDiscount(0);
      setAppliedCode(undefined);
      return;
    }
    setDiscount(value);
    setAppliedCode(promo.trim().toUpperCase());
    Alert.alert('Promo applied', `You saved ${inr(value)}!`);
  };

  const saveVehicle = () => {
    if (!newBrand || !newModel) {
      Alert.alert('Add vehicle', 'Enter at least brand and model.');
      return;
    }
    const isEv = brands.find((b) => b.name === newBrand)?.type === 'EV';
    addVehicle({
      brand: newBrand,
      model: newModel,
      registration: newReg || 'Not provided',
      type: isEv ? 'EV' : 'Petrol',
    });
    setShowAdd(false);
    setNewBrand('');
    setNewModel('');
    setNewReg('');
  };

  const confirm = () => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return Alert.alert('Booking', 'Please select a vehicle.');
    if (!slot) return Alert.alert('Booking', 'Please choose a time slot.');
    if (address.trim().length < 6)
      return Alert.alert('Booking', 'Please enter your service address.');

    const booking = createBooking({
      service,
      vehicle,
      slot,
      address: `${address.trim()}, ${city}`,
      paymentMethod: payment,
      promoCode: appliedCode,
      discount,
    });
    onConfirmed(booking);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book service</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Card>
          <Text style={styles.svcName}>{service.name}</Text>
          <Row style={{ gap: spacing.sm, marginTop: 6 }}>
            <Badge label={service.category} tone="brand" />
            <Badge label={`${service.durationMin} min`} />
          </Row>
        </Card>

        {/* Vehicle (FR-02) */}
        <SectionTitle style={styles.section}>Select vehicle</SectionTitle>
        {vehicles.map((v) => (
          <VehicleRow
            key={v.id}
            v={v}
            selected={v.id === vehicleId}
            onPress={() => setVehicleId(v.id)}
          />
        ))}
        {!showAdd ? (
          <TouchableOpacity onPress={() => setShowAdd(true)}>
            <Text style={styles.addLink}>+ Add another vehicle</Text>
          </TouchableOpacity>
        ) : (
          <Card style={{ marginTop: spacing.sm }}>
            <TextInput
              style={styles.input}
              placeholder="Brand (e.g. Honda)"
              placeholderTextColor={colors.textMuted}
              value={newBrand}
              onChangeText={setNewBrand}
            />
            <TextInput
              style={styles.input}
              placeholder="Model (e.g. Activa 6G)"
              placeholderTextColor={colors.textMuted}
              value={newModel}
              onChangeText={setNewModel}
            />
            <TextInput
              style={styles.input}
              placeholder="Registration (optional)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
              value={newReg}
              onChangeText={setNewReg}
            />
            <Button title="Save vehicle" variant="secondary" onPress={saveVehicle} full />
          </Card>
        )}

        {/* Slot */}
        <SectionTitle style={styles.section}>Pick a time slot</SectionTitle>
        <View style={styles.slotWrap}>
          {SLOTS.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.slot, slot === s && styles.slotActive]}
              onPress={() => setSlot(s)}
            >
              <Text style={[styles.slotText, slot === s && styles.slotTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Address */}
        <SectionTitle style={styles.section}>Service address</SectionTitle>
        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder={`House / flat, street, landmark — ${city}`}
          placeholderTextColor={colors.textMuted}
          multiline
          value={address}
          onChangeText={setAddress}
        />

        {/* Promo (FR-13) */}
        <SectionTitle style={styles.section}>Promo code</SectionTitle>
        <Row style={{ gap: spacing.sm }}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Try FIRST100"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            value={promo}
            onChangeText={setPromo}
          />
          <Button title="Apply" variant="outline" onPress={tryPromo} />
        </Row>

        {/* Payment (FR-10) */}
        <SectionTitle style={styles.section}>Payment method</SectionTitle>
        <PayOption
          label="Pay online (UPI / cards / wallets)"
          sub="Secure prepayment"
          selected={payment === 'online'}
          onPress={() => setPayment('online')}
        />
        <PayOption
          label="Pay after service"
          sub="Cash / UPI on completion"
          selected={payment === 'cod'}
          onPress={() => setPayment('cod')}
        />

        {/* Bill */}
        <Card style={{ marginTop: spacing.lg }}>
          <SectionTitle>Bill summary</SectionTitle>
          <KeyRow label="Service" value={inr(base)} />
          <KeyRow label="GST (18%)" value={inr(gst)} />
          {discount > 0 && (
            <KeyRow label={`Promo ${appliedCode}`} value={`- ${inr(discount)}`} discount />
          )}
          <Divider />
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={styles.totalLabel}>Total payable</Text>
            <Text style={styles.totalValue}>{inr(total)}</Text>
          </Row>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={payment === 'online' ? `Pay ${inr(total)} & confirm` : `Confirm booking · ${inr(total)}`}
          onPress={confirm}
          full
        />
      </View>
    </SafeAreaView>
  );
};

const VehicleRow: React.FC<{
  v: Vehicle;
  selected: boolean;
  onPress: () => void;
}> = ({ v, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={[styles.vehicleRow, selected && styles.vehicleRowActive]}>
      <Text style={styles.vehicleEmoji}>{v.type === 'EV' ? '⚡' : '🏍️'}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.vehicleName}>
          {v.brand} {v.model}
        </Text>
        <Text style={styles.vehicleReg}>{v.registration}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Card>
  </TouchableOpacity>
);

const PayOption: React.FC<{
  label: string;
  sub: string;
  selected: boolean;
  onPress: () => void;
}> = ({ label, sub, selected, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={[styles.payRow, selected && styles.vehicleRowActive]}>
      <View style={{ flex: 1 }}>
        <Text style={styles.payLabel}>{label}</Text>
        <Text style={styles.vehicleReg}>{sub}</Text>
      </View>
      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Card>
  </TouchableOpacity>
);

const KeyRow: React.FC<{ label: string; value: string; discount?: boolean }> = ({
  label,
  value,
  discount,
}) => (
  <Row style={{ justifyContent: 'space-between', paddingVertical: 5 }}>
    <Text style={{ color: colors.textMuted, fontSize: font.body }}>{label}</Text>
    <Text
      style={{
        color: discount ? colors.success : colors.text,
        fontSize: font.body,
        fontWeight: '600',
      }}
    >
      {value}
    </Text>
  </Row>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 44 },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl },
  svcName: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  section: { marginTop: spacing.xl },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.md },
  vehicleRowActive: { borderWidth: 2, borderColor: colors.primary },
  payRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  vehicleEmoji: { fontSize: 24 },
  vehicleName: { fontSize: font.body, fontWeight: '700', color: colors.text },
  vehicleReg: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  payLabel: { fontSize: font.body, fontWeight: '600', color: colors.text },
  addLink: { color: colors.primary, fontWeight: '700', fontSize: font.body, marginTop: 4 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    fontSize: font.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  addressInput: { height: 76, paddingTop: spacing.md, textAlignVertical: 'top' },
  slotWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  slot: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  slotText: { fontSize: font.small, color: colors.text, fontWeight: '600' },
  slotTextActive: { color: colors.primaryDark },
  totalLabel: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: font.h2, fontWeight: '800', color: colors.text },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
