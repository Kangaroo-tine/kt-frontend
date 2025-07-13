// app/(onboarding)/start.tsx
import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Back from '../../assets/gui/button/onboarding//backButton.svg';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenCode() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'gard' | 'target' | null>(
    null,
  );
  const isActive = selectedRole !== null;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Back width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={[Typo.title02, { color: Colors.gray900 }]}>
          연결코드를
        </Text>
        <Text style={[Typo.title02, { color: Colors.gray900 }]}>
          보호자에게 전달하세요
        </Text>
      </View>
      <View style={styles.subtitleWrapper}>
        <Text style={[Typo.label02, { color: Colors.gray500 }]}>
          아래 보이는 연결코드를 보내 계정을 연동하세요
        </Text>
      </View>
      <View style={{ height: 78 }} />
      <View
        style={{
          height: 70,
          marginHorizontal: 20,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.main600,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={[Typo.title03, { color: Colors.main900 }]}>68AV112</Text>
      </View>
      <View style={styles.codeButtonWrapper}>
        <TouchableOpacity style={[styles.codeButton, { marginRight: 8 }]}>
          <Text style={[Typo.label01, { color: Colors.main900 }]}>
            연결코드 다시받기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.codeButton}>
          <Text style={[Typo.label01, { color: Colors.main900 }]}>Copy</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.bottomButtonWrapper}
        onPress={() => router.push('/step4_done')}
      >
        <View style={[styles.button, { backgroundColor: Colors.main600 }]}>
          <Text style={[Typo.heading02, { color: Colors.gray800 }]}>다음</Text>
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
  titleWrapper: {
    height: '18%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  roleButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '10%',
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
  codeBox: {
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.main600,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  codeButtonWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  codeButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: Colors.main600,
    borderRadius: 12,
  },
});
