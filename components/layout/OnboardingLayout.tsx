import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../Header';
import ProgressBar from '../ProgressBar';
import { Colors } from '../../constants/Colors';
import { Typo } from '../../constants/Typo';

interface OnboardingLayoutProps {
  title: string;
  mainTitle: string;
  subtitle: string;
  progress: number;
  children: React.ReactNode;
  bottomButton: {
    text: string;
    onPress: () => void;
    disabled?: boolean;
  };
}

export default function OnboardingLayout({
  title,
  mainTitle,
  subtitle,
  progress,
  children,
  bottomButton,
}: OnboardingLayoutProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Header title={title} />
          <View style={styles.titleWrapper}>
            <Text style={[Typo.title03, { color: Colors.gray900 }]}>
              {mainTitle}
            </Text>
          </View>
          <ProgressBar progress={progress} />
          <View style={styles.subtitleWrapper}>
            <Text style={[Typo.label02, { color: Colors.gray500 }]}>
              {subtitle}
            </Text>
          </View>

          <View style={styles.contentWrapper}>
            {children}
          </View>

          <TouchableOpacity
            style={styles.bottomButtonWrapper}
            disabled={bottomButton.disabled}
            onPress={bottomButton.onPress}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor: bottomButton.disabled
                    ? Colors.gray100
                    : Colors.main500,
                },
              ]}
            >
              <Text style={[Typo.heading02, { color: Colors.gray800 }]}>
                {bottomButton.text}
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
  titleWrapper: {
    height: '10%',
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  subtitleWrapper: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
    marginBottom: 70,
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
});