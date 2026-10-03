import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { toApiError } from "@/services/http/api-error";
import { listPrompts } from "../api/prompt-api";
import type { Prompt } from "../types/property-prompt-types";

export function usePrompts(propertyId?: string) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const loadPrompts = useCallback(
    async (isActive: () => boolean) => {
      const requestId = ++requestSequence.current;
      const canUpdate = () =>
        isActive() && requestSequence.current === requestId;

      if (!propertyId) {
        setError("Property not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await listPrompts(propertyId);
        if (canUpdate()) setPrompts(result);
      } catch (cause) {
        console.error("Failed to load prompts:", cause);
        if (canUpdate()) setError(toApiError(cause).message);
      } finally {
        if (canUpdate()) setLoading(false);
      }
    },
    [propertyId],
  );

  const reload = useCallback(() => {
    void loadPrompts(() => true);
  }, [loadPrompts]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadPrompts(() => active);
      return () => {
        active = false;
      };
    }, [loadPrompts]),
  );

  const addPrompt = useCallback((prompt: Prompt) => {
    setPrompts((current) => [
      prompt,
      ...current.filter((existing) => existing.id !== prompt.id),
    ]);
  }, []);

  return { prompts, loading, error, reload, addPrompt };
}
