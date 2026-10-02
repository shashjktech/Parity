import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

type Props = { count: number; activeIndex: number; style?: StyleProp<ViewStyle> };

export function PaginationDots({ count, activeIndex, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: i === activeIndex ? colors.primary : colors.dotInactive }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: 13 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
