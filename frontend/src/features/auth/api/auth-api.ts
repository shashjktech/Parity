import { env } from '@/config/env';
import { request } from '@/services/http/http-client';
import type { AuthApi, OtpSessionResponse, UserRole, VerifyOtpResponse } from '../types/auth-types';
import { mockAuthApi } from './auth-api.mock';

// type BackendLoginResponse = {
//   access_token: string;
//   refresh_token: string;
//   role: string;
//   user_id: string;
// };

type BackendAuthResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: UserRole;
  };
};


const realAuthApi: AuthApi = {
  register: async (payload) => {
    const response = await request<BackendAuthResponse>('/v1/auth/signup', { method: 'POST', body: payload });
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: response.user
    };
  },
  login: async (payload) => {
    const response = await request<BackendAuthResponse>('/v1/auth/login', { method: 'POST', body: payload });
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      user: response.user
    };
  },
  verifyOtp: (payload) => request<VerifyOtpResponse>('/v1/auth/otp/verify', { method: 'POST', body: payload }),
  resendOtp: (requestId) => request<OtpSessionResponse>('/v1/auth/otp/resend', { method: 'POST', body: { requestId } }),
};


export const authApi: AuthApi = env.useMockApi ? mockAuthApi : realAuthApi;
