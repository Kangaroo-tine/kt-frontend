import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import { Typo } from "@/constants/Typo";
import { Colors } from "@/constants/Colors";

type Props = {
  isVisible: boolean;
  title?: string;          // 모달 제목
  subtitle?: string;       // 부제목 / 서브텍스트
  cancelText?: string;     // 취소 버튼 텍스트
  confirmText?: string;    // 완료 버튼 텍스트
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ReusableModal({
  isVisible, title = "제목을 입력하세요", subtitle,
  cancelText = "취소", confirmText = "완료", onCancel, onConfirm, }: Props) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
    >
      <View style={styles.modalBack}>
        <View style={styles.modalContainer}>
          {/* 제목 */}
          <Text style={styles.modalTitle}>{title}</Text>
          {subtitle && <Text style={styles.modalSub}>{subtitle}</Text>}

          {/* 버튼 */}
          <View style={styles.buttonWrapper}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>{confirmText}</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 286,
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    alignItems: "center",
  },
  modalTitle: {
    ...Typo.heading02,
    color: Colors.gray900,
    textAlign: "center",
  },
  modalSub: {
    ...Typo.label01,
    color: Colors.gray300,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    marginTop: 20,
    gap: 18,
  },
  cancelButton: {
    height: 42,
    width: 114,
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    height: 42,
    width: 114,
    backgroundColor: Colors.main600,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    ...Typo.body02,
    color: Colors.gray500,
  },
  confirmText: {
    ...Typo.body02,
    color: Colors.main900,
  },
});
