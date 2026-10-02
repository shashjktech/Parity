import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '@/theme';
import { AppText } from './app-text';

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  hasError?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
};

export function OtpInput({ value, onChange, length = 6, hasError, editable = true, autoFocus }: Props) {
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <View>
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length }, (_, i) => (
          <View
            key={i}
            style={[
              styles.box,
              focused && i === activeIndex && styles.boxActive,
              hasError && styles.boxError,
            ]}
          >
            <AppText variant="otpDigit" color={colors.textDark}>
              {value[i] ?? ''}
            </AppText>
          </View>
        ))}
      </View>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        editable={editable}
        autoFocus={autoFocus}
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel="One-time code"
        style={[StyleSheet.absoluteFill, { opacity: 0 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  box: {
    flex: 1,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
  },
  boxActive: { borderColor: colors.primary, borderWidth: 1.5 },
  boxError: { borderColor: colors.error },
});
