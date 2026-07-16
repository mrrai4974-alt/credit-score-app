/**
 * Design tokens for the app. Centralised so screens stay consistent and
 * re-theming (e.g. white-labelling for a partner bank) is a one-file change.
 */

export const colors = {
  // Brand
  primary: '#3D5AFE',
  primaryDark: '#2A3EB1',
  primaryLight: '#8C9EFF',
  accent: '#00BFA5',

  // Surfaces
  background: '#F4F6FB',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F8',

  // Text
  textPrimary: '#141A2E',
  textSecondary: '#5A6478',
  textMuted: '#98A2B3',
  textInverse: '#FFFFFF',

  // Feedback
  success: '#2E9E5B',
  warning: '#F2A73B',
  danger: '#E5484D',
  info: '#3D5AFE',

  border: '#E3E8F1',
  shadow: '#0B1220',
} as const;

/**
 * CIBIL / Experian India style score bands (300–900).
 * Each band drives the gauge colour and the qualitative label a user sees.
 */
export const scoreBands = [
  { label: 'Poor', min: 300, max: 549, color: '#E5484D' },
  { label: 'Fair', min: 550, max: 649, color: '#F2A73B' },
  { label: 'Good', min: 650, max: 749, color: '#F5C518' },
  { label: 'Very Good', min: 750, max: 799, color: '#7AC943' },
  { label: 'Excellent', min: 800, max: 900, color: '#2E9E5B' },
] as const;

export const SCORE_MIN = 300;
export const SCORE_MAX = 900;

export function bandForScore(score: number) {
  const clamped = Math.max(SCORE_MIN, Math.min(SCORE_MAX, score));
  return (
    scoreBands.find((b) => clamped >= b.min && clamped <= b.max) ??
    scoreBands[scoreBands.length - 1]
  );
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 40, fontWeight: '800' as const },
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  tiny: { fontSize: 11, fontWeight: '500' as const },
} as const;

export const shadow = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
} as const;
