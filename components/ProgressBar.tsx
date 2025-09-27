import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface ProgressBarProps {
  progress: number; // 0-1 사이의 값
  height?: number;
}

export default function ProgressBar({ progress, height = 7 }: ProgressBarProps) {
  return (
    <View style={[styles.container, { height }]}>
      <View
        style={[
          styles.progressFill,
          {
            width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
            height
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray200,
    borderRadius: 10,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Colors.main500,
    borderRadius: 10,
  },
});