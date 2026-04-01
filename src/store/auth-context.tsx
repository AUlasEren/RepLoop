import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

import { authService, tokenStorage, userService } from '@/services';
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
  AppleAuthRequest,
  ApiError,
} from '@/services/api-types';

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

type AuthContextType = AuthState & {
  login: (body: LoginRequest) => Promise<AuthUser>;
  register: (body: RegisterRequest) => Promise<AuthUser>;
  loginWithGoogle: (body: GoogleAuthRequest) => Promise<AuthUser>;
  loginWithApple: (body: AppleAuthRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let done = false;
    const timeout = setTimeout(() => {
      if (!done) {
        done = true;
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    }, 8000);

    (async () => {
      try {
        const token = await tokenStorage.getToken();
        if (!token) {
          if (!done) { done = true; setState({ user: null, isLoading: false, isAuthenticated: false }); }
          clearTimeout(timeout);
          return;
        }

        const dto = await userService.getProfile();
        const user: AuthUser = {
          id: dto.userId,
          name: dto.displayName,
          email: '',
          avatarUrl: dto.avatarUrl,
          isProfileComplete: true,
        };
        if (!done) { done = true; setState({ user, isLoading: false, isAuthenticated: true }); }
      } catch {
        await tokenStorage.clear().catch(() => {});
        if (!done) { done = true; setState({ user: null, isLoading: false, isAuthenticated: false }); }
      } finally {
        clearTimeout(timeout);
      }
    })();

    return () => { clearTimeout(timeout); };
  }, []);

  const handleAuthResult = useCallback((user: AuthUser) => {
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const login = useCallback(async (body: LoginRequest): Promise<AuthUser> => {
    const result = await authService.login(body);
    handleAuthResult(result.user);
    return result.user;
  }, [handleAuthResult]);

  const register = useCallback(async (body: RegisterRequest): Promise<AuthUser> => {
    const result = await authService.register(body);
    handleAuthResult(result.user);
    return result.user;
  }, [handleAuthResult]);

  const loginWithGoogle = useCallback(async (body: GoogleAuthRequest): Promise<AuthUser> => {
    const result = await authService.googleAuth(body);
    handleAuthResult(result.user);
    return result.user;
  }, [handleAuthResult]);

  const loginWithApple = useCallback(async (body: AppleAuthRequest): Promise<AuthUser> => {
    const result = await authService.appleAuth(body);
    handleAuthResult(result.user);
    return result.user;
  }, [handleAuthResult]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, loginWithGoogle, loginWithApple, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && 'status' in e;
}

export function getApiErrorMessage(e: unknown): string {
  if (!isApiError(e)) return 'Bağlantı hatası. Lütfen tekrar dene.';
  if (e.detail) return e.detail;
  if (e.error) return e.error;
  if (e.errors) {
    const msgs = Object.values(e.errors).flat();
    return msgs.join('\n') || e.title;
  }
  return e.title || 'Bir hata oluştu.';
}
