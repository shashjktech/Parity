import { Ionicons } from '@expo/vector-icons';
import {
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { Ref } from 'react';
import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';

type PropertyCodeFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
    inputRef?: Ref<TextInput>;
  error?: string;

};

export function PropertyCodeField({
  value,
  onChangeText,
  error,
  onBlur,
  inputRef,
}: PropertyCodeFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name="business-outline"
          size={28}
          color={colors.primary}
        />

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <AppText
              variant="body"
              color={colors.textDark}
              style={styles.title}
            >
              Property Code
            </AppText>

            <View style={styles.requiredBadge}>
              <AppText
                variant="caption"
                color={colors.primary}
                style={styles.requiredText}
              >
                Required
              </AppText>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="Enter property code"
              autoCapitalize="characters"
              autoCorrect={false}
              style={styles.input}
              onBlur={onBlur}
              ref={inputRef}
            />

            {hasValue && !error && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.accent}
              />
            )}
          </View>

          <AppText
            variant="caption"
            color={error ? colors.error : colors.textSecondary}
            style={styles.helper}
          >
            {error ??
              'Enter the property code provided by your manager or owner to join the property.'}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EEF8ED',
    borderRadius: 18,
    padding: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },

  headerContent: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  title: {
    fontWeight: '600',
  },

  requiredBadge: {
    backgroundColor: '#D5F2D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  requiredText: {
    fontWeight: '600',
  },

  inputWrapper: {
    minHeight: 52,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#B9DCC0',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 0,
  },

  helper: {
    marginTop: 8,
    lineHeight: 18,
  },
});