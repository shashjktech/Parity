import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import { JoinCodeCard } from '../components/join-code-card';
import { ManageWorkersHeader } from '../components/manage-workers-header';
import { WorkerRow } from '../components/worker-row';
import { WorkerSearchBar } from '../components/worker-search-bar';
import { WorkerTabs } from '../components/worker-tabs';
import { usePropertyWorkers } from '../hooks/use-property-workers';
import type { Worker, WorkerStatus } from '../types/worker';
import { fullName } from '../utils/worker-format';

export function ManageWorkersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string | string[] }>();
  const propertyId = Array.isArray(params.propertyId) ? params.propertyId[0] : params.propertyId;

  const { workers, loading, error, busyUserId, reload, approve, reject, remove } =
    usePropertyWorkers(propertyId);

  const [tab, setTab] = useState<WorkerStatus>('ACTIVE');
  const [query, setQuery] = useState('');

  const active = useMemo(() => workers.filter((w) => w.status === 'ACTIVE'), [workers]);
  const pending = useMemo(() => workers.filter((w) => w.status === 'PENDING'), [workers]);
  const visible = useMemo(() => {
    const source = tab === 'ACTIVE' ? active : pending;
    const q = query.trim().toLowerCase();
    if (!q) return source;
    return source.filter((w) => `${fullName(w)}`.toLowerCase().includes(q));
  }, [tab, active, pending, query]);

  const share = async (message: string) => {
    try {
      await Share.share({ message });
    } catch {
      /* dismissed or unsupported on this platform */
    }
  };
  const codeMessage = `Join my property on Parity. Sign up as a Worker and enter this property code: ${propertyId}`;

  const fail = (message: string | null) => {
    if (message) Alert.alert('Something went wrong', message);
  };

  const confirmReject = (w: Worker) =>
    Alert.alert('Reject request?', `${fullName(w)} will be removed and will need to sign up again.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: async () => fail(await reject(w.workerId)) },
    ]);

  const confirmRemove = (w: Worker) =>
    Alert.alert('Remove worker?', `${fullName(w)} will lose access to this property.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => fail(await remove(w.workerId)) },
    ]);

  const openMenu = (w: Worker) =>
    Alert.alert(fullName(w), undefined, [
      { text: 'Remove from property', style: 'destructive', onPress: () => confirmRemove(w) },
      { text: 'Cancel', style: 'cancel' },
    ]);


  const renderBody = () => {
    if (loading) {
      return (
        <View style={styles.state}>
          <ActivityIndicator color={colors.primary} />
          <AppText style={styles.stateText} color={colors.textSecondary}>Loading workers...</AppText>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.state}>
          <Ionicons name="alert-circle-outline" size={30} color={colors.secondary} />
          <AppText style={styles.stateText} color={colors.textSecondary}>{error}</AppText>
          <Pressable onPress={reload} accessibilityRole="button" style={styles.retry}>
            <AppText style={styles.retryText} color={colors.primary}>Try again</AppText>
          </Pressable>
        </View>
      );
    }
    if (visible.length === 0) {
      const searching = query.trim().length > 0;
      return (
        <View style={styles.state}>
          <Ionicons name="people-outline" size={30} color={colors.textMuted} />
          <AppText style={styles.stateText} color={colors.textSecondary}>
            {searching
              ? 'No workers match your search.'
              : tab === 'ACTIVE'
                ? 'No active workers yet.\nShare the join code above to add your team.'
                : 'No pending requests.'}
          </AppText>
        </View>
      );
    }
    return visible.map((w, index) => (
      <WorkerRow
        key={w.workerId}
        worker={w}
        busy={busyUserId === w.workerId}
        last={index === visible.length - 1}
        onMenu={openMenu}
        onApprove={async (item) => fail(await approve(item.workerId))}
        onReject={confirmReject}
      />
    ));
  };

  return (
    <View style={styles.root}>
      <View style={{ paddingTop: insets.top + 4 }}>
        <ManageWorkersHeader onBack={() => router.back()} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 110 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {propertyId ? <JoinCodeCard code={propertyId} onShare={() => share(propertyId)} /> : null}
        <WorkerTabs
          tab={tab}
          onChange={setTab}
          activeCount={active.length}
          pendingCount={pending.length}
          showCounts={!loading && !error}
        />
        <WorkerSearchBar value={query} onChangeText={setQuery} />
        <View style={styles.list}>{renderBody()}</View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <Pressable
          onPress={() => propertyId && share(codeMessage)}
          style={({ pressed }) => [styles.invite, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Invite worker"
        >
          <Ionicons name="add" size={26} color={colors.white} />
          <AppText style={styles.inviteText} color={colors.white}>Invite Worker</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingTop: 4 },
  list: { marginTop: 6 },
  state: { minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  retry: { paddingHorizontal: 16, paddingVertical: 9 },
  retryText: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 10, paddingHorizontal: 20, backgroundColor: 'rgba(251,250,245,0.96)' },
  invite: {
    height: 58, borderRadius: 18, backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  inviteText: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 22 },
  pressed: { opacity: 0.85 },
});