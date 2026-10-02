import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText } from '@/components/ui';
import { routes } from '@/constants/routes';
import { usePropertySetup } from '@/state/property-setup/property-context';
import { colors, spacing } from '@/theme';
import { MapPreview } from '../components/map-preview';
import { SetupHeader } from '../components/setup-header';
import { createProperty } from '../api/property-api';
import { toApiError } from '@/services/http/api-error';

const FALLBACK_COORDS = { latitude: 22.5726, longitude: 88.3639 };

export function ConfirmLocationScreen() {
  const { state: property } = usePropertySetup();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [saving, setSaving] = useState(false);
  const address = [
    property.address,
    property.city,
  ].filter(Boolean).join(', ');

  const region = [
    property.state,
    property.pincode,
  ].filter(Boolean).join(' ');

  const latitude = property.latitude
    ? Number(property.latitude)
    : FALLBACK_COORDS.latitude;
  const longitude = property.longitude
    ? Number(property.longitude)
    : FALLBACK_COORDS.longitude;

  const confirmLocation = async () => {
    if (saving) return;

    setSaving(true);
    try {
      console.log('Creating property:', property);
      await createProperty(property);
      console.log('Property Created Successfully')
      router.replace(routes.home);

    } catch (error) {
      Alert.alert(
        'Could not add property',
        toApiError(error).message,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.sm },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <SetupHeader onBack={() => router.replace(routes.addProperty)} />

      <AppText
        variant="featureTitle"
        color={colors.primary}
        style={styles.heading}
      >
        Confirm Location
      </AppText>

      <MapPreview latitude={latitude} longitude={longitude} />

      <View style={styles.address}>
        <Ionicons name="location-outline" size={24} color={colors.primary} />
        <AppText
          variant="caption"
          color={colors.textDark}
          style={styles.addressText}
        >
          {address || 'Address not provided'}
          {'\n'}
          {region}
        </AppText>
      </View>

      <AppButton
        title="Confirm Location"
        onPress={confirmLocation}
        loading={saving}
        disabled={!property.name.trim()}
        trailingIcon={
          <Ionicons name="arrow-forward" size={22} color={colors.white} />
        }
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, backgroundColor: colors.background },
  heading: { marginBottom: 12 },
  address: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, paddingHorizontal: 4 },
  addressText: { flex: 1, lineHeight: 19 },
  button: { marginTop: 20 },
});