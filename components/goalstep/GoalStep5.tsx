import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import Back from '../../assets/icon/arrow/back_arrow.svg';
import Center from '../../assets/GUI/emotion/emotion_done.svg';
import OnboardingLayout from '../layout/OnboardingLayout';
import StepButton from '../shared/StepButton';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

type Props = {
  mainGoal: string;
  subGoals: string[];
  onNext: (data: {}) => void;
  onBack: () => void;
};

export default function GoalStep5({ mainGoal, subGoals, onNext, onBack }: Props) {
  return (
    <>
      <OnboardingLayout
        title="STEP 5 완료"
        mainTitle={'목표 설정이 완료되었어요!\n이제 캥거루틴을 시작해볼까요?'}
        subtitle="목표 달성을 위해 하루하루 꾸준히 실천해보세요!"
        progress={1.0}
        leftIcon={
          <TouchableOpacity onPress={onBack}>
            <Back width={24} height={24} />
          </TouchableOpacity>
        }
      >
        <View style={styles.centerWrapper}>
          <Center width={200} height={200} />
          <View style={styles.textWrapper}>
            <Text style={[Typo.heading02, { color: Colors.gray900, textAlign: 'center' }]}>
              목표가 성공적으로 등록되었어요!
            </Text>
            <Text style={[Typo.body02, { color: Colors.gray500, textAlign: 'center', marginTop: 12 }]}>
              '{mainGoal}' 목표를 위해{'\n'}
              {subGoals.length}개의 세부 목표가 준비되었습니다.
            </Text>
          </View>
        </View>
      </OnboardingLayout>

      <StepButton
        text="캥거루틴 시작하기"
        onPress={() => onNext({})}
        disabled={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  centerWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  textWrapper: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});