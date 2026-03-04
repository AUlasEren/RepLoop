import { tokenStorage } from './token-storage';
import type { ApiError, AuthResult } from './api-types';

// Backend base URL'ini buraya yaz. Gelistirme icin localhost kullanilabilir.
const BASE_URL = __DEV__
  ? 'http://localhost:5001'
  : 'https://api.reploop.com';

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(authenticated: boolean): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (authenticated) {
      const token = await tokenStorage.getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleTokenRefresh(): Promise<string | null> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) return null;

        const res = await fetch(`${this.baseUrl}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          await tokenStorage.clear();
          return null;
        }

        const data: AuthResult = await res.json();
        await tokenStorage.setTokens(data.token, data.refreshToken);
        return data.token;
      } catch {
        await tokenStorage.clear();
        return null;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      authenticated?: boolean;
      isFormData?: boolean;
    } = {},
  ): Promise<T> {
    const { body, authenticated = true, isFormData = false } = options;

    const headers = await this.getHeaders(authenticated);
    if (isFormData) {
      delete headers['Content-Type'];
    }

    const config: RequestInit = {
      method,
      headers,
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    };

    let res = await fetch(`${this.baseUrl}${path}`, config);

    // 401 -> token refresh denemesi
    if (res.status === 401 && authenticated) {
      const newToken = await this.handleTokenRefresh();
      if (newToken) {
        headers.Authorization = `Bearer ${newToken}`;
        if (isFormData) delete headers['Content-Type'];
        res = await fetch(`${this.baseUrl}${path}`, { ...config, headers });
      }
    }

    // 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }

    if (!res.ok) {
      let error: ApiError;
      try {
        error = await res.json();
      } catch {
        error = {
          type: '',
          title: 'Network Error',
          status: res.status,
          detail: res.statusText || 'Beklenmeyen bir hata oluştu',
          errorCode: 'NET-0000',
        };
      }
      throw error;
    }

    const text = await res.text();
    if (!text) {
      return undefined as T;
    }
    return JSON.parse(text);
  }

  // ── Public methods ──────────────────────────────────────────────────────

  get<T>(path: string, authenticated = true) {
    return this.request<T>('GET', path, { authenticated });
  }

  post<T>(path: string, body?: unknown, authenticated = true) {
    return this.request<T>('POST', path, { body, authenticated });
  }

  put<T>(path: string, body?: unknown, authenticated = true) {
    return this.request<T>('PUT', path, { body, authenticated });
  }

  patch<T>(path: string, body?: unknown, authenticated = true) {
    return this.request<T>('PATCH', path, { body, authenticated });
  }

  delete<T>(path: string, authenticated = true) {
    return this.request<T>('DELETE', path, { authenticated });
  }

  upload<T>(path: string, formData: FormData) {
    return this.request<T>('PUT', path, { body: formData, authenticated: true, isFormData: true });
  }
}

export const api = new ApiClient(BASE_URL);
