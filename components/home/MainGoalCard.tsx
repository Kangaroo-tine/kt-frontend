import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { VictoryChart, VictoryPie } from 'victory-native';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

// 카테고리별 아이콘 (활성/비활성)
import DailyActiveIcon from '@/assets/GUI/main_goal/daily_active.svg';
import DailyInactiveIcon from '@/assets/GUI/main_goal/daily_inactive.svg';
import HealthActiveIcon from '@/assets/GUI/main_goal/health_active.svg';
import HealthInactiveIcon from '@/assets/GUI/main_goal/health_inactive.svg';
import HobbyActiveIcon from '@/assets/GUI/main_goal/hobby_active.svg';
import HobbyInactiveIcon from '@/assets/GUI/main_goal/hobby_inactive.svg';
import PeopleActiveIcon from '@/assets/GUI/main_goal/people_active.svg';
import PeopleInactiveIcon from '@/assets/GUI/main_goal/people_inactive.svg';
import StudyActiveIcon from '@/assets/GUI/main_goal/study_active.svg';
import StudyInactiveIcon from '@/assets/GUI/main_goal/study_inactive.svg';
import TaskActiveIcon from '@/assets/GUI/main_goal/task_active.svg';
import TaskInactiveIcon from '@/assets/GUI/main_goal/task_inactive.svg';

type MainGoalCardProps = {
  title: string;
  category: 'daily' | 'health' | 'hobby' | 'people' | 'study' | 'task';
  completed: number; // 완료된 서브골 개수
  total: number;     // 전체 서브골 개수
  selected: boolean;
  onPress: () => void;
};

const RING_SIZE = 56;        // 도넛 지름
const RING_STROKE = 8;       // 도넛 두께
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRC = 2 * Math.PI * RING_RADIUS;

export default function MainGoalCard({
  title,
  category,
  completed,
  total,
  selected,
  onPress,
}: MainGoalCardProps) {

  const progress = total > 0 ? Math.min(1, Math.max(0, completed / total)) : 0;
  const dashOffset = CIRC * (1 - progress);

  //메인골 카테고리 별 아이콘
  const renderCategoryIcon = () => {
    switch (category) {
      case 'daily':
        return selected ? (
          <DailyActiveIcon width={28} height={28} />
        ) : (
          <DailyInactiveIcon width={28} height={28} />
        );
      case 'health':
        return selected ? (
          <HealthActiveIcon width={28} height={28} />
        ) : (
          <HealthInactiveIcon width={28} height={28} />
        );
      case 'hobby':
        return selected ? (
          <HobbyActiveIcon width={28} height={28} />
        ) : (
          <HobbyInactiveIcon width={28} height={28} />
        );
      case 'people':
        return selected ? (
          <PeopleActiveIcon width={28} height={28} />
        ) : (
          <PeopleInactiveIcon width={28} height={28} />
        );
      case 'study':
        return selected ? (
          <StudyActiveIcon width={28} height={28} />
        ) : (
          <StudyInactiveIcon width={28} height={28} />
        );
      case 'task':
        return selected ? (
          <TaskActiveIcon width={28} height={28} />
        ) : (
          <TaskInactiveIcon width={28} height={28} />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected ? styles.active : styles.inactive]}
      onPress={onPress}
    >
      {/* 상단 카테고리 텍스트 */}
      <Text style={[styles.category, selected ? styles.activeText : styles.inactiveText]}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Text>
      {/* 원형 그래프 + 아이콘 */}
      <View style={styles.progressWrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* 배경 링 */}
          <Circle
            cx={RING_SIZE/2}
            cy={RING_SIZE/2}
            r={RING_RADIUS}
            stroke={selected ? Colors.gray100 : Colors.gray100}
            strokeWidth={RING_STROKE}
            fill="none"
          />
          {/* 진행 링 */}
          <Circle
            cx={RING_SIZE/2}
            cy={RING_SIZE/2}
            r={RING_RADIUS}
            stroke={selected ? Colors.sub500 : Colors.gray200}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={dashOffset}
            fill="none"
          />
        </Svg>
        <View style={styles.iconOverlay}>
            {renderCategoryIcon()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 96,
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal : 8,
    marginHorizontal: 8,
    alignSelf: 'auto',   
    flex: 0,
    justifyContent: 'center',
  },
  active: {
    backgroundColor: Colors.main300,
    borderColor: Colors.main300,
    borderWidth: 1,},
  inactive: { 
    backgroundColor: Colors.gray0,
    borderColor: Colors.gray200,
    borderWidth: 1, },
  category: {
    ...Typo.label01,
    marginBottom: 6,
  },
  progressWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeText: { color: Colors.sub500 },
  inactiveText: { color: Colors.gray300 },
});
