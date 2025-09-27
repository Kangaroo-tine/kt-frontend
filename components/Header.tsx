import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Back from '../assets/icon/arrow/back_arrow.svg';
import { Colors } from '../constants/Colors';
import { Typo } from '../constants/Typo';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
}

export default function Header({ title, onBackPress }: HeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <TouchableOpacity onPress={handleBackPress}>
          <Back width={24} height={24} />
        </TouchableOpacity>
      </View>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[Typo.heading02, { color: Colors.gray900 }]}>
            {title}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    width: 24,
    height: 24,
    zIndex: 1,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});