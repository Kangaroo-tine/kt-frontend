import { useState } from 'react';

import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import XIcon from '../../assets/icon/x.svg';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import StepButton from '../../components/shared/StepButton';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';
import { updateGoalDraftTitle } from '../../services/goal/goalService';

export default function ScreenCode() {
  const router = useRouter();
  const { category, categoryValue, goalDraftId } = useLocalSearchParams();
  const [goalText, setGoalText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categoryLabel = Array.isArray(category) ? category[0] : category;
  const categoryValueParam = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue;
  const goalDraftIdParam = Array.isArray(goalDraftId) ? goalDraftId[0] : goalDraftId;

  const handleNext = async () => {
    const trimmedGoal = goalText.trim();
    if (!trimmedGoal || isSubmitting) {
      return;
    }

    if (!goalDraftIdParam) {
      Alert.alert('오류', '목표 초안 정보가 없습니다. 이전 단계부터 다시 진행해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateGoalDraftTitle(goalDraftIdParam, { title: trimmedGoal });

      const params = new URLSearchParams({
        category: (categoryLabel || '').toString(),
        goalText: trimmedGoal,
      });

      if (categoryValueParam) {
        params.append('categoryValue', (categoryValueParam || '').toString());
      }

      params.append('goalDraftId', goalDraftIdParam.toString());

      router.push(`/step4?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '목표 제목 저장 중 문제가 발생했습니다.';
      Alert.alert('목표 저장 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <OnboardingLayout
        title="STEP 2 목표 정의"
        mainTitle={'해당 카테고리의\nMain Goal을 입력해주세요.'}
        subtitle="이 카테고리를 통해 이루고 싶은 최종 목표를 자유롭게 적어보세요."
        progress={0.4}
      >
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBox}>
            <Text style={[Typo.heading03, { color: Colors.gray900 }]}>
              {categoryLabel || '선택된 카테고리'}
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
      </OnboardingLayout>

      <StepButton text="다음" onPress={handleNext} disabled={!goalText.trim() || isSubmitting} />
    </>
  );
}

const styles = StyleSheet.create({
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
});
