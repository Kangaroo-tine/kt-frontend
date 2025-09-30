import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import Back from '../../assets/icon/arrow/back_arrow.svg';
import HappyTargetIcon from '../../assets/icon/dependent/happy_target.svg';
import QuestionIcon from '../../assets/icon/dependent/question.svg';
import OnboardingLayout from '../layout/OnboardingLayout';
import StepButton from '../shared/StepButton';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

type Props = {
  mainGoal: string;
  subGoals: string[];
  onNext: (data: {}) => void;
  onBack: () => void;
};

export default function GoalStep4({ mainGoal, subGoals, onNext, onBack }: Props) {
  return (
    <>
      <OnboardingLayout
        title="STEP 4 학습 및 기억"
        mainTitle={'계획을 일정에 등록하면\n더 꾸준히 이어갈 수 있어요.'}
        subtitle="이제 이 세부계획을 언제, 어떻게 실천할지 정해볼까요?"
        progress={0.8}
        leftIcon={
          <TouchableOpacity onPress={onBack}>
            <Back width={24} height={24} />
          </TouchableOpacity>
        }
      >
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
              {mainGoal || '목표 없음'}
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
            {subGoals.map((goal: string, index: number) => (
              <Text
                key={index}
                style={[
                  Typo.body02,
                  {
                    color: Colors.gray600,
                    marginBottom: index < subGoals.length - 1 ? 16 : 0,
                  },
                ]}
              >
                {goal}
              </Text>
            ))}
          </View>
        </ScrollView>
      </OnboardingLayout>

      <StepButton
        text="다음"
        onPress={() => onNext({})}
        disabled={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 10,
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