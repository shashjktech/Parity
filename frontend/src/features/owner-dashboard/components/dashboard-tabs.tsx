import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { DashboardTab } from '../types/dashboard-types';

type Props = { tabs: DashboardTab[]; activeLabel: string; onPress?: (tab: DashboardTab) => void };

export function DashboardTabs({ tabs, activeLabel, onPress }: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const active = tab.label === activeLabel;
        return (
          <Pressable key={tab.label} onPress={() => onPress?.(tab)} style={styles.tab} accessibilityRole="button" accessibilityState={{ selected: active }}>
            <AppIcon icon={tab.icon} size={28} color={active ? colors.primary : '#747A80'} />
            <AppText style={styles.label} color={active ? colors.primary : '#747A80'}>{tab.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 14, paddingBottom: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: 'rgba(255,255,255,0.95)', shadowColor: '#183B2F', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: -4 }, elevation: 8 },
  tab: { alignItems: 'center', gap: 3, minWidth: 70 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
});
