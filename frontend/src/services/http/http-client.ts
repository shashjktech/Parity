import { env } from '@/config/env';
import { ApiError } from './api-error';

type Options = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
  timeoutMs?: number;
};

function parseJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Every backend error must look like: { code, message, fieldErrors?, details? } */
export async function request<T>(path: string, options: Options = {}): Promise<T> {
  const { method = 'GET', body, token, timeoutMs = 15000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    const data = text ? parseJson(text) : null;

    if (!res.ok) {
      throw new ApiError(res.status, data?.code ?? 'HTTP_ERROR', data?.message ?? 'Something went wrong. Please try again.', {
        fieldErrors: data?.fieldErrors,
        details: data?.details,
      });
    }
    return data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError(0, 'TIMEOUT', 'The request timed out. Please try again.');
    }
    throw new ApiError(0, 'NETWORK', 'No internet connection. Please check and try again.');
  } finally {
    clearTimeout(timer);
  }
}