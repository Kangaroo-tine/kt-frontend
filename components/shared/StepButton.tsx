import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

interface StepButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function StepButton({ text, onPress, disabled = false }: StepButtonProps) {
  return (
    <TouchableOpacity
      style={styles.bottomButtonWrapper}
      disabled={disabled}
      onPress={onPress}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: disabled ? Colors.gray100 : Colors.main500,
          },
        ]}
      >
        <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 336,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});