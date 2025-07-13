// onboarding/complete.tsx (마지막 단계)
import { Button } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CompleteScreen() {
  const router = useRouter();

  const finishOnboarding = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    router.replace('/tabs'); // (tabs)/_layout.tsx가 처리할 메인 탭 화면으로 이동
  };

  return <Button title="완료" onPress={finishOnboarding} />;
}
