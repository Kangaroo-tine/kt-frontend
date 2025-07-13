// app/(onboarding)/start.tsx
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import KaKao from '../../assets/gui/button/onboarding//kakao.svg';
import Logo from '../../assets/gui/logo/logo_light.svg';

export default function ScreenStart() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={224} height={73} />
      </View>
      <TouchableOpacity
        style={styles.kakaoWrapper}
        onPress={() => router.push('/step1_role')}
      >
        <KaKao width={335} height={50} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  logoWrapper: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kakaoWrapper: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
