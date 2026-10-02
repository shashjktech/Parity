import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, layout, radius, spacing } from '@/theme';
import { AppText } from './app-text';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline';
  trailingIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ title, onPress, variant = 'filled', trailingIcon, loading = false, disabled = false, style }: Props) {
  const filled = variant === 'filled';
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        filled ? styles.filled : styles.outline,
        pressed && styles.pressed,
        disabled && !loading && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={filled ? colors.white : colors.primary} />
      ) : (
        <>
          <AppText variant={filled ? 'buttonFilled' : 'buttonOutline'} color={filled ? colors.white : colors.primary}>
            {title}
          </AppText>
          {trailingIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: layout.buttonHeight,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm + 2,
  },
  filled: { backgroundColor: colors.primary },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: layout.buttonBorderWidth,
    borderColor: colors.primary,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
});
