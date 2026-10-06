import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';

import { routes } from '@/constants/routes';
import { toApiError } from '@/services/http/api-error';
import { tokenStorage } from '@/services/storage/token-storage';
import { authApi } from '../api/auth-api';
import type { LoginValues } from '../types/auth-types';

const INITIAL: LoginValues = { login_id: '', password: '' };

export function useLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginValues>(INITIAL);
  const [touched, setTouched] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const error = useMemo(() => {
    if (!touched) return undefined;
    if (!values.login_id.trim()) return 'Email or phone number is required';
    if (!values.password) return 'Password is required';
    return undefined;
  }, [touched, values.login_id, values.password]);

  const setLoginId = (loginId: string) => {
    setValues((previous) => ({ ...previous, login_id: loginId }));
    setFormError(undefined);
  };

  const setPassword = (password: string) => {
    setValues((previous) => ({ ...previous, password }));
    setFormError(undefined);
  };

  const submit = async () => {
    if (inFlight.current) return;
    setTouched(true);
    if (error) return;

    inFlight.current = true;
    setSubmitting(true);
    setFormError(undefined);
    try {
      const response = await authApi.login({ login_id: values.login_id.trim(), password: values.password });
      await tokenStorage.save(response);
      router.replace(response.user?.role === 'WORKER' ? routes.workerDashboard : routes.home);
    } catch (caught) {
      const apiError = toApiError(caught);
      if (apiError.code === 'ACCOUNT_NOT_FOUND') {
        router.push({ pathname: routes.noAccount });
      } else {
        setFormError(apiError.message);
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return { values, error, formError, submitting, setLoginId, setPassword, submit };
}
