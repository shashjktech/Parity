import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText, IconCircle } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { SetupFooter } from './setup-footer';
import { SetupHeader } from './setup-header';

type Props = { title: string; body: string; buttonTitle: string; icon: 'business-outline' | 'checkmark'; footerText?: string; onBack: () => void; onContinue: () => void };

export function CompletionScreen({ title, body, buttonTitle, icon, footerText, onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
      <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <SetupHeader onBack={onBack} />
        <View style={styles.center}>
          <IconCircle size={104} backgroundColor={colors.surface} icon={{ family: 'ionicons', name: icon }} iconColor={colors.primary} />
          <AppText variant="heading" color={colors.primary} style={styles.heading}>{title}</AppText>
          <AppText variant="subtitle" color={colors.textSecondary} style={styles.body}>{body}</AppText>
          <AppButton title={buttonTitle} onPress={onContinue} trailingIcon={<Feather name="arrow-right" size={22} color={colors.white} />} style={styles.button} />
        </View>
      </View>
      <SetupFooter text={footerText} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'space-between', backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl },
  center: { alignItems: 'center', marginTop: 24 },
  heading: { marginTop: 18, textAlign: 'center' },
  body: { maxWidth: 285, marginTop: 8, textAlign: 'center' },
  button: { width: '100%', marginTop: 26 },
});
