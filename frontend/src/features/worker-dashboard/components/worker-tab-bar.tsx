import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

export type WorkerTab = 'home' | 'schedules' | 'profile';

type Props = { activeTab: WorkerTab; onSelect?: (tab: WorkerTab) => void };

const tabs: { key: WorkerTab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'schedules', label: 'Schedules', icon: 'calendar-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

export function WorkerTabBar({ activeTab, onSelect }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect?.(tab.key)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Ionicons name={tab.icon} size={21} color={active ? colors.primary : '#7E8782'} />
            <AppText style={[styles.label, active && styles.activeLabel]} color={active ? colors.primary : '#7E8782'}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingTop: 8, backgroundColor: 'rgba(255,255,255,0.96)', borderTopLeftRadius: 18, borderTopRightRadius: 18, shadowColor: '#183B2F', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -3 }, elevation: 7 },
  tab: { width: 86, alignItems: 'center', gap: 2 },
  label: { fontFamily: fontFamily.regular, fontSize: 9, lineHeight: 13 },
  activeLabel: { fontFamily: fontFamily.medium },
});