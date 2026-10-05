import { ApiError } from "@/services/http/api-error";
import { env } from "@/config/env";
import { request } from "@/services/http/http-client";
import { tokenStorage } from "@/services/storage/token-storage";
import { File as ExpoFile, UploadType } from "expo-file-system";
import { Platform } from "react-native";
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
    if (!photo) {
      throw new ApiError(0, "VALIDATION", "Please add a photo to create a property item.");
    }

    const token = await accessToken();

    // Native (Android/iOS) with a photo: native multipart upload, no fetch
    if (photo && Platform.OS !== "web") {
      const parameters: Record<string, string> = {
        type: item.type,
        name: item.name,
      };
      if (item.description) parameters.description = item.description;
      if (item.promptId) parameters.promptId = item.promptId;

      const result = await new ExpoFile(photo.uri).upload(
        `${env.apiUrl}${path}`,
        {
          uploadType: UploadType.MULTIPART,
          fieldName: "photo",
          mimeType: photo.type,
          httpMethod: "POST",
          parameters,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      let data: any = null;
      try {
        data = JSON.parse(result.body);
      } catch { }

      if (result.status < 200 || result.status >= 300) {
        throw new ApiError(
          result.status,
          data?.code ?? "HTTP_ERROR",
          data?.message ?? data?.detail ?? "Something went wrong. Please try again.",
        );
      }
      console.info("[space-create] succeeded", {
        propertyId,
        spaceId: data?.space_id,
        hasPhoto: true,
      });
      return data as { space_id: string };
    }

    if (Platform.OS === "web") {
      throw new ApiError(
        400,
        "UNSUPPORTED_PLATFORM",
        "Web upload is not implemented yet."
      );
    }

    throw new ApiError(
      500,
      "UNKNOWN_STATE",
      "Could not create property item."
    );
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
