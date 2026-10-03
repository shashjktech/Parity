import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui";
import { colors, fontFamily } from "@/theme";
import type { PropertySpaceType } from "../types/property-item";

const tabs: { kind: PropertySpaceType; label: string }[] = [
  { kind: "room", label: "Rooms" },
  { kind: "area", label: "Areas" },
  { kind: "asset", label: "Assets" },
];

type Props = {
  selected: PropertySpaceType;
  counts: Record<PropertySpaceType, number>;
  onSelect: (kind: PropertySpaceType) => void;
};

export function PropertySpaceTypeTabs({ selected, counts, onSelect }: Props) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const active = tab.kind === selected;
        return (
          <Pressable
            key={tab.kind}
            onPress={() => onSelect(tab.kind)}
            style={[styles.tab, active && styles.activeTab]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <AppText
              style={[styles.label, active && styles.activeLabel]}
              color={active ? colors.primary : colors.textSecondary}
            >
              {tab.label} ({counts[tab.kind]})
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tab: {
    flex: 1,
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: { borderBottomColor: colors.primary },
  label: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  activeLabel: { fontFamily: fontFamily.semiBold },
});
