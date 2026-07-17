import React, { useState } from 'react';
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

import { Card } from '../../components/ui';
import { colors, font, radius, spacing } from '../../theme/theme';

const FAQS = [
  {
    q: 'What is the workmanship warranty?',
    a: 'Every service carries a 10-day workmanship warranty. Care+ and Pro members get 15 days.',
  },
  {
    q: 'Do you charge extra for doorstep pickup?',
    a: 'No. Free pickup and drop / on-site service is included in the service price.',
  },
  {
    q: 'Will I be charged for extra repairs automatically?',
    a: 'Never. Any additional issue found is quoted and needs your explicit approval before work proceeds.',
  },
  {
    q: 'Which services are not available at doorstep?',
    a: 'Puncture repair, tyre/tube replacement and wheel alignment are excluded to protect quality and turnaround.',
  },
  {
    q: 'How is GST handled?',
    a: 'All prices show GST (18%) explicitly, and you receive a GST-compliant digital invoice after payment.',
  },
];

/** Support access — call, WhatsApp, chat (FR-14) + FAQs (FR-16). */
export const SupportScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [open, setOpen] = useState<number | null>(0);

  const call = () => Linking.openURL('tel:+918000000000').catch(() => {});
  const whatsapp = () =>
    Linking.openURL('https://wa.me/918000000000').catch(() =>
      Alert.alert('WhatsApp', 'WhatsApp is not installed.'),
    );
  const chat = () => Alert.alert('Live chat', 'Connecting you to an advisor… (demo)');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack} hitSlop={12}>
          <Text style={styles.back}>‹ Account</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.lead}>We're here 24/7</Text>
        <View style={styles.channels}>
          <Channel emoji="📞" label="Call us" onPress={call} />
          <Channel emoji="💬" label="WhatsApp" onPress={whatsapp} />
          <Channel emoji="🗨️" label="Live chat" onPress={chat} />
        </View>

        <Text style={styles.section}>Frequently asked</Text>
        {FAQS.map((f, i) => (
          <TouchableOpacity key={f.q} activeOpacity={0.8} onPress={() => setOpen(open === i ? null : i)}>
            <Card style={styles.faq}>
              <View style={styles.faqHead}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Text style={styles.faqToggle}>{open === i ? '−' : '+'}</Text>
              </View>
              {open === i && <Text style={styles.faqA}>{f.a}</Text>}
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Channel: React.FC<{ emoji: string; label: string; onPress: () => void }> = ({
  emoji,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.channel} onPress={onPress} activeOpacity={0.8}>
    <Text style={styles.channelEmoji}>{emoji}</Text>
    <Text style={styles.channelLabel}>{label}</Text>
  </TouchableOpacity>
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
  back: { color: colors.primary, fontSize: font.body, fontWeight: '700', width: 70 },
  title: { fontSize: font.h3, fontWeight: '800', color: colors.text },
  body: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },
  lead: { fontSize: font.h3, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  channels: { flexDirection: 'row', gap: spacing.md },
  channel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  channelEmoji: { fontSize: 28 },
  channelLabel: { fontSize: font.small, fontWeight: '700', color: colors.text, marginTop: 6 },
  section: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  faq: { marginBottom: spacing.sm },
  faqHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: font.body, fontWeight: '700', color: colors.text, flex: 1, marginRight: spacing.sm },
  faqToggle: { fontSize: 22, color: colors.primary, fontWeight: '800' },
  faqA: { fontSize: font.small, color: colors.textMuted, marginTop: spacing.sm, lineHeight: 20 },
});
