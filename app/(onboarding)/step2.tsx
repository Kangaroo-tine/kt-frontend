import { useState } from 'react';

import { StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import Center_off from '../../assets/GUI/emotion/emotion_off.svg';
import Center_on from '../../assets/GUI/emotion/emotion_on.svg';
import FloatingButton from '../../components/FloatingButton';
import OnboardingLayout from '../../components/layout/OnboardingLayout';

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
    <OnboardingLayout
      title="STEP 1 목표 설정"
      mainTitle={'달성하고 싶은 목표의\n카테고리를 선택해주세요.'}
      subtitle="하나의 카테고리를 선택해주세요."
      progress={0.2}
      bottomButton={{
        text: '다음',
        onPress: () =>
          router.push(`/step3?category=${encodeURIComponent(selected || '')}`),
        disabled: !selected,
      }}
    >
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
        {selected ? <Center_on width="100%" /> : <Center_off width="100%" />}
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'relative',
    height: 250,
    marginVertical: 20,
  },
});
