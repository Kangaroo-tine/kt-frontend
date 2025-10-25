// services/auth/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL, EXPO_PUBLIC_KAKAO_CLIENT_ID } from '@env';

import type {
  AuthResponse,
  KakaoLoginRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  WithdrawResponse,
  ProfileResponse,
} from '../../types/auth';

const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

export class AuthService {
  private static baseUrl = API_BASE_URL || 'https://your-api-server.com/api';

  /**
   * 웹뷰에서 카카오 로그인을 위한 설정
   */
  static getKakaoWebViewConfig() {
    const clientId = EXPO_PUBLIC_KAKAO_CLIENT_ID || 'YOUR_KAKAO_CLIENT_ID';

    console.log('[AuthService] 카카오 웹뷰 설정');
    console.log('[AuthService] EXPO_PUBLIC_KAKAO_CLIENT_ID:', EXPO_PUBLIC_KAKAO_CLIENT_ID);
    console.log('[AuthService] 사용할 clientId:', clientId);
    console.log('[AuthService] 폴백 사용 여부:', !EXPO_PUBLIC_KAKAO_CLIENT_ID);

    return {
      clientId: clientId,
      redirectUri: 'https://oortmealy.github.io/kakao-callback', // GitHub Pages 콜백 페이지
    };
  }

  /**
   * 카카오 로그인
   */
  static async kakaoLogin(kakaoAccessToken: string): Promise<AuthResponse> {
    console.log('[AuthService] 카카오 로그인 요청 시작');
    console.log('[AuthService] Base URL:', this.baseUrl);
    console.log('[AuthService] 카카오 액세스 토큰:', kakaoAccessToken.substring(0, 20) + '...');

    const url = `${this.baseUrl}/auth/login`;
    console.log('[AuthService] 요청 URL:', url);

    const requestBody = {
      accessToken: kakaoAccessToken,
    } as KakaoLoginRequest;
    console.log('[AuthService] 요청 Body:', JSON.stringify(requestBody));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[AuthService] 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AuthService] 응답 에러 내용:', errorText);
        throw new Error(`카카오 로그인 실패: ${response.status} ${errorText}`);
      }

      const data: AuthResponse = await response.json();
      console.log('[AuthService] 응답 데이터:', JSON.stringify(data));

      // 토큰 저장
      if (data.isSuccess && data.result) {
        console.log('[AuthService] 토큰 저장 시작');
        await this.saveTokens(data.result.accessToken, data.result.refreshToken);
        console.log('[AuthService] 토큰 저장 완료');
      } else {
        console.warn('[AuthService] 로그인 성공하지 않음:', data.message);
      }

      return data;
    } catch (error) {
      console.error('[AuthService] 카카오 로그인 에러:', error);
      throw error;
    }
  }

  /**
   * 토큰 재발급
   */
  static async refreshAccessToken(): Promise<AuthResponse> {
    const refreshToken = await this.getRefreshToken();

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      } as RefreshTokenRequest),
    });

    if (!response.ok) {
      throw new Error('토큰 재발급 실패');
    }

    const data: AuthResponse = await response.json();

    // 새 토큰 저장
    if (data.isSuccess && data.result) {
      await this.saveTokens(data.result.accessToken, data.result.refreshToken);
    }

    return data;
  }

  /**
   * 토큰 저장
   */
  static async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await AsyncStorage.multiSet([
      [AUTH_KEYS.ACCESS_TOKEN, accessToken],
      [AUTH_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
  }

  /**
   * Access Token 가져오기
   */
  static async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
  }

  /**
   * Refresh Token 가져오기
   */
  static async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);
  }

  /**
   * 로그아웃 (토큰 삭제)
   */
  static async logout(): Promise<void> {
    await AsyncStorage.multiRemove([AUTH_KEYS.ACCESS_TOKEN, AUTH_KEYS.REFRESH_TOKEN]);
  }

  /**
   * 인증 여부 확인
   */
  static async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    return accessToken !== null;
  }

  /**
   * 프로필 조회
   */
  static async fetchProfile(): Promise<ProfileResponse> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const url = `${this.baseUrl}/auth/profile`;
    console.log('[AuthService] fetchProfile request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      '[AuthService] fetchProfile response status:',
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AuthService] fetchProfile error body:', errorText);
      throw new Error(errorText || response.statusText || String(response.status));
    }

    if (response.status === 204) {
      console.log('[AuthService] fetchProfile response: 204 No Content');
      return {};
    }

    try {
      const data = (await response.json()) as ProfileResponse;
      console.log('[AuthService] fetchProfile parsed response:', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('[AuthService] fetchProfile parse error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(String(error));
    }
  }

  /**
   * 프로필 수정
   */
  static async updateProfile(
    payload: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    console.log('[AuthService] updateProfile payload:', JSON.stringify(payload));
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log('[AuthService] updateProfile request URL:', `${this.baseUrl}/auth/profile`);
    const response = await fetch(`${this.baseUrl}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    console.log(
      '[AuthService] updateProfile response status:',
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AuthService] updateProfile error body:', errorText);
      throw new Error(
        `프로필 수정에 실패했습니다: ${response.status} ${errorText}`,
      );
    }

    if (response.status === 204) {
      console.log('[AuthService] updateProfile response: 204 No Content');
      return {};
    }

    try {
      const data = (await response.json()) as UpdateProfileResponse;
      console.log(
        '[AuthService] updateProfile parsed response:',
        JSON.stringify(data),
      );
      return data;
    } catch (error) {
      console.error('[AuthService] updateProfile parse error:', error);
      throw new Error(
        `프로필 수정 응답을 해석할 수 없습니다: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }

  /**
   * 회원 탈퇴
   */
  static async withdraw(): Promise<WithdrawResponse> {
    const accessToken = await this.getAccessToken();

    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const url = `${this.baseUrl}/auth/withdraw`;
    console.log('[AuthService] withdraw request URL:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(
      '[AuthService] withdraw response status:',
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[AuthService] withdraw error body:', errorText);
      throw new Error(
        `회원 탈퇴에 실패했습니다: ${response.status} ${errorText}`,
      );
    }

    if (response.status === 204) {
      console.log('[AuthService] withdraw response: 204 No Content');
      return {};
    }

    try {
      const data = (await response.json()) as WithdrawResponse;
      console.log('[AuthService] withdraw parsed response:', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('[AuthService] withdraw parse error:', error);
      throw new Error(
        `회원 탈퇴 응답을 해석할 수 없습니다: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
}
