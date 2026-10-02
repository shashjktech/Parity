import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type { PropertyValues } from '@/features/property-setup/types/property-types';

const INITIAL_PROPERTY: PropertyValues = {
  name: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  countryCode: 'IN',
  stateCode: '',
  pincode: '',
  latitude: '',
  longitude: '',
};

type PropertyContextValue = {
  state: PropertyValues;
  updateProperty: (values: Partial<PropertyValues>) => void;
  setField: (field: keyof PropertyValues, value: string) => void;
  resetProperty: () => void;
};

const PropertyContext = createContext<PropertyContextValue | undefined>(
  undefined,
);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(INITIAL_PROPERTY);

  const updateProperty = useCallback((values: Partial<PropertyValues>) => {
    setState((previous) => ({ ...previous, ...values }));
  }, []);

  const setField = useCallback(
    (field: keyof PropertyValues, value: string) => {
      setState((previous) => ({ ...previous, [field]: value }));
    },
    [],
  );

  const resetProperty = useCallback(() => {
    setState({ ...INITIAL_PROPERTY });
  }, []);

  const value = useMemo(
    () => ({ state, updateProperty, setField, resetProperty }),
    [state, updateProperty, setField, resetProperty],
  );

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertySetup() {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error('usePropertySetup must be used inside PropertyProvider');
  }

  return context;
}