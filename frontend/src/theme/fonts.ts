import { Caveat_400Regular } from '@expo-google-fonts/caveat';
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/** Passed to `useFonts` in app/_layout.tsx. Keys must match `fontFamily` values. */
export const fontAssets = {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Caveat_400Regular,
  ...Ionicons.font,
  ...MaterialCommunityIcons.font,
};
