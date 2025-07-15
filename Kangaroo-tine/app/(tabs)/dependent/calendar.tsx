import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';

import React from 'react';

import { StyleSheet, Text, View } from 'react-native';

import { Calendar as RNCalendar } from 'react-native-calendars';

//dependent 캘린더 구현
const Calendar = () => {
  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={(day) => console.log('selected day', day)}
        markedDates={{
          '2025-07-15': {
            selected: true,
            marked: true,
            selectedColor: '#A3E635',
          },
          '2025-07-16': { marked: true, dotColor: '#65A30D' },
        }}
        theme={{
          selectedDayBackgroundColor: '#65A30D',
          todayTextColor: '#65A30D',
          arrowColor: '#65A30D',
          textMonthFontWeight: 'bold',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0, // 최상위 프레임
  },
});

export default Calendar;
