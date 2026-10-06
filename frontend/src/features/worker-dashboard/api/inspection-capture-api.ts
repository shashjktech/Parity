import { env } from '@/config/env';
import { ApiError } from '@/services/http/api-error';
import { tokenStorage } from '@/services/storage/token-storage';
import { File as ExpoFile, UploadType } from 'expo-file-system';
import { Platform } from 'react-native';

import type { CaptureUploadResult } from '../types/capture-types';

async function getAccessToken(): Promise<string> {
  const token = await tokenStorage.getAccessToken();

  if (!token) {
    throw new ApiError(
      401,
      'UNAUTHORIZED',
      'Please sign in again.',
    );
  }

  return token;
}

export async function uploadInspectionCapture(
  propertyId: string,
  spaceId: string,
  photo: {
    uri: string;
    mimeType?: string;
  },
): Promise<CaptureUploadResult> {
  if (Platform.OS === 'web') {
    throw new ApiError(
      400,
      'UNSUPPORTED_PLATFORM',
      'Photo capture is not supported on web.',
    );
  }

  const token = await getAccessToken();

  const path =
    `/v1/inspection/properties/${encodeURIComponent(propertyId)}` +
    `/spaces/${encodeURIComponent(spaceId)}/capture`;

  const result = await new ExpoFile(photo.uri).upload(
    `${env.apiUrl}${path}`,
    {
      uploadType: UploadType.MULTIPART,
      fieldName: 'photo',
      mimeType: photo.mimeType ?? 'image/jpeg',
      httpMethod: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  );

  let data: any = null;

  try {
    data = JSON.parse(result.body);
  } catch {
    // Response body is not JSON.
  }

  if (result.status < 200 || result.status >= 300) {
    throw new ApiError(
      result.status,
      data?.code ?? 'HTTP_ERROR',
      data?.message ??
        data?.detail ??
        'Could not save the photo. Please try again.',
    );
  }

  return data as CaptureUploadResult;
}