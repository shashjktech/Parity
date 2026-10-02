import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

import type { PropertyResponse } from '@/features/property-setup/api/property-api';

type Props = {
  property: PropertyResponse;
  onPress?: () => void;
};

export function PropertyCardDb({ property, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Open ${property.name}`}
    >
      <View style={styles.topRow}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/decor/room-placeholder.avif')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <AppText
              style={styles.name}
              color={colors.primary}
              numberOfLines={1}
            >
              {property.name}
            </AppText>

            <Ionicons
              name="chevron-forward"
              size={22}
              color={colors.textSecondary}
            />
          </View>

          <View style={styles.addressRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={colors.textSecondary}
            />

            <AppText
              style={styles.address}
              color={colors.textSecondary}
              numberOfLines={3}
            >
              {property.address || 'No address available'}
            </AppText>
          </View>

          {property.timezone ? (
            <View style={styles.infoRow}>
              <Ionicons
                name="time-outline"
                size={17}
                color={colors.textSecondary}
              />

              <AppText
                style={styles.infoText}
                color={colors.textSecondary}
              >
                {property.timezone}
              </AppText>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#E7E8E3',
    backgroundColor: 'rgba(255,255,255,0.78)',
    marginBottom: 14,
  },

  topRow: {
    flexDirection: 'row',
    gap: 15,
  },

  imageContainer: {
    width: 110,
    height: 110,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  details: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },

  name: {
    flex: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 26,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },

  address: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },

  infoText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
});