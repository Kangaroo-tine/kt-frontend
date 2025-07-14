import React , { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

//하위 컴포넌트
import MissionCard from '@/components/home/MissionCard';
import MissionHeader from '@/components/home/MissionHeader';

//컬러
import { Colors } from '@/constants/Colors';

//미션 리스트 타입 포맷
import { Mission, MissionStatus } from '@/types/mission';

//dependent 홈 구현
export default function DependentHome() {

  //미션 임의 데이터 값
  const missionList: Mission[] = [
    {
      id: BigInt(1),
      title: '마트가기',
      description:
        '마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. 마트가기의 상세설명입니다. ',
      requires_photo: true,
      mission_start_time: '9:00',
      mission_end_time: '10:00',
      status: 'COMPLETED',
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
      status: 'FAILED',
    },
    {
      id: BigInt(3),
      title: '공부하기',
      description: '공부하기의 상세설명입니다.',
      requires_photo: true,
      mission_start_time: '15:00',
      mission_end_time: '18:00',
      status: 'NOT_STARTED',
    },
  ];

  //미션 상태 업데이트 (미완 => 완료)
  const [missionState, setMissionState] = useState(missionList);
  const handleComplete = (id: bigint) => {
    setMissionState(prev =>
      prev.map(mission =>
        mission.id === id ? { ...mission, status: 'COMPLETED' } : mission
      )
    );
  };

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

      {/* 하단 미션 카드 스크롤 영역 */}
      <ScrollView contentContainerStyle={styles.scrollArea}>
        {missionState.map((mission) => (
          <MissionCard
            key={mission.id.toString()}
            {...mission}
            onComplete={() => handleComplete(mission.id)}
          />
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
