import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Typo } from "@/constants/Typo";

// 아이콘 에셋
import ArrowDown from "@/assets/icon/arrow/down_arrow.svg";
import ArrowUp from "@/assets/icon/arrow/up_arrow.svg";
import Exercise from "@/assets/icon/goal/exercise.svg";
import Daily from '@/assets/icon/goal/daily.svg';
import Hobby from '@/assets/icon/goal/hobby.svg';
import People from '@/assets/icon/goal/people.svg';
import Study from '@/assets/icon/goal/study.svg';
import Task from '@/assets/icon/goal/task.svg';
import BackArrow from "@/assets/icon/arrow/back_arrow.svg";

// 드롭다운에 표시할 샘플 데이터(API 연동시 추가작업)
const MAIN_GOALS = ["다이어트 하기", "운동 루틴 만들기", "가나다라", "마바사", "아자차카", "타파하"];
const SUB_GOALS = ["운동하기", "식단 기록", "명상하기", "마바사", "아자차카", "타파하"];
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 시간 형식 검증(00:00 ~ 23:59)
const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

// 문자열 시간(00:00) -> 분으로 변환하는 유틸
const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};

export default function ScheduleAddScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();


    const [mainOpen, setMainOpen] = useState(false);
    const [subOpen, setSubOpen] = useState(false);

    const [mainGoal, setMainGoal] = useState<string | null>(null);
    const [subGoal, setSubGoal] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [repeatDays, setRepeatDays] = useState<string[]>([]);

    // 시간 유효성 계산 (start time < end Time)
    const startValid = HHMM.test(startTime);
    const endValid = HHMM.test(endTime);
    const bothTimeValid =
        startValid && endValid && toMinutes(startTime) < toMinutes(endTime);

    // 등록 버튼 활성화 조건:
    const canSubmit = !!mainGoal && !!subGoal && !!title.trim() && bothTimeValid;

    const toggleDay = (d: string) =>
        setRepeatDays((prev) =>
            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
        );

    const onPressMain = () => {
        setMainOpen((p) => !p);
        setSubOpen(false);
    };

    const onPressSub = () => {
        if (!mainGoal) return;
        setSubOpen((p) => !p);
        setMainOpen(false);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.backBtn}
                    accessibilityRole="button"
                    accessibilityLabel="뒤로가기"
                >
                    <BackArrow width={20} height={20} />
                </TouchableOpacity>

                {/* ───────────────── Header ───────────────── */}
                <Text style={styles.headerTitle}>일정 추가</Text>
            </View>

            {/* ───────────────── Main Goal ───────────────── */}
            <View style={styles.dropdownWrap}>
                <Text style={styles.title}>Main Goal</Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                        styles.selectBox,
                        (mainOpen || !!mainGoal) && { borderColor: Colors.main600 },
                    ]}
                    onPress={onPressMain}
                >
                    <View style={styles.selectBoxLeft}>
                        {mainGoal ? (
                            <Exercise width={18} height={18} style={{ marginRight: 6 }} />
                        ) : null}

                        <Text
                            style={[Typo.label02, !mainGoal && { color: Colors.gray300 }]}
                            numberOfLines={1}
                        >
                            {mainGoal ?? "Main Goal 선택하기"}
                        </Text>
                    </View>

                    {mainOpen ? (
                        <ArrowUp width={16} height={16} />
                    ) : (
                        <ArrowDown width={16} height={16} />
                    )}
                </TouchableOpacity>

                {mainOpen && (
                    <ScrollView
                        style={styles.dropdownList}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                    >
                        {MAIN_GOALS.map((g, i) => (
                            <TouchableOpacity
                                key={`${g}-${i}`}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setMainGoal(g);
                                    setSubGoal(null);
                                    setMainOpen(false);
                                }}
                            >
                                <Exercise width={18} height={18} style={{ marginRight: 6 }} />
                                <Text style={[Typo.label03, g === mainGoal && { color: Colors.main600 }]}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* ───────────────── Sub Goal ───────────────── */}
            <View style={styles.dropdownWrap}>
                <Text style={styles.title}>Sub Goal</Text>

                <TouchableOpacity
                    activeOpacity={mainGoal ? 0.8 : 1}
                    style={[
                        styles.selectBox,
                        !mainGoal && styles.selectBoxDisabled,
                        (subOpen || !!subGoal) && mainGoal && { borderColor: Colors.main600 },
                    ]}
                    onPress={onPressSub}
                >
                    <View style={styles.selectBoxLeft}>
                        <Text
                            style={[Typo.label02, !subGoal && { color: Colors.gray300 }]}
                            numberOfLines={1}
                        >
                            {subGoal ?? "Sub Goal 선택하기"}
                        </Text>
                    </View>

                    {subOpen ? (
                        <ArrowUp width={16} height={16} />
                    ) : (
                        <ArrowDown width={16} height={16} />
                    )}
                </TouchableOpacity>

                {subOpen && (
                    <ScrollView style={styles.dropdownList}>
                        {SUB_GOALS.map((g, i) => (
                            <TouchableOpacity
                                key={`${g}-${i}`}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSubGoal(g);
                                    setSubOpen(false);
                                }}
                            >
                                <Text
                                    style={[Typo.label03, g === subGoal && { color: Colors.main600 }]}
                                >
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* ───────────────── 카드: 제목 / 시간 / 반복 ───────────────── */}
            <View style={styles.card}>
                {/* 제목 */}
                <Text style={Typo.body01}>제목</Text>
                <TextInput
                    style={styles.titleInput}
                    placeholder="제목을 입력해주세요"
                    placeholderTextColor={Colors.gray300}
                    value={title}
                    onChangeText={setTitle}
                />

                {/* 시간 */}
                <Text style={[Typo.body01, { marginTop: 14 }]}>시간</Text>
                <View style={styles.timeRow}>
                    {/* 시작 시간 입력 */}
                    <TextInput
                        style={[
                            styles.timeInput,
                            startValid ? styles.timeActive : styles.timeIdle,
                        ]}
                        placeholder="00:00"
                        placeholderTextColor={Colors.gray300}
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        value={startTime}
                        onChangeText={setStartTime}
                    />

                    {/* 가운데 화살표: 양쪽 모두 유효하면 메인색, 아니면 회색 */}
                    <Text
                        style={[
                            Typo.label03,
                            styles.timeArrow,
                            { color: bothTimeValid ? Colors.main600 : Colors.gray300 },
                        ]}
                    >
                        →
                    </Text>

                    {/* 종료 시간 입력 */}
                    <TextInput
                        style={[
                            styles.timeInput,
                            endValid ? styles.timeActive : styles.timeIdle,
                        ]}
                        placeholder="00:00"
                        placeholderTextColor={Colors.gray300}
                        keyboardType="numbers-and-punctuation"
                        maxLength={5}
                        value={endTime}
                        onChangeText={setEndTime}
                    />
                </View>

                {/* 반복 요일 */}
                <Text style={[Typo.body01, { marginTop: 14 }]}>반복</Text>
                <View style={styles.daysRow}>
                    {DAYS.map((d) => {
                        const on = repeatDays.includes(d);
                        return (
                            <TouchableOpacity
                                key={d}
                                onPress={() => toggleDay(d)}
                                style={[styles.dayChip, on && styles.dayChipOn]}
                                activeOpacity={0.8}
                            >
                                {/* 선택 시 텍스트 메인색, 비선택 시 회색 */}
                                <Text
                                    style={[Typo.label01, { color: on ? Colors.main600 : Colors.gray400 }]}
                                >
                                    {d}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* ───────────────── 등록 버튼 ───────────────── */}
            <TouchableOpacity
                activeOpacity={canSubmit ? 0.9 : 1}
                style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
                onPress={() => {
                    if (!canSubmit) return;
                    // TODO: 제출 로직(서버 저장 등) 작성
                    // 저장 성공 시 이전 화면으로 복귀
                    router.back(); //api 연동시 처리
                }}
            >
                <Text style={[Typo.heading04, { color: Colors.gray0 }]}>등록하기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray0,
        paddingHorizontal: 16,
        paddingTop: 10,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        ...Typo.heading04,
        color: Colors.gray800,
    },
    title: {
        ...Typo.heading02,
        color: '#000',
        lineHeight: 24,
    },
    backBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
    },

    // 드롭다운 공통 래핑
    dropdownWrap: { marginTop: 6, marginBottom: 18 },

    // 드롭다운 선택 박스
    selectBox: {
        marginTop: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: Colors.gray300,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: Colors.gray0,
    },
    // 비활성(Sub Goal에서 사용): 연한 보더 + 투명도
    selectBoxDisabled: { borderColor: Colors.gray200, opacity: 0.6 },
    // 왼쪽(아이콘+텍스트) 영역
    selectBoxLeft: { flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 8 },

    // 드롭다운 리스트 컨테이너 (열림상태)
    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: Colors.main600,
        borderRadius: 10,
        backgroundColor: Colors.gray0,
        overflow: "hidden",
        maxHeight: 4 * 48, // 내부스크롤 높이 설정 (약 5개)
    },
    // 드롭다운의 각 아이템
    dropdownItem: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray200,
    },

    // 정보 카드(제목/시간/반복 영역)
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.gray200,
    },

    // 제목 입력창: 하단 보더만
    titleInput: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray300,
        paddingVertical: 8,
        marginTop: 4,
        marginBottom: 10,
    },

    // 시간 영역
    timeRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, },

    // 시간 입력 둥근 모양
    timeInput: {
        width: 60,
        paddingVertical: 4,
        paddingHorizontal: 0,
        borderRadius: 18,
        borderWidth: 1,
        textAlign: "center",
    },
    // 시간 기본 상태(입력 안한 상태)
    timeIdle: {
        borderColor: Colors.gray200,
        color: Colors.gray400,
        backgroundColor: Colors.gray0,
    },
    // 시간 활성 상태
    timeActive: {
        borderColor: Colors.main600,
        color: Colors.main800,
    },
    // 가운데 화살표
    timeArrow: {
        marginHorizontal: 20,
        fontSize: 20,
    },

    // 요일 칩
    daysRow: { marginTop: 10, flexDirection: "row", justifyContent: "space-between" },
    dayChip: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.gray200,
        minWidth: 34,
        alignItems: "center",
        marginBottom: 20,
    },
    // 선택된 요일 칩(배경은 연녹, 테두리는 메인색)
    dayChipOn: {
        borderColor: Colors.main600,
    },

    // 등록 버튼
    submitBtn: {
        marginTop: 4,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: Colors.main600,
    },
    // 비활성 시: 연회색 배경
    submitBtnDisabled: { backgroundColor: Colors.gray200 },
});

