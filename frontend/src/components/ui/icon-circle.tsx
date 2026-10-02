import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { AppIcon, type IconSpec } from './app-icon';

type Props = {
  size: number;
  backgroundColor: string;
  icon: IconSpec;
  iconColor: string;
  /** Icon size as a fraction of the circle (default 0.5). */
  iconScale?: number;
};

/** A filled circle with an icon centered inside. */
export function IconCircle({ size, backgroundColor, icon, iconColor, iconScale = 0.5 }: Props) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={backgroundColor} />
      </Svg>
      <AppIcon icon={icon} size={Math.round(size * iconScale)} color={iconColor} />
    </View>
  );
}