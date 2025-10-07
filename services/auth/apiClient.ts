// services/auth/apiClient.ts
import { AuthService } from './authService';

/**
 * 인증이 필요한 API 요청을 위한 fetch wrapper
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = await AuthService.getAccessToken();

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // 401 에러 시 토큰 재발급 시도
  if (response.status === 401) {
    try {
      await AuthService.refreshAccessToken();
      const newAccessToken = await AuthService.getAccessToken();

      // 재시도
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    } catch (error) {
      // 토큰 재발급 실패 시 로그아웃
      await AuthService.logout();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
  }

  return response;
}
