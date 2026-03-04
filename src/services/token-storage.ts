import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'reploop_token';
const REFRESH_KEY = 'reploop_refresh_token';

// Web fallback: SecureStore is native-only
const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string) {
  if (isWeb) {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    return getItem(TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return getItem(REFRESH_KEY);
  },

  async setTokens(token: string, refreshToken: string) {
    await setItem(TOKEN_KEY, token);
    await setItem(REFRESH_KEY, refreshToken);
  },

  async clear() {
    await deleteItem(TOKEN_KEY);
    await deleteItem(REFRESH_KEY);
  },
};
