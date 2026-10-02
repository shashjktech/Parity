import { ApiError } from '@/services/http/api-error';
import type { AuthApi, AuthUser, RegisterPayload } from '../types/auth-types';

const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const MOCK_OTP = '123456';
const MAX_ATTEMPTS = 5;
const EXPIRY_SEC = 60;
const RESEND_SEC = 30;
const DEMO_PHONE = '+919876543210';
const DEMO_EMAIL = 'demo@example.com';
const DEMO_PASSWORD = 'password123';

const sessions = new Map<string, { payload: RegisterPayload; expiresAt: number; attempts: number }>();
const session = (requestId: string) => ({ requestId, expiresInSec: EXPIRY_SEC, resendInSec: RESEND_SEC });
const authResponse = (user: AuthUser) => ({
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user,
});

export const mockAuthApi: AuthApi = {
  async register(payload) {
    console.log('Mock signup payload:', JSON.stringify(payload, null, 2));

    await wait();
    if (payload.email === 'taken@example.com') {
      throw new ApiError(409, 'EMAIL_TAKEN', 'This email is already registered.', {
        fieldErrors: { email: 'This email is already registered' },
      });
    }
    return authResponse({
      id: 'mock-user',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    });
  },

  async login(payload) {
    await wait();
    if ((payload.login_id !== DEMO_EMAIL && payload.login_id !== DEMO_PHONE) || payload.password !== DEMO_PASSWORD) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'The email or phone number and password do not match.');
    }
    return authResponse({
      id: 'mock-user',
      firstName: 'Demo',
      lastName: 'User',
      email: DEMO_EMAIL,
      phone: DEMO_PHONE,
      role: 'owner',
    });
  },

  async verifyOtp({ requestId, otp }) {
    await wait();
    const current = sessions.get(requestId);
    if (!current) throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session expired. Please sign up again.');
    if (current.attempts >= MAX_ATTEMPTS) throw new ApiError(429, 'OTP_LOCKED', 'Too many attempts. Please request a new code.');
    if (Date.now() > current.expiresAt) throw new ApiError(410, 'OTP_EXPIRED', 'This code has expired. Please request a new one.');
    if (otp !== MOCK_OTP) {
      current.attempts += 1;
      throw new ApiError(400, 'OTP_INVALID', 'Incorrect code.', { details: { attemptsLeft: MAX_ATTEMPTS - current.attempts } });
    }
    return authResponse({
      id: 'mock-user',
      firstName: current.payload.firstName,
      lastName: current.payload.lastName,
      email: current.payload.email,
      phone: current.payload.phone,
      role: current.payload.role,
    });
  },

  async resendOtp(requestId) {
    await wait();
    const current = sessions.get(requestId);
    if (!current) throw new ApiError(404, 'SESSION_NOT_FOUND', 'Session expired. Please sign up again.');
    current.expiresAt = Date.now() + EXPIRY_SEC * 1000;
    current.attempts = 0;
    return session(requestId);
  },
};
