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
import BackButton from "../components/ui/BackButton";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function CalendarDetailPage() {
  const router = useRouter();
  const { date, todo } = useLocalSearchParams();
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

  const [todos, setTodos] = useState<
    {
      time: string;
      task: string;
      done: boolean;
      repeatDays?: string[];
      priority?: string;
      details?: string[];
    }[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const todoData: Record<
        string,
        {
          time: string;
          task: string;
          done: boolean;
          repeatDays?: string[];
          priority?: string;
          details?: string[];
        }[]
      > = {
        "8일 목요일": [
          {
            time: "08:00-09:00",
            task: "양치하기",
            done: true,
            repeatDays: ["월", "화", "수"],
            priority: "상",
            details: ["칫솔 준비", "입 헹구기"],
          },
          {
            time: "11:00-12:00",
            task: "책 읽기",
            done: false,
            priority: "중",
          },
        ],
        // 추후 저장된 일정 목록 포함 가능
      };
      const label = selectedDate ? getDateLabel(selectedDate) : "";
      const baseTodos = label ? todoData[label] || [] : [];
      const newTodo = typeof todo === "string" ? JSON.parse(todo) : null;
      setTodos(newTodo ? [...baseTodos, newTodo] : baseTodos);
    }, [selectedDate, todo])
  );

  const label = selectedDate ? getDateLabel(selectedDate) : "";

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <BackButton />
        <Text style={styles.headerTitle}>일정 상세보기</Text>
      </View>
      <Text style={styles.todoCount}>
        <Text style={styles.count}>{todos.length}</Text>개의 할 일이 있습니다.
      </Text>
      <Text style={styles.dateLabel}>{selectedDate}</Text>

      <ScrollView style={{ marginTop: 20 }} contentContainerStyle={{ gap: 12 }}>
        {todos.map((todo, i) => (
          <TodoItem key={i} todo={todo} />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          router.push({
            pathname: "/add-schedule",
            params: { date: selectedDate },
          })
        }
      >
        <Text style={styles.addButtonText}>일정 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30, // 80 → 40으로 상단 간격 줄임
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 20, // 아이콘 때문에 오른쪽 여백 확보
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
    flexDirection: "column",
    backgroundColor: "#D8F5CB",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  todoTime: {
    fontSize: 14,
    fontWeight: "bold",
    width: 120,
    paddingLeft: 1,
  },
  todoTask: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "center",
  },
  todoArrow: {
    width: 16,
    height: 16,
    marginLeft: 8,
    marginRight: 10,
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
  priority: {
    backgroundColor: "#7DDF67",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
});

// Extracted TodoItem component for expand/collapse
function TodoItem({
  todo,
}: {
  todo: {
    time: string;
    task: string;
    done: boolean;
    repeatDays?: string[];
    priority?: string;
    details?: string[];
  };
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.todoCard}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.todoTime}>
          {todo.time.replace(/(\d+):(\d+)\s*([AP]M)/gi, (_, h, m, p) => {
            let hour = parseInt(h, 10);
            if (p.toUpperCase() === "PM" && hour !== 12) hour += 12;
            if (p.toUpperCase() === "AM" && hour === 12) hour = 0;
            return `${hour.toString().padStart(2, "0")}:${m}`;
          })}
        </Text>
        <Text style={styles.todoTask} numberOfLines={1} ellipsizeMode="tail">
          {todo.task}
        </Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Image source={downArrowImg} style={styles.todoArrow} />
        </TouchableOpacity>
      </View>
      {expanded && (
        <View style={{ marginTop: 8, paddingLeft: 120 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            {todo.priority && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 12, color: "#666", marginRight: 4 }}>
                  중요도:
                </Text>
                <View style={styles.priority}>
                  <Text
                    style={{ fontSize: 12, fontWeight: "500", color: "#FFF" }}
                  >
                    {todo.priority}
                  </Text>
                </View>
              </View>
            )}
            {todo.repeatDays?.length > 0 && (
              <Text style={{ fontSize: 12, color: "#666" }}>
                반복: {todo.repeatDays.join(", ")}
              </Text>
            )}
          </View>
          {todo.details?.map((d, idx) => (
            <Text
              key={idx}
              style={{ fontSize: 12, color: "#444", marginTop: 4 }}
            >
              {`${idx + 1}. ${d}`}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
