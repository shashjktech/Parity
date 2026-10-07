import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
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
import { useInspectionResults } from '../hooks/use-inspection-results';

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function InspectionIssueDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const propertyId = firstParam(params.propertyId);
  const spaceId = firstParam(params.spaceId);
  const captureId = firstParam(params.captureId);
  const spaceName = firstParam(params.spaceName) ?? 'Inspection Issue';
  const issueId = firstParam(params.issueId);
  const { result, loading, error, retry } = useInspectionResults(
    propertyId,
    spaceId,
    captureId,
  );
  const [showMaster, setShowMaster] = useState(true);
  const issue = result?.issues.find((item) => item.id === issueId);

  const openRetry = () => {
    if (!propertyId || !spaceId) return;
    router.replace({
      pathname: routes.workerInspectionCapture,
      params: { propertyId, spaceId, spaceName },
    });
  };

  const imageUrl = showMaster
    ? result?.masterImageUrl
    : result?.currentImageUrl;

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
          <AppText style={styles.headerTitle} color={colors.textDark} numberOfLines={1}>
            {issue?.title ?? spaceName}
          </AppText>
          <AppText style={styles.headerSubtitle} color={colors.textSecondary}>
            Inspection Issue
          </AppText>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && !result ? (
        <ActivityIndicator style={styles.state} color={colors.primary} />
      ) : error || !issue ? (
        <Pressable style={styles.state} onPress={retry}>
          <AppText style={styles.stateText} color={colors.error}>
            {error ?? 'This issue is no longer available.'} Tap to retry.
          </AppText>
        </Pressable>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {error ? (
            <Pressable onPress={retry} style={styles.errorNotice}>
              <AppText style={styles.stateText} color={colors.error}>
                {error} Tap to retry.
              </AppText>
            </Pressable>
          ) : null}
          <View style={styles.issueBanner}>
            <Ionicons name="alert-circle" size={22} color={colors.error} />
            <AppText style={styles.issueBannerText} color={colors.textDark}>
              {issue.description ?? 'Review this item and correct it before re-inspection.'}
            </AppText>
          </View>

          <AppText style={styles.sectionTitle} color={colors.textDark}>
            Image Comparison
          </AppText>
          <View style={styles.segment}>
            <Pressable
              onPress={() => setShowMaster(true)}
              style={[styles.segmentButton, showMaster && styles.segmentSelected]}
            >
              <AppText style={styles.segmentText} color={showMaster ? colors.white : colors.textDark}>
                Master Image
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setShowMaster(false)}
              style={[styles.segmentButton, !showMaster && styles.segmentSelected]}
            >
              <AppText style={styles.segmentText} color={!showMaster ? colors.white : colors.textDark}>
                Current Image
              </AppText>
            </Pressable>
          </View>
          <PropertyPhoto
            imageUrl={imageUrl ?? require('@/assets/images/decor/room-placeholder.avif')}
            style={styles.comparisonImage}
          />
          <AppText style={styles.imageCaption} color={colors.textSecondary}>
            {showMaster ? 'Reference image for correct setup' : 'Uploaded inspection photo'}
          </AppText>

          <View style={styles.detailsCard}>
            <AppText style={styles.sectionTitle} color={colors.textDark}>
              Issue Details
            </AppText>
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} color={colors.textSecondary}>
                Category
              </AppText>
              <AppText style={styles.detailValue} color={colors.textDark}>
                {issue.category}
              </AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText style={styles.detailLabel} color={colors.textSecondary}>
                Issue
              </AppText>
              <AppText style={styles.detailValue} color={colors.textDark}>
                {issue.title}
              </AppText>
            </View>
            <View style={[styles.detailRow, styles.descriptionRow]}>
              <AppText style={styles.detailLabel} color={colors.textSecondary}>
                Description
              </AppText>
              <AppText style={styles.detailDescription} color={colors.textSecondary}>
                {issue.description ?? 'No further description was provided.'}
              </AppText>
            </View>
          </View>

          <Pressable onPress={openRetry} style={styles.retryButton}>
            <Ionicons name="camera-outline" size={19} color={colors.white} />
            <AppText style={styles.retryText} color={colors.white}>
              Re-inspect this space
            </AppText>
          </Pressable>
        </ScrollView>
      )}
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
  headerTitle: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  headerSubtitle: { fontFamily: fontFamily.regular, fontSize: 12 },
  headerSpacer: { width: 42 },
  content: { paddingHorizontal: 16, paddingTop: 14 },
  issueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 17,
    padding: 14,
    borderRadius: 11,
    backgroundColor: '#FCE8E5',
  },
  issueBannerText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  segment: {
    flexDirection: 'row',
    marginTop: 9,
    marginBottom: 10,
    padding: 3,
    borderRadius: 22,
    backgroundColor: '#EAE9E6',
  },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 19 },
  segmentSelected: { backgroundColor: '#174B39' },
  segmentText: { fontFamily: fontFamily.medium, fontSize: 12 },
  comparisonImage: { width: '100%', height: 235, borderRadius: 12 },
  imageCaption: { marginTop: 7, marginBottom: 14, textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 11 },
  detailsCard: { gap: 9, padding: 14, borderRadius: 13, backgroundColor: '#FFFFFF' },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E9E8E4',
  },
  detailLabel: { width: 85, fontFamily: fontFamily.regular, fontSize: 12 },
  detailValue: { flex: 1, fontFamily: fontFamily.medium, fontSize: 12 },
  descriptionRow: { alignItems: 'flex-start' },
  detailDescription: { flex: 1, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  retryButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 13,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryText: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  errorNotice: { marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: '#FCE8E5' },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  stateText: { textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 14 },
});
