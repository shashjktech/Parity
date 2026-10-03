import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getOwnerProperties } from '../api/property-api';
import { getDashboardSummary } from '../constants/dashboard-data';
import type { OwnerProperty } from '../types/owner-property';

export function useOwnerDashboard() {
  const [properties, setProperties] = useState<OwnerProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const reload = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const result = await getOwnerProperties();
      if (currentRequestId === requestId.current) {
        setProperties(result);
      }
    } catch (cause) {
      console.error('Failed to load owner properties:', cause);
      if (currentRequestId === requestId.current) {
        setError('Unable to load properties.');
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const verifiedCount = properties.filter(
    (property) => property.verification_status === 'VERIFIED',
  ).length;

  return {
    properties,
    summary: getDashboardSummary(properties.length, verifiedCount),
    loading,
    error,
    reload,
  };
}