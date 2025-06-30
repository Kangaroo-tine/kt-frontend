import { Slot } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

//전역 라우팅 제어, 여기서 어떤 화면으로 갈지 분기
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot /> {/* 여기서 (tabs)/_layout.tsx를 자동으로 렌더링해줌 */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
