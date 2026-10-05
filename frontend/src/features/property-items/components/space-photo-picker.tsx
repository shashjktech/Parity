import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "@/components/ui";
import { colors } from "@/theme";

type Props = {
  photo: ImagePickerAsset | null;
  onChange: (photo: ImagePickerAsset | null) => void;
  disabled?: boolean;
};

export function SpacePhotoPicker({ photo, onChange, disabled }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const choose = async (source: "camera" | "library") => {
    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          `Allow ${source} access to select a photo.`,
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        quality: 0.8,
      };
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets[0]) onChange(result.assets[0]);
    } catch {
      Alert.alert("Photo unavailable", "Could not open the photo source.");
    }
  };

  // Close the sheet first, then open the picker (avoids iOS modal conflicts)
  const pick = (source: "camera" | "library") => {
    setSheetOpen(false);
    setTimeout(() => void choose(source), 350);
  };

  return (
    <View>
      <Pressable
        disabled={disabled}
        onPress={() => setSheetOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={photo ? "Change photo" : "Add photo"}
        style={[styles.box, !photo && styles.boxEmpty, disabled && styles.disabled]}
      >
        {photo ? (
          <>
            <Image source={{ uri: photo.uri }} style={styles.preview} />
            <Pressable
              disabled={disabled}
              onPress={() => onChange(null)}
              hitSlop={8}
              style={styles.removeBtn}
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
            >
              <Ionicons name="close" size={16} color="#fff" />
            </Pressable>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={32} color={colors.primary} />
            <AppText color={colors.primary}>Add photo</AppText>
          </View>
        )}
      </Pressable>

      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSheetOpen(false)}>
          <View style={styles.sheet}>
            <Pressable
              style={styles.option}
              onPress={() => pick("camera")}
              accessibilityRole="button"
            >
              <Ionicons name="camera-outline" size={22} />
              <AppText>Take photo</AppText>
            </Pressable>
            <Pressable
              style={styles.option}
              onPress={() => pick("library")}
              accessibilityRole="button"
            >
              <Ionicons name="images-outline" size={22} />
              <AppText>Upload photo</AppText>
            </Pressable>
            <Pressable
              style={[styles.option, styles.cancel]}
              onPress={() => setSheetOpen(false)}
              accessibilityRole="button"
            >
              <AppText color={colors.primary}>Cancel</AppText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
  },
  boxEmpty: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.inputBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.5 },
  placeholder: { alignItems: "center", gap: 6 },
  preview: { width: "100%", height: "100%" },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 32,
    gap: 8,
  },
  option: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
  },
  cancel: { borderWidth: 0 },
});