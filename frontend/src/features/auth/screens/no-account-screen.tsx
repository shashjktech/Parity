import { Feather, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText, IconCircle } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { colors, spacing } from '@/theme';
import { BrandLogo } from '../../onboarding/components/brand-logo';
import { LoginFooter } from '../components/login-footer';
import { formatPhoneDisplay } from '../utils/phone';

export function NoAccountScreen() {
  const { phone = '' } = useLocalSearchParams<{ phone?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => router.replace(routes.login)} hitSlop={14} accessibilityRole="button" accessibilityLabel="Go back">
            <Feather name="chevron-left" size={28} color={colors.textDark} />
          </Pressable>
          <View style={styles.logo}><BrandLogo/></View>
          <View style={styles.message}>
            <IconCircle size={104} backgroundColor={colors.highlight} icon={{ family: 'ionicons', name: 'person-outline' }} iconColor={colors.primary} />
            <View style={styles.warning}><Ionicons name="alert" size={18} color={colors.white} /></View>
            <AppText variant="heading" color={colors.textDark} style={styles.heading}>No Account Found</AppText>
            <AppText variant="subtitle" color={colors.textSecondary} style={styles.center}>We couldn’t find an account with{`\n`}<AppText variant="phoneNumber" color={colors.primary}>{formatPhoneDisplay(String(phone))}</AppText>.</AppText>
            <AppText variant="subtitle" color={colors.textSecondary} style={[styles.center, styles.prompt]}>Would you like to create a new account{`\n`}and get started with Parity?</AppText>
            <AppButton title="Create an Account" onPress={() => router.replace(routes.signup)} trailingIcon={<Feather name="arrow-right" size={22} color={colors.white} />} style={styles.cta} />
            <Pressable onPress={() => router.replace(routes.login)} hitSlop={8} accessibilityRole="button">
              <AppText variant="caption" color={colors.primary} style={styles.link}>Try a Different Number</AppText>
            </Pressable>
          </View>
        </View>
        {!keyboardVisible && <LoginFooter />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'space-between' },
  content: { paddingHorizontal: spacing.xl },
  logo: { alignItems: 'center', marginTop: 8 },
  message: { alignItems: 'center', marginTop: 30 },
  warning: { position: 'absolute', top: 70, right: '28%', width: 30, height: 30, borderRadius: 15, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  heading: { marginTop: 14, textAlign: 'center' },
  center: { textAlign: 'center', marginTop: 6 },
  prompt: { marginTop: 28 },
  cta: { width: '100%', marginTop: 18 },
  link: { marginTop: 16, textAlign: 'center', textDecorationLine: 'underline' },
});
