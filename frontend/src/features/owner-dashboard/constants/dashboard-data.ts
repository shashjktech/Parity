import type { DashboardSummary, DashboardTab } from '../types/dashboard-types';

export function getDashboardSummary(
  totalProperties: number,
  verifiedProperties: number,
): DashboardSummary[] {
  return [
    {
      label: 'Total Properties',
      value: totalProperties,
      icon: { family: 'ionicons', name: 'business-outline' },
      tone: 'green',
    },
    {
      label: 'Verified Properties',
      value: verifiedProperties,
      icon: { family: 'ionicons', name: 'checkmark-circle-outline' },
      tone: 'neutral',
    },
    {
      label: 'Requires Verification',
      value: totalProperties - verifiedProperties,
      icon: { family: 'ionicons', name: 'time-outline' },
      tone: 'amber',
    },
  ];
}

export const dashboardTabs: DashboardTab[] = [
  { label: 'Properties', icon: { family: 'ionicons', name: 'home' } },
  { label: 'Insights', icon: { family: 'ionicons', name: 'stats-chart-outline' } },
  { label: 'Tasks', icon: { family: 'ionicons', name: 'checkmark-circle-outline' } },
  { label: 'Profile', icon: { family: 'ionicons', name: 'person-outline' } },
];
