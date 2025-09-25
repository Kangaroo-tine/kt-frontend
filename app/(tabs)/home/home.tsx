import React , { useState } from 'react';
import { View,  Text, ScrollView, FlatList, StyleSheet } from 'react-native';

//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';

//하위 컴포넌트
import MainGoalCard from '@/components/home/MainGoalCard';
import StepCard from '@/components/home/SubGoalCard';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

//미션 리스트 타입 포맷
import { Mission, MissionStatus } from '@/types/mission';
import { Header, EmotionType } from '@/types/homeHeader';

//임의 메인골, 서브골 데이터
const mockData = [
  {
    id: "main-1",
    category: "health",
    title: "수영 잘하기",
    subGoals: [
      { id: "sub-1-1", step: 1, title: "수영장 등록하기", completed: true },
      { id: "sub-1-2", step: 2, title: "준비물 챙기기", completed: false },
      { id: "sub-1-3", step: 3, title: "주 3회 수영하기", completed: false },
      { id: "sub-1-4", step: 4, title: "자유형 마스터", completed: false },
    ],
  },
  {
    id: "main-2",
    category: "study",
    title: "자격증 따기",
    subGoals: [
      { id: "sub-2-1", step: 1, title: "교재 구입하기", completed: false },
      { id: "sub-2-2", step: 2, title: "1장 끝내기", completed: false },
    ],
  },
  {
    id: "main-3",
    category: "hobby",
    title: "자격증 따기",
    subGoals: [
      { id: "sub-3-1", step: 1, title: "교재 구입하기", completed: false },
      { id: "sub-3-2", step: 2, title: "1장 끝내기", completed: false },
    ],
  },
  {
    id: "main-4",
    category: "task",
    title: "자격증 따기",
    subGoals: [
      { id: "sub-4-1", step: 1, title: "교재 구입하기", completed: false },
      { id: "sub-4-2", step: 2, title: "1장 끝내기", completed: false },
    ],
  },
  {
    id: "main-5",
    category: "people",
    title: "자격증 따기",
    subGoals: [
      { id: "sub-5-1", step: 1, title: "교재 구입하기", completed: false },
      { id: "sub-5-2", step: 2, title: "1장 끝내기", completed: false },
    ],
  },
];

//dependent 홈 구현
export default function Home() {
  const userName = "장효원";  //임의 사용자 이름

  const [mainGoals, setMainGoals] = useState(mockData);
  const [selectedId, setSelectedId] = useState<string>(mockData[0].id);

  const selectedGoal = mainGoals.find((g) => g.id === selectedId);

  // 서브골 체크박스
  const toggleSubGoal = (goalId: string, subGoalId: string) => {
    setMainGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              subGoals: goal.subGoals.map((sg) =>
                sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
              ),
            }
          : goal
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* 인사 + 캐릭터 */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{userName}님!</Text>
          <Text style={styles.subtitle}>오늘롤ㅇ롱{"\n"}미션하러 가볼까요?</Text>
        </View>
        <HomeDependentIcon width={120} height={120} />
      </View>

      <View style={{ height: 96 + 24 }}>
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
          contentContainerStyle={{ paddingHorizontal: 16 }}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 20 }}
        />
      </View>
      
      {/* 회색 영역 */}
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
              active={true}
              onPress={() => toggleSubGoal(selectedGoal!.id, item.id)}
            />
          )}
          contentContainerStyle={styles.subGoalContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff',
   },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 16,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    
    paddingTop: 16,
  },
  selectedMainGoalTitle: {
    marginBottom: 15,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subGoalContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
