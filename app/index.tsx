import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export default function Index() {
  useEffect(() => {
    // 알림 권한 요청
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log(enabled ? '🔔 알림 권한 허용됨' : '🚫 알림 권한 거부됨');
    };

    // FCM 토큰 요청
    const getToken = async () => {
      const token = await messaging().getToken();
      console.log('📱 FCM Token:', token);
    };

    // 포그라운드 메시지 수신
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 포그라운드 메시지:', remoteMessage);
      Alert.alert('📩 새 알림', remoteMessage.notification?.body ?? '');
    });

    requestPermission();
    getToken();
    return unsubscribe;
  }, []);

  return <Redirect href="/(onboarding)/step0" />;
}
