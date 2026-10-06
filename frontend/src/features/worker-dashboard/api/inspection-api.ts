import { env } from '@/config/env';
import { ApiError } from '@/services/http/api-error';
import { request } from '@/services/http/http-client';
import { tokenStorage } from '@/services/storage/token-storage';
import type {
  InspectionChecklist,
  InspectionSpace,
  InspectionSpaceType,
} from '../types/inspection-types';

const roomNames = [
  'Indoor Seating', 'VIP Room', 'Restrooms', 'Kitchen',
  'Storage', 'Meeting Room', 'Lobby', 'Office',
];
const areaNames = [
  'Outdoor Seating', 'Garden Area', 'Reception', 'Hallway', 'Back Area',
];
const assetNames = [
  'Bar Counter', 'Coffee Machine', 'Tables', 'Chairs',
  'Display Case', 'Freezer', 'Oven', 'Dishwasher',
];

function makeSpaces(type: InspectionSpaceType, names: string[]): InspectionSpace[] {
  return names.map((name, index) => ({
    id: `${type}-${index + 1}`,
    type,
    name,
    location: type === 'room' ? (index === 0 ? 'Ground Floor' : 'First Floor') : null,
    imageUrl: null,
    status: 'pending',
  }));
}

const mockChecklist: InspectionChecklist = {
  property: {
    id: 'HTQ-X9R',
    name: 'Brew & Bites Café',
    imageUrl: null,
  },
  spaces: [
    ...makeSpaces('room', roomNames),
    ...makeSpaces('area', areaNames),
    ...makeSpaces('asset', assetNames),
  ],
};

async function getAccessToken(): Promise<string> {
  const token = await tokenStorage.getAccessToken();
  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Please sign in again.');
  }
  return token;
}

export async function getInspectionChecklist(
  propertyId: string,
): Promise<InspectionChecklist> {
  if (env.useMockApi) {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
    return {
      ...mockChecklist,
      property: { ...mockChecklist.property, id: propertyId },
    };
  }

  return request<InspectionChecklist>(
    `/v1/inspection/properties/${encodeURIComponent(propertyId)}/inspection-checklist`,
    { token: await getAccessToken() },
  );
}