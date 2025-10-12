import 'expo-router/entry';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('💤 백그라운드 메시지 수신:', remoteMessage);
});
