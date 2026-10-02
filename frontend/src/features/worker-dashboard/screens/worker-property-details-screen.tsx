import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { colors, fontFamily } from '@/theme';

const details = [
  { icon: 'business-outline', label: 'Property Type', value: 'Café / Restaurant' },
  { icon: 'business-outline', label: 'Total Area', value: '2,400 sq ft' },
  { icon: 'time-outline', label: 'Working Hours', value: '8:00 AM – 10:00 PM' },
  { icon: 'mail-outline', label: 'Your Role', value: 'Cleaning Staff' },
] as const;

export function WorkerPropertyDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 7, paddingBottom: insets.bottom + 90 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={23} color={colors.primary} />
          </Pressable>
          <AppText style={styles.headerTitle}>Property Details</AppText>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <Image source={images.auth.roomSoft} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.activeBadge}>
            <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
            <AppText style={styles.activeText}>Active</AppText>
          </View>
        </View>

        <View style={styles.propertyHeading}>
          <AppText style={styles.propertyName}>Brew &amp; Bites Café</AppText>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
            <AppText style={styles.address} color={colors.textSecondary}>
              123 Park Street, Kolkata,{ '\n' }West Bengal 700016
            </AppText>
          </View>
        </View>

        <View style={styles.details}>
          {details.map((item, index) => (
            <View key={item.label} style={[styles.detailRow, index < details.length - 1 && styles.detailBorder]}>
              <Ionicons name={item.icon} size={17} color={colors.textSecondary} />
              <AppText style={styles.detailLabel} color={colors.textSecondary}>{item.label}</AppText>
              <AppText style={styles.detailValue} color={colors.textDark}>{item.value}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.about}>
          <AppText style={styles.aboutTitle}>About this Property</AppText>
          <AppText style={styles.aboutText} color={colors.textSecondary}>
            A cozy café in the heart of Kolkata with indoor and outdoor seating, serving fresh coffee and snacks.
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} accessibilityRole="button">
          <Ionicons name="calendar-outline" size={18} color={colors.white} />
          <AppText style={styles.primaryButtonText} color={colors.white}>View Schedules</AppText>
          <Ionicons name="arrow-forward" size={17} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 18 },
  header: { height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 36, height: 36, alignItems: 'flex-start', justifyContent: 'center' },
  headerTitle: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  headerSpacer: { width: 36 },
  hero: { position: 'relative' },
  heroImage: { width: '100%', height: 188, borderRadius: 8, backgroundColor: colors.surface },
  activeBadge: { position: 'absolute', right: 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14, backgroundColor: '#E1F4E6' },
  activeText: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 14 },
  propertyHeading: { paddingTop: 10, paddingBottom: 12 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 25 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 3 },
  address: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 16 },
  details: { paddingHorizontal: 1 },
  detailRow: { minHeight: 39, flexDirection: 'row', alignItems: 'center', gap: 9 },
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E1E5E0' },
  detailLabel: { flex: 1, fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 15 },
  detailValue: { fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 15, textAlign: 'right' },
  about: { marginTop: 17 },
  aboutTitle: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  aboutText: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 17, marginTop: 5 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 18, paddingTop: 10, backgroundColor: colors.background },
  primaryButton: { minHeight: 46, borderRadius: 24, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  primaryButtonText: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.84 },
});