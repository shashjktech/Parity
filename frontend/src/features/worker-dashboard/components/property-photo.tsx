import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useState } from "react";

import { colors } from "@/theme";

type Props = {
  imageUrl: ImageSourcePropType | string | null;
  style: StyleProp<ViewStyle>;
};

export function PropertyPhoto({ imageUrl, style }: Props) {
  const [failed, setFailed] = useState(false);
  const imageSource = typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;

  return (
    <View style={[styles.photo, style]}>
      {imageUrl && !failed ? (
        <Image
          source={imageSource}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onError={() => setFailed(true)}
          accessibilityLabel="Property"
        />
      ) : (
        <Ionicons name="image-outline" size={34} color={colors.textMuted} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
