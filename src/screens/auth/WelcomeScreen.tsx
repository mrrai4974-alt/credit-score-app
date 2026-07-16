import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
  { icon: 'speedometer-outline', text: 'Check your credit score for free' },
  { icon: 'bulb-outline', text: 'Know why it’s low — and how to fix it' },
  { icon: 'wallet-outline', text: 'Track all your loans & EMIs in one place' },
  { icon: 'shield-checkmark-outline', text: 'Bank-grade security for your data' },
];

export function WelcomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}
      >
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Ionicons name="pulse" size={22} color={colors.primary} />
          </View>
          <Text style={styles.logoText}>GoodCredit</Text>
        </View>
        <Text style={styles.heroTitle}>Your credit score,{'\n'}made simple.</Text>
        <Text style={styles.heroSubtitle}>
          Understand your score, improve it with a personalised plan, and manage
          every loan and bill in one app.
        </Text>
      </LinearGradient>

      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.text} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cta}>
          <Button label="Get started" icon="arrow-forward" onPress={() => navigation.navigate('Login')} />
          <Text style={styles.disclaimer}>
            Checking your own score never affects it. Free forever.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { ...typography.h2, color: colors.textInverse },
  heroTitle: { ...typography.display, fontSize: 34, color: colors.textInverse, lineHeight: 42 },
  heroSubtitle: {
    ...typography.body,
    color: colors.textInverse,
    opacity: 0.9,
    marginTop: spacing.md,
    lineHeight: 22,
  },
  body: { flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'space-between', paddingTop: spacing.xl },
  features: { gap: spacing.lg },
  feature: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { ...typography.bodyStrong, color: colors.textPrimary, flex: 1 },
  cta: { gap: spacing.sm },
  disclaimer: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
