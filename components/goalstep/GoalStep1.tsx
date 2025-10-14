import { useState } from 'react';

import { Alert, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import Center_off from '../../assets/GUI/emotion/emotion_off.svg';
import Center_on from '../../assets/GUI/emotion/emotion_on.svg';
import Back from '../../assets/icon/arrow/back_arrow.svg';
import FloatingButton from '../FloatingButton';
import OnboardingLayout from '../layout/OnboardingLayout';
import StepButton from '../shared/StepButton';
import { createGoalDraft } from '../../services/goal/goalService';
import type { GoalCategory } from '../../types/goal';

type Props = {
  onNext: (data: {
    categoryLabel: string;
    categoryValue: GoalCategory;
    goalDraftId?: string;
  }) => void;
  onBack: () => void;
};

type CategoryOption = {
  label: string;
  value: GoalCategory;
  top: number;
  left: number;
  size: number;
};

const categoryOptions: CategoryOption[] = [
  {
    label: '학습·언어',
    value: 'LEARNING',
    top: 40,
    left: 29,
    size: 85,
  },
  {
    label: '업무·과제',
    value: 'ASSIGNMENT',
    top: 15,
    left: 220,
    size: 95,
  },
  {
    label: '건강·운동',
    value: 'EXERCISE',
    top: 80,
    left: 140,
    size: 90,
  },
  {
    label: '관계',
    value: 'RELATIONSHIP',
    top: 180,
    left: 170,
    size: 80,
  },
  {
    label: '자기개발',
    value: 'SELF_DEVELOPMENT',
    top: 120,
    left: 250,
    size: 100,
  },
  {
    label: '일상생활',
    value: 'LIFE',
    top: 150,
    left: 39,
    size: 120,
  },
];

export default function GoalStep1({ onNext, onBack }: Props) {
  const [selectedOption, setSelectedOption] = useState<CategoryOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (!selectedOption || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createGoalDraft({ category: selectedOption.value });
      const goalDraftId =
        response?.result?.goalDraftId ?? response?.result?.draftGoalId;

      onNext({
        categoryLabel: selectedOption.label,
        categoryValue: selectedOption.value,
        goalDraftId:
          goalDraftId !== undefined ? String(goalDraftId) : undefined,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '목표 초안을 생성하는 중 문제가 발생했습니다.';
      Alert.alert('목표 초안 생성 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <OnboardingLayout
        title="STEP 1 목표 설정"
        mainTitle={'달성하고 싶은 목표의\n카테고리를 선택해주세요.'}
        subtitle="하나의 카테고리를 선택해주세요."
        progress={0.2}
        leftIcon={
          <TouchableOpacity onPress={onBack}>
            <Back width={24} height={24} />
          </TouchableOpacity>
        }
      >
        <View style={styles.floatingButtonContainer}>
          {categoryOptions.map((option) => (
            <FloatingButton
              key={option.value}
              label={option.label}
              active={selectedOption?.value === option.value}
              onPress={() => setSelectedOption(option)}
              top={option.top}
              left={option.left}
              size={option.size}
            />
          ))}
        </View>
        <View style={{ marginBottom: 20 }}>
          {selectedOption ? (
            <Center_on width="100%" />
          ) : (
            <Center_off width="100%" />
          )}
        </View>
      </OnboardingLayout>

      <StepButton
        text="다음"
        onPress={handleNext}
        disabled={!selectedOption || isSubmitting}
      />
    </>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'relative',
    height: 250,
    marginVertical: 20,
  },
});
