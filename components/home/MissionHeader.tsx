import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';
//하루 마무리 감정 선택 모달 컴포넌트
import EmotionModal from './EmotionModal';

//상위 컴포넌트에서 전달하는 데이터 포맷
import { Header, EmotionType } from '@/types/homeHeader';
type Props = Header & {
  daliyEmotionSelected: (emotion:EmotionType) => void;
};

export default function MissionHeader(props: Props) {
  
  const progressRatio = props.mission_count === 0 ? 0 : props.mission_complete / props.mission_count; 
  const [isModalVisible, setModalVisible] = useState(false); //하루 마무리 감정 선택 모달
  const [isEmotionRecorded, setIsEmotionRecorded] = useState(false); //모달 선택 완료했는지 안했는지
  const isAllCompleted = props.mission_count > 0 && props.mission_count === props.mission_complete; //모든 미션 완료
  const percentage = Math.round(progressRatio * 100);

  const handleConfirm = (emotion: EmotionType) => {
    setModalVisible(false);
    props.daliyEmotionSelected(emotion);
    setIsEmotionRecorded(true);  //하루 마무리 감정 선택 버튼 비활성화
  };

  return (
    <View style={styles.container}>
      {/* 인사 + 캐릭터 */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{props.userName}님!</Text>
          {isAllCompleted? (<Text style={styles.subtitle}>오늘의 미션 완료!{"\n"}{isEmotionRecorded ? '내일도 화이팅!' : '지금 기분은 어떤가요?'}</Text>) 
          : (<Text style={styles.subtitle}>오늘도{"\n"}미션하러 가볼까요?</Text>)}
        </View>
        <HomeDependentIcon width={120} height={120} />
      </View>

      {/* 진행 텍스트 */}
      { isAllCompleted? (
        <>
          <View style={styles.emotionWrapper}>
            <TouchableOpacity style={[styles.emotionButton, isEmotionRecorded && { backgroundColor: Colors.gray100}]} 
            onPress={() => setModalVisible(true)}
            disabled={isEmotionRecorded}
            >
              <Text style={[styles.emotionText, isEmotionRecorded && { color: Colors.gray500 }]}>오늘의 감정 기록하기</Text> 
            </TouchableOpacity> 
          </View>
        </> ) : (
          <>
            {/* 진행 바 */}
            <View style={styles.progressTextRow}>
              <Text style={styles.progressText}>총 @{props.mission_complete}개의 미션을 완료했어요!</Text>
              <Text style={styles.progressCount}>{props.mission_complete}/{props.mission_count}</Text>
            </View>
            <View style={styles.progressBarContainer}>
            {/* 바 전체 배경 */}
              <View style={styles.progressBarBackground}>
                {/* 진행도에 따른 채워지는 부분 */}
                <View style={[styles.progressBarFill, {width: `${progressRatio * 100}%` }]}/>
              </View>
            </View>
          </>
        )}
        {/* 감정 선택 모달 */}
        <EmotionModal
          isVisible={isModalVisible}
          onCancel={() => setModalVisible(false)} 
          onConfirm={handleConfirm}
          date={"2025-07-15"}
        />
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
  //오늘의 감정 기록하기 버튼
  emotionWrapper:{
    alignItems: 'center',
  },
  emotionButton: {
    marginTop: 20,
    width: 330,
    height: 40,  
    backgroundColor: Colors.main600,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  emotionText: {
    ...Typo.heading04,
    color: Colors.main900,
  },
});
