// app/(onboarding)/start.tsx
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Center_off from '../../assets/GUI/emotion/emotion_off.svg';
import Center_on from '../../assets/GUI/emotion/emotion_on.svg';
import FloatingButton from '../../components/FloatingButton';
//컴포넌트
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

const labels = [
  '학습·언어',
  '업무·과제',
  '건강·운동',
  '관계',
  '자기개발',
  '일상생활',
];

export default function ScreenPhone() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  //좌표와 사이즈
  const buttonData = [
    { top: 40, left: 29, size: 85 }, // 학습·언어
    { top: 15, left: 220, size: 95 }, // 업무·과제
    { top: 80, left: 140, size: 90 }, // 건강·운동
    { top: 180, left: 170, size: 80 }, // 관계
    { top: 120, left: 250, size: 100 }, // 자기개발
    { top: 150, left: 39, size: 120 }, // 일상생활
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Header title="STEP 1 목표 설정" />
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title03, { color: Colors.gray900 }]}>
              달성하고 싶은 목표의{'\n'}카테고리를 선택해주세요.
            </Text>
          </View>
          <ProgressBar progress={0} />
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              하나의 카테고리를 선택해주세요.
            </Text>
          </View>
          <View style={styles.floatingButtonContainer}>
            {labels.map((label, index) => (
              <FloatingButton
                key={label}
                label={label}
                active={selected === label}
                onPress={() => setSelected(label)}
                top={buttonData[index].top}
                left={buttonData[index].left}
                size={buttonData[index].size}
              />
            ))}
          </View>
          <View style={{ marginBottom: 20 }}>
            {selected ? (
              <Center_on width="100%" />
            ) : (
              <Center_off width="100%" />
            )}
          </View>
          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={!selected}
            onPress={() =>
              router.push(
                `/step3?category=${encodeURIComponent(selected || '')}`,
              )
            }
          >
            <View
              style={[
                styles.button,
                { backgroundColor: selected ? Colors.main500 : Colors.gray100 },
              ]}
            >
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                다음
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
  },
  titleWrapper: {
    height: '10%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  floatingButtonContainer: {
    position: 'relative',
    height: 250,
    marginVertical: 20,
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
});
