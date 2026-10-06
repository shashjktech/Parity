import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';

type Props = {
  loading?: boolean;
  title: string;
  message: string;
  onRetry?: () => void;
};

export function WorkerScreenState({ loading = false, title, message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Ionicons name="business-outline" size={34} color={colors.primary} />
      )}
      <AppText style={styles.title} color={colors.primary}>{title}</AppText>
      <AppText style={styles.message} color={colors.textSecondary}>{message}</AppText>
      {!loading && onRetry ? (
        <Pressable onPress={onRetry} style={styles.retry} accessibilityRole="button">
          <AppText style={styles.retryText} color={colors.white}>Try again</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 300, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  title: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 25, textAlign: 'center' },
  message: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  retry: { marginTop: 4, paddingHorizontal: 22, paddingVertical: 10, borderRadius: 22, backgroundColor: colors.primary },
  retryText: { fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
});