//아이콘
import DotIcon from '@/assets/temp/dot.svg';
import { Colors } from '@/constants/Colors';
//폰트, 컬러
import { Typo } from '@/constants/Typo';

import React from 'react';

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Modal from 'react-native-modal';

//모달 props
type Props = {
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  mission_start_time: string;
  title: string;
};

const { width } = Dimensions.get('window');

export default function MissionConfirmModal(props: Props) {
  return (
    <Modal isVisible={props.isVisible} backdropOpacity={0.5}>
      <View style={styles.modalBack}>
        <View style={styles.modalContainer}>
          {/*미션시간, 미션 제목*/}
          <View style={styles.titleWrapper}>
            <Text style={styles.timeText}>
              {Number(props.mission_start_time?.split(':')[0]) < 12
                ? '오전'
                : '오후'}{' '}
              {props.mission_start_time}
            </Text>
            <DotIcon width={3} height={3} />
            <Text style={styles.timeText}>{props.title}</Text>
          </View>
          {/*질문*/}
          <View style={styles.subtitleWrapper}>
            <Text style={styles.questionText}>미션을 완료했나요?</Text>
            <Text style={styles.warningText}>
              도장을 받으면 되돌릴 수 없어요
            </Text>
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
              onPress={props.onConfirm}
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
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  subtitleWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  timeText: {
    ...Typo.heading02,
    color: Colors.main900,
  },
  questionText: {
    ...Typo.heading02,
    color: Colors.gray900,
  },
  warningText: {
    ...Typo.label01,
    color: Colors.gray300,
    marginTop: 4,
  },
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
