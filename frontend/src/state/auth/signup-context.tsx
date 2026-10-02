import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

import type {
    RegistrationDraft,
    SignupValues,
    UserRole,
} from '@/features/auth/types/auth-types';

const INITIAL_REGISTRATION: RegistrationDraft = {
  role: null,

  firstName: '',
  lastName: '',
  email: '',
  countryIso: 'IN',
  phone: '',
  password: '',

  propertyCode: '',
};

type RegistrationContextValue = {
  state: RegistrationDraft;

  updateRole: (role: UserRole) => void;
  updateAccount: (values: SignupValues) => void;
  updatePropertyCode: (propertyCode: string) => void;

  resetRegistration: () => void;
};

const RegistrationContext =
  createContext<RegistrationContextValue | undefined>(undefined);

export function RegistrationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<RegistrationDraft>(
    INITIAL_REGISTRATION,
  );

  const updateRole = useCallback((role: UserRole) => {
    setState((prev) => ({
      ...prev,
      role,
    }));
  }, []);

  const updateAccount = useCallback((values: SignupValues) => {
    setState((prev) => ({
      ...prev,
      ...values,
    }));
  }, []);

  const updatePropertyCode = useCallback((propertyCode: string) => {
    setState((prev) => ({
      ...prev,
      propertyCode,
    }));
  }, []);

  const resetRegistration = useCallback(() => {
    setState(INITIAL_REGISTRATION);
  }, []);

  const value = useMemo(
    () => ({
      state,
      updateRole,
      updateAccount,
      updatePropertyCode,
      resetRegistration,
    }),
    [
      state,
      updateRole,
      updateAccount,
      updatePropertyCode,
      resetRegistration,
    ],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);

  if (!context) {
    throw new Error(
      'useRegistration must be used inside RegistrationProvider',
    );
  }

  return context;
}