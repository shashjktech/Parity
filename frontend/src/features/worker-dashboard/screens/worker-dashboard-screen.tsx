import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';
import { PropertyPhoto } from '../components/property-photo';
import { PropertyStatusBadge } from '../components/property-status-badge';
import { WorkerHeader } from '../components/worker-header';
import { WorkerScreenState } from '../components/worker-screen-state';
import { WorkerTabBar } from '../components/worker-tab-bar';
import { useWorkerDashboard } from '../hooks/use-worker-property';
import type { WorkerProperty } from '../types/worker-types';

export function WorkerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, loading, error, retry } = useWorkerDashboard();
  console.log('WorkerDashboardScreen data:', data);
  const property = data?.property;

  return (
    <View style={styles.root}>
      <Image source={images.decor.leavesTop} style={styles.topLeaves} resizeMode="contain" />
      {/* <Image source={images.decor.leavesBottom} style={styles.bottomLeaves} resizeMode="contain" /> */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        <WorkerHeader workerName={data?.workerName ?? 'Worker'} />

        <View style={styles.headingBlock}>
          <AppText style={styles.eyebrow} color={colors.textSecondary}>WORKER DASHBOARD</AppText>
          <AppText style={styles.heading}>Your Property</AppText>
          <AppText style={styles.subtitle} color={colors.textSecondary}>Here&apos;s the property you are assigned to.</AppText>
        </View>

        {loading ? (
          <WorkerScreenState loading title="Loading your property" message="Getting your latest assignment." />
        ) : error ? (
          <WorkerScreenState title="Could not load your property" message={error} onRetry={retry} />
        ) : property ? (
          <AssignedProperty
            property={property}
            onViewDetails={() => router.push({
              pathname: routes.workerPropertyDetails,
              params: { propertyId: property.id },
            })}
          />
        ) : (
          <WorkerScreenState title="No property assigned" message="Your assigned property will appear here once it is available." />
        )}
      </ScrollView>

      <WorkerTabBar activeTab="home" />
    </View>
  );
}

function AssignedProperty({ property, onViewDetails }: { property: WorkerProperty; onViewDetails: () => void }) {
  return (
    <>
      <View style={styles.property}>
        <View style={styles.imageWrap}>
          <PropertyPhoto imageUrl={require('@/assets/images/decor/room-placeholder.avif')} style={styles.propertyImage} />
          <PropertyStatusBadge status={property.verification_status} />
        </View>
        <View style={styles.propertyInfo}>
          <AppText style={styles.propertyName} color={colors.textDark} numberOfLines={2}>{property.name}</AppText>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={19} color={colors.textSecondary} />
            <AppText style={styles.address} color={colors.textSecondary}>
              {property.address}
            </AppText>
          </View>
        </View>
      </View>

      {/* <View style={styles.stats}>
        <Stat icon="bed-outline" value={property.counts.rooms} label="Rooms" />
        <Stat icon="grid-outline" value={property.counts.areas} label="Areas" />
        <Stat icon="cube-outline" value={property.counts.assets} label="Assets" />
      </View> */}

      <Pressable
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
        onPress={onViewDetails}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${property.name}`}
      >
        <AppText style={styles.primaryButtonText} color={colors.white}>View Details</AppText>
        <Ionicons name="arrow-forward" size={19} color={colors.white} />
      </Pressable>
    </>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={19} color={colors.primary} />
      <AppText style={styles.statValue} color={colors.textDark}>{value}</AppText>
      <AppText style={styles.statLabel} color={colors.textSecondary}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 18 },
  topLeaves: { position: 'absolute', top: 90, right: -40, width: 150, height: 170, opacity: 0.2 },
  bottomLeaves: { position: 'absolute', bottom: 45, left: -38, width: 150, height: 130, opacity: 0.26 },
  headingBlock: { marginTop: 27, marginBottom: 17 },
  eyebrow: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 15, letterSpacing: 1.2 },
  heading: { fontFamily: fontFamily.semiBold, fontSize: 25, lineHeight: 33, marginTop: 4 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18, marginTop: 1 },
  property: { overflow: 'hidden' },
  imageWrap: { position: 'relative' },
  propertyImage: { width: '100%', aspectRatio: 1.38, borderRadius: 8 },
  propertyInfo: { paddingHorizontal: 4, paddingTop: 7 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 24,marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 3 },
  address: { flex: 1, fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 20 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 13 },
  stat: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: '#E7EAE5', borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.8)' },
  statValue: { fontFamily: fontFamily.semiBold, fontSize: 12, lineHeight: 16 },
  statLabel: { fontFamily: fontFamily.regular, fontSize: 9, lineHeight: 13 },
  primaryButton: { minHeight: 45, borderRadius: 24, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 13 },
  primaryButtonText: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.84 },
});