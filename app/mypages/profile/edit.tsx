import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';

//마이페이지_프로필_수정_메인
export default function ProfileEdit() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
      </View>

      <View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // 헤더 스타일
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    ...Typo.heading04,
    color: Colors.gray800,
  },
});
