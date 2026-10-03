import { Ionicons } from "@expo/vector-icons";
import type { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "@/components/ui";
import { AddPromptSheet } from "@/features/property-items/components/add-prompt-sheet";
import { PromptSelect } from "@/features/property-items/components/prompt-select";
import { usePrompts } from "@/features/property-items/hooks/use-prompt";
import { toApiError } from "@/services/http/api-error";
import { colors, fontFamily } from "@/theme";
import { createPropertyItem } from "../api/property-item-api";
import { ItemFormField } from "../components/item-form-field";
import { PropertyItemsHeader } from "../components/property-items-header";
import { SpacePhotoPicker } from "../components/space-photo-picker";
import type { PropertySpaceType } from "../types/property-item";

const kinds: {
  value: PropertySpaceType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: "room", title: "Room", icon: "bed-outline" },
  { value: "area", title: "Area", icon: "grid-outline" },
  { value: "asset", title: "Asset", icon: "cube-outline" },
];

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function validKind(value?: string): value is PropertySpaceType {
  return value === "room" || value === "area" || value === "asset";
}

export function AddPropertyItemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    propertyId?: string | string[];
    kind?: string | string[];
  }>();
  const propertyId = firstParam(params.propertyId);
  const requestedKind = firstParam(params.kind);

  const [kind, setKind] = useState<PropertySpaceType>(
    validKind(requestedKind) ? requestedKind : "room",
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prompt feature
  const {
    prompts,
    loading: promptsLoading,
    addPrompt,
  } = usePrompts(propertyId);
  const [promptId, setPromptId] = useState<string | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptSheetVisible, setPromptSheetVisible] = useState(false);

  const selectedKind =
    kinds.find((option) => option.value === kind) ?? kinds[0];

  const save = async () => {
    if (!propertyId) {
      Alert.alert(
        "Property unavailable",
        "Go back and open configuration from a property.",
      );
      return;
    }
    if (!name.trim()) {
      Alert.alert("Name required", "Enter a name to continue.");
      return;
    }
    if (!promptId) {
      Alert.alert("Prompt required", "Select a prompt to continue.");
      return;
    }
    setSaving(true);
    const photoExtension =
      photo?.mimeType?.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
    try {
      await createPropertyItem(
        propertyId,
        {
          type: kind,
          name: name.trim(),
          description: description.trim() || null,
          promptId,
        },
        photo
          ? {
              uri: photo.uri,
              name: photo.fileName ?? `space-photo-${Date.now()}.${photoExtension}`,
              type: photo.mimeType ?? "image/jpeg",
              size: photo.fileSize,
              file: photo.file,
            }
          : null,
      );
      router.back();
    } catch (error) {
      Alert.alert(
        `Could not add ${selectedKind.title.toLowerCase()}`,
        toApiError(error).message,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <View style={{ paddingTop: insets.top + 4 }}>
        <PropertyItemsHeader title="Add Space" onBack={() => router.back()} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SpacePhotoPicker photo={photo} onChange={setPhoto} disabled={saving} />

        {/* Name */}
        <ItemFormField
          label="Name"
          required
          value={name}
          onChangeText={setName}
          editable={!saving}
          placeholder="e.g. Indoor Seating, Table 1, Kitchen, Reception"
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* Type */}
        <View style={styles.group}>
          <AppText style={styles.label} color={colors.textDark}>
            Type <AppText color={colors.error}>*</AppText>
          </AppText>
          <Pressable
            disabled={saving}
            onPress={() => {
              setTypeOpen((open) => !open);
              setPromptOpen(false);
            }}
            style={[styles.select, typeOpen && styles.selectOpen]}
            accessibilityRole="button"
            accessibilityLabel={`Type, ${selectedKind.title}`}
          >
            <Ionicons
              name={selectedKind.icon}
              size={20}
              color={colors.textDark}
            />
            <AppText style={styles.selectText} color={colors.textDark}>
              {selectedKind.title}
            </AppText>
            <Ionicons
              name={typeOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.textDark}
            />
          </Pressable>

          {typeOpen ? (
            <View style={styles.dropdown}>
              {kinds.map((option) => {
                const selected = option.value === kind;
                return (
                  <Pressable
                    key={option.value}
                    disabled={saving}
                    onPress={() => {
                      setKind(option.value);
                      setTypeOpen(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      selected && styles.dropdownItemSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={colors.textDark}
                    />
                    <AppText
                      style={styles.dropdownText}
                      color={colors.textDark}
                    >
                      {option.title}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* Description */}
        <ItemFormField
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          editable={!saving}
          placeholder={
            "Add any additional details about this space\n(e.g. special features, seating arrangement)"
          }
          multiline
        />

        {/* Prompt */}
        <View pointerEvents={saving ? "none" : "auto"}>
          <PromptSelect
            prompts={prompts}
            loading={promptsLoading}
            selectedId={promptId}
            open={promptOpen}
            onOpenChange={(open) => {
              setPromptOpen(open);
              if (open) setTypeOpen(false);
            }}
            onSelect={(prompt) => setPromptId(prompt.id)}
            onAddNew={() => {
              setPromptOpen(false);
              setTypeOpen(false);
              setPromptSheetVisible(true);
            }}
          />
        </View>

        {/* Save */}
        <Pressable
          onPress={save}
          disabled={saving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && !saving && styles.pressed,
            saving && styles.saving,
          ]}
          accessibilityRole="button"
          accessibilityState={{ disabled: saving, busy: saving }}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <AppText style={styles.saveText} color={colors.white}>
              Save Space
            </AppText>
          )}
        </Pressable>
      </ScrollView>

      <AddPromptSheet
        visible={promptSheetVisible}
        propertyId={propertyId}
        onClose={() => setPromptSheetVisible(false)}
        onCreated={(prompt) => {
          addPrompt(prompt);
          setPromptId(prompt.id); // auto-select the newly created prompt
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { gap: 16, paddingHorizontal: 18, paddingTop: 10 },
  group: { gap: 8 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },

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
  dropdownItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  dropdownItemSelected: { backgroundColor: colors.surface },
  dropdownText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 19,
  },

  saveButton: {
    minHeight: 52,
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: colors.primary,
  },
  saveText: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  pressed: { opacity: 0.86 },
  saving: { opacity: 0.75 },
});
