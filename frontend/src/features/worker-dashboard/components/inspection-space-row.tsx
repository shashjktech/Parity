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
  const typeLabel = space.type === 'assets'
    ? 'Asset'
    : space.type[0].toUpperCase() + space.type.slice(1);

  const statusLabel: Record<InspectionSpace['status'], string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    rejected: 'Issues Found',
    failed: 'Failed · Retry',
    not_configured: 'Not Configured',
  };

  const badgeColor =
    space.status === 'completed'
      ? '#E3F3E8'
      : space.status === 'processing'
        ? '#E4F0FF'
        : space.status === 'rejected' || space.status === 'failed'
          ? '#FCE6E3'
          : '#F0F0EF';
  const badgeTextColor =
    space.status === 'completed'
      ? '#145C45'
      : space.status === 'processing'
        ? '#1D5A91'
        : space.status === 'rejected' || space.status === 'failed'
          ? '#B3261E'
          : '#686D6A';

  const typeIcon = space.type === 'room'
    ? 'bed-outline'
    : space.type === 'area'
      ? 'grid-outline'
      : 'cube-outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={space.status === 'not_configured'}
      style={({ pressed }) => [
        styles.row,
        space.status === 'rejected' && styles.issueRow,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${space.name}, ${statusLabel[space.status]}`}
      accessibilityState={{ disabled: space.status === 'not_configured' }}
    >
      <PropertyPhoto
        imageUrl={space.imageUrl ?? require('@/assets/images/decor/no-image.png')}
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
            <AppText style={styles.meta} color={colors.textSecondary}>{space.location || "ground floor"}</AppText>
          </View>
        ) : null}
      </View>

      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Ionicons
          name={space.status === 'completed'
            ? 'checkmark-circle'
            : space.status === 'processing'
              ? 'ellipsis-horizontal-circle'
              : space.status === 'rejected' || space.status === 'failed'
                ? 'alert-circle'
                : 'information-circle-outline'}
          size={16}
          color={badgeTextColor}
        />
        <AppText style={styles.statusText} color={badgeTextColor} numberOfLines={1}>
          {statusLabel[space.status]}
        </AppText>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
    marginBottom: 7,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  pressed: { opacity: 0.7 },
  issueRow: { backgroundColor: '#FDEAE7' },
  image: { width: 62, height: 62, borderRadius: 9 },
  info: { flex: 1, gap: 4 },
  name: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  meta: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 118, borderRadius: 18, paddingHorizontal: 8, paddingVertical: 7 },
  statusText: { fontFamily: fontFamily.semiBold, fontSize: 10 },
});