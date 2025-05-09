// components/calendar/KidsCalendar.tsx

import grayCheckImg from "@assets/icons/gray_check.png";
import greenCheckImg from "@assets/icons/green_check.png";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import EmotionDay from "./EmotionDay";

const KidsCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [emotionData, setEmotionData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEmotionData = async () => {
      // Mock test data
      const data = [
        { date: "2025-05-08", emotion: "joy" },
        { date: "2025-05-09", emotion: "sad" },
      ];

      // Simulate async delay
      setTimeout(() => {
        const formatted = Object.fromEntries(
          data.map((item) => [item.date, item.emotion])
        );
        setEmotionData(formatted);
      }, 500);
    };

    fetchEmotionData();
  }, []);

  const getDateLabel = (date: string) => {
    const d = new Date(date);
    const dayNames = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return `${d.getDate()}일 ${dayNames[d.getDay()]}`;
  };

  const todoData: Record<
    string,
    { time: string; task: string; done: boolean }[]
  > = {
    "8일 목요일": [
      { time: "08:00", task: "양치하기", done: true },
      { time: "09:00", task: "스트레칭 하기", done: false },
      { time: "11:00", task: "책 읽기", done: true },
    ],
  };

  const markedDates = {
    [today]: {
      selected: true,
      selectedColor: "#71C95D",
    },
    ...(selectedDate && {
      [selectedDate]: {
        selected: true,
        selectedColor: "#8B8B8B",
      },
    }),
  };

  const renderTodoList = (date: string) => {
    const todos = todoData[getDateLabel(date)];

    if (!todos || todos.length === 0) {
      return <Text style={styles.emptyText}>일정이 비어있어요.</Text>;
    }

    return todos.map((todo, idx) => (
      <View key={idx} style={styles.todoCard}>
        <Text style={styles.todoTime}>{todo.time}</Text>
        <Text
          style={[
            styles.todoText,
            todo.done && {
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
              color: "#999",
            },
          ]}
        >
          {todo.task}
        </Text>
        <Image
          source={todo.done ? greenCheckImg : grayCheckImg}
          style={styles.checkIcon}
        />
      </View>
    ));
  };

  const renderAchievementBar = (date: string) => {
    const todos = todoData[getDateLabel(date)];
    if (!todos || todos.length === 0) return null;

    const doneCount = todos.filter((t) => t.done).length;
    const totalCount = todos.length;
    const percentage = (doneCount / totalCount) * 100;

    return (
      <View style={styles.achievementContainer}>
        <Text style={styles.achievementText}>
          {doneCount}/{totalCount}
        </Text>
        <View style={styles.barWrapper}>
          <View style={[styles.achievementBar, { width: `${percentage}%` }]} />
          <Text
            style={[
              styles.kangaroo,
              { left: `${Math.max(0, percentage - 10)}%` },
            ]}
          >
            🦘
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>캘린더</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markingType={"custom"}
        markedDates={markedDates}
        dayComponent={({ date, state }) => (
          <EmotionDay
            date={date.dateString}
            state={state}
            emotion={emotionData[date.dateString]}
            isSelected={date.dateString === selectedDate}
            onPress={setSelectedDate}
          />
        )}
      />
      <ScrollView style={styles.todoWrapper}>
        <Text style={styles.dateLabel}>
          {selectedDate ? getDateLabel(selectedDate) : "날짜를 선택해주세요"}
        </Text>
        <View>{selectedDate && renderTodoList(selectedDate)}</View>
        <View>{selectedDate && renderAchievementBar(selectedDate)}</View>
      </ScrollView>
    </View>
  );
};

export default KidsCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginLeft: 20,
    fontWeight: "bold",
  },
  todoWrapper: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#F2FCF0",
    padding: 16,
    borderRadius: 12,
    maxHeight: 300,
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  todoCard: {
    backgroundColor: "#D7F5D0",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  todoTime: {
    fontSize: 10,
    fontWeight: "600",
    marginRight: 8,
  },
  todoText: {
    fontSize: 12,
    flex: 1,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#555",
  },
  achievementContainer: {
    marginTop: 12,
  },
  achievementText: {
    fontSize: 14,
    marginBottom: 4,
  },
  barWrapper: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  achievementBar: {
    height: "100%",
    backgroundColor: "#71C95D",
  },
  kangaroo: {
    position: "absolute",
    top: -18,
  },
});
