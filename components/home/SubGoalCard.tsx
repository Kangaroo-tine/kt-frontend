import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';

import CheerUpIcon from '@/assets/GUI/home_status/cheerup.svg';
import GoodIcon from '@/assets/GUI/home_status/good.svg';
import CheckBox from '@/assets/icon/checkBox.svg';
import EmptyBox from '@/assets/icon/emptyBox.svg';


type StepCardProps = {
  step: number;
  title: string;
  active?: boolean;
  onPress?: () => void;
};

export default function StepCard({ step, title, active = false, onPress }: StepCardProps) {
  return (
    <View 
      style={[styles.container, active ? styles.active : styles.inactive]} 
    >
      <View style={styles.iconWrapper}>
        {active ? (
            <GoodIcon width={33} height={38} />
        ) : (
            <CheerUpIcon width={33} height={38} />
        )}
      </View>
      <View>
        <Text style={styles.step}>
          STEP {step}
        </Text>
        <Text style={[styles.title, active ? styles.activeText : styles.inactiveText]}>
          {title}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.checkWrapper}
        onPress={onPress}
        disabled={!active}
      >
        {active ? (
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
  step: { ...Typo.label01, color: Colors.gray300},
  title: { ...Typo.heading02 },
  activeText: { color: Colors.main900 },
  inactiveText: { color: Colors.gray300 },
  checkWrapper: { marginLeft: 'auto' },
});
