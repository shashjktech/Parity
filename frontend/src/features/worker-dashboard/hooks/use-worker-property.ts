import { useEffect, useState } from 'react';

import { toApiError } from '@/services/http/api-error';
import { getWorkerDashboard, getWorkerProperty } from '../api/worker-api';
import type { WorkerDashboardData, WorkerProperty } from '../types/worker-types';

export function useWorkerDashboard() {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = String(reloadKey);
  const [result, setResult] = useState<{ key: string; data?: WorkerDashboardData; error?: string }>({ key: '' });

  useEffect(() => {
    let active = true;

    getWorkerDashboard()
      .then((response) => {
        if (active) setResult({ key: requestKey, data: response });
      })
      .catch((cause: unknown) => {
        if (active) setResult({ key: requestKey, error: toApiError(cause).message });
      });

    return () => {
      active = false;
    };
  }, [requestKey]);

  const isCurrentResult = result.key === requestKey;
  return {
    data: isCurrentResult ? result.data : undefined,
    loading: !isCurrentResult,
    error: isCurrentResult ? result.error : undefined,
    retry: () => setReloadKey((key) => key + 1),
  };
}

export function useWorkerProperty(propertyId?: string) {
  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = `${propertyId ?? 'assigned'}:${reloadKey}`;
  const [result, setResult] = useState<{ key: string; property?: WorkerProperty | null; error?: string }>({ key: '' });

  useEffect(() => {
    let active = true;

    const loadProperty = async () => {
      const assignedPropertyId = propertyId ?? (await getWorkerDashboard()).property?.id;
      return assignedPropertyId ? getWorkerProperty(assignedPropertyId) : null;
    };

    loadProperty()
      .then((response) => {
        if (active) setResult({ key: requestKey, property: response });
      })
      .catch((cause: unknown) => {
        if (active) setResult({ key: requestKey, error: toApiError(cause).message });
      });

    return () => {
      active = false;
    };
  }, [propertyId, requestKey]);

  const isCurrentResult = result.key === requestKey;
  return {
    property: isCurrentResult ? result.property : undefined,
    loading: !isCurrentResult,
    error: isCurrentResult ? result.error : undefined,
    retry: () => setReloadKey((key) => key + 1),
  };
}