import { Image, View } from 'react-native';

import { images } from '@/constants/assets';
import { useResponsive } from '@/hooks/use-responsive';
import { colors } from '@/theme';
import { getAspectRatio } from '@/utils/image';
import { verifyFooterPath } from '../utils/footer-paths';
import { WaveImage } from './wave-image';

export function VerifyFooter() {
  const { width } = useResponsive();
  const height = Math.round(width * 0.82);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <WaveImage id="verify" source={images.auth.roomBed} width={width} height={height} buildPath={verifyFooterPath} blur={3} />
      <Image
        source={images.auth.plantBottom}
        resizeMode="contain"
        style={{ position: 'absolute', left: -20, bottom: -70, width: width * 0.38, aspectRatio: getAspectRatio(images.auth.plantBottom, 0.57) }}
      />
      <View style={{ position: 'absolute', right: width * 0.13, top: height * 0.39, transform: [{ rotate: '-6deg' }] }}>

        <View style={{ width: 34, height: 2, marginTop: 4, marginLeft: 40, backgroundColor: colors.secondary }} />
      </View>
    </View>
  );
}
