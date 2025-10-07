import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

type CustomButtonProps = {
  label: string;       // 버튼 안에 들어갈 텍스트
  active?: boolean;    // 활성화 여부
  onPress?: () => void;
}; 

export default function MypageEditBtn({ label, active = false, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, active ? styles.activeButton : styles.inactiveButton]}
      onPress={onPress}
    >
      <Text style={[styles.Btntext, active ? styles.activeText : styles.inactiveText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveButton: {
    backgroundColor: Colors.gray200, // 비활성화 배경
  },
  activeButton: {
    backgroundColor: Colors.main600, // 활성화 배경
  },
  Btntext: {
    ...Typo.label03,
  },
  inactiveText: {
    color: Colors.gray500, // 비활성화 텍스트
  },
  activeText: {
    color: Colors.gray900, // 활성화 텍스트
  },
});
