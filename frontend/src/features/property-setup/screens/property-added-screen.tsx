import { useRouter } from 'expo-router';

import { routes } from '@/constants/routes';
import { usePropertySetup } from '@/state/property-setup/property-context';
import { CompletionScreen } from '../components/completion-screen';

export function PropertyAddedScreen() {
  const router = useRouter();
  const { state: property, resetProperty } = usePropertySetup();

  const continueToDashboard = () => {
    resetProperty();
    router.replace(routes.home);
  };

  return (
    <CompletionScreen
      title="Property Added!"
      body={`${property.name || 'Your property'} has been successfully added. You can now start managing your spaces.`}
      buttonTitle="Go to Dashboard"
      icon="business-outline"
      onBack={() => router.replace(routes.confirmLocation)}
      onContinue={continueToDashboard}
    />
  );
}