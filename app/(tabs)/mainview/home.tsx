//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';
import GoalStepModal, {
  GoalCreationData,
} from '@/components/goalstep/GoalStepModal';
import AddMainGoalCard from '@/components/home/AddMainGoalCard';
//하위 컴포넌트
import MainGoalCard from '@/components/home/MainGoalCard';
import StepCard from '@/components/home/SubGoalCard';
import ReusableModal from '@/components/shared/ReusableModal';
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';
import {
  completeHomeSubgoal,
  fetchGoalSubGoals,
  fetchGoalsRibbon,
  fetchHomeUserName,
} from '@/services/home/homeService';
import type { GoalCategory } from '@/types/goal';
import type { GoalSubgoal, GoalsRibbonGoal } from '@/types/home';

import React, { useCallback, useEffect, useState } from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

type MainGoalCardCategory =
  | 'daily'
  | 'health'
  | 'hobby'
  | 'people'
  | 'study'
  | 'task';

type SubGoal = {
  id: string;
  backendId?: number | string;
  step: number;
  title: string;
  completed: boolean;
  status?: string;
};

type HomeGoal = {
  id: string;
  serverId?: number | string;
  category: MainGoalCardCategory;
  title: string;
  subGoals: SubGoal[];
  progress: number;
  rawCategory?: GoalCategory;
  hasFetchedSubGoals?: boolean;
};

const goalCategoryMap: Record<GoalCategory, MainGoalCardCategory> = {
  LEARNING: 'study',
  LIFE: 'daily',
  EXERCISE: 'health',
  ASSIGNMENT: 'task',
  RELATIONSHIP: 'people',
  SELF_DEVELOPMENT: 'hobby',
};

const goalModalCategoryMap: Record<string, GoalCategory> = {
  '학습·언어': 'LEARNING',
  일상생활: 'LIFE',
  '건강·운동': 'EXERCISE',
  '업무·과제': 'ASSIGNMENT',
  관계: 'RELATIONSHIP',
  자기개발: 'SELF_DEVELOPMENT',
};

function calculateProgress(subGoals: SubGoal[]): number {
  if (!subGoals.length) {
    return 0;
  }
  const completed = subGoals.filter((sg) => sg.completed).length;
  return Math.max(0, Math.min(1, completed / subGoals.length));
}

function normalizeProgress(value?: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value <= 1) {
    return value;
  }
  if (value <= 100) {
    return value / 100;
  }
  return 1;
}

function resolveGoalCategory(
  category: GoalCategory | string | undefined,
): GoalCategory | undefined {
  if (typeof category !== 'string') {
    return undefined;
  }

  if (Object.prototype.hasOwnProperty.call(goalCategoryMap, category)) {
    return category as GoalCategory;
  }

  if (Object.prototype.hasOwnProperty.call(goalModalCategoryMap, category)) {
    return goalModalCategoryMap[category];
  }

  return undefined;
}

function mapGoalCategory(
  category?: GoalCategory | string,
): MainGoalCardCategory {
  const resolved = resolveGoalCategory(category);
  if (!resolved) {
    return 'study';
  }
  return goalCategoryMap[resolved] ?? 'study';
}

function isCompletedStatus(status?: string): boolean {
  if (!status) {
    return false;
  }
  return status.toUpperCase() === 'COMPLETED';
}

function mapSubGoalFromResponse(subgoal: GoalSubgoal, index: number): SubGoal {
  const backendIdentifier = subgoal.id ?? subgoal.subgoalId;
  const id =
    backendIdentifier !== undefined
      ? String(backendIdentifier)
      : `sub-${index}-${Date.now()}`;
  const status =
    typeof subgoal.status === 'string' ? subgoal.status : undefined;
  const completedFlag =
    typeof subgoal.completed === 'boolean'
      ? subgoal.completed
      : isCompletedStatus(status);
  return {
    id,
    backendId: backendIdentifier,
    step: index + 1,
    title: typeof subgoal.title === 'string' ? subgoal.title : '',
    completed: completedFlag,
    status,
  };
}

function mapSubGoalsFromResponse(subgoals: GoalSubgoal[]): SubGoal[] {
  return subgoals.map((subgoal, index) =>
    mapSubGoalFromResponse(subgoal, index),
  );
}

