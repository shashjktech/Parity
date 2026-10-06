import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import type { Worker } from '../types/worker';
import { formatDay, fullName } from '../utils/worker-format';
import { WorkerAvatar } from './worker-avatar';

type Props = {
  worker: Worker;
  busy: boolean;
  last: boolean;
  onMenu: (worker: Worker) => void;
  onApprove: (worker: Worker) => void;
  onReject: (worker: Worker) => void;
};

export function WorkerRow({ worker, busy, last, onMenu, onApprove, onReject }: Props) {
  const pending = worker.status === 'PENDING';
  return (
    <View style={[styles.row, !last && styles.border]}>
      <WorkerAvatar worker={worker} showOnline={!pending} />
      <View style={styles.copy}>
        <AppText style={styles.name} color={colors.textDark} numberOfLines={1}>{fullName(worker)}</AppText>
        <AppText style={styles.role} color={colors.textSecondary} numberOfLines={1}>
          {worker.job_title || 'Worker'}
        </AppText>
        <AppText style={styles.joined} color="#7B8780" numberOfLines={1}>
          {pending ? 'Requested' : 'Joined'} {formatDay(worker.createdAt)}
        </AppText>
      </View>

      {busy ? (
        <ActivityIndicator color={colors.primary} style={styles.busy} />
      ) : pending ? (
        <View style={styles.decisions}>
          <Pressable
            onPress={() => onReject(worker)}
            style={[styles.decision, styles.reject]}
            accessibilityRole="button"
            accessibilityLabel={`Reject ${fullName(worker)}`}
          >
            <Ionicons name="close" size={20} color={colors.error} />
          </Pressable>
          <Pressable
            onPress={() => onApprove(worker)}
            style={[styles.decision, styles.approve]}
            accessibilityRole="button"
            accessibilityLabel={`Approve ${fullName(worker)}`}
          >
            <Ionicons name="checkmark" size={20} color={colors.white} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => onMenu(worker)}
          hitSlop={8}
          style={styles.menu}
          accessibilityRole="button"
          accessibilityLabel={`Options for ${fullName(worker)}`}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.textDark} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 14 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#DDE1D8' },
  copy: { flex: 1, minWidth: 0 },
  name: { fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  role: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },
  joined: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 19 },
  menu: { width: 36, height: 40, alignItems: 'center', justifyContent: 'center' },
  busy: { width: 36 },
  decisions: { flexDirection: 'row', gap: 8 },
  decision: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  reject: { borderWidth: 1, borderColor: '#E7C9C6', backgroundColor: '#FFF6F5' },
  approve: { backgroundColor: colors.primary },
});