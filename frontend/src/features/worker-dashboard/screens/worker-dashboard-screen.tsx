import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';

export function WorkerDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image source={images.decor.leavesTop} style={styles.topLeaves} resizeMode="contain" />
      <Image source={images.decor.leavesBottom} style={styles.bottomLeaves} resizeMode="contain" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 88 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image source={images.brand.logoWordmark} style={styles.logo} resizeMode="contain" />
          <View style={styles.headerActions}>
            <Pressable style={styles.notification} accessibilityRole="button" accessibilityLabel="Notifications">
              <Ionicons name="notifications-outline" size={21} color={colors.primary} />
              <View style={styles.notificationDot} />
            </Pressable>
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>RK</AppText>
            </View>
          </View>
        </View>

        <View style={styles.headingBlock}>
          <AppText style={styles.eyebrow} color={colors.textSecondary}>WORKER DASHBOARD</AppText>
          <AppText style={styles.heading}>Your Property</AppText>
          <AppText style={styles.subtitle} color={colors.textSecondary}>Here&apos;s the property you are assigned to.</AppText>
        </View>

        <View style={styles.property}>
          <View>
            <Image source={images.auth.roomSoft} style={styles.propertyImage} resizeMode="cover" />
            <View style={styles.activeBadge}>
              <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
              <AppText style={styles.activeText}>Active</AppText>
            </View>
          </View>
          <View style={styles.propertyInfo}>
            <AppText style={styles.propertyName}>Brew &amp; Bites Café</AppText>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={19} color={colors.textSecondary} />
              <AppText style={styles.address} color={colors.textSecondary}>
                123 Park Street, Kolkata,{ '\n' }West Bengal 700016
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <Stat icon="bed-outline" value="8" label="Rooms" />
          <Stat icon="grid-outline" value="5" label="Areas" />
          <Stat icon="cube-outline" value="42" label="Assets" />
        </View>

        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => router.push(routes.workerPropertyDetails)}
          accessibilityRole="button"
        >
          <AppText style={styles.primaryButtonText} color={colors.white}>View Details</AppText>
          <Ionicons name="arrow-forward" size={19} color={colors.white} />
        </Pressable>
      </ScrollView>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <WorkerTab icon="home" label="Home" active />
        <WorkerTab icon="calendar-outline" label="Schedules" />
        <WorkerTab icon="person-outline" label="Profile" />
      </View>
    </View>
  );
}

function Stat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={19} color={colors.primary} />
      <AppText style={styles.statValue}>{value}</AppText>
      <AppText style={styles.statLabel} color={colors.textSecondary}>{label}</AppText>
    </View>
  );
}

function WorkerTab({ icon, label, active = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; active?: boolean }) {
  return (
    <Pressable style={styles.tab} accessibilityRole="button" accessibilityState={{ selected: active }}>
      <Ionicons name={icon} size={21} color={active ? colors.primary : '#7E8782'} />
      <AppText style={[styles.tabLabel, active && styles.activeTabLabel]} color={active ? colors.primary : '#7E8782'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 18 },
  topLeaves: { position: 'absolute', top: 90, right: -40, width: 150, height: 170, opacity: 0.2 },
  bottomLeaves: { position: 'absolute', bottom: 45, left: -38, width: 150, height: 130, opacity: 0.26 },
  header: { minHeight: 43, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 128, height: 42, alignSelf: 'flex-start' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  notification: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.inputBorder, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4473D' },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.semiBold, fontSize: 11 },
  headingBlock: { marginTop: 27, marginBottom: 17 },
  eyebrow: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 15, letterSpacing: 1.2 },
  heading: { fontFamily: fontFamily.semiBold, fontSize: 25, lineHeight: 33, marginTop: 4 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18, marginTop: 1 },
  property: { overflow: 'hidden' },
  propertyImage: { width: '100%', height: 184, borderRadius: 8, backgroundColor: colors.surface },
  activeBadge: { position: 'absolute', top: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 14, backgroundColor: '#E1F4E6' },
  activeText: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 14 },
  propertyInfo: { paddingHorizontal: 4, paddingTop: 7 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 3 },
  address: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 16 },
  stats: { flexDirection: 'row', gap: 8, marginTop: 13 },
  stat: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderColor: '#E7EAE5', borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.8)' },
  statValue: { fontFamily: fontFamily.semiBold, fontSize: 12, lineHeight: 16 },
  statLabel: { fontFamily: fontFamily.regular, fontSize: 9, lineHeight: 13 },
  primaryButton: { minHeight: 45, borderRadius: 24, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 13 },
  primaryButtonText: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: 0.84 },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, backgroundColor: 'rgba(255,255,255,0.96)', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#183B2F', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 7 },
  tab: { width: 86, alignItems: 'center', gap: 2 },
  tabLabel: { fontFamily: fontFamily.regular, fontSize: 9, lineHeight: 13 },
  activeTabLabel: { fontFamily: fontFamily.medium },
});