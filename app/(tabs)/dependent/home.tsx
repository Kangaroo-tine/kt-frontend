import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//dependent 홈 구현 
const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>dependent 홈</Text>
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

export default Home;
