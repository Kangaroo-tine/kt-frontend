// app/(onboarding)/start.tsx
import * as React from 'react';

import { Alert, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthService } from '../../services/auth/authService';
import { KakaoWebViewLogin } from '../../components/auth/KakaoWebViewLogin';
import { useAuth } from '../../hooks/useAuth';
//아이콘
import KaKao from '../../assets/GUI/kakao.svg';
import Logo from '../../assets/GUI/logo/logo_light.svg';
//컬러
import { Colors } from '../../constants/Colors';

export default function ScreenStart() {
  console.log('========== STEP0.TSX 렌더링 ==========');
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showWebView, setShowWebView] = React.useState(false);
  const { loginWithKakaoToken } = useAuth();

  const kakaoConfig = AuthService.getKakaoWebViewConfig();

  const handleKakaoLoginSuccess = async (kakaoAccessToken: string) => {
    console.log('카카오 로그인 성공! 액세스 토큰:', kakaoAccessToken.substring(0, 20) + '...');
    setIsLoading(true);
    try {
      console.log('백엔드 로그인 시도 중...');
      // 카카오 액세스 토큰으로 백엔드 로그인
      const authResponse = await loginWithKakaoToken(kakaoAccessToken);
      console.log('백엔드 로그인 응답:', authResponse);

      if (authResponse.isSuccess) {
        console.log('Backend login success');
        // 로그인 성공 -> 다음 화면으로 이동
        console.log('step1로 이동합니다.');
        router.push('/(onboarding)/step1');
      } else {
        console.error('백엔드 로그인 실패:', authResponse.message);
        Alert.alert('로그인 실패', authResponse.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('로그인 오류', '백엔드 로그인 중 오류가 발생했습니다: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLoginError = (error: string) => {
    console.error('Kakao WebView login error:', error);
    Alert.alert('로그인 오류', error);
  };

  const handleKakaoLogin = () => {
    setShowWebView(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={224} height={100} />
      </View>
      <TouchableOpacity
        style={styles.kakaoWrapper}
        onPress={handleKakaoLogin}
        disabled={isLoading}
      >
        <KaKao />
      </TouchableOpacity>

      <KakaoWebViewLogin
        visible={showWebView}
        onClose={() => setShowWebView(false)}
        onSuccess={handleKakaoLoginSuccess}
        onError={handleKakaoLoginError}
        clientId={kakaoConfig.clientId}
        redirectUri={kakaoConfig.redirectUri}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray0,
  },
  logoWrapper: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kakaoWrapper: {
    position: 'absolute',
    bottom: '30%',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    width: 183,
    alignSelf: 'center',
  },
});
