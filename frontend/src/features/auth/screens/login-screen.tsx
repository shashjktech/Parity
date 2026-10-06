import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef,useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton, AppText, TextField } from "@/components/ui";
import { routes } from "@/constants/routes";
import { useKeyboardVisible } from "@/hooks/use-keyboard-visible";
import { colors, spacing } from "@/theme";
import { BrandLogo } from "../../onboarding/components/brand-logo";
import { AuthTitle } from "../components/auth-title";
import { LoginFooter } from "../components/login-footer";
import { useLoginForm } from "../hooks/use-login-form";

export function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const [showPassword, setShowPassword] = useState(false);
  const identifierRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const form = useLoginForm();

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View
          style={[
            styles.content,
            {
              paddingTop: insets.top + spacing.sm,
              paddingBottom: keyboardVisible ? spacing.xl : spacing.lg,
            },
          ]}
        >
          <View style={styles.topRow}>
            <Pressable
              onPress={() =>
                router.canGoBack()
                  ? router.back()
                  : router.replace(routes.welcome)
              }
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Feather name="chevron-left" size={28} color={colors.textDark} />
            </Pressable>
          </View>

          <View style={styles.logo}>
            <BrandLogo />
          </View>
          <View style={styles.title}>
            <AuthTitle
              align="center"
              title="Welcome Back"
              titleColor={colors.primary}
              subtitle="Log in with your email or phone number."
            />
          </View>

          <View style={styles.form}>
            <TextField
              ref={identifierRef}
              label="Email or Phone Number"
              icon={{ family: "ionicons", name: "person-outline" }}
              value={form.values.login_id}
              onChangeText={form.setLoginId}
              onBlur={() => undefined}
              error={
                form.error && !form.values.login_id.trim()
                  ? form.error
                  : undefined
              }
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <TextField
              ref={passwordRef}
              label="Password"
              icon={{ family: "ionicons", name: "lock-closed-outline" }}
              rightIcon={{
                family: "ionicons",
                name: showPassword ? "eye-off-outline" : "eye-outline",
                onPress: () => setShowPassword((prev) => !prev),
              }}
              value={form.values.password}
              onChangeText={form.setPassword}
              onBlur={() => undefined}
              error={
                form.error &&
                form.values.login_id.trim() &&
                !form.values.password
                  ? form.error
                  : undefined
              }
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={form.submit}
            />
            {form.formError ? (
              <AppText
                variant="error"
                color={colors.error}
                style={styles.formError}
              >
                {form.formError}
              </AppText>
            ) : null}
            <AppButton
              title="Continue"
              onPress={form.submit}
              loading={form.submitting}
              trailingIcon={
                <Ionicons name="arrow-forward" size={22} color={colors.white} />
              }
              style={styles.cta}
            />
            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <AppText variant="caption" color={colors.textMuted}>
                OR
              </AppText>
              <View style={styles.divider} />
            </View>
            <AppButton
              title="Create an Account"
              variant="outline"
              onPress={() => router.push(routes.signup)}
              style={styles.signupButton}
            />
          </View>
        </View>
        {!keyboardVisible && <LoginFooter />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "space-between" },
  content: { paddingHorizontal: spacing.xl },
  topRow: { height: 28 },
  logo: { alignItems: "center", marginTop: 6 },
  title: { marginTop: 26 },
  form: { marginTop: 28, gap: 12 },
  formError: { marginTop: 10, textAlign: "center" },
  cta: { marginTop: 16 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
  },
  divider: { flex: 1, height: 1, backgroundColor: colors.inputBorder },
  signupButton: { marginTop: 16 },
});
