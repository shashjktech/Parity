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

export function InspectionResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const propertyId = firstParam(params.propertyId);
  const spaceId = firstParam(params.spaceId);
  const captureId = firstParam(params.captureId);
  const spaceName = firstParam(params.spaceName) ?? 'Inspection Results';
  const { result, loading, error, retry } = useInspectionResults(
    propertyId,
    spaceId,
    captureId,
  );
  const [showMaster, setShowMaster] = useState(true);

  const openRetry = () => {
    if (!propertyId || !spaceId) return;
    router.replace({
      pathname: routes.workerInspectionCapture,
      params: { propertyId, spaceId, spaceName },
    });
  };

  const openIssue = (issueId: string) => {
    if (!propertyId || !spaceId || !captureId) return;
    router.push({
      pathname: routes.workerInspectionIssueDetail,
      params: { propertyId, spaceId, captureId, spaceName, issueId },
    });
  };

  const imageUrl = showMaster
    ? result?.masterImageUrl
    : result?.currentImageUrl;
  const isProcessing = result?.status === 'processing';
  const hasIssues = result?.status === 'rejected';
  const failed = result?.status === 'failed';

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
            {spaceName}
          </AppText>
          <AppText style={styles.headerSubtitle} color={colors.textSecondary}>
            Inspection Results
          </AppText>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      {loading && !result ? (
        <ActivityIndicator style={styles.state} color={colors.primary} />
      ) : error && !result ? (
        <Pressable style={styles.state} onPress={retry}>
          <AppText style={styles.stateText} color={colors.error}>
            {error} Tap to retry.
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
          {isProcessing ? (
            <View style={styles.processingBanner}>
              <ActivityIndicator color={colors.primary} />
              <View style={styles.bannerCopy}>
                <AppText style={styles.bannerTitle} color={colors.primary}>
                  Inspection in progress
                </AppText>
                <AppText style={styles.bannerText} color={colors.textDark}>
                  The photo is being checked. Results will appear here automatically.
                </AppText>
              </View>
            </View>
          ) : hasIssues ? (
            <View style={styles.issueBanner}>
              <Ionicons name="alert-circle" size={34} color={colors.error} />
              <View style={styles.bannerCopy}>
                <AppText style={styles.bannerTitle} color={colors.error}>
                  Issues Found
                </AppText>
                <AppText style={styles.bannerText} color={colors.textDark}>
                  {result?.issues.length ?? 0} issue(s) detected. Review and resolve them before re-inspection.
                </AppText>
              </View>
            </View>
          ) : failed ? (
            <View style={styles.failedBanner}>
              <Ionicons name="warning-outline" size={30} color="#A76013" />
              <View style={styles.bannerCopy}>
                <AppText style={styles.bannerTitle} color="#8A4C0E">
                  Inspection could not be completed
                </AppText>
                <AppText style={styles.bannerText} color={colors.textDark}>
                  Please upload a new photo to retry the inspection.
                </AppText>
              </View>
            </View>
          ) : (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={30} color={colors.primary} />
              <View style={styles.bannerCopy}>
                <AppText style={styles.bannerTitle} color={colors.primary}>
                  Inspection completed
                </AppText>
                <AppText style={styles.bannerText} color={colors.textDark}>
                  No issues were found in this inspection.
                </AppText>
              </View>
            </View>
          )}

          <AppText style={styles.sectionTitle} color={colors.textDark}>
            Inspection Images
          </AppText>
          <View style={styles.segment}>
            <Pressable
              onPress={() => setShowMaster(true)}
              style={[styles.segmentButton, showMaster && styles.segmentSelected]}
            >
              <AppText
                style={styles.segmentText}
                color={showMaster ? colors.white : colors.textDark}
              >
                Master Image
              </AppText>
            </Pressable>
            <Pressable
              onPress={() => setShowMaster(false)}
              style={[styles.segmentButton, !showMaster && styles.segmentSelected]}
            >
              <AppText
                style={styles.segmentText}
                color={!showMaster ? colors.white : colors.textDark}
              >
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

          {hasIssues ? (
            <>
              <View style={styles.sectionHeading}>
                <AppText style={styles.sectionTitle} color={colors.textDark}>
                  Detected Issues ({result?.issues.length ?? 0})
                </AppText>
              </View>
              {result?.issues.map((issue) => (
                <Pressable
                  key={issue.id}
                  onPress={() => openIssue(issue.id)}
                  style={({ pressed }) => [styles.issueCard, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <PropertyPhoto
                    imageUrl={result.currentImageUrl ?? require('@/assets/images/decor/room-placeholder.avif')}
                    style={styles.issueImage}
                  />
                  <View style={styles.issueCopy}>
                    <AppText style={styles.issueCategory} color={colors.error}>
                      {issue.category}
                    </AppText>
                    <AppText style={styles.issueTitle} color={colors.textDark}>
                      {issue.title}
                    </AppText>
                    <AppText
                      style={styles.issueDescription}
                      color={colors.textSecondary}
                      numberOfLines={2}
                    >
                      {issue.description ?? 'Review this item and upload a new photo after correcting it.'}
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
              ))}
              <Pressable onPress={openRetry} style={styles.retryButton}>
                <Ionicons name="camera-outline" size={19} color={colors.white} />
                <AppText style={styles.retryText} color={colors.white}>
                  Upload a new photo
                </AppText>
              </Pressable>
            </>
          ) : null}

          {failed ? (
            <Pressable onPress={openRetry} style={styles.retryButton}>
              <Ionicons name="refresh" size={19} color={colors.white} />
              <AppText style={styles.retryText} color={colors.white}>
                Retry inspection
              </AppText>
            </Pressable>
          ) : null}
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
  headerTitle: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  headerSubtitle: { fontFamily: fontFamily.regular, fontSize: 12 },
  headerSpacer: { width: 42 },
  content: { paddingHorizontal: 17, paddingTop: 14 },
  processingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EAF3ED',
  },
  issueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FCE8E5',
  },
  failedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF1DA',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#EAF3ED',
  },
  bannerCopy: { flex: 1, gap: 4 },
  bannerTitle: { fontFamily: fontFamily.semiBold, fontSize: 15 },
  bannerText: { fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 18 },
  sectionTitle: { fontFamily: fontFamily.semiBold, fontSize: 16 },
  segment: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    padding: 3,
    borderRadius: 22,
    backgroundColor: '#EAE9E6',
  },
  segmentButton: { flex: 1, alignItems: 'center', paddingVertical: 9, borderRadius: 19 },
  segmentSelected: { backgroundColor: '#174B39' },
  segmentText: { fontFamily: fontFamily.medium, fontSize: 12 },
  comparisonImage: { width: '100%', height: 205, borderRadius: 12 },
  imageCaption: { marginTop: 7, marginBottom: 18, textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 11 },
  sectionHeading: { marginBottom: 9 },
  issueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  issueImage: { width: 64, height: 64, borderRadius: 9 },
  issueCopy: { flex: 1, gap: 3 },
  issueCategory: { fontFamily: fontFamily.semiBold, fontSize: 11 },
  issueTitle: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  issueDescription: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 16 },
  retryButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 7,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  retryText: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  errorNotice: { marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: '#FCE8E5' },
  pressed: { opacity: 0.75 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  stateText: { textAlign: 'center', fontFamily: fontFamily.regular, fontSize: 14 },
});
