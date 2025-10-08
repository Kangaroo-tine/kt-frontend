import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ko';

// 설정
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.locale('ko');

// 폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

// 아이콘
import BackArrow from '@/assets/icon/arrow/back_arrow.svg';
import ScheduleActive from '@/assets/alert/schedule_active.svg';
import ScheduleInactive from '@/assets/alert/schedule_inactive.svg';
import RoutineActive from '@/assets/alert/routine_active.svg';
import RoutineInactive from '@/assets/alert/routine_inactive.svg';

export default function AlarmCenter() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // 임의 데이터
  const alerts = [
    {
      id: 1,
      content: '수영장에 잘 도착하셨나요? 관악 수영장 등록하기 일정의 수행 여부를 응답해 주세요! ',
      createdAt: '2025-10-07T07:25:00+09:00', 
    },
    {
      id: 2,
      content: "일본어 프리토킹하기의 세부 루틴인 ‘문제집 10쪽 풀기’를 시작할 시간이 됐어요! 루틴을 하지 못하더라도 포기하지 않는 자세가 중요해요.",
      createdAt: '2025-10-07T02:10:00+09:00',
    },
    {
      id: 3,
      content: "수영장에 잘 도착하셨나요? 관악 수영장 등록하기 일정의 수행 여부를 응답해 주세요! ",
      createdAt: '2025-10-04T09:30:00+09:00', 
    },
    {
      id: 4,
      content: '수영장에 잘 도착하셨나요? 관악 수영장 등록하기 일정의 수행 여부를 응답해 주세요! ',
      createdAt: '2025-09-29T18:00:00+09:00', 
    },
  ];

  // 오늘/이전 구분
  const today = dayjs();
  const alertsToday = alerts.filter((a) => dayjs(a.createdAt).isSame(today, 'day'));
  const alertsBefore = alerts.filter((a) => !dayjs(a.createdAt).isSame(today, 'day'));

  // 상대시간 or 날짜 문자열 생성
  const formatTime = (createdAt: string) => {
    const target = dayjs(createdAt);
    if (target.isSame(today, 'day')) {
      return target.fromNow(); // ex. "3시간 전"
    } else {
      return target.format('M월 D일'); // ex. "10월 3일"
    }
  };

  // 알림 카드
  const AlertCard = ({ title, content, createdAt,isActive }: any) => {
    const IconComponent =
      isActive
          ? ScheduleActive
          : ScheduleInactive

    return (
      <View style={[styles.alertCard, !isActive && styles.inactiveCard]}>
        <IconComponent width={16} height={16} style={styles.icon} />
        <View style={styles.alertTextBox}>
          <Text style={[styles.alertTitle, !isActive && styles.inactiveText]}>일정알림</Text>
          <Text style={[styles.alertContent, !isActive && styles.inactiveText]}>{content}</Text>
          <Text style={[styles.alertTime, !isActive && styles.inactiveText]}>
            {formatTime(createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const combinedData = [
    { type: 'header', title: '오늘' },
    ...alertsToday.map((a) => ({ ...a, isActive: true })),
    { type: 'header', title: '이전 알림' },
    ...alertsBefore.map((a) => ({ ...a, isActive: false })),
  ];

  const renderItem = ({ item }: any) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionTitle}>{item.title}</Text>;
    }
    return <AlertCard {...item} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackArrow width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
      </View>

      {/* 본문 */}
      <FlatList
        data={combinedData}
        keyExtractor={(item, index) => 'id' in item ? String(item.id) : `header-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    ...Typo.heading04,
    color: Colors.gray800,
  },
  sectionTitle: {
    ...Typo.body01,
    color: Colors.gray800,
    marginTop : 20,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 18,
    paddingHorizontal: 5,
  },
  inactiveCard: {
    opacity: 0.4,
  },
  icon: {
    marginRight: 12,
    marginTop: 3,
  },
  alertTextBox: {
    flex: 1,
  },
  alertTitle: {
    ...Typo.label01,
    color: Colors.gray900,
    marginBottom: 8,
  },
  alertContent: {
    ...Typo.label02,
    color: Colors.gray700,
    lineHeight: 20,
    marginBottom: 8,
  },
  alertTime: {
    ...Typo.label05,
    color: Colors.gray500,
  },
  inactiveText: {
    color: Colors.gray500,
  },
});
