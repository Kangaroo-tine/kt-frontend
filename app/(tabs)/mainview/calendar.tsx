import Target from '@/assets/icon/dependent/target.svg';
import Daily from '@/assets/icon/goal/daily.svg';
import Exercise from '@/assets/icon/goal/exercise.svg';
import Hobby from '@/assets/icon/goal/hobby.svg';
import People from '@/assets/icon/goal/people.svg';
import Study from '@/assets/icon/goal/study.svg';
import Task from '@/assets/icon/goal/task.svg';
import Plus from '@/assets/icon/plus2.svg';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

//import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { Link, usePathname, useRouter, useSegments } from 'expo-router';
import { LocaleConfig, Calendar as RNCalendar } from 'react-native-calendars';

/* ---- 캘린더 한글화 ---- */
LocaleConfig.locales['ko'] = {
    monthNames: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
    ],
    monthNamesShort: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
    ],
    dayNames: [
        '일요일',
        '월요일',
        '화요일',
        '수요일',
        '목요일',
        '금요일',
        '토요일',
    ],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

/* ---- 날짜별 미션 더미(예시) ---- */
const missionsByDate: Record<
    string,
    {
        date: string;
        totalCount: number;
        completedCount: number;
        missions: Array<{
            missionId: number;
            title: string;
            mission_start_time: string;
            mission_end_time: string;
            status: 'FAILED' | 'COMPLETED' | 'NOT_STARTED';
            category: 'exercise' | 'daily' | 'hobby' | 'people' | 'study' | 'task';
        }>;
    }
> = {
    '2025-09-19': {
        date: '2025-09-19',
        totalCount: 3,
        completedCount: 2,
        missions: [
            {
                missionId: 1,
                title: '아침 러닝하기',
                mission_start_time: '09:00',
                mission_end_time: '11:00',
                status: 'FAILED',
                category: 'exercise',
            },
            {
                missionId: 2,
                title: '일상 체크',
                mission_start_time: '13:00',
                mission_end_time: '23:00',
                status: 'COMPLETED',
                category: 'daily',
            },
            {
                missionId: 3,
                title: '스터디',
                mission_start_time: '16:00',
                mission_end_time: '18:00',
                status: 'COMPLETED',
                category: 'study',
            },
        ],
    },
    // 예시로 하루 더
    '2025-09-20': {
        date: '2025-09-20',
        totalCount: 2,
        completedCount: 1,
        missions: [
            {
                missionId: 4,
                title: '아침 러닝하기',
                mission_start_time: '09:00',
                mission_end_time: '10:00',
                status: 'COMPLETED',
                category: 'exercise',
            },
            {
                missionId: 5,
                title: '과제 정리',
                mission_start_time: '20:00',
                mission_end_time: '22:00',
                status: 'NOT_STARTED',
                category: 'task',
            },
        ],
    },
};

