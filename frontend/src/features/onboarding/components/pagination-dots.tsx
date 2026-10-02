import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/theme';

type Props = { count: number; activeIndex: number };

export function PaginationDots({ count, activeIndex }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, { backgroundColor: i === activeIndex ? colors.primary : colors.dotInactive }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 13, marginTop: spacing.xl - 4 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
