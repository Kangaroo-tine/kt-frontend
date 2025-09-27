// app/(onboarding)/start.tsx
import { useState } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import XIcon from '../../assets/icon/x.svg';
//컴포넌트
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenCode() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [goalText, setGoalText] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Header title="STEP 2 목표 정의" />
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title03, { color: Colors.gray900 }]}>
              해당 카테고리의{'\n'}Main Goal을 입력해주세요.
            </Text>
          </View>
          <ProgressBar progress={0.25} />
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              이 카테고리를 통해 이루고 싶은 최종 목표를 자유롭게 적어보세요.
            </Text>
          </View>
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBox}>
              <Text style={[Typo.heading03, { color: Colors.gray900 }]}>
                {category || '선택된 카테고리'}
              </Text>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputBox,
                {
                  borderBottomColor: goalText ? Colors.main600 : Colors.gray200,
                },
              ]}
            >
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    Typo.body02,
                    {
                      color: goalText ? Colors.gray600 : Colors.gray300,
                      flex: 1,
                    },
                  ]}
                  placeholder="이루고 싶은 목표 입력하기"
                  placeholderTextColor={Colors.gray300}
                  value={goalText}
                  onChangeText={setGoalText}
                />
                <TouchableOpacity onPress={() => setGoalText('')}>
                  <View style={styles.iconBox}>
                    <XIcon
                      width={20}
                      height={20}
                      color={goalText ? Colors.main600 : Colors.gray200}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={!goalText}
            onPress={() =>
              router.push(
                `/step4?category=${encodeURIComponent(
                  (category as string) || '',
                )}&goalText=${encodeURIComponent(goalText)}`,
              )
            }
          >
            <View
              style={[
                styles.button,
                { backgroundColor: goalText ? Colors.main500 : Colors.gray100 },
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
  categoryContainer: {
    marginTop: 25,
    paddingHorizontal: 12,
  },
  categoryBox: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  inputBox: {
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray200,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
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
