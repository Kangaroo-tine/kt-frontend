import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ArrowDown from '@/assets/icon/arrow/down_arrow.svg';
import ArrowUp from '@/assets/icon/arrow/up_arrow.svg';
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import Daily from '@/assets/icon/goal/daily.svg';
import Exercise from '@/assets/icon/goal/exercise.svg';
import Hobby from '@/assets/icon/goal/hobby.svg';
import People from '@/assets/icon/goal/people.svg';
import Study from '@/assets/icon/goal/study.svg';
import Task from '@/assets/icon/goal/task.svg';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';
import { fetchGoalSubGoals } from '@/services/goal/goalService';
import { fetchGoalsRibbon } from '@/services/home/homeService';
import { createSchedule } from '@/services/schedule/scheduleService';
import type { GoalsRibbonGoal } from '@/types/home';
import type { GoalSubgoal } from '@/types/goal';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const dayToApi: Record<string, string> = {
  일: 'SUN',
  월: 'MON',
  화: 'TUE',
  수: 'WED',
  목: 'THU',
  금: 'FRI',
  토: 'SAT',
};

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

type GoalCategory =
  | 'exercise'
  | 'daily'
  | 'hobby'
  | 'people'
  | 'study'
  | 'task'
  | undefined;

type GoalOption = {
  id: string;
  title: string;
  category?: GoalCategory;
};

type SubGoalOption = {
  id: string;
  title: string;
};

const mapGoalCategory = (value?: string | null): GoalCategory => {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  switch (normalized) {
    case 'exercise':
      return 'exercise';
    case 'life':
    case 'daily':
      return 'daily';
    case 'hobby':
    case 'self_development':
      return 'hobby';
    case 'people':
    case 'relationship':
      return 'people';
    case 'study':
    case 'learning':
      return 'study';
    case 'task':
    case 'assignment':
      return 'task';
    default:
      return undefined;
  }
};

const renderGoalIcon = (category?: GoalCategory, size = 18) => {
  switch (category) {
    case 'exercise':
      return <Exercise width={size} height={size} style={{ marginRight: 6 }} />;
    case 'daily':
      return <Daily width={size} height={size} style={{ marginRight: 6 }} />;
    case 'hobby':
      return <Hobby width={size} height={size} style={{ marginRight: 6 }} />;
    case 'people':
      return <People width={size} height={size} style={{ marginRight: 6 }} />;
    case 'study':
      return <Study width={size} height={size} style={{ marginRight: 6 }} />;
    case 'task':
      return <Task width={size} height={size} style={{ marginRight: 6 }} />;
    default:
      return null;
  }
};

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseId = (value: string) => {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
};

