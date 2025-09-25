import CheerUpIcon from '@/assets/GUI/home_status/cheerup.svg';
import GoodIcon from '@/assets/GUI/home_status/good.svg';
import CheckBox from '@/assets/icon/check_box.svg';
import EmptyBox from '@/assets/icon/empty_box.svg';
import { Colors } from '@/constants/Colors';
//폰트, 컬러
import { Typo } from '@/constants/Typo';

import React from 'react';

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type StepCardProps = {
  step: number;
  title: string;
  completed: boolean;
  onPress?: () => void;
};

export default function StepCard({
  step,
  title,
  completed,
  onPress,
}: StepCardProps) {
  return (
    <View
      style={[styles.container, completed ? styles.active : styles.inactive]}
    >
      <View style={styles.iconWrapper}>
        {completed ? (
          <GoodIcon width={33} height={38} />
        ) : (
          <CheerUpIcon width={33} height={38} />
        )}
      </View>
      <View>
        <Text style={styles.step}>STEP {step}</Text>
        <Text
          style={[
            styles.title,
            completed ? styles.activeText : styles.inactiveText,
          ]}
        >
          {title}
        </Text>
      </View>
      <TouchableOpacity style={styles.checkWrapper} onPress={onPress}>
        {completed ? (
          <CheckBox width={24} height={24} />
        ) : (
          <EmptyBox width={24} height={24} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  active: {
    backgroundColor: Colors.gray0,
    borderColor: Colors.main600,
    borderWidth: 1,
  },
  inactive: {
    backgroundColor: Colors.gray0,
    borderColor: Colors.gray200,
    borderWidth: 1,
  },
  iconWrapper: { marginRight: 10 },
  icon: { width: 40, height: 40, resizeMode: 'contain' },
  step: { ...Typo.label01, color: Colors.gray300 },
  title: { ...Typo.heading02 },
  activeText: { color: Colors.main900 },
  inactiveText: { color: Colors.gray300 },
  checkWrapper: { marginLeft: 'auto' },
});
