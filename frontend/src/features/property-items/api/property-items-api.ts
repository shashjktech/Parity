import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type { CreatePropertyItem, PropertyItem } from '../types/property-item';

async function accessToken() {
  const token = await tokenStorage.getAccessToken();
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Please sign in again to manage property items.');
  }
  return token;
}

export async function getPropertyItems(propertyId: string): Promise<PropertyItem[]> {
  const token = await accessToken();
  return request<PropertyItem[]>(
    `/v1/properties/${encodeURIComponent(propertyId)}/items`,
    { method: 'GET', token },
  );
}

export async function createPropertyItem(
  propertyId: string,
  item: CreatePropertyItem,
): Promise<PropertyItem> {
  const token = await accessToken();
  return request<PropertyItem>(
    `/v1/properties/${encodeURIComponent(propertyId)}/items`,
    { method: 'POST', token, body: item },
  );
}

export async function uploadPropertyItemPhoto(
  propertyId: string,
  photo: { uri: string; name: string; type: string; file?: Blob | null },
): Promise<{ image_path: string }> {
  const token = await accessToken();
  const body = new FormData();
  if (photo.file) {
    body.append('photo', photo.file, photo.name);
  } else {
    body.append('photo', { uri: photo.uri, name: photo.name, type: photo.type } as unknown as Blob);
  }

  return request<{ image_path: string }>(
    `/v1/properties/${encodeURIComponent(propertyId)}/items/photo`,
    { method: 'POST', token, body },
  );
}