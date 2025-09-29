import { useState } from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import XIcon from '../../assets/icon/x.svg';
import OnboardingLayout from '../../components/layout/OnboardingLayout';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function ScreenCode() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [goalText, setGoalText] = useState('');

  return (
    <OnboardingLayout
      title="STEP 2 목표 정의"
      mainTitle={'해당 카테고리의\nMain Goal을 입력해주세요.'}
      subtitle="이 카테고리를 통해 이루고 싶은 최종 목표를 자유롭게 적어보세요."
      progress={0.4}
      bottomButton={{
        text: '다음',
        onPress: () =>
          router.push(
            `/step4?category=${encodeURIComponent(
              (category as string) || '',
            )}&goalText=${encodeURIComponent(goalText)}`,
          ),
        disabled: !goalText,
      }}
    >
      <View style={styles.categoryContainer}>
        <View style={styles.categoryBox}>
          <Text style={[Typo.heading03, { color: Colors.gray900 }]}>
            {category || '선택된 카테고리'}
          </Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputBox,
            {
              borderBottomColor: goalText ? Colors.main600 : Colors.gray200,
            },
          ]}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={[
                Typo.body02,
                {
                  color: goalText ? Colors.gray600 : Colors.gray300,
                  flex: 1,
                },
              ]}
              placeholder="이루고 싶은 목표 입력하기"
              placeholderTextColor={Colors.gray300}
              value={goalText}
              onChangeText={setGoalText}
            />
            <TouchableOpacity onPress={() => setGoalText('')}>
              <View style={styles.iconBox}>
                <XIcon
                  width={20}
                  height={20}
                  color={goalText ? Colors.main600 : Colors.gray200}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginTop: 25,
    paddingHorizontal: 12,
  },
  categoryBox: {
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  inputBox: {
    width: '100%',
    paddingHorizontal: 6,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.gray200,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
