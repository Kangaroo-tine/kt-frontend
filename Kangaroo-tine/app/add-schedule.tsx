import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import BackButton from "../components/ui/BackButton";
import { FontAwesome } from "@expo/vector-icons";
import NextIcon from "@assets/icons/next_icon.png";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function AddSchedulePage() {
  const [isStarred, setIsStarred] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [activePicker, setActivePicker] = useState<"start" | "end" | null>(
    null
  );
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [details, setDetails] = useState<string[]>([""]);
  const [taskTitle, setTaskTitle] = useState("");
  const router = useRouter();
  const { date } = useLocalSearchParams();

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleDetailChange = (index: number, text: string) => {
    const updated = [...details];
    updated[index] = text;
    setDetails(updated);

    if (index === details.length - 1 && text.trim() !== "") {
      setDetails([...updated, ""]);
    }
  };

  const handleDetailDelete = (index: number) => {
    const updated = [...details];
    updated.splice(index, 1);
    setDetails(updated.length > 0 ? updated : [""]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <BackButton />
        </View>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Text style={styles.header}>즐겨찾기</Text>
            <Pressable
              onPress={() => setIsStarred((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <FontAwesome
                name="star"
                size={26}
                color={isStarred ? "#FFD700" : "#ccc"}
              />
            </Pressable>
          </View>
          <Image
            source={NextIcon}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="할 일"
          placeholderTextColor="#999"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <View style={styles.timeRow}>
          <TouchableOpacity onPress={() => setActivePicker("start")}>
            <Text style={styles.timeText}>
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          <Text style={styles.arrow}>→</Text>
          <TouchableOpacity onPress={() => setActivePicker("end")}>
            <Text style={styles.timeText}>
              {endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={activePicker !== null}
          mode="time"
          date={activePicker === "start" ? startTime : endTime}
          onConfirm={(date) => {
            if (activePicker === "start") setStartTime(date);
            else setEndTime(date);
            setActivePicker(null);
          }}
          onCancel={() => setActivePicker(null)}
        />

        <Text style={styles.label}>반복</Text>
        <View style={styles.dayRow}>
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => toggleDay(d)}
              style={[
                styles.day,
                d === "일" && { color: "#FF6464" },
                d === "토" && { color: "#6495ED" },
                selectedDays.includes(d) && styles.selectedDay,
              ]}
            >
              <Text
                style={[
                  selectedDays.includes(d) && styles.selectedDayText,
                  !selectedDays.includes(d) && {
                    color:
                      d === "일" ? "#FF6464" : d === "토" ? "#6495ED" : "#444",
                  },
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>중요도</Text>
        <View style={styles.priorityRow}>
          {["상", "중", "하"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priority,
                selectedPriority === p && styles.selectedPriority,
              ]}
              onPress={() => setSelectedPriority(p)}
            >
              <Text
                style={[
                  styles.priorityText,
                  selectedPriority === p && styles.selectedPriorityText,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>상세내용</Text>
        <View style={{ gap: 8, marginBottom: 30 }}>
          {details.map((detail, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Text style={{ marginRight: 6 }}>{index + 1}.</Text>
              <TextInput
                style={[styles.memoInput, { flex: 1, marginBottom: 0 }]}
                placeholder={`내용 ${index + 1}`}
                value={detail}
                onChangeText={(text) => handleDetailChange(index, text)}
              />
              <TouchableOpacity
                onPress={() => handleDetailDelete(index)}
                style={{ marginLeft: 8 }}
              >
                <FontAwesome name="close" size={25} color="#ccc" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            const newTodo = {
              time: `${startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}-${endTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}`,
              task: taskTitle,
              done: false,
              repeatDays: selectedDays,
              priority: selectedPriority,
              details: details.filter((d) => d.trim() !== ""),
            };
            router.push({
              pathname: "/calendar-detail",
              params: {
                date,
                todo: JSON.stringify(newTodo),
              },
            });
          }}
        >
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrow: {
    fontSize: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    paddingTop: 10,
    paddingBottom: 20,
  },
  dayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  day: {
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedDay: {
    borderColor: "#71C95D",
    backgroundColor: "#D8F5CB",
  },
  selectedDayText: {
    color: "#71C95D",
    fontWeight: "600",
  },
  priorityRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  priority: {
    backgroundColor: "#D8F5CB",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  selectedPriority: {
    backgroundColor: "#71C95D",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
  },
  selectedPriorityText: {
    color: "#fff",
  },
  memoInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 50,
    marginBottom: 30,
  },
  saveButton: {
    backgroundColor: "#71C95D",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
