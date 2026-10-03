import type { IconSpec } from '@/components/ui/app-icon';

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
