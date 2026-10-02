import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, spacing } from '@/theme';
import { COUNTRIES, getCountry } from '../constants/countries';

type Props = { value: string; onChange: (iso: string) => void };

export function CountryCodePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const country = getCountry(value);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.trigger} accessibilityRole="button" accessibilityLabel={`Country code ${country.dial}`}>
        <AppText variant="fieldValue" color={colors.textDark}>{country.dial}</AppText>
        <Feather name="chevron-down" size={16} color={colors.textDark} />
      </Pressable>
      <View style={styles.divider} />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <AppText variant="title" style={styles.sheetTitle}>Select country</AppText>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(c) => c.iso}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.row}
                  onPress={() => {
                    onChange(item.iso);
                    setOpen(false);
                  }}
                >
                  <AppText variant="fieldValue" color={colors.textDark} style={{ flex: 1 }}>{item.name}</AppText>
                  <AppText variant="fieldValue" color={colors.textSecondary}>{item.dial}</AppText>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  divider: { width: 1, height: 30, backgroundColor: colors.inputBorder },
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: { maxHeight: '60%', backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: spacing.xl },
  sheetTitle: { padding: spacing.lg },
  row: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md + 2 },
});
