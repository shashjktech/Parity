import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { BrandLogo } from '@/features/onboarding/components/brand-logo';
import { colors } from '@/theme';

type Props = { onBack: () => void };

export function SetupHeader({ onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} hitSlop={14} accessibilityRole="button" accessibilityLabel="Go back" style={styles.back}>
        <Feather name="chevron-left" size={26} color={colors.textDark} />
      </Pressable>
      <BrandLogo compact />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', minHeight: 118 },
  back: { position: 'absolute', top: 4, left: 0, zIndex: 1 },
});
