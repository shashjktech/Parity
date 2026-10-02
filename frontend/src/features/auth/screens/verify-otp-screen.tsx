import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText, OtpInput, PaginationDots } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useKeyboardVisible } from '@/hooks/use-keyboard-visible';
import { colors, spacing } from '@/theme';
import { formatMmSs } from '@/utils/time';
import { AuthHeader } from '../components/auth-header';
import { AuthTitle } from '../components/auth-title';
import { VerifyFooter } from '../components/verify-footer';
import { DEFAULT_OTP_EXPIRY_SEC, DEFAULT_RESEND_SEC, OTP_LENGTH } from '../constants/auth-config';
import { useOtpVerification } from '../hooks/use-otp-verification';
import { formatPhoneDisplay } from '../utils/phone';

type Params = { requestId?: string; phone?: string; expiresInSec?: string; resendInSec?: string };

/** Guard: opened without a session (deep link / refresh) -> back to signup. */
export function VerifyOtpScreen() {
  const p = useLocalSearchParams<Params>();
  if (!p.requestId || !p.phone) return <Redirect href={routes.signup} />;
  return (
    <VerifyOtpContent
      requestId={p.requestId}
      phone={p.phone}
      expiresInSec={Number(p.expiresInSec) || DEFAULT_OTP_EXPIRY_SEC}
      resendInSec={Number(p.resendInSec) || DEFAULT_RESEND_SEC}
    />
  );
}

type ContentProps = { requestId: string; phone: string; expiresInSec: number; resendInSec: number };

function VerifyOtpContent({ requestId, phone, expiresInSec, resendInSec }: ContentProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const otp = useOtpVerification({ requestId, expiresInSec, resendInSec });

  const goBack = () => (router.canGoBack() ? router.back() : router.replace(routes.signup));

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
          <AuthHeader step={2} onBack={goBack} />

          <View style={styles.title}>
            <AuthTitle
              align="center"
              title="Verify Your Phone Number"
              titleColor={colors.textDark}
              subtitle={
                <View style={styles.subtitle}>
                  <AppText variant="subtitle" color={colors.textSecondary}>
                    {`We’ve sent a ${OTP_LENGTH}-digit code to`}
                  </AppText>
                  <AppText variant="phoneNumber" color={colors.primary}>{formatPhoneDisplay(phone)}</AppText>
                </View>
              }
            />
          </View>

          <View style={styles.otp}>
            <OtpInput value={otp.otp} onChange={otp.setOtp} length={OTP_LENGTH} hasError={!!otp.error || otp.isExpired} editable={!otp.verifying} autoFocus />
          </View>

          {otp.error ? (
            <AppText variant="error" color={colors.error} style={styles.error}>{otp.error}</AppText>
          ) : null}

          <View style={styles.timer}>
            <Ionicons name="time-outline" size={22} color={otp.isExpired ? colors.error : colors.primary} />
            <AppText variant="subtitle" color={otp.isExpired ? colors.error : colors.primary}>
              {otp.isExpired ? 'Code expired' : `Code expires in ${formatMmSs(otp.expiresIn)}`}
            </AppText>
          </View>

          <AppButton
            title="Verify & Continue"
            onPress={otp.verify}
            disabled={!otp.canVerify}
            loading={otp.verifying}
            trailingIcon={<Ionicons name="arrow-forward" size={22} color={colors.white} />}
            style={styles.cta}
          />

          <View style={styles.resend}>
            <AppText variant="caption" color={colors.textDark}>Didn’t receive the code?</AppText>
            <Pressable onPress={otp.resend} disabled={!otp.canResend} hitSlop={8} accessibilityRole="button">
              <AppText variant="caption" color={otp.canResend ? colors.primary : colors.textMuted} style={styles.link}>
                {otp.resending ? 'Sending…' : otp.resendIn > 0 ? `Resend OTP in ${otp.resendIn}s` : 'Resend OTP'}
              </AppText>
            </Pressable>
          </View>
        </View>

        {!keyboardVisible && (
          <View>
            <VerifyFooter />
            <PaginationDots count={2} activeIndex={1} style={[styles.dots, { bottom: insets.bottom + 12 }]} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: 'space-between' },
  content: { paddingHorizontal: spacing.xl },
  title: { marginTop: 36 },
  subtitle: { alignItems: 'center', marginTop: 8, gap: 2 },
  otp: { marginTop: 28 },
  error: { marginTop: 12, textAlign: 'center' },
  timer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18 },
  cta: { marginTop: 18 },
  resend: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 16 },
  link: { textDecorationLine: 'underline' },
  dots: { position: 'absolute', left: 0, right: 0 },
});
