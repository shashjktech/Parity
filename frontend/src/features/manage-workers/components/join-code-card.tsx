import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { images } from '@/constants/assets';
import { colors, fontFamily } from '@/theme';

type Props = { code: string; onShare: () => void };

export function JoinCodeCard({ code, onShare }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch (cause) {
      console.error('Copy failed:', cause);
    }
  };

  return (
    <View style={styles.card}>
      <Image source={images.decor.leavesTop} style={styles.leaves} resizeMode="contain" />
      <AppText style={styles.title} color={colors.textDark}>Worker Join Code</AppText>
      <AppText style={styles.subtitle} color={colors.textSecondary}>
        Share this code with your team to join this property.
      </AppText>

      <View style={styles.codeRow}>
        <View style={styles.codeBox}>
          <AppText style={styles.code} color={colors.primary} selectable>{code}</AppText>
        </View>
        <Pressable
          onPress={copy}
          style={({ pressed }) => [styles.copy, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={copied ? 'Code copied' : 'Copy code'}
        >
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={22} color={colors.primary} />
        </Pressable>
      </View>

      <Pressable
        onPress={onShare}
        style={({ pressed }) => [styles.share, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Share code"
      >
        <Ionicons name="share-outline" size={19} color={colors.primary} />
        <AppText style={styles.shareText} color={colors.primary}>Share Code</AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 6, padding: 20, borderRadius: 22, borderWidth: 1,
    borderColor: '#E8EBE3', backgroundColor: '#FDFDF9', overflow: 'hidden',
  },
  leaves: { position: 'absolute', top: -10, right: -14, width: 96, height: 96, opacity: 0.45 },
  title: { fontFamily: fontFamily.semiBold, fontSize: 17, lineHeight: 24 },
  subtitle: { marginTop: 4, maxWidth: '86%', fontFamily: fontFamily.regular, fontSize: 12.5, lineHeight: 18 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  codeBox: {
    flex: 1, height: 56, borderRadius: 16, backgroundColor: '#E5EFE6',
    alignItems: 'center', justifyContent: 'center',
  },
  code: { fontFamily: fontFamily.bold, fontSize: 20, lineHeight: 28, letterSpacing: 1 },
  copy: {
    width: 50, height: 56, borderRadius: 16, borderWidth: 1, borderColor: '#DDE3DA',
    backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
  },
  share: {
    marginTop: 12, height: 46, borderRadius: 16, borderWidth: 1.2, borderColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  shareText: { fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 22 },
  pressed: { opacity: 0.8 },
});