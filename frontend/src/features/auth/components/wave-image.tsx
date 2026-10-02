import { StyleSheet, type ImageSourcePropType } from 'react-native';
import Svg, {
  ClipPath, Defs, FeGaussianBlur, Filter, LinearGradient, Path, Rect, Stop, Image as SvgImage,
} from 'react-native-svg';

import { colors } from '@/theme';
import { toSvgHref } from '@/utils/image';

type Props = {
  id: string;
  source: ImageSourcePropType;
  width: number;
  height: number;
  buildPath: (w: number, h: number) => string;
  align?: string;
  wash?: boolean;
  /** Gaussian blur radius applied only to this image. Omit or 0 = no blur. */
  blur?: number;
};

export function WaveImage({ id, source, width, height, buildPath, align = 'xMidYMid slice', wash, blur }: Props) {
  const clip = `url(#${id}-clip)`;
  const filter = blur ? `url(#${id}-blur)` : undefined;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Defs>
        <ClipPath id={`${id}-clip`}>
          <Path d={buildPath(width, height)} />
        </ClipPath>

        {blur ? (
          <Filter id={`${id}-blur`} x="-25%" y="-25%" width="150%" height="150%">
            <FeGaussianBlur in="SourceGraphic" stdDeviation={blur} />
          </Filter>
        ) : null}

        <LinearGradient id={`${id}-wash`} x1="0.35" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={colors.background} stopOpacity="0" />
          <Stop offset="1" stopColor={colors.background} stopOpacity="0.75" />
        </LinearGradient>
      </Defs>

      <SvgImage
        href={toSvgHref(source)}
        x={0} y={0} width={width} height={height}
        preserveAspectRatio={align}
        clipPath={clip}
        filter={filter}
      />

      {wash ? <Rect x={0} y={0} width={width} height={height} fill={`url(#${id}-wash)`} clipPath={clip} /> : null}
    </Svg>
  );
}