import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';

import { routes } from '@/constants/routes';
import { toApiError } from '@/services/http/api-error';
import { startPhoneVerification } from '../api/firebase-signup-auth';
import { DEFAULT_COUNTRY, getCountry } from '../constants/countries';
import type { SignupErrors, SignupField, SignupValues } from '../types/auth-types';
import { sanitizePhone, toE164 } from '../utils/phone';
import { useRegistration } from '@/state/auth/signup-context';
import { FIELD_ORDER, firstInvalidField, validateSignup } from '../validation/signup-validation';


const INITIAL: SignupValues = { firstName: '', lastName: '', email: '', countryIso: DEFAULT_COUNTRY.iso, phone: '', password: '' };

export function useSignupForm(options: { onInvalidField?: (field: SignupField) => void } = {}) {
  const router = useRouter();
  const { state: registrationDraft, updateAccount } = useRegistration();

  const [values, setValues] = useState<SignupValues>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<SignupField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<SignupErrors>({});
  const [formError, setFormError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const inFlight = useRef(false);

  const clientErrors = useMemo(
    () => validateSignup({ ...registrationDraft, ...values }),
    [registrationDraft, values],
  );

  const errors = useMemo(() => {
    const out: SignupErrors = {};
    for (const f of FIELD_ORDER) out[f] = (touched[f] ? clientErrors[f] : undefined) ?? serverErrors[f];
    return out;
  }, [clientErrors, touched, serverErrors]);

  const clearServer = (field: SignupField) => {
    setServerErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    setFormError(undefined);
  };

  const setField = (field: SignupField, text: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: field === 'phone' ? sanitizePhone(text, getCountry(prev.countryIso)) : text,
    }));
    clearServer(field);
  };

  const setCountry = (iso: string) => {
    setValues((prev) => ({ ...prev, countryIso: iso, phone: sanitizePhone(prev.phone, getCountry(iso)) }));
    clearServer('phone');
  };

  const markTouched = (field: SignupField) => setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  const submit = async () => {
    if (inFlight.current) return;
    setTouched({ 
      firstName: true, 
      lastName: true, 
      email: true, 
      phone: true, 
      password: true,
       ...(registrationDraft.role === 'worker' ? { propertyCode: true } : {}),
     });

    const invalid = firstInvalidField(clientErrors);
    if (invalid) {
      options.onInvalidField?.(invalid);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setFormError(undefined);
    try {
      updateAccount(values);

      const phone = toE164(getCountry(values.countryIso), values.phone);
      const response = await startPhoneVerification(phone);

      router.push({
        pathname: routes.verifyOtp,
        params: {
          requestId: response.requestId,
          phone,
          expiresInSec: String(response.expiresInSec),
          resendInSec: String(response.resendInSec),
        },
      });
    } catch (e) {
      const err = toApiError(e);
      if (err.fieldErrors) {
        const mapped: SignupErrors = {};
        for (const f of FIELD_ORDER) if (err.fieldErrors[f]) mapped[f] = err.fieldErrors[f];
        setServerErrors(mapped);
        const first = FIELD_ORDER.find((f) => mapped[f]);
        if (first) options.onInvalidField?.(first);
        else setFormError(err.message);
      } else {
        setFormError(err.message);
      }
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return { values, errors, formError, submitting, setField, setCountry, markTouched, submit };
}
