import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, layout, spacing } from '@/theme';
import { AppButton } from '@/components/ui';
import { WELCOME_COPY } from '../constants/welcome-content';

type Props = { onCreateAccount: () => void; onLogIn: () => void };

export function ActionButtons({ onCreateAccount, onLogIn }: Props) {
  return (
    <View style={styles.container}>
      <AppButton
        title={WELCOME_COPY.createAccount}
        onPress={onCreateAccount}
        trailingIcon={<Feather name="arrow-right" size={22} color={colors.white} />}
      />
      <AppButton title={WELCOME_COPY.logIn} onPress={onLogIn} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: layout.screenPaddingH, marginTop: spacing.lg + 2, gap: 10 },
});
