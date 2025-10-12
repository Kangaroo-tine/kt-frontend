import { useState } from 'react';

import {
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

export default function ScreenCode() {
  const router = useRouter();
  const { goalText: mainGoal, categoryValue, goalDraftId } = useLocalSearchParams();
  const [subGoalText, setSubGoalText] = useState('');
  const [selectedSubGoals, setSelectedSubGoals] = useState<string[]>([]);
  const [userAddedGoals, setUserAddedGoals] = useState<string[]>([]);

  const toggleSubGoal = (goal: string) => {
    setSelectedSubGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((item) => item !== goal)
        : [...prev, goal],
    );
  };

  const addUserGoal = () => {
    if (subGoalText.trim()) {
      setUserAddedGoals((prev) => [...prev, subGoalText.trim()]);
      setSubGoalText('');
    }
  };

  const removeUserGoal = (goal: string) => {
    setUserAddedGoals((prev) => prev.filter((item) => item !== goal));
  };

  // 총 선택된 목표 개수 (AI 추천 + 사용자 추가)
  const totalSelectedGoals = selectedSubGoals.length + userAddedGoals.length;
  const isNextButtonActive = totalSelectedGoals >= 3;

  // 더미 데이터 - 10개 아이템
  const subGoals = [
    '아침 기상 시간 지키기',
    '매일 30분 운동하기',
    '건강한 아침식사 먹기',
    '일찍 잠자리에 들기',
    '물 2L 이상 마시기',
    '스마트폰 사용 시간 줄이기',
    '독서 30분 하기',
    '명상 10분 하기',
    '계단 이용하기',
    '감사 일기 쓰기',
  ];

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
              data={subGoals}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              style={styles.listContainer}
              renderItem={({ item }) => {
                const isSelected = selectedSubGoals.includes(item);
                return (
                  <TouchableOpacity onPress={() => toggleSubGoal(item)}>
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
                        {item}
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
                    style={styles.addButton}
                    onPress={addUserGoal}
                  >
                    <Text style={styles.addButtonText}>추가</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* 사용자가 추가한 목표들 */}
            <View style={{ marginTop: 16 }}>
              {userAddedGoals.map((goal, index) => (
                <View
                  key={`user-${index}`}
                  style={[
                    styles.subGoalItem,
                    styles.userAddedItem,
                    { borderColor: Colors.main600 },
                  ]}
                >
                  <Text
                    style={[Typo.body02, { color: Colors.main900, flex: 1 }]}
                  >
                    {goal}
                  </Text>
                  <TouchableOpacity onPress={() => removeUserGoal(goal)}>
                    <XIcon width={16} height={16} color={Colors.gray400} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
      </OnboardingLayout>

      <StepButton
        text="다음"
        onPress={() => {
          const allSelectedGoals = [...selectedSubGoals, ...userAddedGoals];
          const params = new URLSearchParams({
            mainGoal: ((mainGoal as string) || '').toString(),
            subGoals: JSON.stringify(allSelectedGoals),
          });

          if (categoryValue) {
            params.append('categoryValue', (categoryValue as string) || '');
          }

          if (goalDraftId) {
            params.append('goalDraftId', (goalDraftId as string) || '');
          }

          router.push(`/step5?${params.toString()}`);
        }}
        disabled={!isNextButtonActive}
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
