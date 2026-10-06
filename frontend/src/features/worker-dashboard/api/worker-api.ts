import { env } from '@/config/env';
import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type { WorkerDashboardData, WorkerProperty } from '../types/worker-types';

const mockProperty: WorkerProperty = {
  id: 'property-brew-bites',
  name: 'Brew Bites',
  status: 'active',
  address: "123 park street, kolkata, west bengal, india - 700016",
  verification_status: 'VERIFIED',
};

const mockDashboard: WorkerDashboardData = {
  workerId: 'worker-riya-kapoor',
  workerName: 'Riya Kapoor',
  property: mockProperty,
};

const waitForMock = () => new Promise((resolve) => setTimeout(resolve, 280));

async function getAccessToken(): Promise<string> {
  const accessToken = await tokenStorage.getAccessToken();
  if (!accessToken) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Please sign in again to view your assigned property.');
  }
  return accessToken;
}

export async function getWorkerDashboard(): Promise<WorkerDashboardData> {
  if (env.useMockApi) {
    await waitForMock();
    return mockDashboard;
  }

  return request<WorkerDashboardData>('/v1/worker/assigned-property', {
    token: await getAccessToken(),
  });
}

export async function getWorkerProperty(propertyId: string): Promise<WorkerProperty> {
  if (env.useMockApi) {
    await waitForMock();
    if (propertyId !== mockProperty.id) {
      throw new ApiError(404, 'PROPERTY_NOT_FOUND', 'This assigned property could not be found.');
    }
    return mockProperty;
  }

  return request<WorkerProperty>(`/v1/worker/properties/${encodeURIComponent(propertyId)}`, {
    token: await getAccessToken(),
  });
}