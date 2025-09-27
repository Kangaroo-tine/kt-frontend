// app/(onboarding)/start.tsx
import { useState } from 'react';

import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import PenIcon from '../../assets/icon/pen.svg';
import StarIcon from '../../assets/icon/star.svg';
import XIcon from '../../assets/icon/x.svg';
//컴포넌트
import Header from '../../components/Header';
import ProgressBar from '../../components/ProgressBar';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenCode() {
  const router = useRouter();
  const { goalText: mainGoal } = useLocalSearchParams();
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Header title="STEP 3 목록화" />
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title03, { color: Colors.gray900 }]}>
              이제 Main Goal을{'\n'}작은 단계들로 나누어 볼까요?
            </Text>
          </View>
          <ProgressBar progress={0.5} />
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              작은 성공을 하나씩 쌓아가면 큰 목표도 더 쉽게 달성할 수 있어요!
            </Text>
          </View>

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

          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={!isNextButtonActive}
            onPress={() => {
              const allSelectedGoals = [...selectedSubGoals, ...userAddedGoals];
              router.push(
                `/step5?mainGoal=${encodeURIComponent(
                  (mainGoal as string) || '',
                )}&subGoals=${encodeURIComponent(
                  JSON.stringify(allSelectedGoals),
                )}`,
              );
            }}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: isNextButtonActive
                    ? Colors.main500
                    : Colors.gray100,
                },
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
    marginBottom: 80,
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
  inputWrapper: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
});
