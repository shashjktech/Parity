import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { WorkerStatus } from '../types/worker';

type Props = {
  tab: WorkerStatus;
  onChange: (tab: WorkerStatus) => void;
  activeCount: number;
  pendingCount: number;
  showCounts: boolean;
};

export function WorkerTabs({ tab, onChange, activeCount, pendingCount, showCounts }: Props) {
  const items: { key: WorkerStatus; label: string }[] = [
    { key: 'ACTIVE', label: `Active Workers${showCounts ? ` (${activeCount})` : ''}` },
    { key: 'PENDING', label: `Requests${showCounts ? ` (${pendingCount})` : ''}` },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => {
        const selected = tab === item.key;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[styles.tab, selected && styles.tabSelected]}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
          >
            <AppText
              style={selected ? styles.labelSelected : styles.label}
              color={selected ? colors.primary : colors.textSecondary}
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: 22, borderBottomWidth: 1, borderBottomColor: '#E3E6DD' },
  tab: { height: 46, paddingHorizontal: 14, justifyContent: 'center', borderBottomWidth: 2.5, borderBottomColor: 'transparent', marginBottom: -1 },
  tabSelected: { borderBottomColor: colors.primary },
  label: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  labelSelected: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
});