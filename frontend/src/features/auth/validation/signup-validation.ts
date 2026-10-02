import { getCountry } from '../constants/countries';
import type { RegistrationDraft, SignupErrors, SignupField } from '../types/auth-types';
import { digitsOnly } from '../utils/phone';

export const FIELD_ORDER: SignupField[] = ['firstName', 'lastName', 'email', 'phone', 'password', 'propertyCode'];

const NAME_BAD_CHARS = /[\d!@#$%^&*()_+=[\]{};:"\\|,<>/?~`]/;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const normalizeName = (v: string) => v.trim().replace(/\s+/g, ' ');

function validateName(label: string, raw: string): string | undefined {
  const v = normalizeName(raw);
  if (!v) return `${label} is required`;
  if (v.length < 2) return `${label} must be at least 2 characters`;
  if (v.length > 50) return `${label} must be 50 characters or fewer`;
  if (NAME_BAD_CHARS.test(v)) return `Enter a valid ${label.toLowerCase()}`;
  return undefined;
}

function validateEmail(raw: string): string | undefined {
  const v = raw.trim();
  if (!v) return 'Email is required';
  if (v.length > 254 || !EMAIL_PATTERN.test(v) || v.includes('..')) return 'Enter a valid email address';
  return undefined;
}

function validatePhone(iso: string, raw: string): string | undefined {
  const country = getCountry(iso);
  const digits = digitsOnly(raw);
  if (!digits) return 'Phone number is required';
  if (!country.pattern.test(digits)) return `Enter a valid ${country.maxDigits}-digit mobile number`;
  return undefined;
}

function validatePassword(raw: string): string | undefined {
  if (!raw) return 'Password is required';
  if (raw.length < 8) return 'Password must be at least 8 characters';
  if (raw.length > 16) return 'Password must be 16 characters or fewer';
  if (!/[A-Z]/.test(raw)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(raw)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(raw)) return 'Password must contain at least one number';
  // if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(raw)) return 'Password must contain at least one special character';
  return undefined;
}

function validatePropertyCode(raw:string): string | undefined {
  if (!raw.trim()) return 'Property code is required';
  if (raw.trim().length !== 6) return 'Property code must be 6 characters';
  return undefined;
}

export function validateSignup(v: RegistrationDraft): SignupErrors {
  return {
    firstName: validateName('First name', v.firstName),
    lastName: validateName('Last name', v.lastName),
    email: validateEmail(v.email),
    phone: validatePhone(v.countryIso, v.phone),
    password: validatePassword(v.password),
    propertyCode: v.role === 'worker' ? validatePropertyCode(v.propertyCode) : undefined,
  };
}

export const hasErrors = (e: SignupErrors) => Object.values(e).some(Boolean);
export const firstInvalidField = (e: SignupErrors) => FIELD_ORDER.find((f) => e[f]);
