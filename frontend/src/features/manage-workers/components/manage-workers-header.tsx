import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

export function ManageWorkersHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.side} accessibilityRole="button" accessibilityLabel="Go back">
        <Ionicons name="chevron-back" size={26} color={colors.primary} />
      </Pressable>
      <AppText style={styles.title} color={colors.textDark}>Manage Workers</AppText>
      <View style={styles.side} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { height: 54, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  side: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 25 },
});