import { forwardRef, useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';
import { colors, fontFamily } from '@/theme';
import { AppIcon, type IconSpec } from './app-icon';
import { AppText } from './app-text';

type Props = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label: string;
  icon: IconSpec;
  rightIcon?: IconSpec & { onPress?: () => void };
  error?: string;
  /** Rendered between the icon and the text (e.g. country code picker). */
  prefix?: ReactNode;
};

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, icon, rightIcon, error, prefix, onFocus, onBlur, ...inputProps },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : focused ? colors.primary : colors.inputBorder;

  return (
    <View>
      <View style={[styles.box, { borderColor }]}>
        <AppIcon icon={icon} size={24} color={colors.primary} />
        {prefix}
        <View style={styles.textBlock}>
          <AppText variant="fieldLabel" color={colors.textSecondary}>
            {label}
          </AppText>
          <TextInput
            ref={ref}
            {...inputProps}
            accessibilityLabel={label}
            selectionColor={colors.primary}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={styles.input}
          />
        </View>

        {rightIcon && (
          <TouchableOpacity
            onPress={rightIcon.onPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AppIcon icon={rightIcon} size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <AppText variant="error" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 56,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 22,
    backgroundColor: colors.inputBackground,
  },
  textBlock: { flex: 1 },
  input: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 0,
    margin: 0,
    minHeight: 22,
    includeFontPadding: false,
  },
  error: { marginTop: 4, marginLeft: 18 },
});