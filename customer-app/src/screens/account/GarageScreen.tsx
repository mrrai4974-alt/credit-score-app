import React, { useState } from 'react';
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

import { Badge, Button, Card, Row } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import { brands } from '../../data/catalog';
import { colors, font, radius, spacing } from '../../theme/theme';

/** My Garage — add and manage vehicles (FR-02). */
export const GarageScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { vehicles, addVehicle, removeVehicle } = useApp();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [reg, setReg] = useState('');

  const brandMatch = brands.find((b) => b.name.toLowerCase() === brand.trim().toLowerCase());

  const save = () => {
    if (!brand.trim() || !model.trim()) {
      Alert.alert('Add vehicle', 'Please enter brand and model.');
      return;
    }
    addVehicle({
      brand: brand.trim(),
      model: model.trim(),
      registration: reg.trim() || 'Not provided',
      type: brandMatch?.type === 'EV' ? 'EV' : 'Petrol',
    });
    setBrand('');
    setModel('');
    setReg('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Account</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Garage</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {vehicles.map((v) => (
          <Card key={v.id} style={styles.vRow}>
            <Text style={styles.vEmoji}>{v.type === 'EV' ? '⚡' : '🏍️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.vName}>
                {v.brand} {v.model}
              </Text>
              <Text style={styles.vReg}>{v.registration}</Text>
            </View>
            <Badge label={v.type} tone={v.type === 'EV' ? 'info' : 'neutral'} />
            <TouchableOpacity onPress={() => removeVehicle(v.id)} hitSlop={10}>
              <Text style={styles.remove}>✕</Text>
            </TouchableOpacity>
          </Card>
        ))}

        <Card style={{ marginTop: spacing.md }}>
          <Text style={styles.addTitle}>Add a vehicle</Text>
          <TextInput
            style={styles.input}
            placeholder="Brand (e.g. Hero, Ather)"
            placeholderTextColor={colors.textMuted}
            value={brand}
            onChangeText={setBrand}
          />
          <Row style={styles.suggestRow}>
            {brands.slice(0, 5).map((b) => (
              <TouchableOpacity
                key={b.name}
                style={styles.suggest}
                onPress={() => setBrand(b.name)}
              >
                <Text style={styles.suggestText}>{b.name}</Text>
              </TouchableOpacity>
            ))}
          </Row>
          <TextInput
            style={styles.input}
            placeholder="Model (e.g. Splendor Plus)"
            placeholderTextColor={colors.textMuted}
            value={model}
            onChangeText={setModel}
          />
          <TextInput
            style={styles.input}
            placeholder="Registration no. (optional)"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            value={reg}
            onChangeText={setReg}
          />
          <Button title="Add to garage" onPress={save} full />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 70 },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  vRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  vEmoji: { fontSize: 24 },
  vName: { fontSize: font.body, fontWeight: '700', color: colors.text },
  vReg: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  remove: { fontSize: 16, color: colors.danger, fontWeight: '800', paddingLeft: spacing.sm },
  addTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    fontSize: font.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  suggestRow: { flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  suggest: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  suggestText: { color: colors.primaryDark, fontWeight: '600', fontSize: font.small },
});
