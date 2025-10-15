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

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { usePathname, useRouter, useSegments } from 'expo-router';
import { LocaleConfig, Calendar as RNCalendar } from 'react-native-calendars';

import { fetchMonthScheduleAvailability, fetchSchedulesByDate } from '@/services/schedule/scheduleService';
import type { ScheduleListItem } from '@/types/schedule';

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

/* ---- 유틸: YYYY-MM-DD → “n일 요일” ---- */
const formatKoreanDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(y, m - 1, d); // 로컬 기준 안전 파싱
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${dt.getDate()}일 ${days[dt.getDay()]}요일`;
};

type MissionCategory = 'exercise' | 'daily' | 'hobby' | 'people' | 'study' | 'task';

const mapScheduleCategory = (category?: string | null): MissionCategory | undefined => {
    if (!category) {
        return undefined;
    }
    const normalized = category.toLowerCase();
    switch (normalized) {
        case 'exercise':
            return 'exercise';
        case 'life':
        case 'daily':
            return 'daily';
        case 'hobby':
        case 'self_development':
            return 'hobby';
        case 'people':
        case 'relationship':
            return 'people';
        case 'study':
        case 'learning':
            return 'study';
        case 'task':
        case 'assignment':
            return 'task';
        default:
            return undefined;
    }
};

const extractTime = (value?: string | null): string => {
    if (!value) {
        return '';
    }
    const trimmed = value.trim();
    if (!trimmed) {
        return '';
    }
    const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
        const hours = parsed.getHours().toString().padStart(2, '0');
        const minutes = parsed.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    const match = trimmed.match(/(\d{2}:\d{2})/);
    return match ? match[1] : trimmed;
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
    const [schedules, setSchedules] = useState<ScheduleListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [visibleMonth, setVisibleMonth] = useState<{ year: number; month: number }>({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
    });
    const [monthAvailability, setMonthAvailability] = useState<Record<string, boolean>>({});
    const [monthError, setMonthError] = useState<string | null>(null);

    const updateVisibleMonth = useCallback((year: number, month: number) => {
        setVisibleMonth((prev) => {
            if (prev.year === year && prev.month === month) {
                return prev;
            }
            console.log('[Calendar] Visible month changed:', year, month);
            return { year, month };
        });
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadSchedules = async () => {
            if (!selectedDate) {
                return;
            }

            console.log('[Calendar] Fetching schedules for date:', selectedDate);
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetchSchedulesByDate(selectedDate);
                if (!isMounted) {
                    return;
                }

                const items = Array.isArray(response?.result) ? response.result : [];
                console.log(
                    '[Calendar] Schedules fetched:',
                    JSON.stringify(items),
                );
                setSchedules(items);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                console.error(
                    '[Calendar] Failed to fetch schedules:',
                    err,
                );
                const message =
                    err instanceof Error
                        ? err.message
                        : '일정 정보를 불러오지 못했습니다.';
                setError(message);
                setSchedules([]);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadSchedules();

        return () => {
            isMounted = false;
        };
    }, [selectedDate]);

    useEffect(() => {
        let isMounted = true;

        const loadMonthAvailability = async () => {
            console.log(
                '[Calendar] Fetching month availability:',
                visibleMonth.year,
                visibleMonth.month,
            );
            try {
                const response = await fetchMonthScheduleAvailability(
                    visibleMonth.year,
                    visibleMonth.month,
                );
                if (!isMounted) {
                    return;
                }
                const items = Array.isArray(response?.result) ? response.result : [];
                console.log(
                    '[Calendar] Month availability fetched:',
                    JSON.stringify(items),
                );

                const map: Record<string, boolean> = {};
                items.forEach((item) => {
                    if (item?.date) {
                        map[item.date] = !!item.hasSchedule;
                    }
                });
                setMonthAvailability(map);
                setMonthError(null);
            } catch (err) {
                if (!isMounted) {
                    return;
                }
                console.error('[Calendar] Failed to fetch month availability:', err);
                const message =
                    err instanceof Error
                        ? err.message
                        : '월간 일정 정보를 불러오지 못했습니다.';
                setMonthError(message);
                setMonthAvailability({});
            }
        };

        loadMonthAvailability();

        return () => {
            isMounted = false;
        };
    }, [visibleMonth]);

    const missionList = useMemo(
        () =>
            schedules.map((schedule) => {
                const category = mapScheduleCategory(schedule.goal?.category);
                const fallbackId = `${
                    schedule.date ?? 'schedule'
                }-${schedule.goal?.goalTitle ?? ''}-${schedule.startTime ?? ''}-${schedule.endTime ?? ''}`;
                const subgoalTitle = schedule.subgoal?.subgoalTitle ?? schedule.subgoal?.title ?? '';
                return {
                    id: schedule.scheduleId ?? fallbackId,
                    title:
                        schedule.title ??
                        schedule.goal?.goalTitle ??
                        '무제 일정',
                    subTitle: subgoalTitle ? `Sub-goal ${subgoalTitle}` : '',
                    startTime: extractTime(schedule.startTime),
                    endTime: extractTime(schedule.endTime),
                    category,
                };
            }),
        [schedules],
    );

    const headerLabel = useMemo(
        () => formatKoreanDate(selectedDate),
        [selectedDate],
    );

    return (
        <ScrollView style={styles.container}>
            <RNCalendar
                current={selectedDate}
                firstDay={0}
                hideArrows
                enableSwipeMonths
                style={{ marginTop: 22, paddingHorizontal: 40 }}
                onDayPress={(d) => {
                    setSelectedDate(d.dateString);
                    updateVisibleMonth(d.year, d.month);
                }}
                onMonthChange={(date) => {
                    updateVisibleMonth(date.year, date.month);
                }}
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
                    const hasSchedule = !!monthAvailability[date.dateString];
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
                                    {hasSchedule ? (
                                        <Target width={24} height={24} />
                                    ) : (
                                        <View style={[styles.futureCircle, isFuture && styles.futureCircleFuture]} />
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

                {isLoading ? (
                    <Text style={[Typo.label03, { color: Colors.gray300 }]}>
                        일정을 불러오는 중이에요...
                    </Text>
                ) : error ? (
                    <Text style={[Typo.label03, { color: Colors.gray300 }]}>
                        {error}
                    </Text>
                ) : monthError ? (
                    <Text style={[Typo.label03, { color: Colors.gray300 }]}>
                        {monthError}
                    </Text>
                ) : missionList.length === 0 ? (
                    <Text style={[Typo.label03, { color: Colors.gray400 }]}>
                        이 날짜에 등록된 미션이 없어요.
                    </Text>
                ) : (
                    missionList.map((mission) => (
                        <View key={String(mission.id)} style={styles.missionCard}>
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
                                {mission.subTitle ? (
                                    <Text style={[Typo.label03, { color: Colors.gray300 }]}>
                                        {mission.subTitle}
                                    </Text>
                                ) : null}
                            </View>

                            {/* 오른쪽 시간 */}
                            <Text style={[Typo.label02, { color: Colors.gray900 }]}>
                                {mission.startTime || '시간 미정'}
                                {mission.endTime ? ` - ${mission.endTime}` : ''}
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
    futureCircleFuture: {
        backgroundColor: Colors.gray200,
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
