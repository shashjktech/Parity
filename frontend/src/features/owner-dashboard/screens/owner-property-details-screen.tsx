import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';
import { PropertyDetailsActions } from '../components/property-details-actions';
import { PropertyDetailsHeader } from '../components/property-details-header';
import {
  PropertyDescription,
  PropertyInformation,
  PropertyOverview,
} from '../components/property-details-sections';
import { useOwnerPropertyDetails } from '../hooks/use-owner-property-details';

export function OwnerPropertyDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string | string[] }>();
  const propertyId = Array.isArray(params.propertyId)
    ? params.propertyId[0]
    : params.propertyId;
  const { property, loading, error, reload } = useOwnerPropertyDetails(propertyId);

  const showOptions = () => {
    Alert.alert('Property options', 'Refresh the latest property information?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Refresh', onPress: reload },
    ]);
  };

  return (
    <View style={styles.root}>
      <Image source={images.decor.leavesBottom} style={styles.leaves} resizeMode="contain" />
      <View style={{ paddingTop: insets.top + 4 }}>
        <PropertyDetailsHeader onBack={() => router.back()} onMore={showOptions} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + (property ? 112 : 32) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={colors.primary} />
            <AppText style={styles.stateText} color={colors.textSecondary}>
              Loading property details...
            </AppText>
          </View>
        ) : error || !property ? (
          <View style={styles.state}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.secondary} />
            <AppText style={styles.stateText} color={colors.textSecondary}>
              {error ?? 'Property not found.'}
            </AppText>
            <Pressable onPress={reload} accessibilityRole="button" style={styles.retry}>
              <AppText style={styles.retryText} color={colors.primary}>Try again</AppText>
            </Pressable>
          </View>
        ) : (
          <>
            <PropertyOverview property={property} />
            <PropertyInformation property={property} />
            <PropertyDescription />
          </>
        )}
      </ScrollView>

      {property && !loading ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <PropertyDetailsActions
            disabled={property.verification_status === 'PENDING'}
            onRoomConfiguration={() => router.push({
              pathname: routes.propertySpaces,
              params: { propertyId: property.id },
            })}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  leaves: { position: 'absolute', right: -42, bottom: 64, width: 210, height: 190, opacity: 0.38 },
  scroll: { paddingHorizontal: 18, paddingTop: 4 },
  state: { minHeight: 300, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  retry: { paddingHorizontal: 16, paddingVertical: 9 },
  retryText: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 9, backgroundColor: 'rgba(251,250,245,0.96)' },
});