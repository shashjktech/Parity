import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';
import { AppText } from '@/components/ui';

type Props = { label: string; onPress: () => void; style?: StyleProp<ViewStyle> };

export function SkipButton({ label, onPress, style }: Props) {
  return (
    <Pressable accessibilityRole="button" hitSlop={12} onPress={onPress} style={[styles.row, style]}>
      <AppText variant="link">{label}</AppText>
      <Feather name="chevron-right" size={22} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
