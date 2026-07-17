/**
 * Design tokens for the Doorstep customer app.
 * Shares the platform brand (workshop-orange on navy) with the Bike Mistri
 * partner app so the two clients read as one product family.
 */

export const colors = {
  primary: '#FF6B2C',
  primaryDark: '#E2551A',
  primarySoft: '#FFF1EA',

  navy: '#0F1B2D',
  navySoft: '#1B2A41',

  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F3F7',

  text: '#0F1B2D',
  textMuted: '#6B7688',
  textInverse: '#FFFFFF',

  success: '#1FA463',
  successSoft: '#E4F5EC',
  warning: '#E6A100',
  warningSoft: '#FCF3DA',
  danger: '#D64545',
  dangerSoft: '#FBE7E7',
  info: '#2D6CDF',
  infoSoft: '#E6EEFB',

  border: '#E3E8EF',
  divider: '#EEF1F5',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const font = {
  h1: 26,
  h2: 21,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
};

export const shadow = {
  card: {
    shadowColor: '#0F1B2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};
