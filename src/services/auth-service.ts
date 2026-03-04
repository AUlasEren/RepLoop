import { api } from './api-client';
import { tokenStorage } from './token-storage';
import type {
  AuthResult,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  GoogleAuthRequest,
  AppleAuthRequest,
} from './api-types';

async function handleAuthResult(result: AuthResult): Promise<AuthResult> {
  await tokenStorage.setTokens(result.token, result.refreshToken);
  return result;
}

export const authService = {
  async login(body: LoginRequest): Promise<AuthResult> {
    const result = await api.post<AuthResult>('/api/auth/login', body, false);
    return handleAuthResult(result);
  },

  async register(body: RegisterRequest): Promise<AuthResult> {
    const result = await api.post<AuthResult>('/api/auth/register', body, false);
    return handleAuthResult(result);
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken }, false);
      }
    } finally {
      await tokenStorage.clear();
    }
  },

  async forgotPassword(body: ForgotPasswordRequest): Promise<{ message: string }> {
    return api.post('/api/auth/forgot-password', body, false);
  },

  async resetPassword(body: ResetPasswordRequest): Promise<{ message: string }> {
    return api.post('/api/auth/reset-password', body, false);
  },

  async changePassword(body: ChangePasswordRequest): Promise<{ message: string }> {
    return api.post('/api/auth/change-password', body);
  },

  async googleAuth(body: GoogleAuthRequest): Promise<AuthResult> {
    const result = await api.post<AuthResult>('/api/auth/google', body, false);
    return handleAuthResult(result);
  },

  async appleAuth(body: AppleAuthRequest): Promise<AuthResult> {
    const result = await api.post<AuthResult>('/api/auth/apple', body, false);
    return handleAuthResult(result);
  },
};
