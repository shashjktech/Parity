import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme';
import { WELCOME_FEATURES } from '../constants/welcome-content';
import { FeatureItem } from './feature-item';

export function FeatureRow() {
  return (
    <View style={styles.row}>
      {WELCOME_FEATURES.map(({ id, ...feature }) => (
        <FeatureItem key={id} {...feature} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginTop: spacing.lg },
});