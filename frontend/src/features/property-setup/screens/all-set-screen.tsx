import { useRouter } from 'expo-router';

import { routes } from '@/constants/routes';
import { CompletionScreen } from '../components/completion-screen';

export function AllSetScreen() {
  const router = useRouter();
  return <CompletionScreen title="You’re All Set!" body="You have successfully joined the property. You can now start capturing room photos and help maintain higher standards." buttonTitle="Go to Dashboard" icon="checkmark" footerText="Together for\ncleaner spaces." onBack={() => router.replace(routes.joinProperty)} onContinue={() => router.replace(routes.home)} />;
}
