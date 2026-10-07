import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';
import { PropertyPhoto } from '../components/property-photo';
import { InspectionSpaceRow } from '../components/inspection-space-row';
import { useInspectionChecklist } from '../hooks/use-inspection-checklist';
import type { InspectionSpace, InspectionSpaceStatus } from '../types/inspection-types';

const filterOptions: { value: InspectionSpaceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Issues Found' },
  { value: 'failed', label: 'Failed · Retry' },
];

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function groupName(space: InspectionSpace) {
  if (space.type === 'room') {
    return space.location === 'Ground Floor'
      ? 'Floor 1'
      : space.location ?? 'Rooms';
  }
  return space.type === 'area' ? 'Areas' : 'Assets';
}

export function InspectionChecklistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string | string[] }>();
  const propertyId = firstParam(params.propertyId);
  const { checklist, loading, error, retry } = useInspectionChecklist(propertyId);
  const spaces = checklist?.spaces ?? [];
  const [selectedFilter, setSelectedFilter] = useState<InspectionSpaceStatus | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const visibleSpaces = selectedFilter === 'all'
    ? spaces
    : spaces.filter((space) => space.status === selectedFilter);
  const groups = visibleSpaces.reduce<Record<string, InspectionSpace[]>>((result, space) => {
    const name = groupName(space);
    (result[name] ??= []).push(space);
    return result;
  }, {});

  const openSpace = (space: InspectionSpace) => {
    if (!propertyId) return;

    const spaceParams = {
      propertyId,
      spaceId: space.id,
      spaceName: space.name,
      type: space.type,
    };

    if (
      (space.status === 'processing' ||
        space.status === 'completed' ||
        space.status === 'rejected') &&
      space.captureId
    ) {
      router.push({
        pathname: routes.workerInspectionResults,
        params: { ...spaceParams, captureId: space.captureId },
      });
      return;
    }

    router.push({
      pathname: routes.workerInspectionCapture,
      params: spaceParams,
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={25} color={colors.textDark} />
        </Pressable>
        <View style={styles.headerText}>
          <AppText style={styles.headerTitle} color={colors.textDark}>
            Inspection Checklist
          </AppText>
          <AppText style={styles.headerSubtitle} color={colors.textSecondary}>
            {checklist?.property.name ?? 'Property inspection'}
          </AppText>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && !checklist ? (
        <ActivityIndicator style={styles.centerState} color={colors.primary} />
      ) : error && !checklist ? (
        <Pressable onPress={retry} style={styles.centerState}>
          <AppText style={styles.stateText} color={colors.error}>
            {error} Tap to retry.
          </AppText>
        </Pressable>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 22 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.propertyCard}>
            <PropertyPhoto
              imageUrl={
                checklist?.property.imageUrl ??
                require('@/assets/images/decor/room-placeholder.avif')
              }
              style={styles.propertyImage}
            />
            <View style={styles.propertyInfo}>
              <AppText style={styles.propertyName} color={colors.textDark}>
                {checklist?.property.name ?? 'Inspection'}
              </AppText>
              <AppText style={styles.propertyCaption} color={colors.textSecondary}>
                Select a space to inspect
              </AppText>
            </View>
            <Pressable
              style={styles.filterButton}
              onPress={() => setFilterOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Filter inspection spaces"
            >
              <AppText style={styles.filterText} color={colors.textDark}>
                {filterOptions.find((option) => option.value === selectedFilter)?.label ?? 'All'}
              </AppText>
              <Ionicons name="chevron-down" size={16} color={colors.textDark} />
            </Pressable>
          </View>

          {error ? (
            <Pressable onPress={retry} style={styles.errorNotice}>
              <AppText style={styles.errorText} color={colors.error}>
                {error} Tap to retry.
              </AppText>
            </Pressable>
          ) : null}

          {Object.entries(groups).map(([name, groupSpaces]) => (
            <View key={name} style={styles.group}>
              <View style={styles.groupHeading}>
                <AppText style={styles.groupTitle} color={colors.textDark}>
                  {name}
                </AppText>
                <AppText style={styles.groupCount} color={colors.textSecondary}>
                  {groupSpaces.filter((space) => space.status === 'completed' || space.status === 'rejected').length}
                  /{groupSpaces.length}
                </AppText>
              </View>
              {groupSpaces.map((space) => (
                <InspectionSpaceRow
                  key={space.id}
                  space={space}
                  onPress={() => openSpace(space)}
                />
              ))}
            </View>
          ))}

          {!visibleSpaces.length ? (
            <AppText style={styles.stateText} color={colors.textSecondary}>
              {spaces.length
                ? 'No spaces match this status.'
                : 'No inspection spaces are configured for this property.'}
            </AppText>
          ) : null}
        </ScrollView>
      )}
      <Modal
        visible={filterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setFilterOpen(false)}>
          <View style={styles.filterMenu}>
            {filterOptions.map((option) => (
              <Pressable
                key={option.value}
                style={styles.filterOption}
                onPress={() => {
                  setSelectedFilter(option.value);
                  setFilterOpen(false);
                }}
              >
                <AppText
                  style={styles.filterText}
                  color={option.value === selectedFilter ? colors.primary : colors.textDark}
                >
                  {option.label}
                </AppText>
                {option.value === selectedFilter ? (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F7F3' },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E7E5E0',
    backgroundColor: '#FBFAF7',
  },
  backButton: { width: 42, height: 46, justifyContent: 'center' },
  headerText: { flex: 1, alignItems: 'center' },
  headerTitle: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  headerSubtitle: { fontFamily: fontFamily.regular, fontSize: 12 },
  headerSpacer: { width: 42 },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  propertyCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 16,
  },
  propertyImage: { width: 62, height: 62, borderRadius: 10 },
  propertyInfo: { flex: 1, gap: 4 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  propertyCaption: { fontFamily: fontFamily.regular, fontSize: 12 },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  filterText: { fontFamily: fontFamily.medium, fontSize: 12 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 122, paddingRight: 16, backgroundColor: 'rgba(0,0,0,0.18)' },
  filterMenu: { minWidth: 175, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#FFFFFF', elevation: 5 },
  filterOption: { minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E9E8E4' },
  group: { marginBottom: 12 },
  groupHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 3,
  },
  groupTitle: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  groupCount: { fontFamily: fontFamily.regular, fontSize: 12 },
  errorNotice: { marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: '#FCE8E5' },
  errorText: { fontFamily: fontFamily.medium, fontSize: 12, textAlign: 'center' },
  centerState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  stateText: { paddingVertical: 24, textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 14 },
});
