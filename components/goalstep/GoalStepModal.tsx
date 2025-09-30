import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import GoalStep1 from './GoalStep1';
import GoalStep2 from './GoalStep2';
import GoalStep3 from './GoalStep3';
import GoalStep4 from './GoalStep4';
import GoalStep5 from './GoalStep5';

type Props = {
  visible: boolean;
  onClose: () => void;
  onComplete: (goalData: any) => void;
};

export default function GoalStepModal({ visible, onClose, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
    category: '',
    mainGoal: '',
    subGoals: [],
  });

  const handleStepComplete = (stepData: any) => {
    const updatedData = { ...goalData, ...stepData };
    setGoalData(updatedData);

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // 목표 설정 완료
      onComplete(updatedData);
      onClose();
      setCurrentStep(1); // 리셋
      setGoalData({ category: '', mainGoal: '', subGoals: [] });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoalStep1
            onNext={(data) => handleStepComplete(data)}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <GoalStep2
            category={goalData.category}
            onNext={(data) => handleStepComplete(data)}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <GoalStep3
            mainGoal={goalData.mainGoal}
            onNext={(data) => handleStepComplete(data)}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <GoalStep4
            mainGoal={goalData.mainGoal}
            subGoals={goalData.subGoals}
            onNext={(data) => handleStepComplete(data)}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <GoalStep5
            mainGoal={goalData.mainGoal}
            subGoals={goalData.subGoals}
            onNext={(data) => handleStepComplete(data)}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {renderCurrentStep()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});