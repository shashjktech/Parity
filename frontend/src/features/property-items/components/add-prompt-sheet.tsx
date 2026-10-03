import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/components/ui";
import { colors, fontFamily } from "@/theme";
import { toApiError } from "@/services/http/api-error";
import { createPrompt } from "../api/prompt-api";
import type { Prompt } from "../types/property-prompt-types";
type Props = {
  visible: boolean;
  propertyId?: string;
  onClose: () => void;
  onCreated: (prompt: Prompt) => void;
};
export function AddPromptSheet({
  visible,
  propertyId,
  onClose,
  onCreated,
}: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);
  const close = () => {
    if (saving) return;
    setName("");
    setInstructions("");
    onClose();
  };
  const save = async () => {
    if (!propertyId) {
      Alert.alert(
        "Property unavailable",
        "Go back and open configuration from a property.",
      );
      return;
    }
    if (!name.trim()) {
      Alert.alert("Prompt name required", "Enter a name to continue.");
      return;
    }
    if (!instructions.trim()) {
      Alert.alert(
        "Instructions required",
        "Enter the prompt instructions to continue.",
      );
      return;
    }
    setSaving(true);
    try {
      const created = await createPrompt(propertyId, {
        name: name.trim(),
        promptText: instructions.trim(),
      });
      onCreated(created);
      setName("");
      setInstructions("");
      onClose();
    } catch (error) {
      Alert.alert("Could not save prompt", toApiError(error).message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={close}
    >
      
      <KeyboardAvoidingView style={styles.root} behavior="padding">
        
        <Pressable
          style={styles.backdrop}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel="Close add prompt"
        />
        <View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 18) }]}
        >
          
          <View style={styles.handle} />
          <Pressable
            onPress={close}
            style={styles.closeButton}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            
            <Ionicons name="close" size={22} color={colors.textDark} />
          </Pressable>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            
            <View style={styles.titleRow}>
              
              <View style={styles.iconCircle}>
                
                <Ionicons
                  name="document-text-outline"
                  size={26}
                  color={colors.primary}
                />
              </View>
              <View style={styles.titleText}>
                
                <AppText style={styles.title} color={colors.textDark}>
                  Add New Prompt
                </AppText>
                <AppText style={styles.subtitle} color={colors.textSecondary}>
                  Create a custom prompt for this space.
                </AppText>
              </View>
            </View>
            <View style={styles.group}>
              
              <AppText style={styles.label} color={colors.textDark}>
                Prompt Name <AppText color={colors.error}>*</AppText>
              </AppText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Dining Area Inspection"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                returnKeyType="next"
                style={styles.input}
              />
            </View>
            <View style={styles.group}>
              
              <AppText style={styles.label} color={colors.textDark}>
                Prompt Instructions <AppText color={colors.error}>*</AppText>
              </AppText>
              <TextInput
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Enter the prompt instructions here..."
                placeholderTextColor={colors.textSecondary}
                multiline
                textAlignVertical="top"
                style={[styles.input, styles.textarea]}
              />
              <AppText style={styles.helper} color={colors.textSecondary}>
                
                This prompt will be used during inspections to guide what to
                look for in photos.
              </AppText>
            </View>
            <View style={styles.actions}>
              
              <Pressable
                onPress={close}
                disabled={saving}
                style={[styles.button, styles.cancelButton]}
                accessibilityRole="button"
              >
                
                <AppText style={styles.buttonText} color={colors.textDark}>
                  Cancel
                </AppText>
              </Pressable>
              <Pressable
                onPress={save}
                disabled={saving}
                style={({ pressed }) => [
                  styles.button,
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
                  <AppText style={styles.buttonText} color={colors.white}>
                    Save Prompt
                  </AppText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(20,26,23,0.45)",
  },
  sheet: {
    maxHeight: "92%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.background,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    marginTop: 8,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  closeButton: { position: "absolute", top: 16, right: 18, zIndex: 2 },
  body: { gap: 18, paddingHorizontal: 18, paddingTop: 34, paddingBottom: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconCircle: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: colors.surface,
  },
  titleText: { flex: 1, gap: 3 },
  title: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 24 },
  subtitle: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  group: { gap: 8 },
  label: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
  input: {
    minHeight: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 11,
    backgroundColor: colors.white,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.textDark,
  },
  textarea: { minHeight: 130, paddingTop: 12 },
  helper: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 17 },
  actions: { flexDirection: "row", gap: 12, marginTop: 6 },
  button: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  saveButton: { backgroundColor: colors.primary },
  buttonText: { fontFamily: fontFamily.semiBold, fontSize: 15, lineHeight: 20 },
  pressed: { opacity: 0.86 },
  saving: { opacity: 0.75 },
});
