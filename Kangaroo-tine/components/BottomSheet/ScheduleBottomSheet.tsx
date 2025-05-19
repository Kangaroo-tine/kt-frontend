import React from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";

import grayCheckImg from "@assets/icons/gray_check.png";
import greenCheckImg from "@assets/icons/green_check.png";

interface Todo {
  time: string;
  task: string;
  done: boolean;
}

interface Props {
  date: string | null;
  getDateLabel: (date: string) => string;
  todoData: Record<string, Todo[]>;
  onPressDetail: () => void;
}

const ScheduleBottomSheet = ({
  date,
  getDateLabel,
  todoData,
  onPressDetail,
}: Props) => {
  const todos = date ? todoData[getDateLabel(date)] || [] : [];
  return (
    <View style={styles.bottomSheetContainer}>
      <Text style={styles.dateLabel}>
        {date ? getDateLabel(date) : "날짜를 선택해주세요"}
      </Text>
      <View style={{ padding: 10 }} />
      <View style={{ flexShrink: 1 }}>
        <ScrollView
          style={{ maxHeight: 300, flexGrow: 0 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {todos.map((todo) => (
            <View style={styles.todoCard} key={`${todo.time}-${todo.task}`}>
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
                resizeMode="contain"
              />
            </View>
          ))}
          <TouchableOpacity onPress={onPressDetail} style={styles.detailButton}>
            <Text style={styles.detailButtonText}>일정 상세보기</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  dateLabel: {
    fontSize: 20,
    fontWeight: "400",
    color: "#555",
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
  detailButton: {
    marginTop: 20,
    marginBottom: 100,
    backgroundColor: "#71C95D",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  todoTime: {
    width: 60,
    fontSize: 14,
    color: "#333",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#222",
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
});

export default ScheduleBottomSheet;
