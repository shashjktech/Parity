import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { PropertyPhoto } from '@/features/worker-dashboard/components/property-photo';
import { toApiError } from '@/services/http/api-error';

import { useUploadInspectionCapture } from '../hooks/use-upload-inspection-capture';

const REQUIRED_PHOTOS = 1;

const GUIDELINES = [
  'Take clear and well-lit photos',
  'Capture overall view and close-ups',
  'Include all tables, chairs and nearby items',
  'Ensure no trash, stains or spillages',
  'Take photos from different angles',
];

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export function SpaceCaptureScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params =
    useLocalSearchParams<Record<string, string | string[]>>();

  const {
    upload,
    isUploading,
  } = useUploadInspectionCapture();

  const propertyId = firstParam(params.propertyId);
  const spaceId = firstParam(params.spaceId);

  const spaceName =
    firstParam(params.spaceName) ?? 'Space';

  const location =
    firstParam(params.location);

  const imageUrl =
    firstParam(params.imageUrl) || null;

  const position =
    firstParam(params.position) ?? '1';

  const total =
    firstParam(params.total) ?? '1';

  const [photo, setPhoto] =
    useState<ImagePickerAsset | null>(null);

  const [sheetOpen, setSheetOpen] =
    useState(false);

  /*
   * Open camera/gallery.
   */
  const choose = async (
    source: 'camera' | 'library',
  ) => {
    try {
      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          `Allow ${source} access to add a photo.`,
        );

        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.8,
        allowsMultipleSelection: false,
        selectionLimit: 1,
      };

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (
        !result.canceled &&
        result.assets.length > 0
      ) {
        /*
         * We intentionally only take the first photo.
         * This screen supports exactly ONE photo.
         */
        setPhoto(result.assets[0]);
      }
    } catch {
      Alert.alert(
        'Photo unavailable',
        'Could not open the photo source.',
      );
    }
  };

  /*
   * Close the bottom sheet first, then open
   * camera/gallery after the modal animation.
   */
  const pick = (
    source: 'camera' | 'library',
  ) => {
    setSheetOpen(false);

    setTimeout(
      () => void choose(source),
      350,
    );
  };

  /*
   * Upload the single photo and move to the
   * next inspection space.
   */
  const saveAndProceed = async () => {
    if (!propertyId || !spaceId) {
      Alert.alert(
        'Missing details',
        'Property or space information is missing.',
      );

      return;
    }

    if (!photo) {
      Alert.alert(
        'Photo required',
        'Please add a photo before proceeding.',
      );

      return;
    }

    try {
      const result = await upload(
        propertyId,
        spaceId,
        {
          uri: photo.uri,
          mimeType:
            photo.mimeType ?? 'image/jpeg',
        },
      );

      router.replace({
        pathname: routes.workerInspectionResults,
        params: {
          propertyId,
          spaceId,
          captureId: result.captureId,
          spaceName,
        },
      });
    } catch (cause) {
      Alert.alert(
        'Upload failed',
        toApiError(cause).message,
      );
    }
  };

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      {/* ============================================================
          HEADER
          ============================================================ */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.primary}
          />
        </Pressable>

        <AppText
          style={styles.headerTitle}
          color={colors.primary}
          numberOfLines={1}
        >
          {spaceName}
        </AppText>

        <View style={styles.headerCounterContainer}>
          <AppText
            style={styles.headerCounter}
            color={colors.primary}
          >
            {position}/{total}
          </AppText>
        </View>
      </View>

      {/* ============================================================
          CONTENT
          ============================================================ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              insets.bottom + 110,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ==========================================================
            SPACE INFORMATION
            ========================================================== */}
        <View style={styles.spaceCard}>
          <PropertyPhoto
            imageUrl={
              imageUrl ??
              require('@/assets/images/decor/room-placeholder.avif')
            }
            style={styles.spaceImage}
          />

          <View style={styles.spaceInfo}>
            <AppText
              style={styles.spaceName}
              color={colors.textDark}
              numberOfLines={1}
            >
              {spaceName}
            </AppText>

            {location ? (
              <AppText
                style={styles.spaceLocation}
                color={colors.textSecondary}
                numberOfLines={1}
              >
                {location}
              </AppText>
            ) : null}
          </View>
        </View>

        {/* ==========================================================
            INFORMATION NOTICE
            ========================================================== */}
        <View style={styles.notice}>
          <View style={styles.noticeIcon}>
            <Ionicons
              name="information-outline"
              size={20}
              color="#9A5B22"
            />
          </View>

          <AppText
            style={styles.noticeText}
            color={colors.textSecondary}
          >
            Take clear photos of all tables, chairs,
            surroundings and nearby assets in this area.
          </AppText>
        </View>

        {/* ==========================================================
            PHOTO SECTION
            ========================================================== */}
        <AppText
          style={styles.photosTitle}
          color={colors.primary}
        >
          Photo ({photo ? 1 : 0}/{REQUIRED_PHOTOS})
        </AppText>

        {/* ==========================================================
            SINGLE PHOTO UPLOAD
            ========================================================== */}
        <Pressable
          onPress={() => setSheetOpen(true)}
          style={[
            styles.photoUpload,
            photo && styles.photoUploadWithImage,
          ]}
          accessibilityRole="button"
          accessibilityLabel={
            photo
              ? 'Change photo'
              : 'Add photo'
          }
        >
          {photo ? (
            <>
              <Image
                source={{
                  uri: photo.uri,
                }}
                style={styles.photoPreview}
                contentFit="cover"
              />

              {/* Change photo overlay */}
              <View style={styles.changePhotoOverlay}>
                <View style={styles.changePhotoButton}>
                  <Ionicons
                    name="camera-outline"
                    size={20}
                    color={colors.white}
                  />

                  <AppText
                    style={styles.changePhotoText}
                    color={colors.white}
                  >
                    Change Photo
                  </AppText>
                </View>
              </View>

              {/* Remove photo */}
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  setPhoto(null);
                }}
                hitSlop={10}
                style={styles.removePhotoButton}
                accessibilityRole="button"
                accessibilityLabel="Remove photo"
              >
                <Ionicons
                  name="close"
                  size={18}
                  color={colors.white}
                />
              </Pressable>
            </>
          ) : (
            <>
              <View style={styles.cameraIconContainer}>
                <Ionicons
                  name="camera-outline"
                  size={38}
                  color="#566A72"
                />
              </View>

              <AppText
                style={styles.addPhotoText}
                color="#53636E"
              >
                Add Photo
              </AppText>
            </>
          )}
        </Pressable>

        {/* ==========================================================
            PHOTO GUIDELINES
            ========================================================== */}
        <View style={styles.guidelines}>
          <View style={styles.guidelinesHeader}>
            <View style={styles.guidelinesIcon}>
              <Ionicons
                name="document-text-outline"
                size={23}
                color="#633719"
              />
            </View>

            <AppText
              style={styles.guidelinesTitle}
              color="#3D2418"
            >
              Photo Guidelines
            </AppText>
          </View>

          <View style={styles.guidelinesList}>
            {GUIDELINES.map((item) => (
              <View
                key={item}
                style={styles.guidelineRow}
              >
                <AppText
                  style={styles.guidelineBullet}
                  color="#222222"
                >
                  {'•'}
                </AppText>

                <AppText
                  style={styles.guidelineText}
                  color="#4E4E4E"
                >
                  {item}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ============================================================
          BOTTOM ACTION
          ============================================================ */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom:
              insets.bottom + 16,
          },
        ]}
      >
        <Pressable
          onPress={saveAndProceed}
          disabled={!photo || isUploading}
          style={({ pressed }) => [
            styles.saveButton,
            (!photo || isUploading) &&
              styles.saveButtonDisabled,
            pressed &&
              photo &&
              !isUploading &&
              styles.saveButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Save and next"
        >
          {isUploading ? (
            <ActivityIndicator
              size="small"
              color={colors.white}
            />
          ) : (
            <>
              <AppText
                style={styles.saveText}
                color={colors.white}
              >
                Save &amp; Next
              </AppText>

              <Ionicons
                name="arrow-forward"
                size={25}
                color={colors.white}
              />
            </>
          )}
        </Pressable>
      </View>

      {/* ============================================================
          CAMERA / GALLERY SHEET
          ============================================================ */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSheetOpen(false)
        }
      >
        <Pressable
          style={styles.backdrop}
          onPress={() =>
            setSheetOpen(false)
          }
        >
          <View style={styles.sheet}>
            <Pressable
              style={styles.option}
              onPress={() =>
                pick('camera')
              }
              accessibilityRole="button"
            >
              <Ionicons
                name="camera-outline"
                size={23}
                color={colors.textDark}
              />

              <AppText
                color={colors.textDark}
                style={styles.optionText}
              >
                Take photo
              </AppText>
            </Pressable>

            <Pressable
              style={styles.option}
              onPress={() =>
                pick('library')
              }
              accessibilityRole="button"
            >
              <Ionicons
                name="images-outline"
                size={23}
                color={colors.textDark}
              />

              <AppText
                color={colors.textDark}
                style={styles.optionText}
              >
                Upload photo
              </AppText>
            </Pressable>

            <Pressable
              style={[
                styles.option,
                styles.cancelOption,
              ]}
              onPress={() =>
                setSheetOpen(false)
              }
              accessibilityRole="button"
            >
              <AppText
                color={colors.primary}
                style={styles.cancelText}
              >
                Cancel
              </AppText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

/* =================================================================
   STYLES
   ================================================================= */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFEFC',
  },

  scroll: {
    flex: 1,
  },

  /* ================================================================
     HEADER
     ================================================================ */

  header: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0EE',
    backgroundColor: '#FFFEFC',
  },

  backButton: {
    width: 40,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fontFamily.semiBold,
    fontSize: 19,
    lineHeight: 24,
  },

  headerCounterContainer: {
    width: 40,
    alignItems: 'flex-end',
  },

  headerCounter: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },

  /* ================================================================
     CONTENT
     ================================================================ */

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  /* ================================================================
     SPACE CARD
     ================================================================ */

  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 86,
  },

  spaceImage: {
    width: 86,
    height: 86,
    borderRadius: 11,
  },

  spaceInfo: {
    flex: 1,
    marginLeft: 16,
  },

  spaceName: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },

  spaceLocation: {
    marginTop: 3,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  /* ================================================================
     NOTICE
     ================================================================ */

  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 9,
    backgroundColor: '#FFF4E1',
  },

  noticeIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  noticeText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 12.5,
    lineHeight: 18,
  },

  /* ================================================================
     PHOTO TITLE
     ================================================================ */

  photosTitle: {
    marginTop: 26,
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    lineHeight: 23,
  },

  /* ================================================================
     SINGLE PHOTO UPLOAD
     ================================================================ */

  photoUpload: {
    width: '100%',
    height: 300,
    marginTop: 12,
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#CAD5DF',
    backgroundColor: '#FFFEFC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  photoUploadWithImage: {
    borderStyle: 'solid',
    borderColor: '#E1E5E3',
    overflow: 'hidden',
  },

  cameraIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  addPhotoText: {
    marginTop: 9,
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 23,
  },

  photoPreview: {
    width: '100%',
    height: '100%',
  },

  changePhotoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  changePhotoText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },

  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  /* ================================================================
     GUIDELINES
     ================================================================ */

  guidelines: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#FFF4DF',
  },

  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  guidelinesIcon: {
    width: 28,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  guidelinesTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    lineHeight: 21,
  },

  guidelinesList: {
    marginTop: 7,
    paddingLeft: 4,
  },

  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },

  guidelineBullet: {
    width: 17,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 19,
  },

  guidelineText: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 12.5,
    lineHeight: 19,
  },

  /* ================================================================
     FOOTER
     ================================================================ */

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#FFFEFC',
  },

  saveButton: {
    height: 52,
    borderRadius: 28,
    backgroundColor: '#006B50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  saveButtonDisabled: {
    opacity: 0.55,
  },

  saveButtonPressed: {
    opacity: 0.9,
  },

  saveText: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },

  /* ================================================================
     CAMERA / GALLERY MODAL
     ================================================================ */

  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 8,
  },

  option: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
  },

  optionText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },

  cancelOption: {
    borderWidth: 0,
  },

  cancelText: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
  },
});