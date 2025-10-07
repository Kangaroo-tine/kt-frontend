//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';
import GoalStepModal from '@/components/goalstep/GoalStepModal';
import AddMainGoalCard from '@/components/home/AddMainGoalCard';
//하위 컴포넌트
import MainGoalCard from '@/components/home/MainGoalCard';
import StepCard from '@/components/home/SubGoalCard';
import ReusableModal from "@/components/shared/ReusableModal";
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

import React, { useState } from 'react';

import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

//임의 메인골, 서브골 데이터
const mockData = [
  {
    id: 'main-1',
    category: 'health',
    title: '수영 잘하기',
    subGoals: [
      { id: 'sub-1-1', step: 1, title: '수영장 등록하기', completed: true },
      { id: 'sub-1-2', step: 2, title: '준비물 챙기기', completed: false },
      { id: 'sub-1-3', step: 3, title: '주 3회 수영하기', completed: false },
      { id: 'sub-1-4', step: 4, title: '자유형 마스터', completed: false },
    ],
  },
  {
    id: 'main-2',
    category: 'study',
    title: '자격증 따기',
    subGoals: [
      { id: 'sub-2-1', step: 1, title: '교재 구입하기', completed: false },
      { id: 'sub-2-2', step: 2, title: '1장 끝내기', completed: false },
    ],
  },
  {
    id: 'main-3',
    category: 'hobby',
    title: '자격증 따기',
    subGoals: [
      { id: 'sub-3-1', step: 1, title: '교재 구입하기', completed: false },
      { id: 'sub-3-2', step: 2, title: '1장 끝내기', completed: false },
    ],
  },
  {
    id: 'main-4',
    category: 'task',
    title: '자격증 따기',
    subGoals: [
      { id: 'sub-4-1', step: 1, title: '교재 구입하기', completed: false },
      { id: 'sub-4-2', step: 2, title: '1장 끝내기', completed: false },
    ],
  },
  {
    id: 'main-5',
    category: 'people',
    title: '자격증 따기',
    subGoals: [
      { id: 'sub-5-1', step: 1, title: '교재 구입하기', completed: false },
      { id: 'sub-5-2', step: 2, title: '1장 끝내기', completed: false },
    ],
  },
];

export default function Home() {
  const userName = '장효원'; //임의 사용자 이름
  const router = useRouter();

  const [mainGoals, setMainGoals] = useState(mockData);
  const [selectedId, setSelectedId] = useState<string>(mockData[0].id);
  const [showGoalStep, setShowGoalStep] = useState(false);

  // 메인골 추가 버튼을 위한 부분
  const listData = [...mainGoals, { id: 'add-card', type: 'add' }];


  // 서브골 완료 체크 시 모달
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [targetGoal, setTargetGoal] = useState<{
    mainId: string;
    subId: string; 
    title: string;
  } | null>(null);

  const selectedGoal = mainGoals.find((g) => g.id === selectedId);

  // subGoal 완료 처리 함수
  const completeSubGoal = (goalId: string, subGoalId: string) => {
    setMainGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              subGoals: goal.subGoals.map((sg) =>
                sg.id === subGoalId ? { ...sg, completed: true } : sg
              ),
            }
          : goal
      )
    );
  };

  // StepCard 클릭 시 → 모달 열기
  const handleStepPress = (
    goalId: string,
    subGoalId: string,
    title: string,
    completed: boolean
  ) => {
    if (completed) return; // 이미 완료된 항목 클릭 불가
    setTargetGoal({ mainId: goalId, subId: subGoalId, title });
    setCheckModalVisible(true);
  };

  // 목표 설정 완료 후 새로운 목표 추가
  //TODO : api 결정되면 추가 버튼으로 만든 목표도 정보 받아서 설정해야함.
  const handleGoalStepComplete = (goalData: any) => {
    const newGoal = {
      id: `main-${Date.now()}`,
      category: goalData.category.toLowerCase(),
      title: goalData.mainGoal,
      subGoals: goalData.subGoals.map((goal: string, index: number) => ({
        id: `sub-${Date.now()}-${index}`,
        step: index + 1,
        title: goal,
        completed: false,
      })),
    };
    setMainGoals((prev) => [...prev, newGoal]);
    setSelectedId(newGoal.id);
  };

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
              category={item.category as any}
              completed={item.subGoals.filter((s) => s.completed).length}
              total={item.subGoals.length}
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
              onPress={() => handleStepPress(selectedGoal!.id, item.id, item.title, item.completed)}
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
          targetGoal ? `"${targetGoal.title}" 일정을 완료하셨나요?` : ""
        }
        cancelText="취소"
        confirmText="완료"
        onCancel={() => {
          setCheckModalVisible(false);
          setTargetGoal(null);
        }}
        onConfirm={() => {
          if (targetGoal) {
            completeSubGoal(targetGoal.mainId, targetGoal.subId);
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
