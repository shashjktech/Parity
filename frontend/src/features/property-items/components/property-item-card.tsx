import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { PropertyItem } from '../types/property-item';

type Props = { item: PropertyItem };

export function PropertyItemCard({ item }: Props) {
  const available = item.status === 'AVAILABLE';
  const location = [item.area, item.floor_level].filter(Boolean).join(' · ');

  return (
    <View style={styles.card}>
      <Image
        source={item.image_url ? { uri: item.image_url } : require('@/assets/images/decor/room-placeholder.avif')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <AppText style={styles.name} color={colors.textDark} numberOfLines={1}>{item.name}</AppText>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <AppText style={styles.location} color={colors.textSecondary} numberOfLines={1}>
            {location || item.subtype || kindFallback(item.kind)}
          </AppText>
        </View>
        <View style={[styles.status, available ? styles.available : styles.outOfService]}>
          <View style={[styles.dot, available ? styles.availableDot : styles.outOfServiceDot]} />
          <AppText style={styles.statusText} color={available ? colors.primary : colors.error}>
            {available ? 'Available' : 'Out of Service'}
          </AppText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={19} color={colors.textSecondary} />
    </View>
  );
}

function kindFallback(kind: PropertyItem['kind']) {
  if (kind === 'room') return 'Room';
  if (kind === 'area') return 'Property Area';
  return 'Property Asset';
}

const styles = StyleSheet.create({
  card: { minHeight: 94, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, padding: 10, borderWidth: 1, borderColor: colors.line, borderRadius: 16, backgroundColor: colors.white },
  image: { width: 72, height: 72, borderRadius: 12, backgroundColor: colors.surface },
  details: { flex: 1, minWidth: 0, gap: 5 },
  name: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 19 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  location: { flex: 1, fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 15 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 11 },
  available: { backgroundColor: '#E6F3E9' },
  outOfService: { backgroundColor: '#FCE9E7' },
  dot: { width: 7, height: 7, borderRadius: 4 },
  availableDot: { backgroundColor: colors.accent },
  outOfServiceDot: { backgroundColor: colors.error },
  statusText: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 14 },
});