/* ---- 유틸: YYYY-MM-DD → “n일 요일” ---- */
const formatKoreanDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d); // 로컬 기준 안전 파싱
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${dt.getDate()}일 ${days[dt.getDay()]}요일`;
};

const Calendar = () => {
    const segs = useSegments();
    const path = usePathname();

    useEffect(() => {
        console.log('SEGMENTS', segs, 'PATH', path);
    }, [segs, path]);

    const router = useRouter();
    const today = useMemo(() => new Date(), []);
    const todayStr = useMemo(
        () =>
            new Date(today.getFullYear(), today.getMonth(), today.getDate())
                .toISOString()
                .split('T')[0],
        [today],
    );

    // 처음엔 오늘 선택
    const [selectedDate, setSelectedDate] = useState<string>(todayStr);

    const missionList = missionsByDate[selectedDate]?.missions ?? [];
    const headerLabel = useMemo(
        () => formatKoreanDate(selectedDate),
        [selectedDate],
    );

    return (
        <ScrollView style={styles.container}>
            <RNCalendar
                firstDay={0}
                hideArrows
                enableSwipeMonths
                style={{ marginTop: 22, paddingHorizontal: 40 }}
                onDayPress={(d) => setSelectedDate(d.dateString)}
                renderHeader={(date) => {
                    const [year, month] = date.toString('yyyy MM').split(' ');
                    return (
                        <View style={styles.headerOuter}>
                            <View style={styles.headerWrapper}>
                                <Text style={styles.headerText}>{`${month}월`}</Text>
                            </View>
                        </View>
                    );
                }}
                dayComponent={({ date, state, onPress }) => {
                    if (!date) return null;

                    const isToday = date.dateString === todayStr;
                    const isSelected = date.dateString === selectedDate;
                    const isDisabled = state === 'disabled';
                    const isFuture = date.dateString > todayStr;

                    return (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                onPress?.(date); // RNCalendar 내부 onDayPress 연동
                                setSelectedDate(date.dateString);
                            }}
                        >
                            <View style={[styles.dayBox, isSelected && styles.daySelected]}>
                                <Text
                                    style={[
                                        Typo.label02,
                                        { color: Colors.gray500 },
                                        isDisabled && { color: Colors.gray300 },
                                        isSelected && styles.todayText,
                                        isToday && { color: Colors.main700 }, // 오늘은 bold
                                    ]}
                                >
                                    {date.day}
                                </Text>

                                <View style={{ marginTop: 8 }}>
                                    {isFuture ? (
                                        <View style={styles.futureCircle} />
                                    ) : (
                                        <Target width={24} height={24} />
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />

            {/* 📌 선택 날짜 미션 블록 */}
            <View style={styles.missionBlock}>
                <View style={styles.missionHeader}>
                    <Text style={Typo.label01}>{headerLabel}</Text>

                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('../addevent')}
                    >
                        <Plus width={12} height={12} fill={Colors.gray600} />
                    </TouchableOpacity>
                </View>

                {missionList.length === 0 ? (
                    <Text style={[Typo.label03, { color: Colors.gray400 }]}>
                        이 날짜에 등록된 미션이 없어요.
                    </Text>
                ) : (
                    missionList.map((mission) => (
                        <View key={mission.missionId} style={styles.missionCard}>
                            {/* 왼쪽 아이콘 */}
                            <View style={styles.iconWrapper}>
                                {mission.category === 'exercise' ? (
                                    <Exercise width={28} height={28} />
                                ) : mission.category === 'daily' ? (
                                    <Daily width={28} height={28} />
                                ) : mission.category === 'hobby' ? (
                                    <Hobby width={28} height={28} />
                                ) : mission.category === 'people' ? (
                                    <People width={28} height={28} />
                                ) : mission.category === 'study' ? (
                                    <Study width={28} height={28} />
                                ) : mission.category === 'task' ? (
                                    <Task width={28} height={28} />
                                ) : null}
                            </View>

                            {/* 가운데 텍스트 */}
                            <View style={{ flex: 1 }}>
                                <Text style={[Typo.label01, { marginBottom: 2 }]}>
                                    {mission.title}
                                </Text>
                                <Text style={[Typo.label03, { color: Colors.gray300 }]}>
                                    Sub Goal - 매일 꾸준히 운동하기
                                </Text>
                            </View>

                            {/* 오른쪽 시간 */}
                            <Text style={[Typo.label02, { color: Colors.gray900 }]}>
                                {mission.mission_start_time} - {mission.mission_end_time}
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.gray0 },

    /* --- 달력 --- */
    dayBox: {
        width: 24,
        height: 46,
        marginHorizontal: 24,
        marginBottom: 22,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    todayText: { fontFamily: 'Pretendard-Bold' }, // 오늘 bold
    daySelected: {},

    futureCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.gray100,
    },

    headerOuter: {
        width: '100%',
        paddingHorizontal: 5,
        paddingBottom: 16,
        alignItems: 'flex-start',
    },
    headerWrapper: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        backgroundColor: Colors.main600,
        borderRadius: 36,
    },
    headerText: { ...Typo.label03, color: Colors.gray900 },

    /* --- 미션 블록 --- */
    missionBlock: {
        marginHorizontal: 16,
        marginVertical: 24,
        padding: 16,
        borderRadius: 16,
        backgroundColor: Colors.gray100,
    },
    missionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addButton: {
        width: 20,
        height: 20,
        borderRadius: 16,
        backgroundColor: Colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },

    missionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray0,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    iconWrapper: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
});

export default Calendar;
