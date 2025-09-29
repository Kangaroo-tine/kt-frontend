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
}

export default function OnboardingLayout({
  title,
  mainTitle,
  subtitle,
  progress,
  children,
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
    paddingBottom: 90,
  },
});