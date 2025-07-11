import { View } from 'react-native';

import Logo from '../../assets/logo.svg';

// 경로 확인!

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Logo width={120} height={120} />
    </View>
  );
}
