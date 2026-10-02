import { COUNTRIES, type Country } from '../constants/countries';

export const digitsOnly = (s: string) => s.replace(/\D/g, '');

/** Cleans typed/pasted input: drops "+91" prefix and a leading 0, caps the length. */
export function sanitizePhone(input: string, country: Country): string {
  let d = digitsOnly(input);
  const dial = digitsOnly(country.dial);
  if (d.length > country.maxDigits && d.startsWith(dial)) d = d.slice(dial.length);
  if (d.length > country.maxDigits && d.startsWith('0')) d = d.slice(1);
  return d.slice(0, country.maxDigits);
}

export const toE164 = (country: Country, national: string) => `${country.dial}${digitsOnly(national)}`;

/** "+919876543210" -> "+91 98765 43210" */
export function formatPhoneDisplay(e164: string): string {
  const country = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find((c) => e164.startsWith(c.dial));
  if (!country) return e164;
  const national = e164.slice(country.dial.length).replace(/(\d{5})(?=\d)/, '$1 ');
  return `${country.dial} ${national}`;
}
