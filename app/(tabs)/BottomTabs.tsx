// BottomTabs.tsx
import Logo from '@/assets/GUI/logo/logo_dark.svg';
//아이콘
import {
  CalendarIcon,
  EmotionIcon,
  HomeIcon,
  MyPageIcon,
} from '@/components/icon/bottombar';
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';
//px에서 화면 비율에 맞는 크기로 변환해주는 유틸
import { responsiveH, responsiveW } from '@/scripts/utils/responsive';

import React from 'react';

import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//화면 아래 handle부분 처리
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DependentCalendar from './dependent/calendar';
import DependentEmotion from './dependent/emotion';
//Dependent - 일단 대상자 화면만 뜨도록 설정해놓음 - 분기는 나중에 구현
import DependentHome from './dependent/home';
import DependentMyPage from './dependent/mypage';
//각 화면 임포트 - Parent
import ParentCalendar from './parent/calendar';
import ParentEmotion from './parent/emotion';
import ParentHome from './parent/home';
import ParentMyPage from './parent/mypage';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
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
        tabBarActiveTintColor: Colors.main700,
        tabBarInactiveTintColor: Colors.gray300,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DependentHome}
        options={{
          headerTitle: () => <></>,
          headerLeft: () => (
            <View style={{ paddingLeft: 12 }}>
              <Logo width={responsiveW(80)} height={responsiveH(20)} />
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (<Text style={[Typo.label01, { color: focused ? Colors.main700 : Colors.gray300 }]}>홈
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={DependentCalendar}
        options={{
          headerTitle: () => <Text style={Typo.heading04}>캘린더</Text>,
          tabBarIcon: ({ focused }) => (
            <CalendarIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (<Text style={[Typo.label01, { color: focused ? Colors.main700 : Colors.gray300 }]}>캘린더
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Emotion"
        component={DependentEmotion}
        options={{
          headerTitle: () => <Text style={Typo.heading04}>감정기록</Text>,
          tabBarIcon: ({ focused }) => (
            <EmotionIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (<Text style={[Typo.label01, { color: focused ? Colors.main700 : Colors.gray300 }]}>감정기록
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={DependentMyPage}
        options={{
          headerTitle: () => <Text style={Typo.heading04}>마이페이지</Text>,
          tabBarIcon: ({ focused }) => (
            <MyPageIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (<Text style={[Typo.label01, { color:  focused ? Colors.main700 : Colors.gray300 }]}>마이페이지
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
