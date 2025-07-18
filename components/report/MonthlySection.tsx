import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//아이콘
import HappyTargetIcon from '@/assets/icon/dependent/happy_target.svg';
import SadTargetIcon from '@/assets/icon/dependent/sad_target.svg';
import TargetIcon from '@/assets/icon/dependent/target.svg';

type MonthlyStat = {
  month: number;
  happyCount: number;
  normalCount: number;
  sadCount: number;
  rate: number;
};

type MonthlySectionProps = {
  stats: MonthlyStat[];
};

//감정 별 카드 색
const emotionColors: Record<string, any> = {
  blue: { backgroundColor: '#A7D6FF' },
  yellow: { backgroundColor: '#FFE866' },
  green: { backgroundColor: '#F5FFCC' },
};

export default function MonthlySection({ stats }: MonthlySectionProps) {

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const handleMonthCardPress = (month: number) => {
    setSelectedMonth(month);
  };
  const handleClosePopup = () => {
    setSelectedMonth(null);
  };
  const selectedData = stats.find((s) => s.month === selectedMonth);
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.monthlyHeader}>
        <Text style={styles.sectionTitle}>월간 성취도</Text>
        <Picker selectedValue={'2025'} style={styles.picker}>
          <Picker.Item label="2025" value="2025" />
        </Picker>
      </View>
      {/* 카드 리스트 */}
      <View style={styles.monthlyCards}>
        {stats.map((data) => {
          const total = data.happyCount + data.normalCount + data.sadCount;
          const dominant = Math.max(data.happyCount, data.normalCount, data.sadCount);
          let emotion = 'blue';
          let IconComponent = SadTargetIcon;
          if (dominant === data.happyCount) {
            emotion = 'yellow';
            IconComponent = HappyTargetIcon;
          } else if (dominant === data.normalCount) {
            emotion = 'green';
            IconComponent = TargetIcon;
          }
          return (
            <Pressable
              key={data.month}
              style={[styles.monthCard, emotionColors[emotion]]}
              onPress={() => handleMonthCardPress(data.month)}
            >
              <Text style={styles.monthCardText}>{data.month}월</Text>
              <IconComponent width={42} height={42} style={{ marginVertical: 12}} />
              <Text style={[styles.monthCardText, { marginBottom: 4 }]}>총 {total}개의 감정</Text>
              <Text style={styles.monthCardText}>성취율 {data.rate}%</Text>
            </Pressable>
          );
        })}
      </View>

      {/* 먼슬리 카드 터치 시 나오는 팝업 */}
      <Modal
        visible={selectedMonth !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClosePopup}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{selectedData?.month}월 성취도</Text>
            <Text style={styles.popupSub}>
              {selectedData?.month}월 동안 어떤 일이 있었는지 살펴봐요
            </Text>
            <View style={styles.emojiRow}>
              <View style={styles.emojiBlock}>
                <SadTargetIcon width={45} height={45} />
                <Text style={styles.emojiText}>{selectedData?.sadCount}</Text>
              </View>
              <View style={styles.emojiBlock}>
                <TargetIcon width={45} height={45} />
                <Text style={styles.emojiText}>{selectedData?.normalCount}</Text>
              </View>
              <View style={styles.emojiBlock}>
                <HappyTargetIcon width={45} height={45} />
                <Text style={styles.emojiText}>{selectedData?.happyCount}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClosePopup} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  monthlyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 22,
  },
  sectionTitle: {
    ...Typo.label01,
    color: '#000',
  },
  picker: {
    height: 30,
    width: 100,
  },
  monthlyCards: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 22,
    flexWrap: 'wrap',
    gap: 14,
  },
  monthCard: {
    width: '30%',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  monthCardText:{
    ...Typo.label03,
    color: Colors.gray900,
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: Colors.gray0,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  popupTitle: {
    ...Typo.heading02,
    color: Colors.gray900,
  },
  popupSub: {
    ...Typo.label03,
    color: Colors.gray500,
    marginBottom: 20,
    marginTop: 4,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    gap: 24
  },
  emojiBlock: {
    alignItems: 'center',
  },
  emojiText:{
    ...Typo.label03,
    color: Colors.gray900,
  },
  confirmButton: {
    backgroundColor: Colors.main600,
    height: 42,
    width: 120,
    borderRadius: 12,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  confirmButtonText: {
    ...Typo.label01,
    color: Colors.main900,
  },
});