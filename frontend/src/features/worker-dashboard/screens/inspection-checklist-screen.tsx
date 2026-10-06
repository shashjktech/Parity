import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui';
import { routes } from '@/constants/routes';
import { colors, fontFamily } from '@/theme';
import { InspectionSpaceRow } from '../components/inspection-space-row';
import { useInspectionChecklist } from '../hooks/use-inspection-checklist';
import type {
  InspectionFilter,
  InspectionSpaceType,
} from '../types/inspection-types';

const tabs: InspectionSpaceType[] = ['room', 'area', 'assets'];
const filters: InspectionFilter[] = [
  'all',
  'pending',
  'processing',
  'completed',
  'rejected',
  'not_configured',
];

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function titleCase(value: string) {
  return value[0].toUpperCase() + value.slice(1);
}

export function InspectionChecklistScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ propertyId?: string | string[] }>();
  const propertyId = firstParam(params.propertyId);
  const { checklist, loading, error, retry } = useInspectionChecklist(propertyId);

  const [selectedType, setSelectedType] = useState<InspectionSpaceType>('room');
  const [selectedFilter, setSelectedFilter] = useState<InspectionFilter>('all');
  const [search, setSearch] = useState('');

  const spaces = checklist?.spaces ?? [];
  const selectedSpaces = spaces.filter((space) => space.type === selectedType);
  const captured = spaces.filter(
    (space) => space.status !== 'pending' && space.status !== 'not_configured',
  ).length;
  const percent = spaces.length ? Math.round((captured / spaces.length) * 100) : 0;

  const countForFilter = (filter: InspectionFilter) =>
    filter === 'all'
      ? selectedSpaces.length
      : selectedSpaces.filter((space) => space.status === filter).length;

  const visibleSpaces = selectedSpaces.filter((space) => {
    const matchesFilter = selectedFilter === 'all' || space.status === selectedFilter;
    const matchesSearch = `${space.name} ${space.location ?? ''}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const openSpace = (spaceId: string, spaceName: string, type: InspectionSpaceType) => {
    if (!propertyId) return;

    router.push({
      pathname: routes.workerInspectionCapture,
      params: { propertyId, spaceId, spaceName, type },
    });
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 6 }]}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={25} color={colors.textDark} />
        </Pressable>

        {checklist ? (
          <>
            <View style={styles.propertyHeader}>
              <View style={styles.propertyImage} />
              <View style={styles.propertyInfo}>
                <AppText style={styles.propertyName} color={colors.textDark}>
                  {checklist.property.name}
                </AppText>
                {/* <AppText style={styles.scheduleName} color={colors.textSecondary}>
                  {checklist.schedule?.name ?? 'No inspection scheduled'}
                </AppText>
                {checklist.schedule ? (
                  <AppText style={styles.scheduleTime} color={colors.textSecondary}>
                    {checklist.schedule.startTime} - {checklist.schedule.endTime}
                  </AppText>
                ) : null}
                {checklist.schedule?.activeNow ? (
                  <View style={styles.activePill}>
                    <Ionicons name="play" size={12} color="#07855B" />
                    <AppText style={styles.activeText} color="#07855B">Active Now</AppText>
                  </View>
                ) : null} */}
              </View>
            </View>

            <View style={styles.notice}>
              <Ionicons name="information-circle-outline" size={25} color={colors.primary} />
              <AppText style={styles.noticeText} color={colors.textSecondary}>
                Take photos of all rooms, areas and assets in this property. Please complete all items before submitting.
              </AppText>
            </View>

            <View style={styles.progressHeading}>
              <AppText style={styles.sectionTitle} color={colors.textDark}>Progress</AppText>
              <AppText style={styles.progressText} color={colors.textSecondary}>
                {captured} / {spaces.length} photos captured
              </AppText>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percent}%` }]} />
              </View>
              <AppText style={styles.percent} color={colors.primary}>{percent}%</AppText>
            </View>

            <View style={styles.tabs}>
              {tabs.map((type) => {
                const count = spaces.filter((space) => space.type === type).length;
                const selected = selectedType === type;

                return (
                  <Pressable
                    key={type}
                    onPress={() => {
                      setSelectedType(type);
                      setSelectedFilter('all');
                      setSearch('');
                    }}
                    style={[styles.tab, selected && styles.selectedTab]}
                  >
                    <AppText style={styles.tabText} color={selected ? colors.primary : colors.textSecondary}>
                      {type === 'assets' ? 'Assets' : `${titleCase(type)}s`} ({count})
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.searchBox}>
              <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={`Search ${selectedType === 'assets' ? 'assets' : `${selectedType}s`}...`}
                placeholderTextColor={colors.textSecondary}
                style={styles.searchInput}
                returnKeyType="search"
              />
              {search ? (
                <Pressable onPress={() => setSearch('')} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {filters.map((filter) => (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[styles.filter, selectedFilter === filter && styles.selectedFilter]}
                >
                  <AppText
                    style={styles.filterText}
                    color={selectedFilter === filter ? colors.white : colors.textSecondary}
                  >
                    {filter === 'all'
                      ? `All (${countForFilter(filter)})`
                      : `${titleCase(filter.replace('_', ' '))} (${countForFilter(filter)})`}
                  </AppText>
                </Pressable>
              ))}
            </ScrollView>

            {loading ? (
              <ActivityIndicator style={styles.state} color={colors.primary} />
            ) : error ? (
              <Pressable onPress={retry} style={styles.state}>
                <AppText style={styles.stateText} color={colors.error}>{error} Tap to retry.</AppText>
              </Pressable>
            ) : visibleSpaces.length ? (
              visibleSpaces.map((space) => (
                <InspectionSpaceRow
                  key={space.id}
                  space={space}
                  onPress={() => openSpace(space.id, space.name, space.type)}
                />
              ))
            ) : (
              <AppText style={styles.stateText} color={colors.textSecondary}>
                No matching items.
              </AppText>
            )}
          </>
        ) : loading ? (
          <ActivityIndicator style={styles.state} color={colors.primary} />
        ) : (
          <Pressable onPress={retry} style={styles.state}>
            <AppText style={styles.stateText} color={colors.error}>
              {error ?? 'Inspection checklist unavailable.'} Tap to retry.
            </AppText>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 20 },
  back: { width: 40, height: 42, justifyContent: 'center' },
  propertyHeader: { flexDirection: 'row', gap: 14, marginTop: 8 },
  propertyImage: { width: 128, height: 112, borderRadius: 10, backgroundColor: '#E8ECE8' },
  propertyInfo: { flex: 1, justifyContent: 'center', gap: 5 },
  propertyName: { fontFamily: fontFamily.semiBold, fontSize: 20 },
  scheduleName: { fontFamily: fontFamily.regular, fontSize: 15 },
  scheduleTime: { fontFamily: fontFamily.regular, fontSize: 13 },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: 18, backgroundColor: '#D9F8EB', paddingHorizontal: 12, paddingVertical: 6 },
  activeText: { fontFamily: fontFamily.medium, fontSize: 13 },
  notice: { flexDirection: 'row', gap: 12, marginTop: 18, padding: 14, borderRadius: 10, backgroundColor: '#EFF7F1' },
  noticeText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 21 },
  progressHeading: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 22 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 18 },
  progressText: { fontFamily: fontFamily.regular, fontSize: 13 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 9 },
  progressTrack: { flex: 1, height: 10, borderRadius: 8, backgroundColor: '#E8EAED', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  percent: { width: 34, textAlign: 'right', fontFamily: fontFamily.semiBold, fontSize: 13 },
  tabs: { flexDirection: 'row', marginTop: 25, borderBottomWidth: 1, borderColor: '#E8EAED' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 13 },
  selectedTab: { borderBottomWidth: 3, borderColor: colors.primary },
  tabText: { fontFamily: fontFamily.medium, fontSize: 14 },
  searchBox: { minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15, paddingHorizontal: 13, borderWidth: 1, borderColor: '#E8EAED', borderRadius: 12 },
  searchInput: { flex: 1, fontFamily: fontFamily.regular, fontSize: 14 },
  filters: { gap: 9, paddingVertical: 13 },
  filter: { borderRadius: 22, paddingHorizontal: 15, paddingVertical: 9, backgroundColor: '#F1F2F4' },
  selectedFilter: { backgroundColor: colors.primary },
  filterText: { fontFamily: fontFamily.medium, fontSize: 12 },
  state: { paddingVertical: 28 },
  stateText: { textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 14 },
});