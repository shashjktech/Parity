import { View } from 'react-native';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { useResponsive } from '@/hooks/use-responsive';
import { colors } from '@/theme';
import { signupFooterPath } from '../utils/footer-paths';
import { WaveImage } from './wave-image';

export function SignupFooter() {
  const { width } = useResponsive();
  const height = Math.round(width * 0.49);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <WaveImage id="signup" source={images.auth.roomSoft} width={width} height={height} buildPath={signupFooterPath} align="xMinYMax slice" wash />
      <AppText
        variant="script"
        color={colors.primary}
        style={{ position: 'absolute', right: width * 0.08, top: height * 0.3, textAlign: 'right', transform: [{ rotate: '-8deg' }] }}
      >
        {'Better spaces\nstart with you.'}
      </AppText>
      
    </View>
  );
}
