import React, { useState } from 'react';
import {
  Image,LayoutAnimation,Modal,
  Pressable,ScrollView,StyleSheet,Text,
  TouchableOpacity,View,} from 'react-native';
//라이브러리
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRouter } from "expo-router";
//하위 컴포넌트
import MissionConfirmModal from './MissionConfirmModal';

//아이콘
import CheerUpIcon from '@/assets/GUI/home_status/cheerup.svg';
import FailIcon from '@/assets/GUI/home_status/fail.svg';
import GoodIcon from '@/assets/GUI/home_status/good.svg';
import QuestionIcon from '@/assets/icon/dependent/question.svg';
import PhotoIcon from '@/assets/icon/photo.svg';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

//미션 리스트 타입 포맷
import { Mission, MissionStatus } from '@/types/mission';
type Props = Mission & {
  onComplete: () => void;
};

//사진 관련 시작
const samplePhotos = [
  require('../../assets/sample_photos/1.jpg'),
  require('../../assets/sample_photos/2.jpg'),
  require('../../assets/sample_photos/3.jpg'),
  require('../../assets/sample_photos/4.jpg'),
  require('../../assets/sample_photos/5.jpg'),
];
type IImageInfo = {
  url: string; //해당 라이브러리는 url로만 사진을 로딩함
  props?: {
    //근데 테스트할 땐 정적이미지를 쓰기에 추가해줌
    source: number;
  };
};
//사진 관련 끝


export default function MissionCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false); //미션카드 터치
  const [visible, setImageVisible] = useState(false); //사진
  const [index, setIndex] = useState(0); //사진 모달
  const [isModalVisible, setModalVisible] = useState(false); //미션 완료 모달
  const router = useRouter();

  const toggleOpen = () => {
    //애니메이션 자동 적용 함수, 부드럽게 펼쳐지고 접히는
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen((prev) => !prev);
  };

  //미션카드 좌편 아이콘
  const renderIcon = () => {
    switch (props.status) {
      case 'COMPLETED':
        return <GoodIcon width={60} height={60} />;
      case 'FAILED':
        return <FailIcon width={60} height={60} />;
      default:
        return <CheerUpIcon width={60} height={60} />;
    }
  };

  //미션 완료 버튼
  const renderButtonText = () => {
    if (props.status !== 'NOT_STARTED') return null;
    return props.requires_photo
      ? '사진과 함께 미션완료하기'
      : '미션완료하러가기';
  };

  //미완인 미션의 완료 버튼을 눌렀을 때, status 전달 부분
  const handleConfirm = () => {
    setModalVisible(false);
    props.onComplete(); // 상위에서 status를 COMPLETED로 업데이트
  };

  // ImageViewer용 이미지 포맷: { props: { source: number } }[]
  //얘도 나중에 url사용하면 수정해줘야함
  const imageUrls = samplePhotos.map((img) => ({
    props: { source: img },
  })) as unknown as IImageInfo[];

  return (
    <>
      {/* 1. 카드 영역 */}
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={toggleOpen}
        activeOpacity={0.95}
      >
        <View
          style={[
            styles.card,
            props.status === 'COMPLETED' ? styles.cardCompleted : {},
          ]}
        >
          {/* Close 상태인 카드 뷰 */}
          <View style={styles.topRow}>
            {renderIcon()}
            <View style={{ marginLeft: 16 }}>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>
                  {Number(props.mission_start_time?.split(':')[0]) < 12
                    ? '오전'
                    : '오후'}{' '}
                  {props.mission_start_time}
                </Text>
                {props.requires_photo && (
                  <PhotoIcon width={15} height={15} style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text
                style={[
                  styles.title,
                  props.status === 'COMPLETED' ? styles.completedText : {},
                ]}
                numberOfLines={1}
              >
                {props.title}
              </Text>
            </View>
          </View>

          {/* Open 상태인 카드 뷰(상세내용 표시) */}
          {isOpen && (
            <View style={styles.detailArea}>
              {/* 상세설명 */}
              <Text style={styles.description}>{props.description}</Text>

              {/* 상세설명에 사진이 있을 경우 사진들(임시 사진임) + 나중에 FlatList로 바꾸는 거 고민하기 */}
              {props.description_photo && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.photoScroll}
                >
                  {samplePhotos.map((img, i) => (
                    <Pressable
                      key={i}
                      onPress={() => {
                        setIndex(i);
                        setImageVisible(true);
                      }}
                    >
                      <Image source={img} style={styles.photoBox} />
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {/* open 상태 && 미완 상태 => 완료 버튼, 켈퍼 버튼 유 */}
              {props.status === 'NOT_STARTED' && (
                <View style={styles.actionRow}>
                  {/*완료 버튼*/}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalVisible(true)}
                    disabled={props.status !== 'NOT_STARTED'}
                  >
                    <Text style={styles.buttonText}>{renderButtonText()}</Text>
                  </TouchableOpacity>
                  {/*켈퍼 버튼*/}
                  <TouchableOpacity style={styles.questionIconButton} 
                  onPress={() => router.push('/kelper')}>
                    <QuestionIcon width={40} height={40} />
                  </TouchableOpacity>
                </View>
              )}
              {/*완료 버튼 터치 시 나오는 모달*/}
              <MissionConfirmModal
                isVisible={isModalVisible}
                onCancel={() => setModalVisible(false)} 
                onConfirm={handleConfirm}
                mission_start_time={props.mission_start_time}
                title={props.title}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* 2. 모달 사진 뷰 */}
      <Modal visible={visible} transparent={true}>
        <View style={styles.modalOverlay}>
          <Pressable style={styles.closeButton} onPress={() => setImageVisible(false)}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
          <ImageViewer
          imageUrls={imageUrls}
          index={index}
          onSwipeDown={() => setImageVisible(false)}
          enableSwipeDown={true}
          onCancel={() => setImageVisible(false)}
          saveToLocalByLongPress={false} 
          backgroundColor="transparent" 
        />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 6,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cardCompleted: {
    borderColor: Colors.main600,
  },
  //close 상태일 때 프레임
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...Typo.label01,
    color: Colors.gray300,
  },
  title: {
    ...Typo.heading02,
    color: Colors.gray900,
  },
  completedText: {
    color: Colors.main900,
  },
  detailArea: {
    //상세설명 프레임
    borderTopColor: Colors.gray100, // 위쪽 선 색상
    borderTopWidth: 1.5,
    marginTop: 16,
    paddingTop: 16,
  },
  description: {
    ...Typo.body02,
    color: Colors.gray500,
    marginBottom: 12,
  },
  photoScroll: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  photoBox: {
    width: 60,
    height: 60,
  }, //상세설명 프레임 끝
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.main600,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start', 
  },
  buttonText: {
    ...Typo.label01,
    color: Colors.main900,
  },
  questionIconButton: {},
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(97, 97, 97, 0.95)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 14,
  },
    closeText: {
    color: 'white',
    fontSize: 23,
    fontWeight: 'bold',
  },
});
