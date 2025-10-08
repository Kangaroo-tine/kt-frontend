import React, { useRef, useState } from 'react';
import { Modal, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface KakaoWebViewLoginProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (accessToken: string) => void;
  onError: (error: string) => void;
  clientId: string;
  redirectUri: string;
}

export const KakaoWebViewLogin: React.FC<KakaoWebViewLoginProps> = ({
  visible,
  onClose,
  onSuccess,
  onError,
  clientId,
  redirectUri,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const isProcessingRef = useRef(false); // 중복 처리 방지

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile_nickname,profile_image,account_email`;

  const handleShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;
    console.log('Should start load:', url);

    // 리다이렉트 URI로 시작하는 경우
    if (url.startsWith(redirectUri)) {
      // 이미 처리 중이면 로딩 차단
      if (isProcessingRef.current) {
        console.log('이미 처리 중입니다. 로딩을 차단합니다.');
        return false; // 로딩 차단
      }

      const urlParams = new URLSearchParams(url.split('?')[1]);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        onError(`카카오 로그인 오류: ${error}`);
        handleClose();
        return false; // 로딩 차단
      }

      if (code) {
        console.log('인증 코드 받음:', code.substring(0, 10) + '...');
        isProcessingRef.current = true; // 처리 시작
        exchangeCodeForToken(code);
        return false; // 로딩 차단 (이 URL로 이동하지 않음)
      }
    }

    return true; // 다른 URL은 정상 로딩
  };

  const exchangeCodeForToken = async (code: string) => {
    try {
      setLoading(true);
      console.log('토큰 교환 시작');
      console.log('Client ID:', clientId);
      console.log('Redirect URI:', redirectUri);
      console.log('Code:', code);

      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
      });

      console.log('토큰 요청 파라미터:', params.toString());

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();
      console.log('토큰 교환 응답:', data);

      if (data.access_token) {
        console.log('✅ 액세스 토큰 획득 성공!', data.access_token.substring(0, 20) + '...');
        console.log('✅ onSuccess 콜백 호출 시작');
        onSuccess(data.access_token);
        console.log('✅ onSuccess 콜백 완료');
        // 약간의 지연 후 웹뷰 닫기
        setTimeout(() => {
          console.log('✅ 웹뷰 닫기');
          handleClose();
        }, 500);
      } else {
        const errorMsg = data.error_description || data.error || '토큰 교환 실패';
        console.error('토큰 교환 실패:', errorMsg);
        onError(`토큰 교환 실패: ${errorMsg}`);
        isProcessingRef.current = false; // 실패 시 플래그 리셋
      }
    } catch (error) {
      console.error('토큰 교환 오류:', error);
      onError(`토큰 교환 오류: ${error}`);
      isProcessingRef.current = false; // 에러 시 플래그 리셋
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewError = () => {
    Alert.alert('오류', '웹뷰 로딩 중 오류가 발생했습니다.');
    handleClose();
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleClose = () => {
    // 모달이 닫힐 때 플래그 리셋
    isProcessingRef.current = false;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FEE500" />
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: kakaoAuthUrl }}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onError={handleWebViewError}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});