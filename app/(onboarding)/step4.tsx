import { useEffect, useMemo, useState } from 'react';

import {
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import PenIcon from '../../assets/icon/pen.svg';
import StarIcon from '../../assets/icon/star.svg';
import XIcon from '../../assets/icon/x.svg';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import StepButton from '../../components/shared/StepButton';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';
import {
  createManualSubGoal,
  fetchPreviewSubGoals,
  updateSelectedSubGoals,
} from '../../services/goal/goalService';
import type { PreviewSubGoal } from '../../types/goal';

export default function ScreenCode() {
  const router = useRouter();
  const { goalText: mainGoal, categoryValue, goalDraftId } = useLocalSearchParams();
  const [subGoalText, setSubGoalText] = useState('');
  const [recommendedSubGoals, setRecommendedSubGoals] = useState<PreviewSubGoal[]>([]);
  const [manualSubGoals, setManualSubGoals] = useState<PreviewSubGoal[]>([]);
  const [selectedRecommendedIds, setSelectedRecommendedIds] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryValueParam = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue;
  const goalDraftIdParam = Array.isArray(goalDraftId) ? goalDraftId[0] : goalDraftId;

  useEffect(() => {
    if (!goalDraftIdParam) {
      return;
    }

    let isMounted = true;

    const loadRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true);
        const aiSubGoals = await fetchPreviewSubGoals(goalDraftIdParam);
        if (isMounted) {
          setRecommendedSubGoals(aiSubGoals);
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : 'AI 추천 세부 목표를 가져오지 못했습니다.';
          Alert.alert('추천 실패', message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecommendations(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [goalDraftIdParam]);

  useEffect(() => {
    setSelectedRecommendedIds((prev) =>
      prev.filter(
        (id) =>
          recommendedSubGoals.some((goal) => goal.id === id) ||
          manualSubGoals.some((goal) => goal.id === id),
      ),
    );
  }, [recommendedSubGoals, manualSubGoals]);

  const toggleSubGoal = (goalId: string) => {
    setSelectedRecommendedIds((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const addUserGoal = async () => {
    const trimmed = subGoalText.trim();
    if (!trimmed || isAddingManual) {
      return;
    }

    if (!goalDraftIdParam) {
      Alert.alert('오류', '목표 초안 정보가 없습니다. 이전 단계부터 다시 진행해주세요.');
      return;
    }

    try {
      setIsAddingManual(true);
      const existingIds = new Set(
        [
          ...recommendedSubGoals.map((goal) => goal.id),
          ...manualSubGoals.map((goal) => goal.id),
        ].map((id) => id),
      );

      const manualGoal = await createManualSubGoal(goalDraftIdParam, { title: trimmed });
      let newManualGoals: PreviewSubGoal[] = [];

      if (manualGoal) {
        newManualGoals = [manualGoal];
      } else {
        try {
          setIsLoadingRecommendations(true);
          const refreshed = await fetchPreviewSubGoals(goalDraftIdParam);
          newManualGoals = refreshed.filter((goal) => !existingIds.has(goal.id));
          setRecommendedSubGoals(refreshed);
        } finally {
          setIsLoadingRecommendations(false);
        }
      }

      if (newManualGoals.length > 0) {
        setManualSubGoals((prev) => {
          const merged = [...newManualGoals, ...prev];
          const seen = new Set<string>();
          const unique: PreviewSubGoal[] = [];
          merged.forEach((goal) => {
            const id = goal.id;
            if (!seen.has(id)) {
              seen.add(id);
              unique.push(goal);
            }
          });
          return unique;
        });
        setSelectedRecommendedIds((prev) => {
          const next = new Set(prev);
          newManualGoals.forEach((goal) => next.add(goal.id));
          return Array.from(next);
        });
      } else {
        console.log('[GoalService] manual subgoal 추가 후 새로운 항목을 찾지 못했습니다.');
      }

      setSubGoalText('');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '세부 목표를 추가하는 중 문제가 발생했습니다.';
      Alert.alert('추가 실패', message);
    } finally {
      setIsAddingManual(false);
    }
  };

  const removeUserGoal = (goalId: string) => {
    setManualSubGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    setSelectedRecommendedIds((prev) => prev.filter((id) => id !== goalId));
  };

  const selectedRecommendedGoals = useMemo(
    () =>
      recommendedSubGoals
        .filter((goal) => selectedRecommendedIds.includes(goal.id))
        .map((goal) => goal.title),
    [recommendedSubGoals, selectedRecommendedIds],
  );

  const selectedManualGoals = useMemo(
    () =>
      manualSubGoals
        .filter((goal) => selectedRecommendedIds.includes(goal.id))
        .map((goal) => goal.title),
    [manualSubGoals, selectedRecommendedIds],
  );

  const combinedSelectedGoalTitles = useMemo(
    () => [...selectedRecommendedGoals, ...selectedManualGoals],
    [selectedRecommendedGoals, selectedManualGoals],
  );

  // 총 선택된 목표 개수 (AI 추천 + 사용자 추가)
  const totalSelectedGoals = combinedSelectedGoalTitles.length;
  const isNextButtonActive = totalSelectedGoals >= 3;
  const isAddDisabled = !subGoalText.trim() || isAddingManual || !goalDraftIdParam;

  const handleNext = async () => {
    if (!goalDraftIdParam) {
      Alert.alert('오류', '목표 초안 정보가 없습니다. 이전 단계부터 다시 진행해주세요.');
      return;
    }

    if (!isNextButtonActive || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateSelectedSubGoals(goalDraftIdParam, {
        selectedPreviewIds: selectedRecommendedIds,
      });

      const params = new URLSearchParams({
        mainGoal: ((mainGoal as string) || '').toString(),
        subGoals: JSON.stringify(combinedSelectedGoalTitles),
      });

      if (categoryValueParam) {
        params.append('categoryValue', categoryValueParam.toString());
      }

      params.append('goalDraftId', goalDraftIdParam.toString());

      router.push(`/step5?${params.toString()}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '세부 목표 선택 정보를 저장하는 중 문제가 발생했습니다.';
      Alert.alert('저장 실패', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <OnboardingLayout
        title="STEP 3 목록화"
        mainTitle={'이제 Main Goal을\n작은 단계들로 나누어 볼까요?'}
        subtitle="작은 성공을 하나씩 쌓아가면 큰 목표도 더 쉽게 달성할 수 있어요!"
        progress={0.6}
      >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
            <View style={styles.labelContainer}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Main Goal</Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View
                style={[styles.inputBox, { borderBottomColor: Colors.main600 }]}
              >
                <View style={styles.inputRow}>
                  <TextInput
                    style={[
                      Typo.body02,
                      {
                        color: Colors.gray600,
                        flex: 1,
                      },
                    ]}
                    placeholder="이루고 싶은 목표 입력하기"
                    placeholderTextColor={Colors.gray300}
                    value={(mainGoal as string) || ''}
                    editable={false}
                  />
                </View>
              </View>
            </View>

            <View style={styles.labelContainer}>
              <View style={styles.labelBox}>
                <Text style={styles.labelText}>Sub Goal</Text>
              </View>
            </View>
            <View style={styles.aiRecommendationContainer}>
              <StarIcon width={16} height={16} color={Colors.main900} />
              <Text style={[Typo.label03, { color: Colors.main900 }]}>
                AI 추천으로 세부 목표를 정해요!
              </Text>
            </View>

            <FlatList
              data={recommendedSubGoals}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              style={styles.listContainer}
              ListEmptyComponent={
                isLoadingRecommendations ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={Colors.main600} />
                    <Text style={[Typo.label03, styles.loadingText]}>
                      AI 추천을 불러오는 중이에요...
                    </Text>
                  </View>
                ) : (
                  <View style={styles.loadingContainer}>
                    <Text style={[Typo.label03, styles.emptyText]}>
                      추천된 세부 목표가 없어요. 직접 추가해보세요!
                    </Text>
                  </View>
                )
              }
              renderItem={({ item }) => {
                const isSelected = selectedRecommendedIds.includes(item.id);
                return (
                  <TouchableOpacity onPress={() => toggleSubGoal(item.id)}>
                    <View
                      style={[
                        styles.subGoalItem,
                        {
                          borderColor: isSelected
                            ? Colors.main600
                            : Colors.gray200,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          Typo.body02,
                          {
                            color: isSelected ? Colors.main900 : Colors.gray300,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={styles.aiRecommendationContainer}>
              <PenIcon width={16} height={16} color={Colors.main900} />
              <Text style={[Typo.label03, { color: Colors.main900 }]}>
                내가 직접 세부목표를 추가해요
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputBox,
                  {
                    borderBottomColor: subGoalText
                      ? Colors.main600
                      : Colors.gray200,
                  },
                ]}
              >
                <View style={styles.inputRow}>
                  <TextInput
                    style={[
                      Typo.body02,
                      {
                        color: subGoalText ? Colors.gray600 : Colors.gray300,
                        flex: 1,
                      },
                    ]}
                    placeholder="세부 목표를 입력해주세요"
                    placeholderTextColor={Colors.gray300}
                    value={subGoalText}
                    onChangeText={setSubGoalText}
                  />
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      isAddDisabled && styles.addButtonDisabled,
                    ]}
                    onPress={addUserGoal}
                    disabled={isAddDisabled}
                  >
                    <Text
                      style={[
                        styles.addButtonText,
                        isAddDisabled && styles.addButtonTextDisabled,
                      ]}
                    >
                      {isAddingManual ? '추가 중...' : '추가'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 사용자가 추가한 목표들 */}
            <View style={styles.manualListContainer}>
              {manualSubGoals.map((goal) => {
                const isSelected = selectedRecommendedIds.includes(goal.id);
                return (
                  <View
                    key={goal.id}
                    style={[
                      styles.subGoalItem,
                      styles.userAddedItem,
                      {
                        borderColor: isSelected ? Colors.main600 : Colors.gray200,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.manualGoalButton}
                      onPress={() => toggleSubGoal(goal.id)}
                    >
                      <Text
                        style={[
                          Typo.body02,
                          { color: isSelected ? Colors.main900 : Colors.gray300 },
                        ]}
                        numberOfLines={2}
                      >
                        {goal.title}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeUserGoal(goal.id)}>
                      <XIcon width={16} height={16} color={Colors.gray400} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
      </OnboardingLayout>

      <StepButton text="다음" onPress={handleNext} disabled={!isNextButtonActive || isSubmitting} />
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
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: Colors.main600,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    ...Typo.label03,
    color: Colors.gray900,
    textAlign: 'center',
  },
  aiRecommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 8,
    gap: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  listContainer: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  manualListContainer: {
    marginTop: 16,
  },
  subGoalItem: {
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
  },
  userAddedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...Typo.label03,
    color: Colors.gray900,
    textAlign: 'center',
  },
  addButtonDisabled: {
    backgroundColor: Colors.gray100,
  },
  addButtonTextDisabled: {
    color: Colors.gray400,
  },
  manualGoalButton: {
    flex: 1,
    marginRight: 12,
  },
  loadingContainer: {
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.main900,
    marginTop: 8,
  },
  emptyText: {
    color: Colors.gray400,
    textAlign: 'center',
    marginTop: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
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
});
