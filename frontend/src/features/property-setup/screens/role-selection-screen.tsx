import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { routes } from "@/constants/routes";
import { colors, spacing } from "@/theme";
import { RoleCard } from "../components/role-card";
import { SetupFooter } from "../components/setup-footer";
import { SetupHeader } from "../components/setup-header";

import { useRegistration } from "@/state/auth/signup-context";

export function RoleSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateRole } = useRegistration();

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <SetupHeader onBack={() => router.replace(routes.welcome)} />
        <View style={styles.title}>
          <AppText
            variant="heading"
            color={colors.textDark}
            style={styles.center}
          >
            Who are you?
          </AppText>
          <AppText
            variant="subtitle"
            color={colors.textSecondary}
            style={styles.center}
          >
            Tell us how you’ll be using Parity.
          </AppText>
        </View>
        <View style={styles.cards}>
          <RoleCard
            icon={{ family: "ionicons", name: "business-outline" }}
            title="Property Owner"
            description="Manage properties, track cleanliness, and oversee teams"
            onPress={() => {
              updateRole("OWNER");
              router.push(routes.signup);
            }}
          />
          <RoleCard
            icon={{ family: "ionicons", name: "person-outline" }}
            title="Worker"
            description="Join a property and capture room photos"
            onPress={() => {
              updateRole("WORKER");
              router.push(routes.signup);
            }}
          />
        </View>
      </View>
      <SetupFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  content: { paddingHorizontal: spacing.xl },
  title: { marginTop: 8 },
  center: { textAlign: "center" },
  cards: { gap: 12, marginTop: 28 },
});
