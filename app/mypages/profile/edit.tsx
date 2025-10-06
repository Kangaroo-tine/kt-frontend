import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from "@/components/button/MypageEditBtn";
import { useRouter } from 'expo-router';

//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import ProfilePhoto from '@/assets/temp/temp_profile_edit.svg';

//커스텀 토스트
function CustomToast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

//마이페이지_프로필_수정_메인
export default function ProfileEdit() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [nameActive, setNameActive] = useState(false);
  const [emailActive, setEmailActive] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  //올바른 이메일 입력 형식
  const validateEmail = (text: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text);
  };
  //완료 버튼 핸들러
  const handleComplete = () => {
    if (email && !validateEmail(email)) {
      setEmailError(true);
      setToastMessage("이메일 형식이 올바르지 않습니다");
      setTimeout(() => setToastMessage(""), 2500); // 2.5초 뒤 사라짐
      return;
    }
    setEmailError(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필 수정</Text>
        {/* 완료 버튼 */}
        <View style= {styles.completeBtnWrapper}>
          <CustomButton
            label="완료"
            active={!!name || !!email}
            onPress={handleComplete}
          />
        </View>
      </View>

      {/* 프로필 사진 */}
      <View style={styles.profilePhoto}>
        <ProfilePhoto />
      </View>
      
      <View style={styles.textEditWrapper}>
        {/* 이름 */}
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={[
            styles.input,
            nameActive && styles.activeInput,
          ]}
          placeholder="이름을 입력해주세요."
          placeholderTextColor= "#A6A6A6"
          value={name}
          onFocus={() => setNameActive(true)}
          onBlur={() => setNameActive(false)}
          onChangeText={setName}
        />

        {/* 이메일 */}
        <Text style={styles.label}>이메일</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              emailActive && styles.activeInput,
              emailError && styles.errorInput,
              { flex: 1 },
            ]}
            placeholder="emailaddress@email.com"
            placeholderTextColor="#A6A6A6"
            value={email}
            onFocus={() => setEmailActive(true)}
            onBlur={() => setEmailActive(false)}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(false);
            }}
          />
          {emailError && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setEmail("");
                setEmailError(false);
              }}
            >
              <Text style={styles.clearButtonText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
        
      {/* 커스텀 토스트 */}
      <CustomToast message={toastMessage} />

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
  completeBtnWrapper: {
    marginLeft: 200,
  },
  //프로필 사진
  profilePhoto: {
    height: 85,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //텍스트 수정
  textEditWrapper: {
    padding: 20,
  },
  label: {
    ...Typo.body02,
    marginTop: 16,
    marginBottom: 4,
    color: Colors.gray900,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
    paddingVertical: 8,
    fontSize: 16,
  },
  activeInput: {
    borderBottomColor: Colors.main600,
  },
  errorInput: {
    borderBottomColor: "red",
  },
  clearButton: {
    marginLeft: 8,
    backgroundColor: "red",
    borderRadius: 20,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: Colors.main600,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  toastText: {
    color: Colors.gray900,
  },
});
