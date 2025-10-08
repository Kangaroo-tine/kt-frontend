import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, StatusBar, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomButton from "@/components/button/MypageEditBtn";
import { useRouter } from 'expo-router';

//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import ProfilePhoto from '@/assets/temp/temp_profile_edit.svg';
import CloseRedIcon from '@/assets/icon/x_icon/red.svg';

//커스텀 토스트
function CustomToast({ message }: { message: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // 투명도 0으로 시작 
  useEffect(() => {
    if (message) {
      // 토스트가 새로 생기면 페이드 인 → 0.3초 대기 → 페이드 아웃
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300, // 등장 속도
          useNativeDriver: true,
        }),
        Animated.delay(2000), // 보여지는 시간
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400, // 사라지는 속도
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
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
      setToastMessage(""); // 기존 비우고
      setTimeout(() => {
        setToastMessage("이메일 형식이 올바르지 않습니다"); }, 100);
      return;
    }
    setEmailError(false);
    setToastMessage("프로필이 변경되었습니다");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

        {/* 입력 폼 */}
        <View style={styles.textEditWrapper}>
          {/* 이름 */}
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                Typo.body02,
                styles.input,
                nameActive && styles.activeInput,
                { flex: 1 },
              ]}
              placeholder="이름을 입력해주세요."
              placeholderTextColor={Colors.gray300}
              value={name}
              onFocus={() => setNameActive(true)}
              onBlur={() => setNameActive(false)}
              onChangeText={setName}
            />
          </View>
          
          {/* 이메일 */}
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                Typo.body02,
                styles.input,
                emailActive && !emailError && styles.activeInput,
                emailError && styles.errorInput,
                { flex: 1 },
              ]}
              placeholder="emailaddress@email.com"
              placeholderTextColor={Colors.gray300}
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
                onPress={() => {
                  setEmail("");
                  setEmailError(false);
                }}
              >
                <CloseRedIcon width={20} height={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
          
        {/* 커스텀 토스트 */}
        <CustomToast message={toastMessage} />

      </View>
    </TouchableWithoutFeedback>
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
  toastContainer: {
    position: "absolute",
    bottom: 30,
    left: 10,
    right: 10,
    backgroundColor: Colors.main600,
    paddingVertical: 13,
    paddingHorizontal: 0,
    borderRadius: 8,
    alignItems: "center",
  },
  toastText: {
    color: Colors.gray900,
  },
});
