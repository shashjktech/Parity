import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

type Props = {
  title: string;
  onBack: () => void;
  actionTitle?: string;
  onAction?: () => void;
};

export function PropertyItemsHeader({ title, onBack, actionTitle, onAction }: Props) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>
      <AppText style={styles.title} color={colors.textDark} numberOfLines={1}>{title}</AppText>
      {actionTitle && onAction ? (
        <Pressable onPress={onAction} style={styles.action} accessibilityRole="button">
          <Ionicons name="add" size={19} color={colors.white} />
          <AppText style={styles.actionText} color={colors.white}>{actionTitle}</AppText>
        </Pressable>
      ) : <View style={styles.iconButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  iconButton: { width: 38, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 23 },
  action: { minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3, paddingHorizontal: 10, borderRadius: 18, backgroundColor: colors.primary },
  actionText: { fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 },
});