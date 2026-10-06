import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import { PropertyPhoto } from './property-photo';
import type { InspectionSpace } from '../types/inspection-types';

type Props = {
  space: InspectionSpace;
  onPress: () => void;
};

export function InspectionSpaceRow({ space, onPress }: Props) {
  const typeLabel = space.type === 'asset'
    ? 'Asset'
    : space.type[0].toUpperCase() + space.type.slice(1);

  const statusLabel = space.status === 'not_configured'
    ? 'Not Configured'
    : space.status[0].toUpperCase() + space.status.slice(1);

  const typeIcon = space.type === 'room'
    ? 'bed-outline'
    : space.type === 'area'
      ? 'grid-outline'
      : 'cube-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${space.name}, ${statusLabel}`}
    >
      <PropertyPhoto
        imageUrl={space.imageUrl ?? require('@/assets/images/decor/room-placeholder.avif')}
        style={styles.image}
      />

      <View style={styles.info}>
        <AppText style={styles.name} color={colors.textDark} numberOfLines={1}>
          {space.name}
        </AppText>
        <View style={styles.metaRow}>
          <Ionicons name={typeIcon} size={16} color={colors.textSecondary} />
          <AppText style={styles.meta} color={colors.textSecondary}>{typeLabel}</AppText>
        </View>
        {space.location ? (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <AppText style={styles.meta} color={colors.textSecondary}>{space.location}</AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.status}>
        <Ionicons
          name={space.status === 'completed' ? 'checkmark-circle-outline' : 'ellipse-outline'}
          size={22}
          color={space.status === 'completed' ? colors.primary : colors.textSecondary}
        />
        <AppText style={styles.statusText} color={colors.textSecondary}>
          {statusLabel}
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E9E5',
  },
  pressed: { opacity: 0.7 },
  image: { width: 72, height: 72, borderRadius: 9 },
  info: { flex: 1, gap: 4 },
  name: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  status: { alignItems: 'center', gap: 3 },
  statusText: { fontFamily: fontFamily.regular, fontSize: 11 },
});