import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type KV = {
  set(k: string, v: string): Promise<void>;
  get(k: string): Promise<string | null>;
  remove(k: string): Promise<void>;
};

const webStore: KV = {
  set: async (k, v) => localStorage.setItem(k, v),
  get: async (k) => localStorage.getItem(k),
  remove: async (k) => localStorage.removeItem(k),
};
const nativeStore: KV = {
  set: (k, v) => SecureStore.setItemAsync(k, v),
  get: (k) => SecureStore.getItemAsync(k),
  remove: (k) => SecureStore.deleteItemAsync(k),
};
const store = Platform.OS === 'web' ? webStore : nativeStore; // web is dev-only

const ACCESS = 'parity.accessToken';
const REFRESH = 'parity.refreshToken';

export const tokenStorage = {
  async save(t: { accessToken: string; refreshToken: string }) {
    await store.set(ACCESS, t.accessToken);
    await store.set(REFRESH, t.refreshToken);
  },
  getAccessToken: () => store.get(ACCESS),
  getRefreshToken: () => store.get(REFRESH),
  async clear() {
    await store.remove(ACCESS);
    await store.remove(REFRESH);
  },
};