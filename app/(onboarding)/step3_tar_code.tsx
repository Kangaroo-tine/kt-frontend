// app/(onboarding)/start.tsx
import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Back from '../../assets/gui/button/onboarding//backButton.svg';
import Gard_act from '../../assets/gui/button/onboarding//gard_act.svg';
import Gard_inact from '../../assets/gui/button/onboarding//gard_inact.svg';
import Target_act from '../../assets/gui/button/onboarding//target_act.svg';
import Target_inact from '../../assets/gui/button/onboarding//target_inact.svg';
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
      <TouchableOpacity
        style={styles.bottomButtonWrapper}
        disabled={!isActive}
        onPress={() => router.push('/step4_done')}
      >
        <View
          style={[
            styles.button,
            { backgroundColor: isActive ? Colors.main600 : Colors.gray100 },
          ]}
        >
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
});
