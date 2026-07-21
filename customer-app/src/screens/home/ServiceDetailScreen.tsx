import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PriceTag } from '../../components/shared';
import { Badge, Button, Card, Divider, KeyValue } from '../../components/ui';
import { Service } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';
import { gstAmount, inr } from '../../utils/format';

/** Service detail with transparent price, duration, inspection points (FR-04). */
export const ServiceDetailScreen: React.FC<{
  service: Service;
  onBack: () => void;
  onBook: (service: Service) => void;
}> = ({ service, onBack, onBook }) => {
  const isQuote = service.price === null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Badge label={service.category} tone="brand" />
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.desc}>{service.description}</Text>

        <Card style={styles.priceCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.priceLead}>Transparent price</Text>
            <Text style={styles.priceSub}>No hidden charges. GST included.</Text>
          </View>
          <PriceTag service={service} size="lg" />
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <KeyValue label="Duration" value={`${service.durationMin} minutes`} />
          {service.inspectionPoints > 0 && (
            <KeyValue
              label="Inspection"
              value={`${service.inspectionPoints}-point checklist`}
            />
          )}
          <KeyValue label="Warranty" value="10-day workmanship" />
          {!isQuote && (
            <>
              <Divider />
              <KeyValue label="Base price" value={inr(service.price!)} />
              <KeyValue label="GST (18%)" value={inr(gstAmount(service.price!))} />
            </>
          )}
        </Card>

        <Text style={styles.section}>What's included</Text>
        <Card>
          {service.highlights.map((h) => (
            <View key={h} style={styles.hlRow}>
              <Text style={styles.hlCheck}>✓</Text>
              <Text style={styles.hlText}>{h}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isQuote ? 'Get a quote' : 'Book this service'}
          onPress={() => onBook(service)}
          full
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700' },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xl },
  name: { fontSize: font.h1, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  desc: { fontSize: font.body, color: colors.textMuted, marginTop: 6, lineHeight: 21 },
  priceCard: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  priceLead: { fontSize: font.body, fontWeight: '700', color: colors.text },
  priceSub: { fontSize: font.small, color: colors.textMuted, marginTop: 2 },
  section: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  hlRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  hlCheck: {
    color: colors.success,
    fontWeight: '900',
    marginRight: spacing.md,
    fontSize: 15,
  },
  hlText: { fontSize: font.body, color: colors.text },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
