import { routes } from '@/constants/routes';
import { Country, State } from 'country-state-city';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { usePropertySetup } from '@/state/property-setup/property-context';
import type { PropertyValues } from '../types/property-types';

export function usePropertyForm() {
  const router = useRouter();
  const { state: values, updateProperty, setField } = usePropertySetup();
  const [touched, setTouched] = useState(false);
  const [locating, setLocating] = useState(false);

  const error =
    touched && !values.name.trim()
      ? 'Property name is required'
      : undefined;

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(values.countryCode);

  const setCountry = (isoCode: string) => {
    const country = countries.find((item) => item.isoCode === isoCode);
    updateProperty({
      countryCode: isoCode,
      country: country?.name ?? '',
      stateCode: '',
      state: '',
    });
  };

  const setState = (isoCode: string) => {
    const state = State.getStatesOfCountry(values.countryCode)
      .find((item) => item.isoCode === isoCode);

    updateProperty({
      stateCode: isoCode,
      state: state?.name ?? '',
    });
  };

  const detectLocation = async () => {
    try {
      setLocating(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location permissions in your device settings to use this feature.',
        );
        return;
      }

      const serviceEnabled = await Location.hasServicesEnabledAsync();
      if (!serviceEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services in your device settings to use this feature.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!place) {
        Alert.alert(
          'Location Not Found',
          'Could not determine your address. Please enter it manually.',
        );
        return;
      }

      const matchedCountry = countries.find(
        (item) =>
          item.name.toLowerCase() ===
          (place.country ?? '').toLowerCase(),
      );
      const countryCode = matchedCountry?.isoCode ?? values.countryCode;
      const matchedState = State.getStatesOfCountry(countryCode).find(
        (item) =>
          item.name.toLowerCase() ===
          (place.region ?? '').toLowerCase(),
      );

      updateProperty({
        address:
          [place.streetNumber, place.street].filter(Boolean).join(' ') ||
          place.name ||
          values.address,
        city: place.city ?? place.subregion ?? values.city,
        countryCode,
        country: matchedCountry?.name ?? place.country ?? values.country,
        stateCode: matchedState?.isoCode ?? values.stateCode,
        state: matchedState?.name ?? place.region ?? values.state,
        pincode: place.postalCode ?? values.pincode,
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude),
      });
    } catch {
      Alert.alert(
        'Location Detection Failed',
        'Failed to detect your location. Please enter the address manually.',
      );
    } finally {
      setLocating(false);
    }
  };

  const submit = () => {
    setTouched(true);
    if (!values.name.trim()) return;

    router.push(routes.confirmLocation);
  };

  return {
    values,
    error,
    locating,
    countries,
    states,
    setField: (field: keyof PropertyValues, value: string) =>
      setField(field, value),
    setCountry,
    setState,
    detectLocation,
    submit,
  };
}