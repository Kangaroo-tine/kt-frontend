// types/auth.ts
export interface KakaoLoginRequest {
  accessToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: string;
    refreshTokenExpiresIn: string;
  };
}

export interface UpdateProfileRequest {
  nickname: string | null;
  email: string | null;
  profileImageUrl: string | null;
  [key: string]: unknown;
}

export interface UpdateProfileResponseResult {
  id?: number | string;
  nickname?: string;
  email?: string;
  profileImageUrl?: string;
  [key: string]: unknown;
}

export interface UpdateProfileResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: UpdateProfileResponseResult;
  [key: string]: unknown;
}

export interface WithdrawResponse {
  isSuccess?: boolean;
  code?: string;
  message?: string;
  result?: string;
  [key: string]: unknown;
}
