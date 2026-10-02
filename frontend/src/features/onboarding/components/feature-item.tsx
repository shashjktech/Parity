import { StyleSheet, View } from 'react-native';

import { AppText, IconCircle } from '@/components/ui';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, spacing } from '@/theme';
import type { WelcomeFeature } from '../constants/welcome-content';

type Props = Omit<WelcomeFeature, 'id'>;

export function FeatureItem({ title, caption, icon, iconColor, circleColor }: Props) {
  const { width } = useResponsive();
  const size = Math.round(width * 0.15); // circle ≈ 15% of screen width

  return (
    <View style={styles.item}>
      <IconCircle size={size} backgroundColor={circleColor} icon={icon} iconColor={iconColor} />
      <AppText variant="featureTitle" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="featureCaption" color={colors.textMuted} style={styles.caption}>
        {caption}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  title: { marginTop: spacing.sm, textAlign: 'center' },
  caption: { textAlign: 'center' },
});