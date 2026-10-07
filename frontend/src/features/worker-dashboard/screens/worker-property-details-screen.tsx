import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';
import { PropertyPhoto } from '../components/property-photo';
import { PropertyStatusBadge } from '../components/property-status-badge';
import { WorkerScreenState } from '../components/worker-screen-state';
import { useWorkerProperty } from '../hooks/use-worker-property';
import type { WorkerProperty } from '../types/worker-types';

export function WorkerPropertyDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string }>();
  const propertyId = typeof params.propertyId === 'string' ? params.propertyId : undefined;
  const { property, loading, error, retry } = useWorkerProperty(propertyId);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace(routes.workerDashboard);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 7, paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={23} color={colors.primary} />
          </Pressable>
          <AppText style={styles.headerTitle} color={colors.primary}>Property Details</AppText>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <WorkerScreenState loading title="Loading property details" message="Getting the latest property information." />
        ) : error ? (
          <WorkerScreenState title="Could not load property details" message={error} onRetry={retry} />
        ) : property ? (
          <PropertyDetails property={property} />
        ) : (
          <WorkerScreenState title="Property not found" message="This property may no longer be assigned to you." />
        )}
      </ScrollView>

      {property && !loading && !error ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
            onPress={() => router.push({
              pathname: routes.workerInspectionChecklist,
              params: { propertyId: property.id },
            })}
            accessibilityRole="button"
            accessibilityLabel={`View schedules for ${property.name}`}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.white} />
            <AppText style={styles.primaryButtonText} color={colors.white}>Inspection Capture</AppText>
            <Ionicons name="arrow-forward" size={17} color={colors.white} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function PropertyDetails({ property }: { property: WorkerProperty }) {
  return (
    <>
      <View style={styles.hero}>
        <PropertyPhoto imageUrl={require('@/assets/images/decor/room-placeholder.avif')} style={styles.heroImage} />
        <View style={styles.activeBadge}>
          <PropertyStatusBadge status={property.verification_status} style={styles.activeBadge} />
        </View>
      </View>

      <View style={styles.propertyHeading}>
        <AppText style={styles.propertyName} color={colors.primary}>{property.name}</AppText>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
          <AppText style={styles.address} color={colors.textSecondary}>
            {property.address}
          </AppText>
        </View>
      </View>

      <View style={styles.details}>
        <PropertyDetailRow icon="business-outline" label="Property Type" value={"No value available"} />
        <PropertyDetailRow icon="business-outline" label="Total Area" value={ "No value available"} />
        <PropertyDetailRow icon="time-outline" label="Working Hours" value={"No value available"} />
        <PropertyDetailRow icon="mail-outline" label="Your Role" value={ "No value available"} last />
      </View>

      <View style={styles.about}>
        <AppText style={styles.aboutTitle} color={colors.primary}>About this Property</AppText>
        <AppText style={styles.aboutText} color={colors.textSecondary}>{ "No description available"}</AppText>
      </View>
    </>
  );
}

function PropertyDetailRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !last && styles.detailBorder]}>
      <Ionicons name={icon} size={17} color={colors.textSecondary} />
      <AppText style={styles.detailLabel} color={colors.textSecondary}>{label}</AppText>
      <AppText style={styles.detailValue} color={colors.textDark} numberOfLines={2}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 18 },
  header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 36, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 20 },
  headerSpacer: { width: 36 },
  hero: { position: 'relative' },
  heroImage: { width: '100%', aspectRatio: 1.38, borderRadius: 8 },
  activeBadge: { position: 'absolute', right: 0, bottom: 50 },
  propertyHeading: { paddingTop: 10, paddingBottom: 12 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize:24 ,lineHeight: 26, marginBottom: 7 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 3 },
  address: { flex: 1, fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 22 },
  details: { borderRadius: 8, borderWidth: 1, borderColor: '#E7EAE5', backgroundColor: 'rgba(255,255,255,0.55)', paddingHorizontal: 10 },
  detailRow: { minHeight: 39, flexDirection: 'row', alignItems: 'center', gap: 9 },
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E1E5E0' },
  detailLabel: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 15 },
  detailValue: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 15, textAlign: 'right' },
  about: { marginTop: 17 },
  aboutTitle: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 20 },
  aboutText: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 18, marginTop: 5 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 10, backgroundColor: colors.background },
  primaryButton: { minHeight: 56, borderRadius: 24, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonText: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 18 },
  pressed: { opacity: 0.84 },
});