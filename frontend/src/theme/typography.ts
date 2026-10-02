import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  script: 'Caveat_400Regular',
} as const;

export const typography = {
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  link: { fontFamily: fontFamily.medium, fontSize: 17, lineHeight: 24 },
  buttonFilled: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22 },
  buttonOutline: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  featureTitle: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  featureCaption: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  tagline: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 14, letterSpacing: 2 },
  title: { fontFamily: fontFamily.semiBold, fontSize: 24, lineHeight: 32 },
  heading: { fontFamily: fontFamily.semiBold, fontSize: 28, lineHeight: 36 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22 },
  fieldLabel: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  fieldValue: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fontFamily.regular, fontSize: 12.5, lineHeight: 18 },
  error: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  stepLabel: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  brandTagline: { fontFamily: fontFamily.regular, fontSize: 9.5, lineHeight: 14, letterSpacing: 2.6 },
  phoneNumber: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 24 },
  otpDigit: { fontFamily: fontFamily.medium, fontSize: 22, lineHeight: 28 },
  script: { fontFamily: fontFamily.script, fontSize: 21, lineHeight: 26 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
