import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { Property } from '../types/dashboard-types';

type Props = { property: Property; onPress?: () => void };

export function PropertyCard({ property, onPress }: Props) {
  const verified = property.status === 'verified';
  const statusColor = verified ? colors.accent : '#A85D09';

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button" accessibilityLabel={`Open ${property.name}`}>
      <View style={styles.topRow}>
        <Image source={property.image} style={styles.image} resizeMode="cover" />
        <View style={styles.details}>
          <View style={styles.nameRow}>
            <AppText style={styles.name} color={colors.primary} numberOfLines={1}>{property.name}</AppText>
            <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <AppText style={styles.address} color={colors.textSecondary}>{property.address}</AppText>
          </View>
          <View style={[styles.status, verified ? styles.verified : styles.requires]}>
            <Ionicons name={verified ? 'checkmark-circle' : 'time-outline'} size={18} color={statusColor} />
            <AppText style={styles.statusText} color={statusColor}>{verified ? 'Verified' : 'Requires Verification'}</AppText>
          </View>
          {property.statusMessage ? (
            <View style={styles.message}>
              <Ionicons name="information-circle-outline" size={19} color="#A85D09" />
              <AppText style={styles.messageText} color="#6C5A43">{property.statusMessage}</AppText>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.stats}>
        {property.stats.map((stat) => (
          <View key={stat.label} style={[styles.stat, !verified && styles.emptyStat]}>
            <View style={styles.statTopRow}>
              <AppIcon icon={stat.icon} size={20} color={verified ? colors.textSecondary : '#A4AAA5'} />
              <AppText style={styles.statValue} color={verified ? colors.textDark : '#8F9690'}>{stat.value}</AppText>
            </View>
            <AppText style={styles.statLabel} color={verified ? colors.textSecondary : '#8F9690'}>{stat.label}</AppText>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 21, borderWidth: 1, borderColor: '#E7E8E3', backgroundColor: 'rgba(255,255,255,0.78)', gap: 14, marginBottom: 14 },
  topRow: { flexDirection: 'row', gap: 15 },
  image: { width: 110, aspectRatio: 1, borderRadius: 15, backgroundColor: colors.surface },
  details: { flex: 1, minWidth: 0, justifyContent: 'space-between' },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  name: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 26 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 6 },
  address: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  status: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 13, marginTop: 10 },
  verified: { backgroundColor: '#E2F4E9' },
  requires: { backgroundColor: '#FFF0D9' },
  statusText: { fontFamily: fontFamily.medium, fontSize: 14, lineHeight: 19 },
  message: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF5E8', borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9, marginTop: 10 },
  messageText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#EAEBE8', backgroundColor: 'rgba(255,255,255,0.56)', gap: 2 },
  emptyStat: { borderStyle: 'dashed', borderColor: '#C8CCC9', backgroundColor: 'transparent' },
  statTopRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 20 },
  statLabel: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17 },
});