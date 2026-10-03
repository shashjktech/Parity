import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { routes } from "@/constants/routes";
import { colors, fontFamily } from "@/theme";
import { PropertyItemCard } from "../components/property-item-card";
import { PropertySpaceTypeTabs } from "../components/property-item-kind-tabs";
import { PropertyItemsHeader } from "../components/property-items-header";
import { usePropertyItems } from "../hooks/use-property-items";
import type { PropertySpaceType } from "../types/property-item";

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function PropertySpacesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string | string[] }>();
  const propertyId = firstParam(params.propertyId);
  const { items, loading, error, reload } = usePropertyItems(propertyId);
  const [selectedKind, setSelectedKind] = useState<PropertySpaceType>("room");
  const [search, setSearch] = useState("");

  const counts: Record<PropertySpaceType, number> = {
    room: items.filter((item) => item.type === "room").length,
    area: items.filter((item) => item.type === "area").length,
    asset: items.filter((item) => item.type === "asset").length,
  };
  const visibleItems = items.filter((item) => {
    const matchesKind = item.type === selectedKind;
    const matchesSearch = `${item.name} ${item.description ?? ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesKind && matchesSearch;
  });
  const kindLabel =
    selectedKind === "room"
      ? "Room"
      : selectedKind === "area"
        ? "Area"
        : "Asset";

  const openAddItem = () => {
    if (!propertyId) return;
    router.push({
      pathname: routes.addPropertyItem,
      params: { propertyId, kind: selectedKind },
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 4 }]}>
      <PropertyItemsHeader
        title="Room Configuration"
        onBack={() => router.back()}
        actionTitle={`Add ${kindLabel}`}
        onAction={openAddItem}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <PropertySpaceTypeTabs
          selected={selectedKind}
          counts={counts}
          onSelect={setSelectedKind}
        />

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={`Search ${selectedKind === "room" ? "rooms" : `${selectedKind}s`}...`}
            placeholderTextColor={colors.textMuted}
            accessibilityLabel={`Search ${selectedKind}s`}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {search ? (
            <Pressable
              onPress={() => setSearch("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.list}>
          {loading ? (
            <View style={styles.state}>
              <ActivityIndicator color={colors.primary} />
              <AppText style={styles.stateText} color={colors.textSecondary}>
                Loading property items...
              </AppText>
            </View>
          ) : error ? (
            <View style={styles.state}>
              <Ionicons
                name="cloud-offline-outline"
                size={26}
                color={colors.secondary}
              />
              <AppText style={styles.stateText} color={colors.textSecondary}>
                {error}
              </AppText>
              <Pressable
                onPress={reload}
                accessibilityRole="button"
                style={styles.retry}
              >
                <AppText style={styles.retryText} color={colors.primary}>
                  Try again
                </AppText>
              </Pressable>
            </View>
          ) : visibleItems.length ? (
            visibleItems.map((item) => (
              <PropertyItemCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.state}>
              <Ionicons
                name={
                  selectedKind === "room"
                    ? "bed-outline"
                    : selectedKind === "area"
                      ? "map-outline"
                      : "cube-outline"
                }
                size={28}
                color={colors.primary}
              />
              <AppText style={styles.emptyTitle} color={colors.textDark}>
                No {selectedKind === "room" ? "rooms" : `${selectedKind}s`}
                found
              </AppText>
              <AppText style={styles.stateText} color={colors.textSecondary}>
                {search
                  ? "Try a different search."
                  : `Add the first ${selectedKind} for this property.`}
              </AppText>
              {!search ? (
                <Pressable
                  onPress={openAddItem}
                  style={styles.emptyAction}
                  accessibilityRole="button"
                >
                  <Ionicons name="add" size={18} color={colors.white} />
                  <AppText style={styles.emptyActionText} color={colors.white}>
                    Add {kindLabel}
                  </AppText>
                </Pressable>
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18 },
  searchBox: {
    minHeight: 44,
    marginTop: 17,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    minHeight: 40,
    color: colors.textDark,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    paddingVertical: 0,
  },
  list: { paddingTop: 2 },
  state: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 22,
  },
  stateText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  emptyTitle: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 21 },
  retry: { paddingHorizontal: 14, paddingVertical: 7 },
  retryText: { fontFamily: fontFamily.semiBold, fontSize: 13 },
  emptyAction: {
    minHeight: 38,
    marginTop: 3,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },
  emptyActionText: { fontFamily: fontFamily.medium, fontSize: 12 },
});
