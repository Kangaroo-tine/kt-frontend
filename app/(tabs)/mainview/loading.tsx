import LoadingIcon from '@/assets/GUI/loading.svg';
import LoadingText from '@/assets/GUI/loading_text.svg';

import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import ProgressBar from '../../../components/ProgressBar';
//폰트,컬러
import { Colors } from '../../../constants/Colors';
import { Typo } from '../../../constants/Typo';

//dependent 마이페이지 구현
const Loading = () => {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1000; // 2초
    const interval = 50; // 50ms마다 업데이트
    const steps = duration / interval;
    const increment = 1 / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(currentStep * increment);

      if (currentStep >= steps) {
        clearInterval(timer);
        // 3초 후 채팅 화면으로 이동
        router.push('../../kelper');
      }
    }, interval);

    return () => clearInterval(timer);
  }, [router]);
  return (
    <View style={styles.container}>
      <LoadingText width={200} height={200} />
      <LoadingIcon width={150} height={150} />
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Text
          style={[Typo.title02, { color: Colors.gray900, textAlign: 'center' }]}
        >
          Kelper가 생각 중
        </Text>
      </View>
      <View style={{ width: '100%', marginTop: 16, paddingHorizontal: 40 }}>
        <ProgressBar progress={progress} height={4} />
      </View>
      <View style={styles.subtitleWrapper}>
        <Text style={[Typo.label02, { color: Colors.gray500 }]}>
          잠시만 기다려주세요...
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speechBubbleWrapper: {
    alignItems: 'center',
    marginBottom: 16,
    width: '80%',
  },
  speechBubble: {
    backgroundColor: Colors.main100,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxWidth: '100%',
    marginBottom: 8,
  },
  thinkingDotsWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.main100,
    marginHorizontal: 2,
  },
  subtitleWrapper: {
    marginTop: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

export default Loading;
