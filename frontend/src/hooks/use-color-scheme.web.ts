import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web static rendering falls back to a light theme until the client has the runtime color-scheme.
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  return colorScheme ?? 'light';
}
