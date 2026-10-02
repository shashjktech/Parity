import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { images } from '@/constants/assets';
import { useResponsive } from '@/hooks/use-responsive';
import { getAspectRatio } from '@/utils/image';

/** Background leaves: top-left and bottom-left. Sits behind everything and ignores touches. */
export function DecorLayer() {
  const { width } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={images.decor.leavesTop}
        resizeMode="contain"
        style={{
          position: 'absolute',
          top: insets.top + 4,
          left: -width * 0.02,
          width: width * 0.3,
          aspectRatio: getAspectRatio(images.decor.leavesTop, 1.1),
        }}
      />
      <Image
        source={images.decor.leavesBottom}
        resizeMode="contain"
        style={{
          position: 'absolute',
          bottom: 0,
          left: -width * 0.02,
          width: width * 0.28,
          aspectRatio: getAspectRatio(images.decor.leavesBottom, 0.85),
        }}
      />
    </View>
  );
}
