import Cheerup from '@/assets/GUI/home_status/cheerup.svg';
import Fail from '@/assets/GUI/home_status/fail.svg';
import Good from '@/assets/GUI/home_status/good.svg';
import Happy from '@/assets/icon/dependent/happy_target.svg';
import Sad from '@/assets/icon/dependent/sad_target.svg';
import Target from '@/assets/icon/dependent/target.svg';
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LocaleConfig, Calendar as RNCalendar } from 'react-native-calendars';

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

//dependent 캘린더 구현
const missionData = {
  date: '2025-06-19',
  totalCount: 3,
  completedCount: 2,
  missions: [
    {
      missionId: 1,
      title: '할일들어가는곳10글자',
      mission_start_time: '08:00',
      status: 'FAILED',
    },
    {
      missionId: 2,
      title: '할일들어가는곳10글자',
      mission_start_time: '12:00',
      status: 'COMPLETED',
    },
    {
      missionId: 3,
      title: '할일들어가는곳10글자',
      mission_start_time: '16:00',
      status: 'COMPLETED',
    },
  ],
};

const Calendar = () => {
  return (
    <ScrollView style={styles.container}>
      <RNCalendar
        onDayPress={(day) => console.log('selected day', day)}
        markedDates={{}}
        firstDay={0}
        style={{
          marginTop: 22,
          paddingHorizontal: 40,
        }}
        hideArrows={true}
        enableSwipeMonths={true}
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
        dayComponent={({ date, state }) => {
          if (!date) return null;
          const isToday =
            date.dateString === new Date().toISOString().split('T')[0];
          const isDisabled = state === 'disabled';
          return (
            <View style={[styles.dayBox, isToday && styles.todayBox]}>
              <Text
                style={[
                  Typo.label02,
                  { color: Colors.gray500 },
                  isDisabled && { color: Colors.gray300 },
                  isToday && { color: Colors.main700 },
                ]}
              >
                {date.day}
              </Text>
              <View style={{ marginTop: 8 }}>
                {date.dateString > new Date().toISOString().split('T')[0] ? (
                  <View style={styles.futureCircle} />
                ) : (
                  <Target width={24} height={24} />
                )}
              </View>
            </View>
          );
        }}
      />
      <View style={styles.missionBlock}>
        <View style={styles.missionHeader}>
          <Text style={Typo.label01}>{`16일 수요일`}</Text>
          <Text style={[Typo.label01, { color: Colors.main700 }]}>
            {`${missionData.completedCount} / ${missionData.totalCount}`}
          </Text>
        </View>
        {missionData.missions.map((mission) => (
          <View key={mission.missionId} style={styles.missionRow}>
            <Text style={[Typo.label02, { width: 52 }]}>
              {mission.mission_start_time}
            </Text>
            <Text style={[Typo.label02, { flex: 1, marginHorizontal: 16 }]}>
              {mission.title}
            </Text>
            {mission.status === 'COMPLETED' ? (
              <Good width={24} height={24} />
            ) : mission.status === 'FAILED' ? (
              <Fail width={24} height={24} />
            ) : (
              <Cheerup width={24} height={24} />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0, // 최상위 프레임
  },
  dayBox: {
    width: 24,
    height: 46,
    marginHorizontal: 24,
    marginBottom: 22,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  todayBox: {},
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
  headerText: {
    ...Typo.label03,
    color: Colors.gray900,
  },
  missionBlock: {
    marginHorizontal: 12,
    marginVertical: 24,
    padding: 20,
    borderRadius: 12,
    backgroundColor: Colors.gray0,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

export default Calendar;
