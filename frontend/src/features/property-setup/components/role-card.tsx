import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon, AppText, type IconSpec } from '@/components/ui';
import { colors, spacing } from '@/theme';

type Props = { icon: IconSpec; title: string; description: string; onPress: () => void };

export function RoleCard({ icon, title, description, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}><AppIcon icon={icon} size={31} color={colors.primary} /></View>
      <View style={styles.copy}>
        <AppText variant="featureTitle" color={colors.primary}>{title}</AppText>
        <AppText variant="caption" color={colors.textSecondary}>{description}</AppText>
      </View>
      <Feather name="chevron-right" size={22} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 14, backgroundColor: colors.inputBackground },
  pressed: { opacity: 0.82 },
  icon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  copy: { flex: 1, gap: 2 },
});
