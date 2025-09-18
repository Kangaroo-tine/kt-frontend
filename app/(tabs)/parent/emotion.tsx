import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { VictoryChart, VictoryPie, VictoryLine, VictoryAxis} from 'victory-native';
import { LinearGradient } from 'expo-linear-gradient';
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//하위 컴포넌트
import MonthlySection from '@/components/report/MonthlySection';

const { width } = Dimensions.get('window');

import ReportDependentIcon from '@/assets/GUI/report_dependent.svg';

//일간 성취율
const userInfo = {
  name: '효원님',
  totalMissions: 10,
  completedMissions: 6,
};
//주간 성취율
const weeklyStats = [
  { date: '07.13', rate: 100 },
  { date: '07.14', rate: 60 },
  { date: '07.15', rate: 15 },
  { date: '07.16', rate: 100 },
  { date: '07.17', rate: 60 },
  { date: '07.18', rate: 80 },
  { date: '07.19', rate: 50 },
];
//월간 성취율
const monthlyStats = [
  { month: 2, happyCount: 9, normalCount: 6, sadCount: 15, rate: 80},
  { month: 3, happyCount: 6, normalCount: 14, sadCount: 11, rate: 80},
  { month: 4, happyCount: 6, normalCount: 14, sadCount: 11, rate: 80},
  { month: 5, happyCount: 10, normalCount: 15, sadCount: 6, rate: 80},
  { month: 6, happyCount: 12, normalCount: 10, sadCount: 8, rate: 60},
];

//parent 감정기록 구현 
export default function Emotion() {

  const dailyRate = Math.round((userInfo.completedMissions / userInfo.totalMissions) * 100);
  const weeklyRate =
    Math.round(
      weeklyStats.reduce((sum, s) => sum + s.rate, 0) / weeklyStats.length
  );

  return (
    <ScrollView style={styles.container}>
      {/* 상단 카드 */}
      <View style={styles.topSection}>
        <LinearGradient
          colors={['#FFFFFF', '#FFE866']} // 밝은 위쪽 → 살짝 진한 아래쪽
          style={styles.gradientCard}
        >
          <Text style={styles.subText}><Text style={styles.highlightText}>{userInfo.name}</Text>의</Text>
          <Text style={styles.subText}>캥거루틴 레포트</Text>
          <View style={styles.iconWrapper}>
            <ReportDependentIcon width={146} height={112}/>
          </View>
        </LinearGradient>
        <View style={styles.card}>
          <Text style={styles.subText}>
            일간 성취율은{'\n'}
            <Text style={styles.highlightText}>{dailyRate}%</Text>
            입니다
          </Text>
          <VictoryPie
            data={[
              { x: '완료', y: dailyRate },
              { x: '미완료', y: 100 - dailyRate },
            ]}
            width={140}
            height={140}
            innerRadius={50}
            colorScale={[Colors.main600, Colors.gray100]}
            labels={() => null}
          />
        </View>
      </View>
      {/* 주간 성취율 */}
      <View style={styles.weeklySection}>
        <Text style={styles.weekSubText}>
          주간 성취율은 <Text style={styles.highlightText}>{weeklyRate}%</Text> 입니다
        </Text>
        <VictoryChart
          height={140}
          width={width - 32}
          padding={{ top: 20, left: 20, right: 20, bottom: 0}}
          domain={{ y: [0, 100] }}
        >
          {/* X축 */}
          <VictoryAxis
            tickValues={[1, 2, 3, 4, 5, 6, 7]}
            tickFormat={weeklyStats.map((d) => d.date)}
            style={{
              axis: { stroke: Colors.gray200 },
              tickLabels: { fontSize: 10, fill: Colors.gray600 },
              grid: { stroke: 'transparent' },
            }}
          />
          {/* Y축 */}
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: 'transparent' },
              tickLabels: { fontSize: 0 },
              grid: { stroke: Colors.gray200 },
            }}
          />
          {/* 라인 */}
          <VictoryLine
            data={weeklyStats.map((d, i) => ({ x: i + 1, y: d.rate }))}
            style={{
              data: { stroke: Colors.main600, strokeWidth: 2 },
            }}
          />
        </VictoryChart>
      </View>
      {/* 월간 성취도 */}
      <MonthlySection stats={monthlyStats} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal:14,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradientCard: {
    width: '48%',
    height: 230,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '48%',
    height: 230,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightText: {
    ...Typo.heading02,
    color: Colors.main700,
  },
  subText: {
    ...Typo.body01,
    color: Colors.gray900,
  },
  iconWrapper: {
    paddingHorizontal: 7,
    paddingVertical: 8,
  },
  weekSubText: {
    ...Typo.label01,
    color: Colors.gray900,
  },
  weeklySection: {
    marginTop: 15,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
});
