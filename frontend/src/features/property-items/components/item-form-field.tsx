import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

type Props = TextInputProps & { label: string; required?: boolean; multiline?: boolean };

export function ItemFormField({ label, required = false, multiline = false, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <AppText style={styles.label} color={colors.textDark}>
        {label}{required ? <AppText color={colors.error}> *</AppText> : null}
      </AppText>
      <TextInput
        {...inputProps}
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.primary}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 17 },
  input: { minHeight: 44, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 11, backgroundColor: colors.white, color: colors.textDark, fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  multiline: { minHeight: 82, textAlignVertical: 'top' },
});