import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';

type Props = {
  userName: string;
  mission_count: number;
  mission_complete: number;
};

export default function MissionHeader({ userName, mission_count, mission_complete }: Props) {
  const progressRatio = mission_count === 0 ? 0 : mission_complete / mission_count;
  const percentage = Math.round(progressRatio * 100);

  return (
    <View style={styles.container}>
      {/* 인사 + 캐릭터 */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{userName}님!</Text>
          <Text style={styles.subtitle}>오늘도{"\n"}미션하러 가볼까요?</Text>
        </View>
        <HomeDependentIcon width={120} height={120} />
      </View>

      {/* 진행 텍스트 */}
      <View style={styles.progressTextRow}>
        <Text style={styles.progressText}>총 @{mission_complete}개의 미션을 완료했어요!</Text>
        <Text style={styles.progressCount}>{mission_complete}/{mission_count}</Text>
      </View>

      {/* 진행 바 */}
        <View style={styles.progressBarContainer}>
        {/* 바 전체 배경 */}
            <View style={styles.progressBarBackground}>
                {/* 진행도에 따른 채워지는 부분 */}
                <View style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]} />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray0,
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...Typo.title03,
    //fontWeight: 'bold',
    color: Colors.main700,
  },
  subtitle: {
    marginTop: 12,
    ...Typo.heading01,
    color: '#000',
    lineHeight: 24,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  progressText: {
    ...Typo.label03,
    color: Colors.gray300,
  },
  progressCount: {
    ...Typo.label03,
    color: '#A6A6A6',
  },
    progressBarContainer: {
        marginTop: 12,
    },
    progressBarBackground: {
        height: 17,
        backgroundColor: Colors.main100,
        borderRadius: 999,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.main500,
        borderRadius: 999,
    },
});
