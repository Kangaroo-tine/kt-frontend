import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { Typo } from '../constants/Typo';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  top: number;
  left: number;
  size?: number; // 선택적 사이즈 prop
};

export default function FloatingButton({ label, active, onPress, top, left, size = 90 }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: active ? Colors.main500 : Colors.gray200,
          position: 'absolute',
          top,
          left
        },
      ]}
    >
      <Text style={[Typo.heading04, { color: Colors.gray800 }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});