import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton, AppText, TextField } from "@/components/ui";
import { routes } from "@/constants/routes";
import { useKeyboardVisible } from "@/hooks/use-keyboard-visible";
import { useRegistration } from "@/state/auth/signup-context";
import { colors, spacing } from "@/theme";
import { AuthHeader } from "../components/auth-header";
import { AuthTitle } from "../components/auth-title";
import { CountryCodePicker } from "../components/country-code-picker";
import { PropertyCodeField } from "../components/property-code-field";
import { SignupFooter } from "../components/signup-footer";
import { TermsText } from "../components/terms-text";
import { useSignupForm } from "../hooks/use-signup-form";
import type { SignupField } from "../types/auth-types";

export function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  const { state: registrationDraft, updatePropertyCode } = useRegistration();
  const isWorker = registrationDraft.role === "worker";

  const [showPassword, setShowPassword] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const propertyCodeRef = useRef<TextInput>(null);

  const focusField = (field: SignupField) => {
    const map: Record<SignupField, TextInput | null> = {
      firstName: firstNameRef.current,
      lastName: lastNameRef.current,
      email: emailRef.current,
      phone: phoneRef.current,
      password: passwordRef.current,
      propertyCode: propertyCodeRef.current,
    };
    map[field]?.focus();
  };

  const form = useSignupForm({ onInvalidField: focusField });
  const { values, errors } = form;

  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace(routes.welcome);

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
          <AuthHeader step={1} onBack={goBack} />

          <View style={styles.title}>
            <AuthTitle
              title="Create Your Account"
              subtitle="Let’s get you started with a cleaner, smarter way to manage your spaces."
            />
          </View>

          <View style={styles.fields}>
            <TextField
              ref={firstNameRef}
              label="First Name"
              icon={{ family: "ionicons", name: "person-outline" }}
              value={values.firstName}
              onChangeText={(t) => form.setField("firstName", t)}
              onBlur={() => form.markTouched("firstName")}
              error={errors.firstName}
              autoCapitalize="words"
              autoComplete="given-name"
              textContentType="givenName"
              maxLength={50}
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            <TextField
              ref={lastNameRef}
              label="Last Name"
              icon={{ family: "ionicons", name: "person-outline" }}
              value={values.lastName}
              onChangeText={(t) => form.setField("lastName", t)}
              onBlur={() => form.markTouched("lastName")}
              error={errors.lastName}
              autoCapitalize="words"
              autoComplete="family-name"
              textContentType="familyName"
              maxLength={50}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <TextField
              ref={emailRef}
              label="Email Address"
              icon={{ family: "ionicons", name: "mail-outline" }}
              value={values.email}
              onChangeText={(t) => form.setField("email", t)}
              onBlur={() => form.markTouched("email")}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              maxLength={254}
              returnKeyType="next"
              onSubmitEditing={() => phoneRef.current?.focus()}
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
              value={values.password}
              onChangeText={(t) => form.setField("password", t)}
              onBlur={() => form.markTouched("password")}
              error={errors.password}
              secureTextEntry={!showPassword} // <-- Dynamic secure text toggle
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={form.submit}
            />
            <TextField
              ref={phoneRef}
              label="Phone Number"
              icon={{ family: "ionicons", name: "call" }}
              prefix={
                <CountryCodePicker
                  value={values.countryIso}
                  onChange={form.setCountry}
                />
              }
              value={values.phone}
              onChangeText={(t) => form.setField("phone", t)}
              onBlur={() => form.markTouched("phone")}
              error={errors.phone}
              keyboardType="number-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
              returnKeyType="done"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            {isWorker && (
              <PropertyCodeField
                value={registrationDraft.propertyCode}
                onChangeText={updatePropertyCode}
                onBlur={() => form.markTouched("propertyCode")}
                inputRef={propertyCodeRef}
                error={errors.propertyCode}
              />
            )}
          </View>

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
              <Feather name="arrow-right" size={22} color={colors.white} />
            }
            style={styles.cta}
          />
          <View style={styles.terms}>
            <TermsText />
          </View>
        </View>

        {!keyboardVisible && <SignupFooter />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, justifyContent: "space-between" },
  content: { paddingHorizontal: spacing.xl },
  title: { marginTop: 36 },
  fields: { marginTop: 22, gap: 12 },
  formError: { marginTop: 12, textAlign: "center" },
  cta: { marginTop: 20 },
  terms: { marginTop: 14 },
});
