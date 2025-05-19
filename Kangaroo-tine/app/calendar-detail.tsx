// app/calendar-detail.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import downArrowImg from "../assets/icons/down_icon.png";
import backArrowImg from "../assets/icons/back_icon.png";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

export default function CalendarDetailPage() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const selectedDate = typeof date === "string" ? date : "";
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
  const label = selectedDate ? getDateLabel(selectedDate) : "";
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
  const todos = label ? todoData[label] || [] : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={backArrowImg} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>일정 상세보기</Text>
      </View>
      <Text style={styles.todoCount}>
        <Text style={styles.count}>{todos.length}</Text>개의 할 일이 있습니다.
      </Text>
      <Text style={styles.dateLabel}>{selectedDate}</Text>

      <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ gap: 12 }}>
        {todos.map((todo, i) => (
          <View key={i} style={styles.todoCard}>
            <Text style={styles.todoTime}>{todo.time}</Text>
            <Text style={styles.todoTask}>{todo.task}</Text>
            <Image source={downArrowImg} style={styles.todoArrow} />
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>일정 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  todoCount: {
    fontSize: 18,
    marginBottom: 4,
  },
  count: {
    fontSize: 30,
    fontWeight: "bold",
  },
  dateLabel: {
    fontSize: 16,
    color: "#555",
  },
  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D8F5CB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  todoTime: {
    fontSize: 14,
    fontWeight: "bold",
    width: 60,
  },
  todoTask: {
    flex: 1,
    fontSize: 15,
  },
  todoArrow: {
    width: 16,
    height: 16,
    marginLeft: 8,
  },
  addButton: {
    marginTop: 24,
    marginBottom: 50, // ⬅️ 하단 여백 추가
    backgroundColor: "#71C95D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
