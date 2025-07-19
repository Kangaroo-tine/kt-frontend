// app/(onboarding)/start.tsx
import * as React from 'react';
import { useState } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

//아이콘
import Back from '../../assets/icon/arrow/back_arrow.svg';
//폰트, 컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenPhone() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'gard' | 'target' | null>(
    null,
  );
  const [isActive, setIsActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonText, setButtonText] = useState('인증하기');

  const handleInputChange = (text: string) => {
    setPhoneNumber(text);
    setIsActive(text.length > 10);
  };

  const clearInput = () => {
    setPhoneNumber('');
    setIsActive(false);
  };

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
              보호자 번호를
            </Text>
            <Text style={[Typo.title02, { color: Colors.gray900 }]}>
              입력해 주세요
            </Text>
          </View>
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              보호자 번호를 하이픈 ( - ) 없이 입력해 주세요
            </Text>
          </View>
          <View style={{ height: 90 }} />
          <View
            style={[
              styles.inputWrapper,
              { borderBottomColor: isActive ? Colors.main600 : Colors.gray200 },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="번호를 입력해주세요"
                placeholderTextColor={Colors.gray300}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handleInputChange}
              />
              {phoneNumber.length > 0 && (
                <TouchableOpacity onPress={clearInput}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.gray200}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={!isActive}
            onPress={() => {
              if (buttonText === '다음') {
                router.push('/step3_tar_code');
              } else {
                setButtonText('다음');
              }
            }}
          >
            <View
              style={[
                styles.button,
                { backgroundColor: isActive ? Colors.main600 : Colors.gray100 },
              ]}
            >
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                {buttonText}
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
  },
  input: {
    ...Typo.body02,
    color: Colors.gray900,
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
});
