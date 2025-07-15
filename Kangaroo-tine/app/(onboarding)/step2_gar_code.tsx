// app/(onboarding)/start.tsx
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

import * as React from 'react';
import { useState } from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

//아이콘
import Back from '../../assets/icon/arrow/back_arrow.svg';
import Taget from '../../assets/icon/dependent/target.svg';

export default function ScreenCode() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isActive = selectedRole !== null && code.length === 7;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.backButtonWrapper}>
            <TouchableOpacity onPress={() => router.back()}>
              <Back width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title02, { color: Colors.gray900 }]}>
              받은 연결코드를
            </Text>
            <Text style={[Typo.title02, { color: Colors.gray900 }]}>
              입력해 주세요
            </Text>
          </View>
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              대상자 선택 후, 연결코드 7자리를 입력해 주세요
            </Text>
          </View>
          <View style={{ height: 60 }} />
          <View style={styles.subtitleWrapper}>
            <View
              style={{
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selectedRole ? Colors.main500 : Colors.gray200,
                overflow: 'hidden',
                marginTop: 12,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingHorizontal: 20,
                  backgroundColor: Colors.gray0,
                  paddingVertical: 10,
                  minHeight: 60,
                }}
                onPress={() => {
                  setIsDropdownOpen((prev) => !prev);
                }}
              >
                {/* 왼쪽 그룹: 아이콘 + 텍스트 */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Taget width={20} height={20} style={{ marginRight: 8 }} />
                  <Text style={[Typo.heading03, { color: Colors.gray900 }]}>
                    {selectedRole ? selectedRole : '대상자 선택'}
                  </Text>
                </View>

                <Back
                  width={20}
                  height={20}
                  style={{
                    transform: [
                      { rotate: isDropdownOpen ? '90deg' : '270deg' },
                    ],
                  }}
                />
              </TouchableOpacity>
              {isDropdownOpen && (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingBottom: 16,
                    backgroundColor: Colors.gray0,
                  }}
                >
                  <View style={{ gap: 4 }}>
                    {['장효원', '이영주', '김은혜'].map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 10,
                        }}
                        onPress={() => {
                          setSelectedRole(item);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Taget
                          width={20}
                          height={20}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={[Typo.heading03, { color: Colors.gray900 }]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      // 토글추가 로직
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                    }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={Colors.gray400}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[Typo.heading03, { color: Colors.gray400 }]}>
                      대상자 추가
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View
            style={[
              styles.inputWrapper,
              {
                borderBottomColor: hasError
                  ? '#FF5854'
                  : isActive
                  ? Colors.main600
                  : Colors.gray300,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="연결코드를 입력해주세요"
                placeholderTextColor={Colors.gray300}
                keyboardType="default"
                inputMode="text"
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  // do nothing here regarding selectedRole
                  const isValid = text.length === 7;
                  setHasError(!isValid && text.length > 0);
                }}
              />
              {code.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setCode('');
                    setSelectedRole(null);
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={hasError ? Colors.error : Colors.gray200}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={!isActive}
            onPress={() => router.push('/step4_done')}
          >
            <View
              style={[
                styles.button,
                { backgroundColor: isActive ? Colors.main600 : Colors.gray100 },
              ]}
            >
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                인증하기
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
  },
  backButtonWrapper: {
    width: '100%',
    height: 24,
    padding: 20,
  },
  titleWrapper: {
    height: '18%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  roleButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    width: 336,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  input: {
    ...Typo.body02,
    color: Colors.gray900,
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
});
