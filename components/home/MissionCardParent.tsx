import React, { useState } from 'react';
import { Image,LayoutAnimation,Modal,
Pressable,ScrollView,StyleSheet,Text,
TouchableOpacity,View,} from 'react-native';
console.log('📍 MissionCardParent 렌더링');
  //라이브러리
import ImageViewer from 'react-native-image-zoom-viewer';

//아이콘
import CheerUpIcon from '@/assets/GUI/home_status/cheerup.svg';
import FailIcon from '@/assets/GUI/home_status/fail.svg';
import GoodIcon from '@/assets/GUI/home_status/good.svg';
import PhotoIcon from '@/assets/icon/photo.svg';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

//미션 리스트 타입 포맷
import { Mission, MissionStatus } from '@/types/mission';
type Props = Mission & {
  onComplete: () => void;
  onFail: () => void;
};

//사진관련 시작
const samplePhotos = [
  require('../../assets/sample_photos/1.jpg'),
  require('../../assets/sample_photos/2.jpg'),
];

type IImageInfo = {
  url: string; //해당 라이브러리는 url로만 사진을 로딩함
  props?: {
    //근데 테스트할 땐 정적이미지를 쓰기에 추가해줌
    source: number;
  };
};
//사진관련 끝

export default function MissionCard(props: Props){
  const [isOpen, setIsOpen] = useState(false); //미션카드 터치
  const [visible, setImageVisible] = useState(false); //사진
  const [index, setIndex] = useState(0); //사진 모달

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
  // ImageViewer용 이미지 포맷: { props: { source: number } }[]
  //얘도 나중에 url사용하면 수정해줘야함
  const imageUrls = samplePhotos.map((img) => ({
      props: { source: img },
  })) as unknown as IImageInfo[];

  return (
    <>
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
        > {/* Close 상태인 카드 뷰 */}
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
          {/* Open 상태인 카드 뷰 */}
          {isOpen && (
            <View style={styles.detailArea}>
              {/* 인증 사진 있을 경우 */}
              {props.requires_photo && (
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
              {/* 미완료 상태일 경우 버튼 */}
              {props.status === 'NOT_STARTED' && (
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.activeButton} onPress={props.onComplete}>
                    <Text style={styles.activeText}>미션 완료</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inactiveButton} onPress={props.onFail}>
                    <Text style={styles.inactiveText}>미션 실패</Text>
                  </TouchableOpacity>
                </View>
              )}
              {/* 완료 상태일 때 */}
              {props.status === 'COMPLETED' && (
                <View style={styles.buttonRow}>
                  <View style={styles.inactiveButton}>
                    <Text style={styles.inactiveText}>미션 완료</Text>
                  </View>
                </View>
              )}
              {/* 실패 상태일 때 */}
              {props.status === 'FAILED' && (
                <View style={styles.buttonRow}>
                  <View style={styles.inactiveButton}>
                    <Text style={styles.inactiveText}>미션 실패</Text>
                  </View>
                </View>
              )}
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
      </Modal>*/
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    //가장 상위 프레임
    marginVertical: 6, //상하여백
    paddingHorizontal: 16, //좌우여백
  },
  card: {
    //두번째 프레임
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cardCompleted: {
    borderColor: Colors.main600,
  },
  //close 상태일때의 프레임
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
  //상세설명 프레임
  detailArea: {
    borderTopColor: Colors.gray100, 
    borderTopWidth: 1.5,
    marginTop: 16,
    paddingTop: 16,
  },
  photoScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  photoBox: {
    width: 120, 
    height: 120,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  activeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.main600,
  },
  inactiveButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.gray100,
  },
  activeText: {
    ...Typo.label01,
    color: Colors.main900,
  },
  inactiveText: {
    ...Typo.label01,
    color: Colors.gray300,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(97, 97, 97, 0.95)', //임의로 색 지정
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
})