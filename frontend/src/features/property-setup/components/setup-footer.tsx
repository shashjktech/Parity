import { View } from "react-native";

import { AppText } from "@/components/ui";
import { images } from "@/constants/assets";
import { useResponsive } from "@/hooks/use-responsive";
import { colors } from "@/theme";
import { WaveImage } from "../../auth/components/wave-image";
import { setupFooterPath } from "../utils/footer-paths";

export function SetupFooter({
  text = "Same care.\nA cleaner tomorrow.",
}: {
  text?: string;
}) {
  const { width } = useResponsive();
  const height = Math.round(width * 0.96);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <WaveImage
        id="setup"
        source={images.auth.roomSoft}
        width={width}
        height={height}
        buildPath={setupFooterPath}
        align="xMinYMax slice"
        wash
      />
      <View
        style={{
          position: "absolute",
          right: width * 0.1,
          top: height * 0.52,
          transform: [{ rotate: "-7deg" }],
        }}
      >
        <AppText
          variant="script"
          color={colors.primary}
          style={{ textAlign: "right" }}
        >
          {text}
        </AppText>
        <View
          style={{
            width: 34,
            height: 2,
            marginTop: 4,
            marginLeft: 36,
            backgroundColor: colors.secondary,
          }}
        />
      </View>
    </View>
  );
}
