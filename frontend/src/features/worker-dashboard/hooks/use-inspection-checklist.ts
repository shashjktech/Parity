import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { toApiError } from '@/services/http/api-error';
import { getInspectionChecklist } from '../api/inspection-api';
import type { InspectionChecklist } from '../types/inspection-types';

export function useInspectionChecklist(propertyId?: string) {
  const [checklist, setChecklist] = useState<InspectionChecklist>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const loadRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let timer: ReturnType<typeof setTimeout> | undefined;

      if (!propertyId) {
        setError('Property ID is missing.');
        setLoading(false);
        loadRef.current = null;
        return () => {
          active = false;
        };
      }

      const load = async (showLoading: boolean) => {
        if (showLoading) setLoading(true);
        setError(undefined);

        try {
          const result = await getInspectionChecklist(propertyId);
          if (!active) return;
          setChecklist(result);
          if (result.spaces.some((space) => space.status === 'processing')) {
            timer = setTimeout(() => void load(false), 3000);
          }
        } catch (cause: unknown) {
          if (active) setError(toApiError(cause).message);
        } finally {
          if (active && showLoading) setLoading(false);
        }
      };

      const retryLoad = () => void load(true);
      loadRef.current = retryLoad;
      void load(true);

      return () => {
        active = false;
        if (timer) clearTimeout(timer);
        if (loadRef.current === retryLoad) loadRef.current = null;
      };
    }, [propertyId]),
  );

  return {
    checklist,
    loading,
    error,
    retry: useCallback(() => loadRef.current?.(), []),
  };
}