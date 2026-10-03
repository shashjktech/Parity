import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getOwnerProperty } from '../api/property-api';
import type { OwnerProperty } from '../types/owner-property';

export function useOwnerPropertyDetails(propertyId?: string) {
  const [property, setProperty] = useState<OwnerProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const loadProperty = useCallback(async (isActive: () => boolean) => {
    const requestId = ++requestSequence.current;
    const canUpdate = () => isActive() && requestSequence.current === requestId;

    if (!propertyId) {
      setError('Property not found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getOwnerProperty(propertyId);
      if (canUpdate()) setProperty(result);
    } catch (cause: unknown) {
      console.error('Failed to load owner property details:', cause);
      if (canUpdate()) {
        setProperty(null);
        setError('Unable to load property details.');
      }
    } finally {
      if (canUpdate()) setLoading(false);
    }
  }, [propertyId]);

  const reload = useCallback(() => {
    void loadProperty(() => true);
  }, [loadProperty]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadProperty(() => active);

      return () => {
        active = false;
      };
    }, [loadProperty]),
  );

  return { property, loading, error, reload };
}