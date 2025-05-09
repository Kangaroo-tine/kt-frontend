// app/(tabs)/kids-calendar.tsx
import KidsCalendar from '@/components/calendar/KidsCalendar';
import React from 'react';
import { SafeAreaView } from 'react-native';

export default function KidsCalendarScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KidsCalendar />
    </SafeAreaView>
  );
}