import { Ionicons } from "@expo/vector-icons";
import { Image, type ImageSource } from "expo-image";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useEffect, useState } from "react";

import { env } from "@/config/env";
import { tokenStorage } from "@/services/storage/token-storage";
import { colors } from "@/theme";

type Props = {
  imageUrl: ImageSource | string | number | null;
  style: StyleProp<ViewStyle>;
};

export function PropertyPhoto({ imageUrl, style }: Props) {
  const [imageState, setImageState] = useState({ imageUrl, failed: false });
  const [tokenState, setTokenState] = useState<{
    imageUrl: string;
    accessToken: string | null;
  } | null>(null);

  useEffect(() => {
    if (typeof imageUrl !== "string") {
      return;
    }

    let active = true;
    tokenStorage
      .getAccessToken()
      .then((token) => {
        if (active) setTokenState({ imageUrl, accessToken: token });
      })
      .catch((error: unknown) => {
        console.error("[PropertyPhoto] Failed to load image authorization token", error);
        if (active) setTokenState({ imageUrl, accessToken: null });
      });

    return () => {
      active = false;
    };
  }, [imageUrl]);

  const failed = imageState.imageUrl === imageUrl && imageState.failed;
  const tokenLoaded =
    typeof imageUrl !== "string" || tokenState?.imageUrl === imageUrl;
  const accessToken =
    typeof imageUrl === "string" && tokenState?.imageUrl === imageUrl
      ? tokenState.accessToken
      : null;

  const imageSource: ImageSource | string | number | undefined =
    typeof imageUrl === "string"
      ? {
          uri: /^https?:\/\//i.test(imageUrl)
            ? imageUrl
            : `${env.apiUrl.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`,
          ...(accessToken
            ? { headers: { Authorization: `Bearer ${accessToken}` } }
            : {}),
        }
      : imageUrl ?? undefined;

  return (
    <View style={[styles.photo, style]}>
      {imageUrl && !failed && tokenLoaded ? (
        <Image
          source={imageSource}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          onError={() => setImageState({ imageUrl, failed: true })}
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
