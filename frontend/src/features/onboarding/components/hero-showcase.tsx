import { useState } from "react";

import { Image, StyleSheet, View, type LayoutChangeEvent } from "react-native";

import Svg, { ClipPath, Defs, Path, Image as SvgImage } from "react-native-svg";

import { images } from "@/constants/assets";
import { useResponsive } from "@/hooks/use-responsive";
import { getAspectRatio, toSvgHref } from "@/utils/image";

import { buildHeroClipPath } from "../utils/hero-clip-path";

const HERO_HEIGHT_RATIO = 0.82;

const LEAVES_WIDTH_RATIO = 0.2;
const LEAVES_LEFT_RATIO = -0.13;

export function HeroShowcase() {
  const { width } = useResponsive();

  const [size, setSize] = useState({
    w: 0,
    h: 0,
  });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: layoutWidth, height: layoutHeight } = e.nativeEvent.layout;

    setSize((prev) => {
      if (prev.w === layoutWidth && prev.h === layoutHeight) {
        return prev;
      }

      return {
        w: layoutWidth,
        h: layoutHeight,
      };
    });
  };

  const { w, h } = size;

  const leavesAspect = getAspectRatio(images.decor.leavesTop, 1.1);

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height: width * HERO_HEIGHT_RATIO,
        },
      ]}
      onLayout={onLayout}
    >
      {w > 0 && h > 0 && (
        <>
          {/* ============================== */}
          {/* BACKGROUND HERO                  */}
          {/* ============================== */}

          <View style={styles.heroBackground} pointerEvents="none">
            <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
              <Defs>
                <ClipPath id="heroClip">
                  <Path d={buildHeroClipPath(w, h)} />
                </ClipPath>
              </Defs>

              <SvgImage
                href={toSvgHref(images.onboarding.heroRoom)}
                x={0}
                y={0}
                width={w}
                height={h}
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#heroClip)"
              />
            </Svg>
          </View>

          {/* ============================== */}
          {/* FOREGROUND ELEMENTS              */}
          {/* ============================== */}

          <View style={styles.foreground} pointerEvents="none">
            {/* Leaves */}
            <Image
              source={images.decor.leavesTop}
              resizeMode="contain"
              style={{
                position: "absolute",
                left: w * LEAVES_LEFT_RATIO,
                bottom: 0,
                width: w * LEAVES_WIDTH_RATIO,
                aspectRatio: leavesAspect,
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    position: "relative",
    overflow: "hidden",
  },

  heroBackground: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },

  foreground: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    elevation: 10,
  },
});
