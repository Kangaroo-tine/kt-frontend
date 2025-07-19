import { StyleSheet } from 'react-native';
/* 사용예시 코드
import { Text, View } from 'react-native';
import { Typo } from '@\constants\Typo.ts'; //경로는 구조에 맞게 수정

export default function HomeScreen() {
  return (
    <View>
      <Text style={Typo.title01}>캥거루틴_kangarootine</Text>
      <Text style={Typo.body02}>캥거루틴 설명글</Text>
    </View>
  );
}
*/


//질문!!! 폰트 크기도 화면 크기에 따라 다르게 해야하나?

export const Typo = StyleSheet.create({
  // Titles
  title01: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 36,
    letterSpacing: -0.03 * 36, // -3%
  },
  title02: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 28,
    letterSpacing: -0.03 * 28,
  },
  title03: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 24,
    letterSpacing: -0.03 * 24,
  },

  // Headings
  heading01: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 20,
    letterSpacing: -0.03 * 20,
  },
  heading02: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    letterSpacing: -0.01 * 18,
  },
  heading03: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 18,
    letterSpacing: -0.01 * 18,
    lineHeight: 25,
  }, 
  heading04: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 16,
    letterSpacing: -0.01 * 16,
  },

  // Body
  body01: {
    fontFamily: 'Pretendard-Bold',
    fontSize: 14,
    letterSpacing: -0.02 * 14,
  },
  body02: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 14,
    letterSpacing: -0.02 * 14,
  },

  // Labels
  label01: {
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 12,
    letterSpacing: -0.01 * 12,
  },
  label02: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    letterSpacing: -0.01 * 12,
  },
  label03: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 10,
    letterSpacing: 0,
  },
});