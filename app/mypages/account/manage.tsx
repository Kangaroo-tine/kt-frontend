import React , { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SvgProps } from 'react-native-svg';

//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import NextArrow from '@/assets/icon/arrow/next_arrow.svg';
import LockIcon from '@/assets/icon/blackline_icon/lock.svg';
import PeopleIcon from '@/assets/icon/blackline_icon/people.svg';

//컴포넌트
import ReusableModal from "@/components/shared/ReusableModal"; 

// 목록 UI 관련
type MenuItemProps = {
  icon: React.FC<SvgProps>;
  label: string;
  onPress?: () => void;
};

const MenuItem = ({ icon: Icon, label, onPress }: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon width={14} height={14} style={{ marginRight: 5 }} />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
  </TouchableOpacity>
);


export default function Manage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  //로그아웃 모달
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  //모달에서 로그아웃 버튼 눌렀을 때 핸들러
  const handleLogout = () => {
    setLogoutModalVisible(false) //수정!!!!!!!!!!!!!!=======================
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>계정관리</Text>
      </View>

      { /* 본문 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정</Text>
        <View style={styles.box}>
          <MenuItem
            icon={LockIcon}
            label="로그아웃"
            onPress={() => setLogoutModalVisible(true)}
          />
          <MenuItem
            icon={PeopleIcon}
            label="탈퇴하기"
            onPress={() => router.push('./withdraw')}
          />
        </View>
      </View>

      {/* 로그아웃 모달 */}
      <ReusableModal
        isVisible={logoutModalVisible}
        title="로그아웃 하실건가요?"
        subtitle="언제든 기다리고 있을게요!"
        cancelText="로그아웃"
        confirmText="돌아가기"
        onCancel={() => handleLogout()} // -> 로그아웃 핸들러
        onConfirm={() => setLogoutModalVisible(false)} // → 돌아가기 누르면 모달 닫힘
      />

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
    padding : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight : 12,
  },
  headerTitle: {
    ...Typo.heading04,
    color : Colors.gray800,
  },
  box: { 
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  section: {
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  sectionTitle: {
    ...Typo.label01,
    color: Colors.gray500,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuLabel: {
    ...Typo.body02,
    color: Colors.gray900,
  },
});
