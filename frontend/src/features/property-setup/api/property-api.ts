import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type { PropertyValues } from '../types/property-types';

export type CreatePropertyResponse = {
  id: string;
  name: string;
};
export type PropertyResponse = {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  timezone: string | null;
  verification_status: string;
  subscription_plan_id: string | null;
  created_at: string;
};

export async function createProperty(
    property: PropertyValues,
  ): Promise<CreatePropertyResponse> {
  const accessToken = await tokenStorage.getAccessToken();

  if (!accessToken) {
    throw new ApiError(
      401,
      'UNAUTHORIZED',
      'Please sign in again before adding a property.',
    );
  }

  const body = {
    name: property.name.trim(),
    address: property.address.trim(),
    city: property.city.trim(),
    state: property.state.trim(),
    country: property.country.trim(),
    pincode: property.pincode.trim(),
  };

  return request<CreatePropertyResponse>('/v1/properties/add', {
    method: 'POST',
    token: accessToken,
    body,
  });
}

export async function getProperties(): Promise<PropertyResponse[]> {
  const accessToken = await tokenStorage.getAccessToken();

  if (!accessToken) {
    throw new ApiError(
      401,
      'UNAUTHORIZED',
      'Please sign in again to view your properties.',
    );
  }

  return request<PropertyResponse[]>('/v1/properties', {
    method: 'GET',
    token: accessToken,
  });
}