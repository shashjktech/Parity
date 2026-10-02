import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton, AppText, TextField } from '@/components/ui';
import { routes } from '@/constants/routes';
import { colors, spacing } from '@/theme';
import { SetupHeader } from '../components/setup-header';

export function JoinPropertyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const error = touched && code.trim().length < 4 ? 'Enter a valid property code' : undefined;

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SetupHeader onBack={() => router.replace(routes.roleSelection)} />
        <View style={styles.title}>
          <View style={styles.icon}><Ionicons name="people-outline" size={38} color={colors.primary} /></View>
          <AppText variant="heading" color={colors.primary} style={styles.center}>Join a Property</AppText>
          <AppText variant="subtitle" color={colors.textSecondary} style={styles.center}>Enter the property code provided{`\n`}by your manager or owner.</AppText>
        </View>
        <View style={styles.form}>
          <TextField label="Property Code" icon={{ family: 'ionicons', name: 'key-outline' }} value={code} onChangeText={setCode} onBlur={() => setTouched(true)} error={error} autoCapitalize="characters" maxLength={12} />
          <View style={styles.info}><Ionicons name="information-circle" size={20} color="#3979A8" /><AppText variant="caption" color="#3979A8" style={styles.infoText}>The property code is usually shared{`\n`}by your property owner or manager.</AppText></View>
          <AppButton title="Join Property" onPress={() => { setTouched(true); if (code.trim().length >= 4) router.replace(routes.allSet); }} trailingIcon={<Ionicons name="arrow-forward" size={22} color={colors.white} />} style={styles.button} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  title: { alignItems: 'center', marginTop: 4 },
  icon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  center: { textAlign: 'center', marginTop: 8 },
  form: { gap: 14, marginTop: 28 },
  info: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, backgroundColor: '#E8F2FA' },
  infoText: { flex: 1, lineHeight: 18 },
  button: { marginTop: 2 },
});
