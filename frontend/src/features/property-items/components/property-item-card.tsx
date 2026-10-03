import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { PropertyItem } from '../types/property-item';

type Props = { item: PropertyItem };

export function PropertyItemCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={
          item.image_url
            ? { uri: item.image_url, headers: item.image_headers }
            : require('@/assets/images/decor/room-placeholder.avif')
        }
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <AppText style={styles.name} color={colors.textDark} numberOfLines={1}>{item.name}</AppText>
        <View style={styles.locationRow}>
          <Ionicons name="home-outline" size={13} color={colors.textSecondary} />
          <AppText style={styles.location} color={colors.textSecondary} numberOfLines={1}>
            {item.description || kindFallback(item.type)}
          </AppText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={19} color={colors.textSecondary} />
    </View>
  );
}

function kindFallback(kind: PropertyItem['type']) {
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
});