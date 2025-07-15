import React, { JSX, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//데이터 포맷
import { EmotionType } from '@/types/homeHeader';

//아이콘
import Back from '../../assets/icon/arrow/back_arrow.svg';
import HappyTargetIcon from '../../assets/icon/dependent/happy_target.svg';
import SadTargetIcon from '../../assets/icon/dependent/sad_target.svg';
import TargetIcon from '../../assets/icon/dependent/target.svg';

//상위 컴포넌트로부터 전달받는 모달 props
type Props = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: (emotion: EmotionType) => void;
  date: string;
};

export default function EmotionModal(props: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(
    null,
  );
  const isActive = selectedEmotion;

  //감정에 따른 아이콘
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case '행복':
        return (
          <HappyTargetIcon width={30} height={30} style={{ marginRight: 8 }} />
        );
      case '보통':
        return <TargetIcon width={30} height={30} style={{ marginRight: 8 }} />;
      case '슬픔':
        return (
          <SadTargetIcon width={30} height={25} style={{ marginRight: 8 }} />
        );
      default:
        return null;
    }
  };
  const emotionDisplayMap: Record<EmotionType, { label: string; icon: JSX.Element }> = {
  HAPPY: {
    label: '행복',
    icon: <HappyTargetIcon width={20} height={20} style={{ marginRight: 8 }} />,
  },
  NEUTRAL: {
    label: '보통',
    icon: <TargetIcon width={20} height={20} style={{ marginRight: 8 }} />,
  },
  SAD: {
    label: '슬픔',
    icon: <SadTargetIcon width={20} height={20} style={{ marginRight: 8 }} />,
  },
};

  return (
    <Modal isVisible={props.isVisible} backdropOpacity={0.5}
    onBackdropPress={props.onCancel}
    onBackButtonPress={props.onCancel}>
      <View style={styles.modalBack}>
        <View style={styles.modalContainer}>
          {/*모달 제목*/}
          <Text style={styles.modalTitle}>오늘의 기분은 어땠나요?</Text>
          {/*기분 3가지 중 선택*/}
          <View style={styles.emotionSelectWrapper}>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedEmotion ? Colors.main500 : Colors.gray200,
                overflow: 'hidden',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                style={styles.emotionSelectBox}
                onPress={() => {
                  setIsDropdownOpen((prev) => !prev);
                }}
              >
                {/* 왼쪽 그룹: 아이콘 + 텍스트 */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {selectedEmotion && emotionDisplayMap[selectedEmotion].icon}
                  <Text style={styles.emotionOptionText}>
                    {selectedEmotion ? emotionDisplayMap[selectedEmotion].label : '선택해 주세요'}
                  </Text>
                </View>
                <Back
                  width={20}
                  height={20}
                  style={{
                    transform: [
                      { rotate: isDropdownOpen ? '90deg' : '270deg' },
                    ],
                  }}
                />
              </TouchableOpacity>
              {/*드롭다운*/}
              {isDropdownOpen && (
                <View style={styles.emotionSelectBox}>
                  <View style={{ gap: 4 }}>
                    {['행복', '보통', '슬픔'].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 10,
                        }}
                        onPress={() => {
                          if (item === '행복') setSelectedEmotion('HAPPY');
                          else if (item === '보통')
                            setSelectedEmotion('NEUTRAL');
                          else if (item === '슬픔') setSelectedEmotion('SAD');
                          setIsDropdownOpen(false);
                        }}
                      >
                        {getEmotionIcon(item)}
                        <Text style={styles.emotionOptionText}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {/*드롭다운 코드 끝*/}
            </View>
          </View>
          {/*취소, 완료 버튼*/}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={props.onCancel}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              disabled={!isActive}
              onPress={() => props.onConfirm(selectedEmotion!)}
            >
              <Text style={styles.confirmText}>완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 286,
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  modalTitle: {
    ...Typo.heading02,
    color: Colors.main900,
  },
  emotionSelectWrapper: {
    marginTop: 8,
  },
  emotionSelectBox: {
    //감정 선택 박스 "선택해 주세요"
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    backgroundColor: Colors.gray0,
    paddingVertical: 12,
    minHeight: 50,
  },
  emotionOptionText: {
    ...Typo.heading03,
    color: Colors.gray900,
  },
  //취소, 완료 버튼 스타일들
  buttonWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 18,
  },
  cancelButton: {
    height: 42,
    width: 114,
    borderWidth: 1, //테두리
    borderColor: Colors.gray200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    height: 42,
    width: 114,
    backgroundColor: Colors.main600,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    ...Typo.label01,
    color: Colors.gray500,
  },
  confirmText: {
    ...Typo.label01,
    color: Colors.main900,
  },
});
