import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';
import Plus from '@/assets/icon/plus.svg'; 

type Props = {
  label?: string;
  onPress: () => void;
};

export default function AddMainGoalCard({ label = '추가', onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Text style={styles.label}>{label}</Text>
      <Plus width={48} height={48} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 96,
    borderRadius: 20,
    paddingHorizontal:11.5,
    marginHorizontal: 8,
    backgroundColor: Colors.gray0,
    borderWidth: 1,
    borderColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 13,
  },
  label: { ...Typo.label01,  color: Colors.gray400 },
});
