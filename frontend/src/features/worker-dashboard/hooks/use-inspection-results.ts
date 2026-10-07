import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { toApiError } from '@/services/http/api-error';
import { getInspectionCaptureResult } from '../api/inspection-api';
import type { InspectionCaptureResult } from '../types/inspection-types';

export function useInspectionResults(
  propertyId?: string,
  spaceId?: string,
  captureId?: string,
) {
  const [result, setResult] = useState<InspectionCaptureResult>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const loadRef = useRef<(() => void) | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let timer: ReturnType<typeof setTimeout> | undefined;

      if (!propertyId || !spaceId || !captureId) {
        setError('Inspection result details are missing.');
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
          const nextResult = await getInspectionCaptureResult(
            propertyId,
            spaceId,
            captureId,
          );
          if (!active) return;
          setResult(nextResult);
          if (nextResult.status === 'processing') {
            timer = setTimeout(() => void load(false), 2500);
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
    }, [propertyId, spaceId, captureId]),
  );

  return {
    result,
    loading,
    error,
    retry: useCallback(() => loadRef.current?.(), []),
  };
}
