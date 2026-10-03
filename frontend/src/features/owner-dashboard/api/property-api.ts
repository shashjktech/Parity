import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type { OwnerProperty } from '../types/owner-property';

async function getAccessToken(message: string) {
  const accessToken = await tokenStorage.getAccessToken();

  if (!accessToken) {
    throw new ApiError(401, 'UNAUTHORIZED', message);
  }

  return accessToken;
}

export async function getOwnerProperties(): Promise<OwnerProperty[]> {
  const accessToken = await getAccessToken(
    'Please sign in again to view your properties.',
  );

  const properties = await request<OwnerProperty[]>('/v1/properties', {
    method: 'GET',
    token: accessToken,
  });
  console.log('[GET /v1/properties] response:', properties);
  return properties;
}

export async function getOwnerProperty(propertyId: string): Promise<OwnerProperty> {
  const accessToken = await getAccessToken(
    'Please sign in again to view this property.',
  );

  return request<OwnerProperty>(
    `/v1/properties/${encodeURIComponent(propertyId)}`,
    { method: 'GET', token: accessToken },
  );
}