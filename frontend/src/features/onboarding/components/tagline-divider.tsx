import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useResponsive } from '@/hooks/use-responsive';
import { colors, spacing } from '@/theme';
import { WELCOME_COPY } from '../constants/welcome-content';

/** "—— BETTER SPACES. BRIGHTER STAYS. ——" */
export function TaglineDivider() {
  const { width } = useResponsive();

  return (
    <View style={[styles.row, { width: width * 0.8 }]}>
      <View style={styles.line} />
      <AppText
        variant="tagline"
        color={colors.textMuted}
        numberOfLines={1}
        adjustsFontSizeToFit
        style={styles.text}
      >
        {WELCOME_COPY.tagline}
      </AppText>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md + 4,
    marginTop: spacing.lg + 2,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.line },
  text: { flexShrink: 1, textTransform: 'uppercase' },
});