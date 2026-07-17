import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { colors, font, radius, shadow, spacing } from '../theme/theme';

/* ------------------------------------------------------------------ Card */

export const Card: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

/* ---------------------------------------------------------------- Button */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export const Button: React.FC<{
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  full?: boolean;
}> = ({
  title,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  full,
}) => {
  const map: Record<ButtonVariant, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.primary, fg: colors.textInverse },
    secondary: { bg: colors.navy, fg: colors.textInverse },
    outline: { bg: 'transparent', fg: colors.text, border: colors.border },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    ghost: { bg: 'transparent', fg: colors.primary },
  };
  const s = map[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: s.bg,
          borderColor: s.border ?? 'transparent',
          borderWidth: s.border ? 1 : 0,
          opacity: disabled ? 0.45 : 1,
          alignSelf: full ? 'stretch' : 'auto',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={s.fg} />
      ) : (
        <Text style={[styles.buttonText, { color: s.fg }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

/* ----------------------------------------------------------------- Badge */

export const Badge: React.FC<{
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand';
  style?: StyleProp<ViewStyle>;
}> = ({ label, tone = 'neutral', style }) => {
  const tones = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textMuted },
    success: { bg: colors.successSoft, fg: colors.success },
    warning: { bg: colors.warningSoft, fg: colors.warning },
    danger: { bg: colors.dangerSoft, fg: colors.danger },
    info: { bg: colors.infoSoft, fg: colors.info },
    brand: { bg: colors.primarySoft, fg: colors.primaryDark },
  } as const;
  const t = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.badgeText, { color: t.fg }]}>{label}</Text>
    </View>
  );
};

/* ------------------------------------------------------------- Row / misc */

export const Row: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => <View style={[styles.row, style]}>{children}</View>;

export const Divider: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

export const SectionTitle: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}> = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

export const KeyValue: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.kv}>
    <Text style={styles.kvLabel}>{label}</Text>
    <Text style={styles.kvValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  button: {
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonText: {
    fontSize: font.body,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: font.tiny,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: font.small,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  kvLabel: { color: colors.textMuted, fontSize: font.body },
  kvValue: { color: colors.text, fontSize: font.body, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },
});
