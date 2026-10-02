export type Country = { iso: string; name: string; dial: string; maxDigits: number; pattern: RegExp };

export const COUNTRIES: readonly Country[] = [
  { iso: 'IN', name: 'India', dial: '+91', maxDigits: 10, pattern: /^[6-9]\d{9}$/ },
  { iso: 'US', name: 'United States', dial: '+1', maxDigits: 10, pattern: /^[2-9]\d{9}$/ },
  { iso: 'GB', name: 'United Kingdom', dial: '+44', maxDigits: 10, pattern: /^7\d{9}$/ },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971', maxDigits: 9, pattern: /^5\d{8}$/ },
  { iso: 'SG', name: 'Singapore', dial: '+65', maxDigits: 8, pattern: /^[89]\d{7}$/ },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];
export const getCountry = (iso: string): Country => COUNTRIES.find((c) => c.iso === iso) ?? DEFAULT_COUNTRY;
