import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

console.log('📍 ParentHome 렌더링');
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

//미션 리스트 타입 포맷
import { Mission, MissionStatus } from '@/types/mission';
//하위 컴포넌트
import MissionCard from '@/components/home/MissionCardParent';
//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';
import MapIcon from '@/assets/icon/Floating.svg';

//parent 홈 구현
export default function ParentHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  //미션 상태 업데이트 (미완 => 완료 or 실패), id를 기준으로 상태 업데이트
  const [missionState, setMissionState] = useState(missionList);
  const handleComplete = (id: bigint) => {
    setMissionState((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, status: 'COMPLETED' } : mission,
      ),
    );
  };
  const handleFail = (id: bigint) => {
    setMissionState((prev) =>
      prev.map((mission) =>
        mission.id === id ? { ...mission, status: 'FAILED' } : mission,
      ),
    );
  };
  return (
    <View style={styles.container}>
      {/* 상단 고정 MissionHeader */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.nameText}>장효원님께서</Text>
            <Text style={styles.missionTitleText}>아침먹기</Text>
            <Text style={styles.nameText}>미션을 완료했습니다!</Text>
          </View>
          <HomeDependentIcon width={120} height={120} />
        </View>
        <Text style={styles.pendingMission}>승인할 미션 1개</Text>
      </View>
      {/* 하단 미션 카드 스크롤 영역 */}
      <ScrollView contentContainerStyle={styles.scrollArea}>
        {missionState.map((mission) => (
          <MissionCard
            key={mission.id.toString()}
            {...mission}
            onComplete={() => handleComplete(mission.id)}
            onFail={() => handleFail(mission.id)}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[styles.map, { bottom: insets.bottom}]}
        activeOpacity={0.85}
        onPress={() => router.push('/map')} 
        accessibilityRole="button"
        accessibilityLabel="지도 열기"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <MapIcon width={63} height={63} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // 최상위 프레임
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  //헤더 영역
  header: {
    backgroundColor: Colors.gray0,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  //헤더 중 상단 텍스트와 아이콘 영역
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    ...Typo.heading04,
    color: '#000',
  },
  missionTitleText: {
    marginTop: 12,
    ...Typo.title03,
    color: Colors.main700,
  },
  text: {
    ...Typo.heading04,
    color: '#000',
  },
  //승인할 미션 @개 영역
  pendingMission: {
    marginTop: 8,
    ...Typo.label01,
    color: Colors.gray300,
  },
  //미션 카드 영역
  scrollArea: {
    paddingVertical: 12,
    paddingHorizontal: 7,
  },
  map: {
    position: 'absolute',
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
 
    
  },
});
