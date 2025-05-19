// components/calendar/ParentCalendar.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import PercentDay from "./PercentDay";
import { useRouter } from "expo-router";
import ScheduleBottomSheet from "../BottomSheet/ScheduleBottomSheet";

const ParentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];
  const [percentData, setPercentData] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchPercentData = async () => {
      const data = [
        { date: "2025-05-08", percent: 60 },
        { date: "2025-05-09", percent: 100 },
      ];
      setTimeout(() => {
        const formatted = Object.fromEntries(
          data.map((item) => [item.date, item.percent])
        );
        setPercentData(formatted);
      }, 500);
    };

    fetchPercentData();
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

  const renderTodoList = (date: string) => {
    const todos = todoData[getDateLabel(date)];
    const label = getDateLabel(date);

    console.log("🧪 date:", date);
    console.log("🧪 label:", label);
    console.log("🧪 todos:", todos);

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
      </View>
    ));
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

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.title}>캘린더</Text>
        <Calendar
          style={{ height: 320 }}
          onDayPress={handleDayPress}
          markingType={"custom"}
          markedDates={markedDates}
          theme={{
            arrowColor: "#B5BEC6",
            todayTextColor: "#B5BEC6",
          }}
          dayComponent={({ date, state }) => (
            <PercentDay
              date={date.dateString}
              state={state}
              percent={percentData[date.dateString]}
              isSelected={date.dateString === selectedDate}
              onPress={() => handleDayPress({ dateString: date.dateString })}
            />
          )}
        />
        <View style={{ marginTop: 100 }}></View>
        <ScheduleBottomSheet
          date={selectedDate}
          getDateLabel={getDateLabel}
          todoData={todoData}
          onClose={() => {}}
          onPressDetail={() =>
            router.push({
              pathname: "/calendar-detail",
              params: { date: selectedDate },
            })
          }
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  title: {
    fontSize: 25,
    marginLeft: 20,
    marginTop: 10,
    fontWeight: "medium",
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  todoCard: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoTime: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    width: 60,
  },
  todoText: {
    fontSize: 14,
    flex: 1,
    color: "#222",
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
  modalContent: {
    backgroundColor: "#F2FCF0",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#71C95D",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
export default ParentCalendar;
