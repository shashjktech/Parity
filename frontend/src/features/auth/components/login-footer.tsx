import { View } from 'react-native';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { useResponsive } from '@/hooks/use-responsive';
import { colors } from '@/theme';
import { signupFooterPath } from '../utils/footer-paths';
import { WaveImage } from './wave-image';

export function LoginFooter() {
  const { width } = useResponsive();
  const height = Math.round(width * 0.55);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <WaveImage id="login" source={images.auth.roomSoft} width={width} height={height} buildPath={signupFooterPath} align="xMinYMax slice" wash />
      {/* <Image
        source={images.auth.plantBottom}
        resizeMode="contain"
        style={{ position: 'absolute', left: 0, bottom: 0, width: width * 0.33, aspectRatio: getAspectRatio(images.auth.plantBottom, 0.57) }}
      /> */}
      <View style={{ position: 'absolute', right: width * 0.12, top: height * 0.45, transform: [{ rotate: '-8deg' }] }}>
        <AppText variant="script" color={colors.primary} style={{ textAlign: 'right' }}>
          {'Cleaner\nspaces\nhappier stays.'}
        </AppText>
        <View style={{ width: 34, height: 2, marginTop: 4, marginLeft: 36, backgroundColor: colors.secondary }} />
      </View>
    </View>
  );
}
