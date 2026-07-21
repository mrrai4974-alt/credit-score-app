import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ServiceRow } from '../../components/shared';
import { Badge, Button, Card, Row } from '../../components/ui';
import { useApp } from '../../context/AppContext';
import {
  categoryMeta,
  cities,
  neighborhoodsByCity,
  services,
} from '../../data/catalog';
import { Service, ServiceCategory } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';

export const HomeScreen: React.FC<{
  onOpenCategory: (category: ServiceCategory) => void;
  onOpenService: (service: Service) => void;
}> = ({ onOpenCategory, onOpenService }) => {
  const { name, city, setCity, authenticated } = useApp();
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [callback, setCallback] = useState('');

  const popular = services.filter((s) =>
    ['s-gen-1', 's-ev-2', 's-re-1'].includes(s.id),
  );
  const neighborhoods = neighborhoodsByCity[city] ?? [];

  const requestCallback = () => {
    if (callback.replace(/\D/g, '').length < 10) {
      Alert.alert('Quick Help', 'Enter a valid 10-digit mobile number.');
      return;
    }
    setCallback('');
    Alert.alert(
      'Callback requested',
      'An advisor will call you back within 5 minutes.',
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.body}>
        {/* Header + service finder */}
        <View style={styles.header}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.hello}>
                Hi {authenticated ? name : 'there'} 👋
              </Text>
              <Text style={styles.headline}>What needs a service today?</Text>
            </View>
          </Row>

          <TouchableOpacity
            style={styles.cityBar}
            onPress={() => setCityPickerOpen(true)}
          >
            <Text style={styles.cityIcon}>📍</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cityLabel}>Service location</Text>
              <Text style={styles.cityName}>{city}</Text>
            </View>
            <Text style={styles.cityChange}>Change</Text>
          </TouchableOpacity>

          {neighborhoods.length > 0 && (
            <Text style={styles.serving}>
              Serving {neighborhoods.length}+ neighborhoods ·{' '}
              {neighborhoods.slice(0, 3).join(', ')}…
            </Text>
          )}
        </View>

        {/* Categories */}
        <Text style={styles.section}>Service categories</Text>
        <View style={styles.catGrid}>
          {categoryMeta.map((c) => (
            <TouchableOpacity
              key={c.key}
              style={styles.catCard}
              onPress={() => onOpenCategory(c.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.catEmoji}>{c.emoji}</Text>
              <Text style={styles.catLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo banner */}
        <Card style={styles.promo}>
          <View style={{ flex: 1 }}>
            <Badge label="Limited offer" tone="brand" />
            <Text style={styles.promoTitle}>Flat ₹100 off your first service</Text>
            <Text style={styles.promoSub}>Use code FIRST100 at checkout</Text>
          </View>
          <Text style={styles.promoEmoji}>🎉</Text>
        </Card>

        {/* Popular services */}
        <Text style={styles.section}>Popular near you</Text>
        {popular.map((s) => (
          <ServiceRow key={s.id} service={s} onPress={() => onOpenService(s)} />
        ))}

        {/* Quick help callback (FR-07) */}
        <Card style={styles.callback}>
          <Text style={styles.callbackTitle}>Need help choosing? 🧑‍🔧</Text>
          <Text style={styles.callbackSub}>
            Leave your number — an advisor calls back in 5 minutes.
          </Text>
          <Row style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <TextInput
              style={styles.callbackInput}
              placeholder="Mobile number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={callback}
              onChangeText={setCallback}
            />
            <Button title="Call me" onPress={requestCallback} />
          </Row>
        </Card>
      </ScrollView>

      {/* City picker */}
      <Modal
        visible={cityPickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCityPickerOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setCityPickerOpen(false)}>
          <Pressable style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Choose your city</Text>
            {cities.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.cityOption}
                onPress={() => {
                  setCity(c);
                  setCityPickerOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.cityOptionText,
                    c === city && { color: colors.primary, fontWeight: '800' },
                  ]}
                >
                  {c}
                </Text>
                {c === city && <Text style={styles.tick}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  body: { paddingBottom: spacing.xxl },
  header: {
    backgroundColor: colors.navy,
    padding: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  hello: { color: '#AEB9C9', fontSize: font.body },
  headline: { color: colors.textInverse, fontSize: font.h2, fontWeight: '800', marginTop: 2 },
  cityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navySoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  cityIcon: { fontSize: 20 },
  cityLabel: { color: '#8996AB', fontSize: font.tiny },
  cityName: { color: colors.textInverse, fontSize: font.body, fontWeight: '700' },
  cityChange: { color: colors.primary, fontWeight: '700', fontSize: font.small },
  serving: { color: '#8996AB', fontSize: font.small, marginTop: spacing.sm },
  section: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  catCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  catEmoji: { fontSize: 26 },
  catLabel: { fontSize: font.small, fontWeight: '700', color: colors.text, marginTop: 6 },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: '#FFF6EF',
  },
  promoTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginTop: 6 },
  promoSub: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  promoEmoji: { fontSize: 40 },
  callback: { marginHorizontal: spacing.lg, marginTop: spacing.lg },
  callbackTitle: { fontSize: font.h3, fontWeight: '700', color: colors.text },
  callbackSub: { fontSize: font.small, color: colors.textMuted, marginTop: 4 },
  callbackInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    fontSize: font.body,
    color: colors.text,
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalTitle: { fontSize: font.h3, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  cityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cityOptionText: { fontSize: font.body, color: colors.text },
  tick: { color: colors.primary, fontWeight: '800' },
});