function mapRibbonGoal(goal: GoalsRibbonGoal, index: number): HomeGoal {
  const normalizedProgress = normalizeProgress(goal.progress);
  const resolvedCategory = mapGoalCategory(goal.category);
  const rawCategory = resolveGoalCategory(goal.category);
  return {
    id: goal.id !== undefined ? String(goal.id) : `goal-${index}`,
    serverId: goal.id,
    title: typeof goal.title === 'string' ? goal.title : '',
    category: resolvedCategory,
    subGoals: [],
    progress: normalizedProgress,
    rawCategory,
    hasFetchedSubGoals: false,
  };
}

export default function Home() {
  const [userName, setUserName] = useState<string>('장효원');
  const router = useRouter();

  const [mainGoals, setMainGoals] = useState<HomeGoal[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [showGoalStep, setShowGoalStep] = useState(false);

  // 서브골 완료 체크 시 모달
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [targetGoal, setTargetGoal] = useState<{
    mainId: string;
    subId: string;
    backendId?: string | number;
    title: string;
  } | null>(null);

  const selectedGoal = mainGoals.find((g) => g.id === selectedId);

  const applyRibbonGoals = useCallback(
    (ribbonGoals: GoalsRibbonGoal[], preferredId?: string | number) => {
      const normalized = ribbonGoals.map((goal, index) =>
        mapRibbonGoal(goal, index),
      );

      setMainGoals(normalized);
      setSelectedId((prev) => {
        if (!normalized.length) {
          return '';
        }

        const desiredId =
          preferredId !== undefined ? String(preferredId) : prev;

        if (desiredId && normalized.some((goal) => goal.id === desiredId)) {
          return desiredId;
        }

        return normalized[0]?.id ?? '';
      });
    },
    [],
  );

  const refreshGoalsRibbon = useCallback(
    async (preferredId?: string | number, signal?: { canceled: boolean }) => {
      try {
        const ribbonGoals = await fetchGoalsRibbon();
        if (signal?.canceled) {
          return;
        }
        applyRibbonGoals(ribbonGoals, preferredId);
      } catch (error) {
        if (!signal?.canceled) {
          console.error('[Home] Failed to load goals ribbon', error);
        }
      }
    },
    [applyRibbonGoals],
  );

  useEffect(() => {
    let isCanceled = false;

    const loadUserName = async () => {
      try {
        const nickname = await fetchHomeUserName();
        if (!isCanceled && nickname) {
          setUserName(nickname);
        }
      } catch (error) {
        console.error('[Home] Failed to load user nickname', error);
      }
    };

    loadUserName();

    return () => {
      isCanceled = true;
    };
  }, []);

  useEffect(() => {
    const signal = { canceled: false };
    refreshGoalsRibbon(undefined, signal);
    return () => {
      signal.canceled = true;
    };
  }, [refreshGoalsRibbon]);

  useEffect(() => {
    const goal = mainGoals.find((g) => g.id === selectedId);
    if (!goal) {
      return;
    }
    if (goal.hasFetchedSubGoals) {
      return;
    }
    const serverId = goal.serverId;
    if (serverId === undefined) {
      return;
    }

    let isCanceled = false;

    const loadSubGoals = async () => {
      try {
        const subgoals = await fetchGoalSubGoals(serverId);
        if (isCanceled) {
          return;
        }

        const normalized = mapSubGoalsFromResponse(subgoals);

        setMainGoals((prev) =>
          prev.map((item) => {
            if (item.id !== goal.id) {
              return item;
            }
            const nextSubGoals = normalized;
            return {
              ...item,
              subGoals: nextSubGoals,
              hasFetchedSubGoals: true,
              progress:
                nextSubGoals.length > 0
                  ? calculateProgress(nextSubGoals)
                  : item.progress,
            };
          }),
        );
      } catch (error) {
        console.error(
          `[Home] Failed to load subgoals goalId=${serverId}`,
          error,
        );
        setMainGoals((prev) =>
          prev.map((item) =>
            item.id === goal.id ? { ...item, hasFetchedSubGoals: true } : item,
          ),
        );
      }
    };

    loadSubGoals();

    return () => {
      isCanceled = true;
    };
  }, [selectedId, mainGoals]);

  // subGoal 완료 처리 함수
  const completeSubGoal = async (
    goalId: string,
    subGoalId: string,
    backendId?: string | number,
  ) => {
    const remoteId = backendId ?? subGoalId;
    let parentGoalProgress: number | undefined;

    if (backendId !== undefined) {
      try {
        const completion = await completeHomeSubgoal(remoteId);
        parentGoalProgress = normalizeProgress(completion?.parentGoalProgress);
      } catch (error) {
        console.error(
          `[Home] Failed to complete subgoal (remote) subGoalId=${remoteId}`,
          error,
        );
        return;
      }
    }

    setMainGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal;
        }

        const updatedSubGoals = goal.subGoals.map((sg) =>
          sg.id === subGoalId
            ? {
                ...sg,
                completed: true,
                status: 'COMPLETED',
              }
            : sg,
        );

        return {
          ...goal,
          subGoals: updatedSubGoals,
          hasFetchedSubGoals: true,
          progress:
            parentGoalProgress !== undefined
              ? parentGoalProgress
              : updatedSubGoals.length > 0
              ? calculateProgress(updatedSubGoals)
              : goal.progress,
        };
      }),
    );
  };

  // StepCard 클릭 시 → 모달 열기
  const handleStepPress = (goal: HomeGoal, subGoal: SubGoal) => {
    if (subGoal.completed) {
      return; // 이미 완료된 항목 클릭 불가
    }
    setTargetGoal({
      mainId: goal.id,
      subId: subGoal.id,
      backendId: subGoal.backendId,
      title: subGoal.title,
    });
    setCheckModalVisible(true);
  };

  // 목표 설정 완료 후 새로운 목표 추가
  const handleGoalStepComplete = useCallback(
    async (goalData: GoalCreationData) => {
      const preferredId =
        goalData?.committedGoalId ??
        goalData?.commitResponse?.result?.goalId ??
        goalData?.commitResponse?.result?.draftGoalId;

      await refreshGoalsRibbon(preferredId);
    },
    [refreshGoalsRibbon],
  );

  return (
    <View style={styles.container}>
      {/* 인사 + 캐릭터 */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{userName}님!</Text>
          <Text style={styles.subtitle}>오늘도{'\n'}미션하러 가볼까요?</Text>
        </View>
        <HomeDependentIcon width={120} height={120} />
      </View>

      <View>
        {/* 메인골 카드 리스트 */}
        <FlatList
          horizontal
          data={mainGoals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MainGoalCard
              title={item.title}
              category={item.category}
              completed={item.subGoals.filter((s) => s.completed).length}
              total={item.subGoals.length}
              progress={item.progress}
              selected={selectedId === item.id}
              onPress={() => setSelectedId(item.id)}
            />
          )}
          // 리스트 끝에 플러스 카드 추가 ========>>> 목표 설정 모달 트리거
          ListFooterComponent={
            <AddMainGoalCard onPress={() => setShowGoalStep(true)} />
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            alignItems: 'center',
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* 회색 영역 (서브 골 리스트) */}
      <View style={styles.subGoalSection}>
        {/* 선택된 메인골 제목 */}
        <Text style={styles.selectedMainGoalTitle}>{selectedGoal?.title}</Text>
        {/* 서브골 카드 리스트 (세로 스크롤) */}
        <FlatList
          data={selectedGoal?.subGoals || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StepCard
              step={item.step}
              title={item.title}
              completed={item.completed}
              onPress={() => {
                if (!selectedGoal) {
                  return;
                }
                handleStepPress(selectedGoal, item);
              }}
            />
          )}
          contentContainerStyle={styles.subGoalContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* 목표 설정 모달 */}
      <GoalStepModal
        visible={showGoalStep}
        onClose={() => setShowGoalStep(false)}
        onComplete={handleGoalStepComplete}
      />

      {/* 탈퇴하기 모달 */}
      <ReusableModal
        isVisible={checkModalVisible}
        title="목표를 완료했나요?"
        subtitle={
          targetGoal ? `"${targetGoal.title}" 일정을 완료하셨나요?` : ''
        }
        cancelText="취소"
        confirmText="완료"
        onCancel={() => {
          setCheckModalVisible(false);
          setTargetGoal(null);
        }}
        onConfirm={async () => {
          if (targetGoal) {
            await completeSubGoal(
              targetGoal.mainId,
              targetGoal.subId,
              targetGoal.backendId,
            );
          }
          setCheckModalVisible(false);
          setTargetGoal(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  name: {
    ...Typo.title03,
    color: Colors.main700,
  },
  subtitle: {
    marginTop: 12,
    ...Typo.heading01,
    color: '#000',
    lineHeight: 24,
  },
  subGoalSection: {
    flex: 1,
    backgroundColor: Colors.gray100, // 회색 배경
    marginTop: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
  },
  selectedMainGoalTitle: {
    marginBottom: 15,
    marginLeft: 19,
    ...Typo.heading02,
    color: Colors.sub500,
  },
  subGoalContainer: {
    paddingHorizontal: 13,
    paddingBottom: 24,
  },
});
