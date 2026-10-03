import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getPropertyItems } from '../api/property-items-api';
import type { PropertyItem } from '../types/property-item';

export function usePropertyItems(propertyId?: string) {
  const [items, setItems] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const loadItems = useCallback(async (isActive: () => boolean) => {
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
      const result = await getPropertyItems(propertyId);
      if (canUpdate()) setItems(result);
    } catch (cause) {
      console.error('Failed to load property items:', cause);
      if (canUpdate()) setError('Unable to load rooms, areas, and assets.');
    } finally {
      if (canUpdate()) setLoading(false);
    }
  }, [propertyId]);

  const reload = useCallback(() => {
    void loadItems(() => true);
  }, [loadItems]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadItems(() => active);
      return () => {
        active = false;
      };
    }, [loadItems]),
  );

  return { items, loading, error, reload };
}