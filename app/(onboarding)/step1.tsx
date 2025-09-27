// app/(onboarding)/start.tsx
import { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

//아이콘
import Center from '../../assets/GUI/emotion/emotion_done.svg';
import Back from '../../assets/icon/arrow/back_arrow.svg';
import Intro from '../../assets/temp/report.svg';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenRole() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    '안녕하세요 !\n저는 여러분의 목표를 도와줄 캥코치예요.',
    '목표가 어렵게 느껴지실 수도 있어요.\n하지만 제가 단계별로 안내해드릴게요.',
    '작은 습관이 큰 변화를 만들 수 있어요.\n지금부터 저와 함께 해보실래요?',
  ];

  if (showIntro) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonWrapper}>
          <TouchableOpacity onPress={() => setShowIntro(false)}>
            <Back width={24} height={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.introWrapper}>
          <Intro width={200} height={200} />
          <TouchableOpacity onPress={() => setTextIndex((textIndex + 1) % 3)}>
            <Text
              style={[
                Typo.heading02,
                { color: Colors.gray900, textAlign: 'center' },
              ]}
            >
              {texts[textIndex]}
            </Text>
          </TouchableOpacity>
        </View>
        {textIndex === 2 && (
          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            onPress={() => router.push('/step2')}
          >
            <View style={[styles.button, { backgroundColor: Colors.main500 }]}>
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                시작하기
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Back width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleWrapper}>
        <Text style={[Typo.title02, { color: Colors.gray900 }]}>
          캥거루틴은
        </Text>
        <Text style={[Typo.title02, { color: Colors.gray900 }]}>
          이런 앱이에요
        </Text>
      </View>

      <View style={styles.centerWrapper}>
        <Center width="100%" />
        <View style={styles.textWrapper}>
          <Text style={[Typo.heading02, { color: Colors.gray900 }]}>
            집중력 향상을 위한 GMT 트레이닝 앱이에요.
          </Text>
          <Text style={[Typo.heading02, { color: Colors.gray900 }]}>
            세부 설명을 읽고, 목표를 설정해주세요.{'\n'}
          </Text>
          <Text
            style={[
              Typo.label02,
              { color: Colors.gray500, textAlign: 'center' },
            ]}
          >
            GMT(Goal Management Training)는{'\n'} 큰 목표를 작은 단계로 나누어
            실행을돕는 훈련법이에요.{'\n'}이를 통해 집중력, 성취감, 자기조절력을
            키울 수 있어요.
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.bottomButtonWrapper}
        onPress={() => setShowIntro(true)}
      >
        <View style={[styles.button, { backgroundColor: Colors.main500 }]}>
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
  centerWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
  },
  textWrapper: {
    marginTop: 20,
    alignItems: 'center',
  },
  introWrapper: {
    flex: 1,
    top: '25%',
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
});
