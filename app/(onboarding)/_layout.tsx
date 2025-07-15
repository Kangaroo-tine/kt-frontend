// app/(onboarding)/_layout.tsx
import { View } from 'react-native';
import React from 'react';

import { Slot } from 'expo-router';

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}
