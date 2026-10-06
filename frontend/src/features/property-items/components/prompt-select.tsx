import { AppText } from "@/components/ui";
import { colors, fontFamily } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import type { Prompt } from "../types/property-prompt-types";
type Props = {
  prompts: Prompt[];
  loading: boolean;
  selectedId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (prompt: Prompt) => void;
  onAddNew: () => void;
};
export function PromptSelect({
  prompts,
  loading,
  selectedId,
  open,
  onOpenChange,
  onSelect,
  onAddNew,
}: Props) {
  const selected = prompts.find((prompt) => prompt.id === selectedId) ?? null;
  const showInfo = () =>
    Alert.alert(
      "Prompt",
      "The prompt guides what to look for in photos when this space is inspected.",
    );
  return (
    <View style={styles.group}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <AppText style={styles.label} color={colors.textDark}>
            Prompt <AppText color={colors.error}>*</AppText>
          </AppText>
          <Pressable
            onPress={showInfo}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="What is a prompt?"
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.textDark}
            />
          </Pressable>
        </View>
        <Pressable
          onPress={onAddNew}
          style={styles.addButton}
          accessibilityRole="button"
          accessibilityLabel="Add new prompt"
        >
          <Ionicons name="add" size={18} color={colors.primary} />
          <AppText style={styles.addText} color={colors.primary}>
            Add New Prompt
          </AppText>
        </Pressable>
      </View>
      <Pressable
        onPress={() => onOpenChange(!open)}
        style={[styles.select, open && styles.selectOpen]}
        accessibilityRole="button"
        accessibilityLabel={`Prompt, ${selected?.name ?? "none selected"}`}
      >
        <Ionicons
          name="document-text-outline"
          size={20}
          color={colors.textDark}
        />
        <AppText
          style={styles.selectText}
          color={selected ? colors.textDark : colors.textSecondary}
          numberOfLines={1}
        >
          {selected?.name ?? "Select a prompt"}
        </AppText>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textDark}
        />
      </Pressable>
      {open ? (
        <View style={styles.dropdown}>
          {loading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
          ) : prompts.length === 0 ? (
            <AppText style={styles.empty} color={colors.textSecondary}>
              No prompts yet. Tap &quot;Add New Prompt&quot; to create one.
            </AppText>
          ) : (
            prompts.map((prompt) => {
              const isSelected = prompt.id === selectedId;
              return (
                <Pressable
                  key={prompt.id}
                  onPress={() => {
                    onSelect(prompt);
                    onOpenChange(false);
                  }}
                  style={[styles.item, isSelected && styles.itemSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={colors.textDark}
                  />
                  <AppText style={styles.itemText} color={colors.textDark}>
                    {prompt.name}
                  </AppText>
                </Pressable>
              );
            })
          )}
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  group: { gap: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  addText: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  select: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  selectOpen: { borderWidth: 1.5 },
  selectText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 19,
  },
  dropdown: {
    padding: 6,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  item: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  itemSelected: { backgroundColor: colors.surface },
  itemText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  loader: { paddingVertical: 14 },
  empty: {
    padding: 12,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 17,
  },
});
