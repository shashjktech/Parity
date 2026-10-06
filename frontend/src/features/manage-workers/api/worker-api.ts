import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type { Worker } from '../types/worker';

async function accessToken() {
  const token = await tokenStorage.getAccessToken();
  if (!token) throw new ApiError(401, 'UNAUTHORIZED', 'Please sign in again to manage workers.');
  return token;
}

const base = (propertyId: string) => `/v1/properties/${encodeURIComponent(propertyId)}/workers`;
const one = (propertyId: string, userId: string) => `${base(propertyId)}/${encodeURIComponent(userId)}`;

export async function getWorkers(propertyId: string): Promise<Worker[]> {
  return request<Worker[]>(base(propertyId), { method: 'GET', token: await accessToken() });
}

export async function approveWorker(propertyId: string, userId: string): Promise<void> {
  await request<void>(`${one(propertyId, userId)}/approve`, { method: 'POST', token: await accessToken() });
}

export async function rejectWorker(propertyId: string, userId: string): Promise<void> {
  await request<void>(`${one(propertyId, userId)}/reject`, { method: 'POST', token: await accessToken() });
}

export async function removeWorker(propertyId: string, userId: string): Promise<void> {
  await request<void>(one(propertyId, userId), { method: 'DELETE', token: await accessToken() });
}

