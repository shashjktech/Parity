import { useWindowDimensions } from 'react-native';

const BASE_WIDTH = 390; // design reference width (iPhone 14/15)

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const factor = Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.3);
  /** Scales a 390pt-based size to the current screen. */
  const scale = (size: number) => Math.round(size * factor);
  return { width, height, scale };
}
