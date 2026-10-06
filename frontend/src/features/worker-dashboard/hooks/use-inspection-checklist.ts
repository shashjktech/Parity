import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { toApiError } from '@/services/http/api-error';
import { getInspectionChecklist } from '../api/inspection-api';
import type { InspectionChecklist } from '../types/inspection-types';

export function useInspectionChecklist(propertyId?: string) {
  const [reloadKey, setReloadKey] = useState(0);
  const [checklist, setChecklist] = useState<InspectionChecklist>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!propertyId) {
        setError('Property ID is missing.');
        setLoading(false);
        return () => {
          active = false;
        };
      }

      setLoading(true);
      setError(undefined);

      getInspectionChecklist(propertyId)
        .then((result) => {
          if (active) setChecklist(result);
        })
        .catch((cause: unknown) => {
          if (active) setError(toApiError(cause).message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, [propertyId, reloadKey]),
  );

  return {
    checklist,
    loading,
    error,
    retry: () => setReloadKey((key) => key + 1),
  };
}