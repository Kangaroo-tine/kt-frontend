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

export default function ScreenRole() {
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
          캥거루틴에서의
        </Text>
        <Text style={[Typo.title02, { color: Colors.gray900 }]}>
          역할을 선택해주세요
        </Text>
      </View>
      <View style={styles.subtitleWrapper}>
        <Text style={[Typo.label02, { color: Colors.gray500 }]}>
          보호자와 대상자 중 세부설명을 읽고 역할을 선택해 주세요
        </Text>
      </View>
      <View style={styles.roleButtonWrapper}>
        <TouchableOpacity onPress={() => setSelectedRole('gard')}>
          <View
            style={{ width: '100%', maxWidth: 336, aspectRatio: 336 / 112 }}
          >
            {selectedRole !== 'target' ? (
              <Gard_act
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <Gard_inact
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            )}
          </View>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
        <TouchableOpacity onPress={() => setSelectedRole('target')}>
          <View
            style={{ width: '100%', maxWidth: 336, aspectRatio: 336 / 112 }}
          >
            {selectedRole !== 'gard' ? (
              <Target_act
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <Target_inact
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.bottomButtonWrapper}
        disabled={!isActive}
        onPress={() =>
          selectedRole === 'target'
            ? router.push('/step2_tar_phone')
            : router.push('/step2_gar_code')
        }
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
