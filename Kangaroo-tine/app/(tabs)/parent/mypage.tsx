import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//parent 마이페이지 구현 
const MyPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>parent 마이페이지</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000', 
    fontSize: 24,
  },
});

export default MyPage;
