import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { Worker } from '../types/worker';
import { initials } from '../utils/worker-format';

const PALETTES: [string, string][] = [
  ['#DCEBDD', '#145C45'],
  ['#F6E6CF', '#A85D09'],
  ['#DCEAF3', '#14567A'],
  ['#EADFF0', '#5B3E78'],
];

function paletteFor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) % 997;
  return PALETTES[hash % PALETTES.length];
}

export function WorkerAvatar({ worker, showOnline }: { worker: Worker; showOnline: boolean }) {
  const [bg, fg] = paletteFor(worker.workerId);
  return (
    <View style={styles.wrap}>
      <View style={[styles.circle, { backgroundColor: bg }]}>
        <AppText style={styles.initials} color={fg}>{initials(worker)}</AppText>
      </View>
      {showOnline && worker.isOnline ? <View style={styles.dot} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 56, height: 56 },
  circle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 26 },
  dot: {
    position: 'absolute', right: 0, bottom: 2, width: 13, height: 13, borderRadius: 7,
    backgroundColor: '#27B45B', borderWidth: 2, borderColor: colors.background,
  },
});