export default function ScheduleAddScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [mainOpen, setMainOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const [mainGoals, setMainGoals] = useState<GoalOption[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(null);
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  const [subGoals, setSubGoals] = useState<SubGoalOption[]>([]);
  const [selectedSubGoal, setSelectedSubGoal] = useState<SubGoalOption | null>(null);
  const [subGoalsError, setSubGoalsError] = useState<string | null>(null);
  const [isLoadingSubGoals, setIsLoadingSubGoals] = useState(false);

  const [title, setTitle] = useState('');
  const [localDate, setLocalDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startValid = HHMM.test(startTime);
  const endValid = HHMM.test(endTime);
  const bothTimeValid =
    startValid && endValid && toMinutes(startTime) < toMinutes(endTime);
  const dateValid = ISO_DATE.test(localDate);

  const recurrenceDays = useMemo(
    () =>
      repeatDays
        .map((day) => dayToApi[day])
        .filter((value): value is string => typeof value === 'string'),
    [repeatDays],
  );

  const canSubmit =
    !!selectedGoal?.id &&
    !!selectedSubGoal?.id &&
    !!title.trim() &&
    bothTimeValid &&
    dateValid &&
    !isSubmitting;

  const toggleDay = (d: string) =>
    setRepeatDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  const onPressMain = () => {
    setMainOpen((prev) => !prev);
    setSubOpen(false);
    setGoalsError(null);
  };

  const onPressSub = () => {
    if (!selectedGoal) return;
    setSubOpen((prev) => !prev);
    setMainOpen(false);
    setSubGoalsError(null);
  };

  useEffect(() => {
    let isMounted = true;

    const loadGoals = async () => {
      setIsLoadingGoals(true);
      setGoalsError(null);
      try {
        const response = await fetchGoalsRibbon();
        if (!isMounted) return;

        const items: GoalsRibbonGoal[] = Array.isArray(response) ? response : [];

        const mapped = items.map((goal: GoalsRibbonGoal) => ({
          id: String(goal.id),
          title: goal.title ?? '',
          category: mapGoalCategory(goal.category),
        }));

        setMainGoals(mapped);
        console.log('[ScheduleAdd] Goals fetched:', JSON.stringify(mapped));
      } catch (error) {
        if (!isMounted) return;
        console.error('[ScheduleAdd] Failed to fetch goals:', error);
        const message =
          error instanceof Error ? error.message : '메인 목표를 불러오지 못했습니다.';
        setGoalsError(message);
      } finally {
        if (isMounted) {
          setIsLoadingGoals(false);
        }
      }
    };

    loadGoals();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (!selectedGoal?.id) {
      setSubGoals([]);
      setSelectedSubGoal(null);
      return;
    }

    const loadSubGoals = async () => {
      setIsLoadingSubGoals(true);
      setSubGoalsError(null);
      try {
        const response = await fetchGoalSubGoals(selectedGoal.id);
        if (!isMounted) return;

        const items = Array.isArray(response) ? response : [];

        const mapped = items
          .filter((item): item is GoalSubgoal => item.id !== undefined || item.subgoalId !== undefined)
          .map((item: GoalSubgoal) => ({
            id: String(item.id ?? item.subgoalId),
            title: item.title ?? item.subgoalTitle ?? '',
          }));

        setSubGoals(mapped);
        setSelectedSubGoal(null);
        console.log(
          '[ScheduleAdd] Subgoals fetched for goal',
          selectedGoal.id,
          JSON.stringify(mapped),
        );
      } catch (error) {
        if (!isMounted) return;
        console.error('[ScheduleAdd] Failed to fetch subgoals:', error);
        const message =
          error instanceof Error ? error.message : '서브 목표를 불러오지 못했습니다.';
        setSubGoalsError(message);
        setSubGoals([]);
        setSelectedSubGoal(null);
      } finally {
        if (isMounted) {
          setIsLoadingSubGoals(false);
        }
      }
    };

    loadSubGoals();
    return () => {
      isMounted = false;
    };
  }, [selectedGoal?.id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
        >
          <BackArrow width={20} height={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 추가</Text>
      </View>

      {/* Main Goal */}
      <View style={styles.dropdownWrap}>
        <Text style={styles.title}>Main Goal</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.selectBox,
            (mainOpen || !!selectedGoal) && { borderColor: Colors.main600 },
          ]}
          onPress={onPressMain}
        >
          <View style={styles.selectBoxLeft}>
            {renderGoalIcon(selectedGoal?.category)}
            <Text
              style={[Typo.label02, !selectedGoal && { color: Colors.gray300 }]}
              numberOfLines={1}
            >
              {selectedGoal?.title ?? 'Main Goal 선택하기'}
            </Text>
          </View>
          {mainOpen ? <ArrowUp width={16} height={16} /> : <ArrowDown width={16} height={16} />}
        </TouchableOpacity>

        {mainOpen && (
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {isLoadingGoals ? (
              <View style={styles.dropdownLoading}>
                <ActivityIndicator size="small" color={Colors.main600} />
              </View>
            ) : goalsError ? (
              <View style={styles.dropdownLoading}>
                <Text style={[Typo.label03, { color: Colors.gray400 }]}>{goalsError}</Text>
              </View>
            ) : mainGoals.length === 0 ? (
              <View style={styles.dropdownLoading}>
                <Text style={[Typo.label03, { color: Colors.gray400 }]}>
                  등록된 메인 목표가 없어요.
                </Text>
              </View>
            ) : (
              mainGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedGoal(goal);
                    setMainOpen(false);
                    setSubOpen(false);
                  }}
                >
                  {renderGoalIcon(goal.category)}
                  <Text
                    style={[
                      Typo.label03,
                      goal.id === selectedGoal?.id && { color: Colors.main600 },
                    ]}
                  >
                    {goal.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Sub Goal */}
      <View style={styles.dropdownWrap}>
        <Text style={styles.title}>Sub Goal</Text>

        <TouchableOpacity
          activeOpacity={selectedGoal ? 0.8 : 1}
          style={[
            styles.selectBox,
            !selectedGoal && styles.selectBoxDisabled,
            (subOpen || !!selectedSubGoal) && selectedGoal && { borderColor: Colors.main600 },
          ]}
          onPress={onPressSub}
        >
          <View style={styles.selectBoxLeft}>
            <Text
              style={[Typo.label02, !selectedSubGoal && { color: Colors.gray300 }]}
              numberOfLines={1}
            >
              {selectedSubGoal?.title ?? 'Sub Goal 선택하기'}
            </Text>
          </View>
          {subOpen ? <ArrowUp width={16} height={16} /> : <ArrowDown width={16} height={16} />}
        </TouchableOpacity>

        {subOpen && (
          <ScrollView style={styles.dropdownList}>
            {isLoadingSubGoals ? (
              <View style={styles.dropdownLoading}>
                <ActivityIndicator size="small" color={Colors.main600} />
              </View>
            ) : subGoalsError ? (
              <View style={styles.dropdownLoading}>
                <Text style={[Typo.label03, { color: Colors.gray400 }]}>{subGoalsError}</Text>
              </View>
            ) : subGoals.length === 0 ? (
              <View style={styles.dropdownLoading}>
                <Text style={[Typo.label03, { color: Colors.gray400 }]}>
                  선택한 메인 목표에 서브 목표가 없어요.
                </Text>
              </View>
            ) : (
              subGoals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedSubGoal(goal);
                    setSubOpen(false);
                  }}
                >
                  <Text
                    style={[
                      Typo.label03,
                      goal.id === selectedSubGoal?.id && { color: Colors.main600 },
                    ]}
                  >
                    {goal.title}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Details */}
      <View style={styles.card}>
        <Text style={Typo.body01}>제목</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="제목을 입력해주세요"
          placeholderTextColor={Colors.gray300}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[Typo.body01, { marginTop: 14 }]}>날짜 (YYYY-MM-DD)</Text>
        <TextInput
          style={[
            styles.titleInput,
            dateValid ? styles.dateActive : styles.dateIdle,
          ]}
          placeholder="2025-10-14"
          placeholderTextColor={Colors.gray300}
          value={localDate}
          onChangeText={setLocalDate}
          maxLength={10}
        />

        <Text style={[Typo.body01, { marginTop: 14 }]}>시간</Text>
        <View style={styles.timeRow}>
          <TextInput
            style={[
              styles.timeInput,
              startValid ? styles.timeActive : styles.timeIdle,
            ]}
            placeholder="00:00"
            placeholderTextColor={Colors.gray300}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            value={startTime}
            onChangeText={setStartTime}
          />
          <Text
            style={[
              Typo.label03,
              styles.timeArrow,
              { color: bothTimeValid ? Colors.main600 : Colors.gray300 },
            ]}
          >
            →
          </Text>
          <TextInput
            style={[
              styles.timeInput,
              endValid ? styles.timeActive : styles.timeIdle,
            ]}
            placeholder="00:00"
            placeholderTextColor={Colors.gray300}
            keyboardType="numbers-and-punctuation"
            maxLength={5}
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>

        <Text style={[Typo.body01, { marginTop: 14 }]}>반복</Text>
        <View style={styles.daysRow}>
          {DAYS.map((d) => {
            const on = repeatDays.includes(d);
            return (
              <TouchableOpacity
                key={d}
                onPress={() => toggleDay(d)}
                style={[styles.dayChip, on && styles.dayChipOn]}
                activeOpacity={0.8}
              >
                <Text
                  style={[Typo.label01, { color: on ? Colors.main600 : Colors.gray400 }]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={canSubmit ? 0.9 : 1}
        style={[styles.submitBtn, (!canSubmit || isSubmitting) && styles.submitBtnDisabled]}
        onPress={async () => {
          if (!canSubmit || !selectedGoal || !selectedSubGoal) {
            return;
          }

          const startDateTime = `${localDate} ${startTime}`;
          const endDateTime = `${localDate} ${endTime}`;
          const payload = {
            goalId: parseId(selectedGoal.id),
            subgoalId: parseId(selectedSubGoal.id),
            title: title.trim(),
            localDate,
            startTime: startDateTime,
            endTime: endDateTime,
            recurrenceDays,
          };

          try {
            setIsSubmitting(true);
            console.log('[ScheduleAdd] createSchedule payload:', JSON.stringify(payload));
            const response = await createSchedule(payload);
            console.log('[ScheduleAdd] createSchedule response:', JSON.stringify(response));
            Alert.alert(
              '등록 완료',
              response?.message ?? '일정이 등록되었습니다.',
              [
                {
                  text: '확인',
                  onPress: () => router.back(),
                },
              ],
            );
          } catch (error) {
            console.error('[ScheduleAdd] createSchedule error:', error);
            const message =
              error instanceof Error ? error.message : '일정 등록 중 문제가 발생했습니다.';
            Alert.alert('등록 실패', message);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <Text style={[Typo.heading04, { color: Colors.gray0 }]}>
          {isSubmitting ? '등록 중...' : '등록하기'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  headerTitle: {
    ...Typo.heading04,
    color: Colors.gray800,
  },
  title: {
    ...Typo.heading02,
    color: '#000',
    lineHeight: 24,
  },
  dropdownWrap: {
    marginTop: 6,
    marginBottom: 18,
  },
  selectBox: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.gray0,
  },
  selectBoxDisabled: {
    borderColor: Colors.gray200,
    opacity: 0.6,
  },
  selectBoxLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.main600,
    borderRadius: 10,
    backgroundColor: Colors.gray0,
    overflow: 'hidden',
    maxHeight: 48 * 4.5,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  dropdownLoading: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray300,
    paddingVertical: 8,
    marginTop: 4,
    marginBottom: 10,
  },
  dateIdle: {
    borderBottomColor: Colors.gray300,
  },
  dateActive: {
    borderBottomColor: Colors.main600,
  },
  timeRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timeInput: {
    width: 60,
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 18,
    borderWidth: 1,
    textAlign: 'center',
  },
  timeIdle: {
    borderColor: Colors.gray200,
    color: Colors.gray400,
    backgroundColor: Colors.gray0,
  },
  timeActive: {
    borderColor: Colors.main600,
    color: Colors.main800,
  },
  timeArrow: {
    marginHorizontal: 20,
    fontSize: 20,
  },
  daysRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
    minWidth: 34,
    alignItems: 'center',
    marginBottom: 20,
  },
  dayChipOn: {
    borderColor: Colors.main600,
  },
  submitBtn: {
    marginTop: 4,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.main600,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.gray200,
  },
});
