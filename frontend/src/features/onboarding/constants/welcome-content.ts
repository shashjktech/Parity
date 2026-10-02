import type { IconSpec } from '@/components/ui';
import { colors } from '@/theme';

export const WELCOME_COPY = {
  skip: 'Skip',
  createAccount: 'Create an Account',
  logIn: 'Log In',
  tagline: 'Better spaces. Brighter stays.',
  pageCount: 3,
  activePage: 0,
} as const;

export type WelcomeFeature = {
  id: string;
  title: string;
  caption: string;
  icon: IconSpec;
  iconColor: string;
  circleColor: string;
};

export const WELCOME_FEATURES: readonly WelcomeFeature[] = [
  {
    id: 'capture',
    title: 'Capture',
    caption: 'Room photos',
    icon: { family: 'ionicons', name: 'camera-outline' },
    iconColor: colors.primary,
    circleColor: colors.surface,
  },
  {
    id: 'compare',
    title: 'Compare',
    caption: 'Find issues instantly',
    icon: { family: 'ionicons', name: 'sparkles' },
    iconColor: colors.secondary,
    circleColor: colors.highlight,
  },
  {
    id: 'improve',
    title: 'Improve',
    caption: 'Consistent quality',
    icon: { family: 'material', name: 'signal-cellular-3' }, // three rising bars
    iconColor: colors.primary,
    circleColor: colors.surface,
  },
];