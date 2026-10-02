import { Redirect } from 'expo-router';

import { routes } from '@/constants/routes';

// Later: check auth / onboarding-seen flag here and redirect accordingly.
export default function Index() {
  return <Redirect href={routes.welcome} />;
}
