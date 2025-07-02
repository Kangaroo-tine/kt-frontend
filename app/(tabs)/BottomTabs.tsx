// BottomTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Typo } from '@/constants/Typo';
                              
//화면 아래 handle부분 처리
import { useSafeAreaInsets } from 'react-native-safe-area-context';
//px에서 화면 비율에 맞는 크기로 변환해주는 유틸
import { responsiveW, responsiveH } from '@/scripts/utils/responsive';

//각 화면 임포트 - Parent
import ParentHome from './parent/home';
import ParentCalendar from './parent/calendar';
import ParentEmotion from './parent/emotion';
import ParentMyPage from './parent/mypage'; 
//Dependent - 일단 대상자 화면만 뜨도록 설정해놓음 - 분기는 나중에 구현
import DependentHome from './dependent/home';
import DependentCalendar from './dependent/calendar';
import DependentEmotion from './dependent/emotion';
import DependentMyPage from './dependent/mypage';

//바텀탭의 아이콘, 홈헤더의 로고 임포트
import { HomeIcon, CalendarIcon, EmotionIcon, MyPageIcon } from '@/components/icon/bottombar';
import Logo from '../../assets/logo.svg';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator screenOptions={{ 
      headerShown: true,
      headerStyle: {
        height: 48 + insets.top,
        backgroundColor: '#FFFFFF',
        shadowColor: 'transparent',
        elevation: 0,
      },
      headerTitleAlign: 'center',
      tabBarStyle: {
        height: 60 + insets.bottom,
        paddingBottom: insets.bottom,
        paddingTop: 5,
        backgroundColor: '#FFFFFF',
      },
      tabBarActiveTintColor: '#A6CC00',
      tabBarInactiveTintColor: '#A6A6A6',}}
    >
      <Tab.Screen
        name="Home"
        component={DependentHome}
        options={{
          headerTitle: () => null,
          headerLeft: () => (
            <View style={{ paddingLeft: 12 }}>
              <Logo width={responsiveW(80)} height={responsiveH(20)} />
            </View>
          ),
          tabBarIcon: ({ focused }) => <HomeIcon color={focused ? '#A6CC00' : '#A6A6A6'} width={24} height={24} />,
          tabBarLabel: '홈',
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={DependentCalendar}
        options={{
          headerTitle: () => (
            <Text style={ Typo.heading04 }>
              캘린더
            </Text>
          ),
          tabBarIcon: ({ focused }) => <CalendarIcon color={focused ? '#A6CC00' : '#A6A6A6'} width={24} height={24} />,
          tabBarLabel: '캘린더',
        }}
      />
      <Tab.Screen
        name="Emotion"
        component={DependentEmotion}
        options={{
          headerTitle: () => (
            <Text style={ Typo.heading04 }>
              감정기록
            </Text>
          ),
          tabBarIcon: ({ focused }) => <EmotionIcon color={focused ? '#A6CC00' : '#A6A6A6'} width={24} height={24} />,
          tabBarLabel: '감정기록',
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={DependentMyPage}
        options={{
          headerTitle: () => (
            <Text style={ Typo.heading04 }>
              마이페이지
            </Text>
          ),
          tabBarIcon: ({ focused }) => <MyPageIcon color={focused ? '#A6CC00' : '#A6A6A6'} width={24} height={24} />,
          tabBarLabel: '마이페이지',
        }}
      />
    </Tab.Navigator>
  );
}