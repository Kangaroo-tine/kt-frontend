import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  LayoutAnimation,
  Modal,
  Pressable,
  ScrollView
} from 'react-native';
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

import CheerUpIcon from '@/assets/GUI/home_status/cheerup.svg';
import GoodIcon from '@/assets/GUI/home_status/good.svg';
import FailIcon from '@/assets/GUI/home_status/fail.svg';
import QuestionIcon from '@/assets/icon/dependent/question.svg';
import PhotoIcon from '@/assets/icon/photo.svg';


type MissionStatus = 'NOT_STARTED' | 'COMPLETED' | 'FAILED';

type Props = {
  id: bigint;
  title: string;
  description: string;
  description_photo?: boolean;
  requires_photo: boolean;
  mission_start_time: string; // '09:00' 같은 포맷
  mission_end_time: string;
  status: MissionStatus;
};

export default function MissionCard(props: Props) {
  const [isOpen, setIsOpen] = useState(false); //미션카드 터치
  const [previewImage, setPreviewImage] = useState<any>(null); //사진 터치

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

  const samplePhotos = [
    require('../../assets/sample_photos/1.jpg'),
    require('../../assets/sample_photos/2.jpg'),
    require('../../assets/sample_photos/3.jpg'),
    require('../../assets/sample_photos/4.jpg'),
    require('../../assets/sample_photos/5.jpg'),
  ];

  return (
    <>
        {/* 1. 카드 영역 */}
        <TouchableOpacity style={styles.cardWrapper} onPress={toggleOpen} activeOpacity={0.95}>
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
                    {Number(props.mission_start_time?.split(':')[0]) < 12 ? '오전' : '오후'} {props.mission_start_time}
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
                        <Pressable key={i} onPress={() => setPreviewImage(img)}>
                          <Image source={img} style={styles.photoBox} />
                        </Pressable>
                    ))}
                </ScrollView>
                )}

                {/* 미완 상태라면 완료 버튼 표시와 켈퍼 버튼 */}
                {props.status === 'NOT_STARTED' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.buttonText}>{renderButtonText()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.questionIconButton}>
                        <QuestionIcon width={40} height={40} />
                    </TouchableOpacity>
                </View>
                )}
            </View>
            )}
        </View>
        </TouchableOpacity>

        {/* 2. 모달 사진 뷰 */}
        <Modal
            visible={!!previewImage}
            transparent
            onRequestClose={() => setPreviewImage(null)}
            >
            <View style={styles.modalOverlay}>
                <Pressable style={{ flex: 1 }} onPress={() => setPreviewImage(null)}>
                <Image
                    source={previewImage}
                    style={styles.fullImage}
                    resizeMode="contain"
                />
                </Pressable>
            </View>
        </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {                       //가장 상위 프레임
    marginVertical: 6, //상하여백
    paddingHorizontal: 16, //좌우여백
  },
  card: {   //두번째 프레임
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  cardCompleted: {
    borderColor: Colors.main600,
  },
  topRow: {  //close 상태일때의 프레임
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
  detailArea: { //상세설명 프레임
    borderTopColor: Colors.gray100,  // 위쪽 선 색상
    borderTopWidth: 1.5,
    marginTop : 16,
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
    //borderRadius: 6, 
  }, //상세설명 프레임 끝
  actionRow: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: Colors.main600,
    borderRadius: 8,
    paddingVertical: 8, //상하여백
    paddingHorizontal: 12, //좌우여백
    alignSelf: 'flex-start', //부모 뷰 안에서 왼쪽 정렬
  },
  buttonText: {
    ...Typo.label01,
    color: Colors.main900,
  },
  questionIconButton: {
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(97, 97, 97, 0.9)', //임의로 색 지정
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '90%',
    borderRadius: 12,
},
});
