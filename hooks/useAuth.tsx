import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthService } from '../services/auth/authService';
import type { AuthResponse } from '../types/auth';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  loginWithKakaoToken: (kakaoAccessToken: string) => Promise<AuthResponse>;
  refreshSession: () => Promise<AuthResponse>;
  hydrateFromStorage: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  buildAuthHeaders: (headers?: HeadersInit) => HeadersInit;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INITIAL_STATE: AuthState = {
  accessToken: null,
  refreshToken: null,
  isInitializing: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  const applyTokensToState = useCallback(
    (next: { accessToken: string | null; refreshToken: string | null }) => {
      setState((prev) => ({
        ...prev,
        ...next,
        isInitializing: false,
      }));
    },
    [],
  );

  const hydrateFromStorage = useCallback(async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AuthService.getAccessToken(),
        AuthService.getRefreshToken(),
      ]);
      applyTokensToState({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.warn('[useAuth] Failed to hydrate auth state', error);
      applyTokensToState({
        accessToken: null,
        refreshToken: null,
      });
    }
  }, [applyTokensToState]);

  useEffect(() => {
    void hydrateFromStorage();
  }, [hydrateFromStorage]);

  const setTokens = useCallback(
    async ({ accessToken, refreshToken }: AuthTokens) => {
      await AuthService.saveTokens(accessToken, refreshToken);
      applyTokensToState({
        accessToken,
        refreshToken,
      });
    },
    [applyTokensToState],
  );

  const loginWithKakaoToken = useCallback(
    async (kakaoAccessToken: string) => {
      const response = await AuthService.kakaoLogin(kakaoAccessToken);

      if (response.isSuccess && response.result) {
        applyTokensToState({
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken,
        });
      }

      return response;
    },
    [applyTokensToState],
  );

  const refreshSession = useCallback(async () => {
    const response = await AuthService.refreshAccessToken();

    if (response.isSuccess && response.result) {
      applyTokensToState({
        accessToken: response.result.accessToken,
        refreshToken: response.result.refreshToken,
      });
    }

    return response;
  }, [applyTokensToState]);

  const logout = useCallback(async () => {
    await AuthService.logout();
    applyTokensToState({
      accessToken: null,
      refreshToken: null,
    });
  }, [applyTokensToState]);

  const buildAuthHeaders = useCallback(
    (headers: HeadersInit = {}) => {
      if (!state.accessToken) {
        return headers;
      }

      const authHeader = { Authorization: `Bearer ${state.accessToken}` };

      if (headers instanceof Headers) {
        const next = new Headers(headers);
        next.set('Authorization', authHeader.Authorization);
        return next;
      }

      if (Array.isArray(headers)) {
        const next = headers.filter(
          ([key]) => key.toLowerCase() !== 'authorization',
        );
        next.push(['Authorization', authHeader.Authorization]);
        return next;
      }

      return {
        ...headers,
        ...authHeader,
      };
    },
    [state.accessToken],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      isInitializing: state.isInitializing,
      isAuthenticated: !!state.accessToken,
      loginWithKakaoToken,
      refreshSession,
      hydrateFromStorage,
      setTokens,
      logout,
      buildAuthHeaders,
    }),
    [
      state.accessToken,
      state.refreshToken,
      state.isInitializing,
      loginWithKakaoToken,
      refreshSession,
      hydrateFromStorage,
      setTokens,
      logout,
      buildAuthHeaders,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
