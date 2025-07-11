import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//parent 감정기록 구현 
const Emotion = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>parent 감정기록</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000', 
    fontSize: 24,
  },
});

export default Emotion;
