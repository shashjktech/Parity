/** Palette from the design sheet. `background`, `textMuted`, `line`, `dotInactive` are sampled by eye. */
export const colors = {
  primary: '#145C45',
  accent: '#2E7D63',
  surface: '#E8F0EA',
  highlight: '#F4E9D9',
  secondary: '#B68945',

  background: '#FBFAF5',
  white: '#FFFFFF',
  textMuted: '#8B9892',
  line: '#CBD3CE',
  dotInactive: '#DCE5DF',

  textSecondary: '#5C6B64',
  textDark: '#141A17',
  error: '#B3261E',
  inputBackground: '#FAF9F4',
  inputBorder: '#D5DCD7',
} as const;

export type ColorToken = keyof typeof colors;
