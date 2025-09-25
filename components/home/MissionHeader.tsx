import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
//폰트, 컬러
import { Typo } from '@/constants/Typo';
import { Colors } from '@/constants/Colors';
//아이콘
import HomeDependentIcon from '@/assets/GUI/home_dependent.svg';

//상위 컴포넌트에서 전달하는 데이터 포맷
import { Header, EmotionType } from '@/types/homeHeader';
type Props = Header & {
  daliyEmotionSelected: (emotion:EmotionType) => void;
};

export default function MissionHeader(props: Props) {

  return (
    <View style={styles.container}>
      {/* 인사 + 캐릭터 */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{props.userName}님!</Text>
          <Text style={styles.subtitle}>오늘도{"\n"}미션하러 가볼까요?</Text>
        </View>
        <HomeDependentIcon width={120} height={120} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray0,
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    ...Typo.title03,
    color: Colors.main700,
  },
  subtitle: {
    marginTop: 12,
    ...Typo.heading01,
    color: '#000',
    lineHeight: 24,
  },
  

  
});
