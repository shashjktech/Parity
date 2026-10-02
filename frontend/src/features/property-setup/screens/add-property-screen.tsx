import { AppButton, AppText, TextField } from "@/components/ui";
import { routes } from "@/constants/routes";
import { colors, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SelectField } from "../components/select-field";
import { SetupHeader } from "../components/setup-header";
import { usePropertyForm } from "../hooks/use-property-form";

export function AddPropertyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const form = usePropertyForm();

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SetupHeader onBack={() => router.replace(routes.roleSelection)} />

        <View style={styles.title}>
          <Ionicons name="business-outline" size={42} color={colors.primary} />
          <AppText
            variant="heading"
            color={colors.primary}
            style={styles.center}
          >
            Add Your Property
          </AppText>
          <AppText
            variant="subtitle"
            color={colors.textSecondary}
            style={styles.center}
          >
            Let&apos;s add your first property to get started.
          </AppText>
        </View>

        <View style={styles.form}>
          <TextField
            label="Property Name"
            icon={{ family: "ionicons", name: "business-outline" }}
            value={form.values.name}
            onChangeText={(value) => form.setField("name", value)}
            error={form.error}
            autoCapitalize="words"
          />

          <TextField
            label="Address"
            icon={{ family: "ionicons", name: "location-outline" }}
            value={form.values.address}
            onChangeText={(value) => form.setField("address", value)}
            autoCapitalize="words"
          />

          <SelectField
            label="Country"
            iconName="flag-outline"
            value={form.values.country}
            placeholder="Select country"
            options={form.countries.map((c) => ({
              label: c.name,
              value: c.isoCode,
            }))}
            onSelect={form.setCountry}
          />

          <View style={styles.row}>
            <View style={styles.city}>
              <TextField
                label="City"
                icon={{ family: "ionicons", name: "navigate-outline" }}
                value={form.values.city}
                onChangeText={(value) => form.setField("city", value)}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.small}>
              <SelectField
                label="State"
                iconName="map-outline"
                value={form.values.state}
                placeholder="Select"
                options={form.states.map((s) => ({
                  label: s.name,
                  value: s.isoCode,
                }))}
                onSelect={form.setState}
                disabled={!form.values.country}
              />
            </View>
          </View>

          <TextField
            label="Pincode"
            icon={{ family: "ionicons", name: "keypad-outline" }}
            value={form.values.pincode}
            onChangeText={(value) =>
              form.setField("pincode", value.replace(/\D/g, "").slice(0, 6))
            }
            keyboardType="number-pad"
          />

          <Pressable
            onPress={form.detectLocation}
            style={styles.detect}
            accessibilityRole="button"
            disabled={form.locating}
          >
            {form.locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons
                name="locate-outline"
                size={21}
                color={colors.primary}
              />
            )}
            <AppText variant="caption" color={colors.primary}>
              {form.locating ? "Detecting…" : "Detect My Location"}
            </AppText>
          </Pressable>

          <AppButton
            title="Save Property"
            onPress={form.submit}
            trailingIcon={
              <Ionicons name="arrow-forward" size={22} color={colors.white} />
            }
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: { alignItems: "center", marginTop: 4 },
  center: { textAlign: "center", marginTop: 4 },
  form: { gap: 11, marginTop: 22 },
  row: { flexDirection: "row", gap: 8 },
  city: { flex: 1.2 },
  small: { flex: 1 },
  detect: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 16,
    backgroundColor: colors.inputBackground,
  },
  button: { marginTop: 4 },
});
