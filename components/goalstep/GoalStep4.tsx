import { useState } from 'react';

import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import Back from '../../assets/icon/arrow/back_arrow.svg';
import HappyTargetIcon from '../../assets/icon/dependent/happy_target.svg';
import QuestionIcon from '../../assets/icon/dependent/question.svg';
import OnboardingLayout from '../layout/OnboardingLayout';
import StepButton from '../shared/StepButton';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';
import { commitGoalDraft } from '../../services/goal/goalService';
import type { CommitGoalDraftResponse } from '../../types/goal';

type Props = {
  mainGoal: string;
  subGoals: string[];
  goalDraftId?: string;
  onNext: (data: {
    commitResponse?: CommitGoalDraftResponse;
    committedGoalId?: string | number;
  }) => void;
  onBack: () => void;
};

export default function GoalStep4({
  mainGoal,
  subGoals,
  goalDraftId,
  onNext,
  onBack,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!goalDraftId) {
      Alert.alert('오류', '목표 초안 정보가 없습니다. 처음 단계부터 다시 진행해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await commitGoalDraft(goalDraftId);
      const committedId =
        response?.result?.goalId ?? response?.result?.draftGoalId;

      onNext({
        commitResponse: response,
        committedGoalId: committedId,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '목표를 확정하는 중 문제가 발생했습니다.';
      Alert.alert('확정 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        text="캥거루틴 하러가기"
        onPress={handleCommit}
        disabled={isSubmitting || !goalDraftId}
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
