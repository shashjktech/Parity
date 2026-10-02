import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

type Props = { onPress: () => void; compact?: boolean };

export function AddPropertyButton({ onPress, compact = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, compact && styles.compactButton]}
      accessibilityRole="button"
      accessibilityLabel="Add property"
    >
      <Ionicons name="add" size={28} color={colors.white} />
      {!compact && <AppText style={styles.label} color={colors.white}>Add Property</AppText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minWidth: 80, minHeight: 58, paddingHorizontal: 7, borderRadius: 10, backgroundColor: colors.primary, gap: 4 },
  compactButton: { minWidth: 38, width: 38, height: 38, minHeight: 38, paddingHorizontal: 0, borderRadius: 18 },
  label: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 23 },
});