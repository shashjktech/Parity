import { ApiError } from "@/services/http/api-error";
import { env } from "@/config/env";
import { request } from "@/services/http/http-client";
import { tokenStorage } from "@/services/storage/token-storage";
import { File as ExpoFile } from "expo-file-system";
import type { CreatePropertyItem, PropertyItem } from "../types/property-item";

export type Prompt = {
  id: string;
  name: string;
  prompt_text: string;
  created_at: string;
  updated_at: string;
};

async function accessToken() {
  const token = await tokenStorage.getAccessToken();
  if (!token) {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Please sign in again to manage property items.",
    );
  }
  return token;
}

export async function getPropertyItems(
  propertyId: string,
): Promise<PropertyItem[]> {
  const token = await accessToken();
  const items = await request<PropertyItem[]>(
    `/v1/properties/${encodeURIComponent(propertyId)}/spaces`,
    { method: "GET", token },
  );
  return items.map((item) => ({
    ...item,
    image_url: item.image_url ? `${env.apiUrl}${item.image_url}` : null,
    image_headers: item.image_url
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  }));
}

export async function createPropertyItem(
  propertyId: string,
  item: CreatePropertyItem,
  photo?: {
    uri: string;
    name: string;
    type: string;
    size?: number;
    file?: Blob | null;
  } | null,
): Promise<{ space_id: string }> {
  const path = `/v1/properties/${encodeURIComponent(propertyId)}/spaces/add`;
  const timeoutMs = photo ? 120_000 : 15_000;
  console.info("[space-create] sending request", {
    propertyId,
    type: item.type,
    hasDescription: Boolean(item.description),
    hasPrompt: Boolean(item.promptId),
    hasPhoto: Boolean(photo),
    photoName: photo?.name,
    photoType: photo?.type,
    photoSize: photo?.size ?? photo?.file?.size,
    timeoutMs,
  });

  try {
    const token = await accessToken();
    const form = new FormData();
    form.append("type", item.type);
    form.append("name", item.name);
    if (item.description) form.append("description", item.description);
    if (item.promptId) form.append("promptId", item.promptId);

    if (photo) {
      const file = photo.file ?? new ExpoFile(photo.uri);
      form.append("photo", file, photo.name);
    }

    const result = await request<{ space_id: string }>(path, {
      method: "POST",
      token,
      body: form,
      timeoutMs,
    });
    console.info("[space-create] succeeded", {
      propertyId,
      spaceId: result.space_id,
      hasPhoto: Boolean(photo),
    });
    return result;
  } catch (error) {
    console.error("[space-create] failed", {
      propertyId,
      type: item.type,
      hasPhoto: Boolean(photo),
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
      status: error instanceof ApiError ? error.status : undefined,
      code: error instanceof ApiError ? error.code : undefined,
      timeoutMs,
    });
    throw error;
  }
}
