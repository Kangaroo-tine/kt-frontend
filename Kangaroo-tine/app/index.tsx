// app/index.tsx
import { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<null | string>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await AsyncStorage.getItem('onboardingCompleted');
      setInitialRoute(completed === 'true' ? '/parent/home' : '/start'); // start.tsx가 onboarding 시작점
    };
    checkOnboarding();
  }, []);

  if (!initialRoute) return null;

  return <Redirect href={initialRoute} />;
}
