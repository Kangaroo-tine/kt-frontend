// app/(tabs)/parent-calendar.tsx
import ParentCalendar from "@/components/calendar/ParentCalendar";
import React from "react";
import { SafeAreaView } from "react-native";

export default function ParentCalendarScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ParentCalendar />
    </SafeAreaView>
  );
}
