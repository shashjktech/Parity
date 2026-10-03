import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { AppText } from '@/components/ui';
import { colors, fontFamily } from '@/theme';
import { toApiError } from '@/services/http/api-error';
import { createPropertyItem, uploadPropertyItemPhoto } from '../api/property-items-api';
import { ItemFormField } from '../components/item-form-field';
import { PropertyItemsHeader } from '../components/property-items-header';
import type { PropertyItemKind, PropertyItemStatus } from '../types/property-item';

const kinds: { value: PropertyItemKind; title: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'room', title: 'Room', icon: 'bed-outline' },
  { value: 'area', title: 'Area', icon: 'map-outline' },
  { value: 'asset', title: 'Asset', icon: 'cube-outline' },
];

const subtypeOptions: Record<PropertyItemKind, string[]> = {
  room: ['Table', 'Private Room', 'Outdoor', 'Counter', 'Other'],
  area: ['Indoor', 'Outdoor', 'Ground Floor', 'First Floor', 'Other'],
  asset: ['Furniture', 'Appliance', 'Equipment', 'Other'],
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function validKind(value?: string): value is PropertyItemKind {
  return value === 'room' || value === 'area' || value === 'asset';
}

export function AddPropertyItemScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    propertyId?: string | string[];
    kind?: string | string[];
  }>();
  const propertyId = firstParam(params.propertyId);
  const requestedKind = firstParam(params.kind);
  const [kind, setKind] = useState<PropertyItemKind>(validKind(requestedKind) ? requestedKind : 'room');
  const [name, setName] = useState('');
  const [kindPickerVisible, setKindPickerVisible] = useState(false);
  const [subtype, setSubtype] = useState('');
  const [area, setArea] = useState('');
  const [floorLevel, setFloorLevel] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [status, setStatus] = useState<PropertyItemStatus>('AVAILABLE');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [saving, setSaving] = useState(false);

  const title = 'Add Space';
  const kindTitle = kinds.find((option) => option.value === kind)?.title ?? 'Room';
  const placeName = kind === 'room' ? 'e.g. Table 1, Room 101, VIP Room' : kind === 'area' ? 'e.g. Ground Floor, Garden' : 'e.g. Dining Table, Refrigerator';
  const subtypeLabel = kind === 'room' ? 'Room Type' : kind === 'area' ? 'Area Type' : 'Asset Type';
  const areaLabel = kind === 'room' ? 'Area' : 'Location';

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera permission needed',
          'Allow camera access to take a photo of this space.',
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) setPhoto(result.assets[0]);
    } catch (error) {
      Alert.alert('Camera unavailable', toApiError(error).message);
    }
  };

  const save = async () => {
    if (!propertyId) {
      Alert.alert('Property unavailable', 'Go back and open configuration from a property.');
      return;
    }
    if (!name.trim()) {
      Alert.alert(`${kindTitle} name required`, 'Enter a name to continue.');
      return;
    }
    if (!subtype) {
      Alert.alert(`${kindTitle} type required`, `Select a ${kindTitle.toLowerCase()} type to continue.`);
      return;
    }
    setSaving(true);
    try {
      const uploadedPhoto = photo
        ? await uploadPropertyItemPhoto(propertyId, {
            uri: photo.uri,
            name: photo.fileName ?? `space-photo-${Date.now()}.jpg`,
            type: photo.mimeType ?? 'image/jpeg',
            file: photo.file,
          })
        : null;
      await createPropertyItem(propertyId, {
        kind,
        name: name.trim(),
        subtype: subtype || null,
        area: area.trim() || null,
        floor_level: floorLevel.trim() || null,
        capacity: kind === 'room' && capacity ? Number(capacity) : null,
        status,
        description: description.trim() || null,
        image_path: uploadedPhoto?.image_path ?? null,
      });
      router.back();
    } catch (error) {
      Alert.alert(`Could not add ${kind}`, toApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <View style={{ paddingTop: insets.top + 4 }}>
        <PropertyItemsHeader title={title} onBack={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.group}>
            <AppText style={styles.label} color={colors.textDark}>Space Type <AppText color={colors.error}>*</AppText></AppText>
            <Pressable onPress={() => setKindPickerVisible(true)} style={styles.typeSelect} accessibilityRole="button" accessibilityLabel={`Space type, ${kindTitle}`}>
              <Ionicons name={kinds.find((option) => option.value === kind)?.icon ?? 'bed-outline'} size={18} color={colors.primary} />
              <AppText style={styles.typeSelectText} color={colors.textDark}>{kindTitle}</AppText>
              <Ionicons name="chevron-down" size={17} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Pressable onPress={takePhoto} style={styles.photoButton} accessibilityRole="button" accessibilityLabel={photo ? 'Retake space photo' : 'Take a photo of this space'}>
            {photo ? (
              <>
                <Image source={{ uri: photo.uri }} style={styles.photoPreview} resizeMode="cover" />
                <View style={styles.photoAction}>
                  <Ionicons name="camera-outline" size={15} color={colors.white} />
                  <AppText style={styles.photoActionText} color={colors.white}>Retake Photo</AppText>
                </View>
              </>
            ) : (
              <>
                <Ionicons name="camera-outline" size={27} color={colors.primary} />
                <AppText style={styles.photoTitle} color={colors.textDark}>Take {kindTitle.toLowerCase()} photo</AppText>
                <AppText style={styles.photoHint} color={colors.textSecondary}>Optional</AppText>
              </>
            )}
          </Pressable>

        <ItemFormField
          label={`${kind === 'room' ? 'Room' : kind === 'area' ? 'Area' : 'Asset'} Name`}
          required
          value={name}
          onChangeText={setName}
          placeholder={placeName}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <View style={styles.group}>
          <AppText style={styles.label} color={colors.textDark}>{subtypeLabel} <AppText color={colors.error}>*</AppText></AppText>
          <View style={styles.options}>
            {subtypeOptions[kind].map((option) => {
              const selected = subtype === option;
              return (
                <Pressable key={option} onPress={() => setSubtype(option)} style={[styles.option, selected && styles.optionSelected]} accessibilityRole="button" accessibilityState={{ selected }}>
                  <AppText style={[styles.optionText, selected && styles.optionTextSelected]} color={selected ? colors.primary : colors.textSecondary}>{option}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ItemFormField label={areaLabel} value={area} onChangeText={setArea} placeholder={kind === 'room' ? 'Select or enter area' : 'e.g. Indoor - Ground Floor'} autoCapitalize="words" />
        <ItemFormField label="Floor / Level" value={floorLevel} onChangeText={setFloorLevel} placeholder="e.g. Ground Floor" autoCapitalize="words" />

        {kind === 'room' ? (
          <View style={styles.group}>
            <AppText style={styles.label} color={colors.textDark}>Capacity</AppText>
            <View style={styles.stepper}>
              <Pressable onPress={() => setCapacity(String(Math.max(0, Number(capacity || 0) - 1)))} style={styles.stepButton} accessibilityRole="button" accessibilityLabel="Decrease capacity">
                <Ionicons name="remove" size={18} color={colors.textSecondary} />
              </Pressable>
              <AppText style={styles.capacity} color={colors.textDark}>{capacity || '0'}</AppText>
              <Pressable onPress={() => setCapacity(String(Number(capacity || 0) + 1))} style={styles.stepButton} accessibilityRole="button" accessibilityLabel="Increase capacity">
                <Ionicons name="add" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        ) : null}

        <View style={styles.group}>
          <AppText style={styles.label} color={colors.textDark}>Status</AppText>
          <View style={styles.options}>
            {([
              ['AVAILABLE', 'Available'],
              ['OUT_OF_SERVICE', 'Out of Service'],
            ] as const).map(([value, label]) => {
              const selected = status === value;
              return (
                <Pressable key={value} onPress={() => setStatus(value)} style={[styles.statusOption, selected && styles.statusOptionSelected]} accessibilityRole="button" accessibilityState={{ selected }}>
                  <View style={[styles.statusDot, value === 'AVAILABLE' ? styles.availableDot : styles.outOfServiceDot]} />
                  <AppText style={styles.optionText} color={selected ? colors.primary : colors.textSecondary}>{label}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <ItemFormField label="Description (Optional)" value={description} onChangeText={setDescription} placeholder="Add any additional details..." multiline />

        <Pressable onPress={save} disabled={saving} style={({ pressed }) => [styles.saveButton, pressed && !saving && styles.pressed, saving && styles.saving]} accessibilityRole="button" accessibilityState={{ disabled: saving, busy: saving }}>
          {saving ? <ActivityIndicator color={colors.white} /> : <AppText style={styles.saveText} color={colors.white}>Save Space</AppText>}
        </Pressable>
      </ScrollView>

      <Modal transparent visible={kindPickerVisible} animationType="fade" onRequestClose={() => setKindPickerVisible(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalBackdrop} onPress={() => setKindPickerVisible(false)} accessibilityRole="button" accessibilityLabel="Close space type selector" />
          <View style={[styles.typeSheet, { paddingBottom: Math.max(insets.bottom, 18) }]}>
            <AppText style={styles.sheetTitle} color={colors.textDark}>Select Space Type</AppText>
            {kinds.map((option) => {
              const selected = option.value === kind;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    setKind(option.value);
                    setSubtype('');
                    setKindPickerVisible(false);
                  }}
                  style={[styles.typeChoice, selected && styles.typeChoiceSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Ionicons name={option.icon} size={20} color={selected ? colors.primary : colors.textSecondary} />
                  <AppText style={styles.typeChoiceText} color={selected ? colors.primary : colors.textDark}>{option.title}</AppText>
                  {selected ? <Ionicons name="checkmark" size={19} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { gap: 16, paddingHorizontal: 18, paddingTop: 10 },
  group: { gap: 8 },
  label: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 17 },
  typeSelect: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 11, backgroundColor: colors.white },
  typeSelectText: { flex: 1, fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18 },
  photoButton: { height: 150, alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: 13, backgroundColor: colors.white },
  photoPreview: { ...StyleSheet.absoluteFill, width: '100%', height: '100%' },
  photoTitle: { fontFamily: fontFamily.medium, fontSize: 12, lineHeight: 17 },
  photoHint: { fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 14 },
  photoAction: { position: 'absolute', right: 9, bottom: 9, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 14, backgroundColor: 'rgba(20,26,23,0.72)' },
  photoActionText: { fontFamily: fontFamily.medium, fontSize: 10, lineHeight: 14 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  option: { minHeight: 34, paddingHorizontal: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 10, backgroundColor: colors.white },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.surface },
  optionText: { fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 15 },
  optionTextSelected: { fontFamily: fontFamily.medium },
  stepper: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 11, backgroundColor: colors.white },
  stepButton: { width: 34, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: colors.surface },
  capacity: { fontFamily: fontFamily.semiBold, fontSize: 14 },
  statusOption: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 11, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 10, backgroundColor: colors.white },
  statusOptionSelected: { borderColor: colors.primary, backgroundColor: colors.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  availableDot: { backgroundColor: colors.accent },
  outOfServiceDot: { backgroundColor: colors.error },
  saveButton: { minHeight: 48, marginTop: 3, alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor: colors.primary },
  saveText: { fontFamily: fontFamily.semiBold, fontSize: 14, lineHeight: 20 },
  pressed: { opacity: 0.86 },
  saving: { opacity: 0.75 },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(20,26,23,0.35)' },
  typeSheet: { gap: 8, paddingHorizontal: 18, paddingTop: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: colors.background },
  sheetTitle: { marginBottom: 5, fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 22 },
  typeChoice: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 11, backgroundColor: colors.white },
  typeChoiceSelected: { borderColor: colors.primary, backgroundColor: colors.surface },
  typeChoiceText: { flex: 1, fontFamily: fontFamily.medium, fontSize: 13, lineHeight: 18 },
});