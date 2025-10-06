// BottomTabs.tsx
import React from 'react';
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

//아이콘
import {
  CalendarIcon,
  KelperIcon,
  HomeIcon,
  MyPageIcon,
} from '@/components/icon/bottombar';
import Bell from "@/assets/alert/bell.svg";
import Logo from '@/assets/GUI/logo/logo_dark.svg';
//폰트, 컬러
import { Colors } from '@/constants/Colors';
import { Typo } from '@/constants/Typo';
//px에서 화면 비율에 맞는 크기로 변환해주는 유틸
import { responsiveH, responsiveW } from '@/scripts/utils/responsive';


import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//화면 아래 handle부분 처리
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Dependent - 일단 대상자 화면만 뜨도록 설정해놓음 - 분기는 나중에 구현
import Calendar from './mainview/calendar';
import Loading from './mainview/loading';
import Home from './mainview/home';
import MyPage from './mainview/mypage';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const router = useRouter();
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
        component={Home}
        options={{
          headerTitle: () => <View />,
          headerLeft: () => (
            <View style={{ paddingLeft: 12 }}>
              <Logo width={responsiveW(80)} height={responsiveH(20)} />
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("../alarmCenter")} // 알림센터 경로
              style={{ paddingRight: 16 }}
            >
              <Bell
                width={20}
                height={20}
              />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                Typo.label01,
                { color: focused ? Colors.main700 : Colors.gray300 },
              ]}
            >
              홈
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerTitle: () => (
            <View
              style={{
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...Typo.heading04, color: Colors.gray800 }}>
                캘린더
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <CalendarIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: '캘린더',
        }}
      />
      <Tab.Screen
        name="AIKelper"
        component={Loading}
        options={{
          headerTitle: () => (
            <View
              style={{
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...Typo.heading04, color: Colors.gray800 }}>
                AI 켈퍼
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <KelperIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                Typo.label01,
                { color: focused ? Colors.main700 : Colors.gray300 },
              ]}
            >
              AI 켈퍼
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          headerTitle: () => (
            <View
              style={{
                padding: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ ...Typo.heading04, color: Colors.gray800 }}>
                마이 페이지
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused }) => (
            <MyPageIcon
              color={focused ? Colors.main700 : Colors.gray300}
              width={24}
              height={24}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={[
                Typo.label01,
                { color: focused ? Colors.main700 : Colors.gray300 },
              ]}
            >
              마이페이지
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
