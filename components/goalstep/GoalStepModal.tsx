import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import GoalStep1 from './GoalStep1';
import GoalStep2 from './GoalStep2';
import GoalStep3 from './GoalStep3';
import GoalStep4 from './GoalStep4';
import GoalStep5 from './GoalStep5';
import type { GoalCategory } from '../../types/goal';
import type { CommitGoalDraftResponse } from '../../types/goal';

export type GoalCreationData = {
  categoryLabel?: string;
  categoryValue?: GoalCategory;
  goalDraftId?: string;
  mainGoal?: string;
  subGoals: string[];
  selectedPreviewIds?: string[];
  commitResponse?: CommitGoalDraftResponse;
  committedGoalId?: string | number;
};

const TOTAL_STEPS = 5;

const initialGoalData: GoalCreationData = {
  subGoals: [],
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onComplete: (goalData: GoalCreationData) => void;
};

export default function GoalStepModal({
  visible,
  onClose,
  onComplete,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState<GoalCreationData>(initialGoalData);

  const resetWorkflow = () => {
    setGoalData(initialGoalData);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!visible) {
      resetWorkflow();
    }
  }, [visible]);

  const finalize = (finalData: GoalCreationData) => {
    onComplete(finalData);
    onClose();
    resetWorkflow();
  };

  const handleStepComplete = (stepData: Partial<GoalCreationData> = {}) => {
    setGoalData((prev) => {
      const merged = { ...prev, ...stepData };
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prevStep) => Math.min(TOTAL_STEPS, prevStep + 1));
      } else {
        finalize(merged);
      }
      return merged;
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    } else {
      resetWorkflow();
      onClose();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GoalStep1
            onNext={(data) =>
              handleStepComplete({
                categoryLabel: data.categoryLabel,
                categoryValue: data.categoryValue,
                goalDraftId: data.goalDraftId,
              })
            }
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <GoalStep2
            categoryLabel={goalData.categoryLabel}
            goalDraftId={goalData.goalDraftId}
            onNext={(data) =>
              handleStepComplete({
                mainGoal: data.mainGoal,
              })
            }
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <GoalStep3
            mainGoal={goalData.mainGoal ?? ''}
            goalDraftId={goalData.goalDraftId}
            onNext={(data) =>
              handleStepComplete({
                subGoals: data.subGoals,
                selectedPreviewIds: data.selectedPreviewIds,
              })
            }
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <GoalStep4
            mainGoal={goalData.mainGoal ?? ''}
            subGoals={goalData.subGoals}
            goalDraftId={goalData.goalDraftId}
            onNext={(data) =>
              handleStepComplete({
                commitResponse: data.commitResponse,
                committedGoalId: data.committedGoalId,
              })
            }
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <GoalStep5
            mainGoal={goalData.mainGoal ?? ''}
            subGoals={goalData.subGoals}
            onNext={() => handleStepComplete()}
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
      onRequestClose={() => {
        resetWorkflow();
        onClose();
      }}
    >
      <View style={styles.container}>{renderCurrentStep()}</View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
