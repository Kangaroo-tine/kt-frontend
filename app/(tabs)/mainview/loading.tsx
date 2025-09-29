import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";

//dependent 마이페이지 구현 
const Loading = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>켈퍼 로딩 화면</Text>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => router.push('../../kelper')}
      >
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
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
  roundButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Loading;
