import MissionCard from '@/components/home/MissionCard';
import MissionHeader from '@/components/home/MissionHeader';
import { Colors } from '@/constants/Colors';

import React from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

//import { View, Text, StyleSheet } from 'react-native';

type MissionStatus = 'NOT_STARTED' | 'COMPLETED' | 'FAILED';

//dependent 홈 구현
export default function DependentHome() {
  const missionList = [
    {
      id: BigInt(1),
      title: '마트가기',
      description:
        '마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. ',
      requires_photo: true,
      mission_start_time: '9:00',
      mission_end_time: '10:00',
      status: 'COMPLETED' as const,
    },
    {
      id: BigInt(2),
      title: '집 청소하기',
      description:
        '집 청소하기의 상세설명입니다. 집 청소하기의 상세설명입니다. 집 청소하기의 상세설명입니다. 집 청소하기의 상세설명입니다. 집 청소하기의 상세설명입니다. 집 청소하기의 상세설명입니다. ',
      description_photo: true,
      requires_photo: false,
      mission_start_time: '10:00',
      mission_end_time: '11:00',
      status: 'FAILED' as const,
    },
    {
      id: BigInt(3),
      title: '공부하기',
      description: '공부하기의 상세설명입니다.',
      requires_photo: true,
      mission_start_time: '15:00',
      mission_end_time: '18:00',
      status: 'NOT_STARTED' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {/* 상단 고정 MissionHeader */}
      <View style={styles.header}>
        <MissionHeader
          userName="장효원"
          mission_count={3}
          mission_complete={1}
        />
      </View>

      {/* 미션 카드 스크롤 영역 */}
      <ScrollView contentContainerStyle={styles.scrollArea}>
        {missionList.map((mission) => (
          <MissionCard key={mission.id.toString()} {...mission} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100, // 최상위 프레임
  },
  header: {
    backgroundColor: Colors.gray0, //헤더 영역
  },
  scrollArea: {
    paddingVertical: 12,
    paddingHorizontal: 7, //미션 카드 영역
  },
});
