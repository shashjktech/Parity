import { Linking, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui';
import { env } from '@/config/env';
import { colors } from '@/theme';

export function TermsText() {
  return (
    <AppText variant="caption" color={colors.textSecondary} style={styles.text}>
      {'By creating an account, you agree to our '}
      <AppText variant="caption" color={colors.primary} style={styles.link} accessibilityRole="link" onPress={() => Linking.openURL(env.termsUrl)}>
        Terms of Service
      </AppText>
      {' and '}
      <AppText variant="caption" color={colors.primary} style={styles.link} accessibilityRole="link" onPress={() => Linking.openURL(env.privacyUrl)}>
        Privacy Policy
      </AppText>
      .
    </AppText>
  );
}

const styles = StyleSheet.create({
  text: { textAlign: 'center' },
  link: { textDecorationLine: 'underline' },
});
