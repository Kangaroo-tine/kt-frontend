// components/calendar/EmotionDay.tsx
import { EMOTION_ICONS } from "@/constants/emotions";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  date: string;
  state: "disabled" | "today" | "selected" | "";
  emotion?: string;
  isSelected?: boolean;
  onPress?: (date: string) => void;
}

const EmotionDay = ({ date, state, emotion, isSelected, onPress }: Props) => {
  const day = parseInt(date.split("-")[2], 10);

  return (
    <Pressable
      onPress={() => onPress?.(date)}
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        state === "disabled" && styles.disabled,
      ]}
    >
      <Text style={styles.text}>{day}</Text>
      {emotion && <Image source={EMOTION_ICONS[emotion]} style={styles.icon} />}
    </Pressable>
  );
};

export default EmotionDay;

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
    position: "relative",
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: "#71C95D",
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    position: "absolute",
    top: 8,
  },
  icon: {
    width: 25,
    height: 20,
    position: "absolute",
    bottom: 4,
  },
});
