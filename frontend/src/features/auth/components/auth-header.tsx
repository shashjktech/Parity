import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { BrandLogo } from '@/features/onboarding/components/brand-logo';
import { colors } from '@/theme';

type Props = { step: number; totalSteps?: number; onBack: () => void };

export function AuthHeader({ step, totalSteps = 2, onBack }: Props) {
  return (
    <View>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} hitSlop={14} accessibilityRole="button" accessibilityLabel="Go back">
          <Feather name="chevron-left" size={28} color={colors.textDark} />
        </Pressable>
        <AppText variant="stepLabel" color={colors.textSecondary}>{`Step ${step} of ${totalSteps}`}</AppText>
      </View>

      <View style={styles.logo}>
        <BrandLogo />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { alignItems: 'center' },
  tagline: { marginTop: 8, textAlign: 'center' },
});
