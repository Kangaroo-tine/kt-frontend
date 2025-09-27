// app/(onboarding)/start.tsx

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import HappyTargetIcon from '../../assets/icon/dependent/happy_target.svg';
import QuestionIcon from '../../assets/icon/dependent/question.svg';
//컴포넌트
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenCode() {
  const router = useRouter();
  const { mainGoal, subGoals } = useLocalSearchParams();

  // Parse the subGoals from JSON string
  const parsedSubGoals = subGoals ? JSON.parse(subGoals as string) : [];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Header title="STEP 4 학습 및 기억" />
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title03, { color: Colors.gray900 }]}>
              계획을 일정에 등록하면 {'\n'}더 꾸준히 이어갈 수 있어요.
            </Text>
          </View>
          <ProgressBar progress={0.75} />
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              이제 이 세부계획을 언제, 어떻게 실천할지 정해볼까요?
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.labelContainer}>
              <View style={styles.labelBox}>
                <QuestionIcon width={16} height={16} color={Colors.gray900} />
                <Text style={styles.labelText}>Main Goal</Text>
              </View>
            </View>

            <View style={styles.goalCard}>
              <Text style={[Typo.body02, { color: Colors.gray600 }]}>
                {(mainGoal as string) || '목표 없음'}
              </Text>
            </View>

            <View style={styles.labelContainer}>
              <View style={styles.labelBox}>
                <HappyTargetIcon
                  width={16}
                  height={16}
                  color={Colors.gray900}
                />
                <Text style={styles.labelText}>Sub Goal</Text>
              </View>
            </View>

            <View style={styles.subGoalCard}>
              {parsedSubGoals.map((goal: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    Typo.body02,
                    {
                      color: Colors.gray600,
                      marginBottom: index < parsedSubGoals.length - 1 ? 16 : 0,
                    },
                  ]}
                >
                  {goal}
                </Text>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            onPress={() => router.push('/step6')}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: Colors.main500,
                },
              ]}
            >
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                캥거루틴 하러가기
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
  backButtonWrapper: {
    width: '100%',
    height: 24,
    padding: 20,
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
  labelContainer: {
    marginTop: 20,
    marginLeft: 16,
    alignSelf: 'flex-start',
  },
  labelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    color: Colors.gray900,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 80,
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
  inputWrapper: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
  goalCard: {
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.main600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  subGoalCard: {
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.main600,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
});
