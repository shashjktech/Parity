import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { ApiError } from '@/services/http/api-error';
import {
  approveWorker, getWorkers, rejectWorker, removeWorker, 
} from '../api/worker-api';
import type { Worker } from '../types/worker';

export function usePropertyWorkers(propertyId?: string) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const sequence = useRef(0);

  const load = useCallback(async (isActive: () => boolean, silent = false) => {
    const id = ++sequence.current;
    const canUpdate = () => isActive() && sequence.current === id;

    if (!propertyId) {
      setError('Property not found.');
      setLoading(false);
      return;
    }
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const result = await getWorkers(propertyId);
      if (canUpdate()) setWorkers(result);
    } catch (cause: unknown) {
      console.error('Failed to load workers:', cause);
      if (canUpdate() && !silent) {
        setWorkers([]);
        setError(cause instanceof ApiError ? cause.message : 'Unable to load workers.');
      }
    } finally {
      if (canUpdate() && !silent) setLoading(false);
    }
  }, [propertyId]);

  const reload = useCallback(() => { void load(() => true); }, [load]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void load(() => active);
      return () => { active = false; };
    }, [load]),
  );

  /** Runs a mutation, refreshes the list, returns an error message or null. */
  const run = useCallback(async (userId: string, action: () => Promise<void>) => {
    setBusyUserId(userId);
    try {
      await action();
      await load(() => true, true);
      return null;
    } catch (cause: unknown) {
      return cause instanceof ApiError ? cause.message : 'Something went wrong. Please try again.';
    } finally {
      setBusyUserId(null);
    }
  }, [load]);

  return {
    workers, loading, error, busyUserId, reload,
    approve: (userId: string) => run(userId, () => approveWorker(propertyId!, userId)),
    reject: (userId: string) => run(userId, () => rejectWorker(propertyId!, userId)),
    remove: (userId: string) => run(userId, () => removeWorker(propertyId!, userId)),
  };
}