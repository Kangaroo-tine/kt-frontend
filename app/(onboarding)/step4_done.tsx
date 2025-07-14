// onboarding/complete.tsx (마지막 단계)
import * as React from 'react';
import { useState } from 'react';

import { Button } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Done from '../../assets/GUI/done.svg';
//아이콘
import Back from '../../assets/icon/arrow/back_arrow.svg';
//폰트,컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function CompleteScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const isActive = true;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Back width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.doneWrapper}>
        <Done width={180} height={230} />
        <View style={{ height: 40 }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={[Typo.title02, { color: Colors.gray900 }]}>
            계정 연동이 완료되었어요!
          </Text>
        </View>
        <View style={styles.subtitleWrapper}>
          <Text style={[Typo.label02, { color: Colors.gray500 }]}>
            보호자가 등록한 루틴을 확인해 보세요
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bottomButtonWrapper}
        disabled={!isActive}
        onPress={() => router.push('/(tabs)/BottomTabs')}
      >
        <View
          style={[
            styles.button,
            { backgroundColor: isActive ? Colors.main600 : Colors.gray100 },
          ]}
        >
          <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
            시작하기
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
  },
  backButtonWrapper: {
    width: '100%',
    height: 24,
    padding: 20,
  },
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 336,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneWrapper: {
    flex: 1,
    bottom: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
  },
  input: {
    ...Typo.body02,
    color: Colors.gray900,
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
});
