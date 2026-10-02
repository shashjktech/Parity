import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaginationDots } from '@/components/ui';
import { routes } from '@/constants/routes';
import { colors, spacing } from '@/theme';
import { ActionButtons } from '../components/action-buttons';
import { BrandLogo } from '../components/brand-logo';
import { FeatureRow } from '../components/feature-row';
import { HeroShowcase } from '../components/hero-showcase';
import { TaglineDivider } from '../components/tagline-divider';
import { WELCOME_COPY } from '../constants/welcome-content';

export function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.sm },
        ]}
      >
        <BrandLogo />
        <View style={{ marginTop: -50 }}>
          <HeroShowcase />
        </View>
        <FeatureRow />
        <PaginationDots count={WELCOME_COPY.pageCount} activeIndex={WELCOME_COPY.activePage} style={{ marginTop: spacing.xl - 4 }} />
        <ActionButtons
          onCreateAccount={() => router.push(routes.roleSelection)}
          onLogIn={() => router.push(routes.login)}
        />
        <TaglineDivider />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
});
