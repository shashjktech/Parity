import { Asset } from 'expo-asset';
import { Platform, type ImageSourcePropType } from 'react-native';

/**
 * width / height of a bundled image. Uses expo-asset because
 * `Image.resolveAssetSource` does not exist on web (react-native-web).
 */
export function getAspectRatio(source: ImageSourcePropType, fallback = 1): number {
  if (typeof source === 'number') {
    const { width, height } = Asset.fromModule(source);
    if (width && height) return width / height;
  } else if (source && !Array.isArray(source) && source.width && source.height) {
    return source.width / source.height;
  }
  return fallback;
}

/**
 * `href` for react-native-svg <Image>. Native accepts the require() module directly;
 * on web it needs a plain { uri }.
 */
export function toSvgHref(source: ImageSourcePropType): ImageSourcePropType {
  if (Platform.OS === 'web' && typeof source === 'number') {
    return { uri: Asset.fromModule(source).uri };
  }
  return source;
}
