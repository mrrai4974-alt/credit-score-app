import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ServiceRow } from '../../components/shared';
import { Card } from '../../components/ui';
import { categoryMeta, excludedServices, services } from '../../data/catalog';
import { Service, ServiceCategory } from '../../types';
import { colors, font, radius, spacing } from '../../theme/theme';

export const ServiceListScreen: React.FC<{
  category: ServiceCategory;
  onBack: () => void;
  onOpenService: (service: Service) => void;
}> = ({ category, onBack, onOpenService }) => {
  const [active, setActive] = useState<ServiceCategory>(category);
  const list = services.filter((s) => s.category === active);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Home</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Services</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {categoryMeta.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[styles.tab, active === c.key && styles.tabActive]}
            onPress={() => setActive(c.key)}
          >
            <Text style={[styles.tabText, active === c.key && styles.tabTextActive]}>
              {c.emoji} {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {list.map((s) => (
          <ServiceRow key={s.id} service={s} onPress={() => onOpenService(s)} />
        ))}

        <Card style={styles.excluded}>
          <Text style={styles.exclTitle}>Not offered at doorstep</Text>
          <Text style={styles.exclSub}>
            To protect service quality and turnaround, we don't do:
          </Text>
          <Text style={styles.exclList}>{excludedServices.join(' · ')}</Text>
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
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 60 },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  tabs: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.sm },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    height: 38,
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { fontWeight: '700', color: colors.textMuted, fontSize: font.small },
  tabTextActive: { color: colors.textInverse },
  list: { padding: spacing.lg, paddingTop: spacing.md },
  excluded: { marginTop: spacing.sm, backgroundColor: colors.surfaceAlt },
  exclTitle: { fontSize: font.body, fontWeight: '700', color: colors.text },
  exclSub: { fontSize: font.small, color: colors.textMuted, marginTop: 4 },
  exclList: { fontSize: font.small, color: colors.text, marginTop: 6, fontWeight: '600' },
});
