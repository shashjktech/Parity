import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

type Props = {
  onBack: () => void;
  onMore: () => void;
};

export function PropertyDetailsHeader({ onBack, onMore }: Props) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={25} color={colors.primary} />
      </Pressable>
      <AppText style={styles.title} color={colors.textDark}>
        Property Details
      </AppText>
      <Pressable
        onPress={onMore}
        style={styles.iconButton}
        accessibilityRole="button"
        accessibilityLabel="Property options"
      >
        <Ionicons name="ellipsis-vertical" size={22} color={colors.textDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 54,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
});