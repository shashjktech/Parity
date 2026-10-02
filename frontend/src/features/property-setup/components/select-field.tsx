import { AppText, TextField } from "@/components/ui";
import { colors, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

type Option = { label: string; value: string };

type Props = {
  label: string;
  iconName: ComponentProps<typeof Ionicons>["name"];
  value: string; // display label, e.g. "West Bengal"
  placeholder?: string;
  options: Option[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

export function SelectField({
  label,
  iconName,
  value,
  placeholder,
  options,
  onSelect,
  disabled,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [options, query],
  );

  return (
    <>
      <Pressable
        onPress={() => !disabled && setVisible(true)}
        disabled={disabled}
      >
        <View pointerEvents="none">
          <TextField
            label={label}
            icon={{ family: "ionicons", name: iconName }}
            value={value}
            placeholder={placeholder}
            editable={false}
          />
        </View>
      </Pressable>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.searchRow}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${label.toLowerCase()}`}
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onSelect(item.value);
                    setQuery("");
                    setVisible(false);
                  }}
                >
                  <AppText>{item.label}</AppText>
                </Pressable>
              )}
              ListEmptyComponent={
                <AppText color={colors.textSecondary} style={styles.empty}>
                  No results
                </AppText>
              }
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    padding: spacing.lg,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 8,
  },
  searchInput: { flex: 1 },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inputBorder,
  },
  empty: { textAlign: "center", marginTop: 20 },
});
