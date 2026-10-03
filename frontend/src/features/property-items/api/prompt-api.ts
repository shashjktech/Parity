import { ApiError } from "@/services/http/api-error";
import { request } from "@/services/http/http-client";
import { tokenStorage } from "@/services/storage/token-storage";
import type {
    CreatePromptPayload,
    Prompt,
} from "../types/property-prompt-types";

async function accessToken() {
  const token = await tokenStorage.getAccessToken();
  if (!token) {
    throw new ApiError(
      401,
      "UNAUTHORIZED",
      "Please sign in again to manage prompts.",
    );
  }
  return token;
}

export async function listPrompts(propertyId: string): Promise<Prompt[]> {
  const token = await accessToken();
  return request<Prompt[]>(
    `/v1/properties/${encodeURIComponent(propertyId)}/prompts`,
    { method: 'GET', token },
  );
}


export async function createPrompt(
  propertyId: string,
  payload: CreatePromptPayload,
): Promise<Prompt> {
  const token = await accessToken();
  return request<Prompt>(
    `/v1/properties/${encodeURIComponent(propertyId)}/prompts/add`,
    { method: "POST", token, body: payload },
  );
}
