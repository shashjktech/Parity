import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, fontFamily } from '@/theme';

type Props = { value: string; onChangeText: (value: string) => void };

export function WorkerSearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.box}>
      <Ionicons name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search workers..."
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel="Search workers"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 16, height: 48, borderRadius: 16, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#EEEFE8',
  },
  input: {
    flex: 1, fontFamily: fontFamily.regular, fontSize: 14.5, color: colors.textDark,
    paddingVertical: 0, includeFontPadding: false,
  },
});