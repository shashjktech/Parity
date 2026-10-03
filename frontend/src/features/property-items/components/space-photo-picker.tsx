import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import type { ImagePickerAsset } from "expo-image-picker";
import { Alert, Image, Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/components/ui";
import { colors } from "@/theme";

type Props = {
  photo: ImagePickerAsset | null;
  onChange: (photo: ImagePickerAsset | null) => void;
  disabled?: boolean;
};

export function SpacePhotoPicker({ photo, onChange, disabled }: Props) {
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

  return (
    <View style={styles.root}>
      {photo && (
        <>
          <Image source={{ uri: photo.uri }} style={styles.preview} />
          <Pressable disabled={disabled} onPress={() => onChange(null)}>
            <AppText color={colors.primary}>Remove photo</AppText>
          </Pressable>
        </>
      )}
      <View style={styles.actions}>
        {(["camera", "library"] as const).map((source) => (
          <Pressable
            key={source}
            disabled={disabled}
            style={styles.button}
            onPress={() => void choose(source)}
            accessibilityRole="button"
          >
            <Ionicons
              name={source === "camera" ? "camera-outline" : "images-outline"}
              size={20}
            />
            <AppText>
              {source === "camera" ? "Take photo" : "Choose photo"}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 8 },
  preview: { width: "100%", height: 180, borderRadius: 12 },
  actions: { flexDirection: "row", gap: 8 },
  button: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 10,
  },
});
