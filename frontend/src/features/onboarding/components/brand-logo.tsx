import { Image, StyleSheet, Text, View } from 'react-native';

import { images } from '@/constants/assets';
import { colors, fontFamily } from '@/theme';

type Props = { compact?: boolean };

export function BrandLogo({ compact = false }: Props) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {/* Leaf */}
      <Image
        source={images.brand.logo}
        resizeMode="contain"
        style={[styles.leaf, compact && styles.compactLeaf]}
      />

      {/* parity */}
      <Text style={[styles.wordmark, compact && styles.compactWordmark]}>parity</Text>

      {/* Tagline */}
      <View style={[styles.taglineContainer, compact && styles.compactTaglineContainer]}>
        <Text style={styles.tagline}>CLEAN SPACES</Text>
        <Text style={styles.tagline}>HIGHER STANDARDS</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  compact: { transform: [{ scale: 0.72 }] },

  leaf: {
    width: 100,
    height: 80,
    marginBottom: 0,
  },

  wordmark: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 56,
    letterSpacing: 1.2,
    lineHeight: 46,
    textAlign: 'center',
  },

  compactLeaf: { width: 88, height: 70 },
  compactWordmark: { fontSize: 50, lineHeight: 42 },

  taglineContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  compactTaglineContainer: { marginTop: 8 },

  tagline: {
    color: colors.textSecondary,
    fontFamily: fontFamily.medium,
    fontSize: 8,
    letterSpacing: 2.1,
    lineHeight: 13,
    textAlign: 'center',
  },
});