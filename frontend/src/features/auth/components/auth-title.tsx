import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors } from '@/theme';

type Props = { title: string; subtitle?: ReactNode; align?: 'left' | 'center'; titleColor?: string };

export function AuthTitle({ title, subtitle, align = 'left', titleColor = colors.primary }: Props) {
  return (
    <View style={styles.container}>
      <AppText variant="heading" color={titleColor} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={{ textAlign: align }}>
        {title}
      </AppText>
      {typeof subtitle === 'string' ? (
        <AppText variant="subtitle" color={colors.textSecondary} style={[styles.subtitle, { textAlign: align }]}>
          {subtitle}
        </AppText>
      ) : (
        subtitle
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignSelf: 'stretch' },
  subtitle: { marginTop: 8 },
});
