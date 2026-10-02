import type { ImageSourcePropType } from 'react-native';

import type { IconSpec } from '@/components/ui/app-icon';

export type PropertyStatus = 'verified' | 'requires-verification';

export type PropertyStat = {
  label: string;
  value: number | string;
  icon: IconSpec;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  image: ImageSourcePropType;
  status: PropertyStatus;
  statusMessage?: string;
  stats: PropertyStat[];
};

export type DashboardSummary = {
  label: string;
  value: number;
  icon: IconSpec;
  tone: 'green' | 'neutral' | 'amber';
};


export type DashboardTab = {
  label: string;
  icon: IconSpec;
};
