import { images } from '@/constants/assets';
import type { DashboardSummary, DashboardTab, Property } from '../types/dashboard-types';

const propertyStats = {
  areas: { label: 'Areas', icon: { family: 'material' as const, name: 'silverware-fork-knife' as const } },
  staff: { label: 'Staff', icon: { family: 'ionicons' as const, name: 'people-outline' as const } },
  photos: { label: 'Photos', icon: { family: 'ionicons' as const, name: 'images-outline' as const } },
};

export const dashboardSummary: DashboardSummary[] = [
  { label: 'Total Properties', value: 3, icon: { family: 'ionicons', name: 'business-outline' }, tone: 'green' },
  { label: 'Verified Properties', value: 2, icon: { family: 'ionicons', name: 'checkmark-circle-outline' }, tone: 'neutral' },
  { label: 'Requires Verification', value: 1, icon: { family: 'ionicons', name: 'time-outline' }, tone: 'amber' },
];

export const properties: Property[] = [
  {
    id: 'brew-bites',
    name: 'Brew & Bites Cafe',
    address: '123 Park Street, Kolkata,\nWest Bengal 700016',
    image: images.auth.roomSoft,
    status: 'verified',
    stats: [
      { ...propertyStats.areas, value: 5 },
      { ...propertyStats.staff, value: 12 },
      { ...propertyStats.photos, value: 24 },
    ],
  },
  {
    id: 'hillview',
    name: 'Hillview Homestay',
    address: 'Near MG Road, Darjeeling,\nWest Bengal 734101',
    image: images.onboarding.heroRoom,
    status: 'requires-verification',
    statusMessage: 'Complete property details, add at least one area and a few photos to get verified.',
    stats: [
      { ...propertyStats.areas, value: '-' },
      { ...propertyStats.staff, value: '-' },
      { ...propertyStats.photos, value: '-' },
    ],
  },
  {
    id: 'green-plate',
    name: 'The Green Plate',
    address: '45 Salt Lake, Sector V,\nKolkata, West Bengal 700091',
    image: images.auth.roomSoft,
    status: 'verified',
    stats: [
      { ...propertyStats.areas, value: 6 },
      { ...propertyStats.staff, value: 15 },
      { ...propertyStats.photos, value: 18 },
    ],
  },
];

export const dashboardTabs: DashboardTab[] = [
  { label: 'Properties', icon: { family: 'ionicons', name: 'home' } },
  { label: 'Insights', icon: { family: 'ionicons', name: 'stats-chart-outline' } },
  { label: 'Tasks', icon: { family: 'ionicons', name: 'checkmark-circle-outline' } },
  { label: 'Profile', icon: { family: 'ionicons', name: 'person-outline' } },
];
