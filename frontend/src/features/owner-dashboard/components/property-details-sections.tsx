import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { colors, fontFamily } from '@/theme';
import type { OwnerProperty } from '../types/owner-property';

type Props = { property: OwnerProperty };

const unavailable = 'Not provided';

function formatAddedDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? unavailable
    : date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
}

export function PropertyOverview({ property }: Props) {
  const verified = property.verification_status === 'VERIFIED';
  const statusLabel = verified
    ? 'Verified'
    : property.verification_status === 'ACTION_REQUIRED'
      ? 'Action Required'
      : 'Pending Verification';

  return (
    <>
      <View style={styles.hero}>
        <Image
          source={images.auth.roomBed}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel="Generic property photo placeholder"
        />
        <View style={styles.photoNote}>
          <Ionicons name="image-outline" size={15} color={colors.white} />
          <AppText style={styles.photoNoteText} color={colors.white}>
            Property photo
          </AppText>
        </View>
      </View>

      <View style={styles.titleBlock}>
        <View style={styles.nameRow}>
          <AppText style={styles.propertyName} color={colors.textDark}>
            {property.name}
          </AppText>
          <View style={[styles.status, verified ? styles.statusVerified : styles.statusPending]}>
            <Ionicons
              name={verified ? 'checkmark-circle' : 'time-outline'}
              size={18}
              color={verified ? colors.primary : '#A85D09'}
            />
            <AppText
              style={styles.statusText}
              color={verified ? colors.primary : '#A85D09'}
            >
              {statusLabel}
            </AppText>
          </View>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={21} color={colors.primary} />
          <AppText style={styles.address} color={colors.textSecondary}>
            {property.address || unavailable}
          </AppText>
        </View>
      </View>

      <View style={styles.metrics}>
        <Metric icon="bed-outline" value="—" label="Rooms" tone="green" />
        <Metric icon="people-outline" value="—" label="Staff" tone="amber" />
        <Metric icon="images-outline" value="—" label="Photos" tone="blue" />
      </View>
    </>
  );
}

type MetricProps = {
  icon: 'bed-outline' | 'people-outline' | 'images-outline';
  value: string;
  label: string;
  tone: 'green' | 'amber' | 'blue';
};

function Metric({ icon, value, label, tone }: MetricProps) {
  return (
    <View style={[styles.metric, styles[`metric_${tone}`]]}>
      <Ionicons name={icon} size={28} color={tone === 'green' ? colors.primary : tone === 'amber' ? '#A85D09' : '#14567A'} />
      <View style={styles.metricCopy}>
        <AppText style={styles.metricValue} color={colors.textDark}>{value}</AppText>
        <AppText style={styles.metricLabel} color={colors.textSecondary}>{label}</AppText>
      </View>
    </View>
  );
}

export function PropertyInformation({ property }: Props) {
  const rows = [
    { icon: 'business-outline' as const, label: 'Property Type', value: unavailable },
    { icon: 'resize-outline' as const, label: 'Total Area', value: unavailable },
    { icon: 'time-outline' as const, label: 'Working Hours', value: unavailable },
    { icon: 'globe-outline' as const, label: 'Timezone', value: property.timezone || unavailable },
    { icon: 'call-outline' as const, label: 'Phone', value: unavailable },
    { icon: 'mail-outline' as const, label: 'Email', value: unavailable },
    { icon: 'calendar-outline' as const, label: 'Added On', value: formatAddedDate(property.created_at) },
  ];

  return (
    <View style={styles.information}>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[styles.infoRow, index < rows.length - 1 && styles.infoBorder]}
        >
          <Ionicons name={row.icon} size={20} color={colors.primary} />
          <AppText style={styles.infoLabel} color={colors.textSecondary}>
            {row.label}
          </AppText>
          <AppText style={styles.infoValue} color={colors.textDark}>
            {row.value}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function PropertyDescription() {
  return (
    <View style={styles.description}>
      <AppText style={styles.descriptionTitle} color={colors.textDark}>
        Description
      </AppText>
      <AppText style={styles.descriptionText} color={colors.textSecondary}>
        No description provided.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  heroImage: { width: '100%', height: '100%' },
  photoNote: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(20,26,23,0.62)',
  },
  photoNoteText: { fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 },
  titleBlock: { paddingTop: 15, paddingHorizontal: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  propertyName: { flex: 1, fontFamily: fontFamily.semiBold, fontSize: 24, lineHeight: 32 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14 },
  statusVerified: { backgroundColor: '#E2F4E9' },
  statusPending: { backgroundColor: '#FFF0D9' },
  statusText: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 17 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 7 },
  address: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  metrics: { flexDirection: 'row', gap: 9, marginTop: 20 },
  metric: { flex: 1, minWidth: 0, minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, borderRadius: 16, paddingHorizontal: 8 },
  metric_green: { backgroundColor: '#EAF4E9', borderColor: '#E1EEE0', borderWidth: 1 },
  metric_amber: { backgroundColor: '#FFF5E9', borderColor: '#F4E8D8', borderWidth: 1 },
  metric_blue: { backgroundColor: '#EDF5FA', borderColor: '#DFECF4', borderWidth: 1 },
  metricCopy: { minWidth: 0 },
  metricValue: { fontFamily: fontFamily.semiBold, fontSize: 20, lineHeight: 25 },
  metricLabel: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17 },
  information: { marginTop: 17, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#E4E9E5', backgroundColor: 'rgba(255,255,255,0.62)' },
  infoRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E1E5E0' },
  infoLabel: { flex: 1, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  infoValue: { flex: 1, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  description: { marginTop: 20, marginBottom: 20 },
  descriptionTitle: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 25 },
  descriptionText: { marginTop: 5, fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 20 },
});