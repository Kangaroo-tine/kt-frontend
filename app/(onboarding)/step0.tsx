// app/(onboarding)/start.tsx
import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

//아이콘
import KaKao from '../../assets/GUI/kakao.svg';
import Logo from '../../assets/GUI/logo/logo_light.svg';
//컬러
import { Colors } from '../../constants/Colors';

export default function ScreenStart() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={224} height={100} />
      </View>
      <TouchableOpacity
        style={styles.kakaoWrapper}
        onPress={() => router.push('/step1')}
      >
        <KaKao />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
  },
  logoWrapper: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kakaoWrapper: {
    position: 'absolute',
    bottom: '30%',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    width: 183,
    alignSelf: 'center',
  },
});
