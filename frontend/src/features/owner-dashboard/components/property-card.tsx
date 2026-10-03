import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { OwnerProperty } from '../types/owner-property';

type Props = { property: OwnerProperty; onPress?: () => void };

export function PropertyCard({ property, onPress }: Props) {
  const verified = property.verification_status === 'VERIFIED';
  const statusLabel = verified
    ? 'Verified'
    : property.verification_status === 'ACTION_REQUIRED'
      ? 'Action Required'
      : 'Pending Verification';
  const statusColor = verified ? colors.accent : '#A85D09';

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button" accessibilityLabel={`Open ${property.name}`}>
      <View style={styles.topRow}>
        <Image
          source={require('@/assets/images/decor/room-placeholder.avif')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <AppText style={styles.name} color={colors.primary} numberOfLines={1}>{property.name}</AppText>
            <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <AppText style={styles.infoText} color={colors.textSecondary}>
              {property.address || 'No address available'}
            </AppText>
          </View>
          {property.timezone ? (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={17} color={colors.textSecondary} />
              <AppText style={styles.infoText} color={colors.textSecondary}>
                {property.timezone}
              </AppText>
            </View>
          ) : null}
          <View style={[styles.status, verified ? styles.verified : styles.requires]}>
            <Ionicons
              name={verified ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={statusColor}
            />
            <AppText style={styles.statusText} color={statusColor}>
              {statusLabel}
            </AppText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 21, borderWidth: 1, borderColor: '#E7E8E3', backgroundColor: 'rgba(255,255,255,0.78)', marginBottom: 14 },
  topRow: { flexDirection: 'row', gap: 15 },
  image: { width: 110, aspectRatio: 1, borderRadius: 15, backgroundColor: colors.surface },
  details: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  name: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8 },
  infoText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 13, marginTop: 10 },
  verified: { backgroundColor: '#E2F4E9' },
  requires: { backgroundColor: '#FFF0D9' },
  statusText: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 19 },
});