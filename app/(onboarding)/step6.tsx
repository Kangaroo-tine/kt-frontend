// onboarding/complete.tsx (마지막 단계)
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import Done from '../../assets/GUI/done.svg';
//아이콘
import Back from '../../assets/icon/arrow/back_arrow.svg';
//폰트,컬러
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

export default function CompleteScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <Back width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.doneWrapper}>
        <Done width={180} height={230} />
        <View style={{ height: 40 }} />
        <View style={{ alignItems: 'center' }}>
          <Text
            style={[
              Typo.title02,
              { color: Colors.gray900, textAlign: 'center' },
            ]}
          >
            캥거루틴과 함께 {'\n'}차근차근 실천해봐요
          </Text>
        </View>
        <View style={styles.subtitleWrapper}>
          <Text style={[Typo.label02, { color: Colors.gray500 }]}>
            캥거루틴이 당신의 여정을 함께 응원할게요!
          </Text>
        </View>
      </View>

      <View style={styles.bottomButtonWrapper}>
        <TouchableOpacity
          style={[
            styles.buttonHalf,
            { backgroundColor: Colors.gray100, marginRight: 8 },
          ]}
          onPress={() => router.push('/(tabs)/BottomTabs')}
        >
          <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
            홈으로 가기
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonHalf, { backgroundColor: Colors.main600 }]}
          onPress={() => router.push('/(tabs)/BottomTabs')}
        >
          <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
            일정 추가하기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bottomButtonWrapper: {
    position: 'absolute',
    bottom: '5%',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: 336,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonHalf: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneWrapper: {
    flex: 1,
    bottom: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
