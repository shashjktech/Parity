export type SignupField = 'firstName' | 'lastName' | 'email' | 'phone' | 'password' | 'propertyCode';
export type SignupValues = {
  firstName: string;
  lastName: string;
  email: string;
  countryIso: string;
  phone: string;
  password: string
};
export type UserRole = 'OWNER' | 'WORKER';

// temporary draft to save all the values of the signup form before sending to the backend
export type RegistrationDraft = SignupValues & {
  role: UserRole | null;
  propertyCode: string;

};

export type SignupErrors = Partial<Record<SignupField, string>>;

export type LoginValues = { login_id: string; password: string };
export type LoginPayload = { login_id: string; password: string };

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  property_code?: string;
};
//Final payload to send to the backend for registration
export type RegisterPayload = SignupPayload & { firebaseIdToken: string };

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
};


export type OtpSessionResponse = { requestId: string; expiresInSec: number; resendInSec: number };
export type VerifyOtpResponse = AuthResponse;
export type VerifyOtpPayload = { requestId: string; otp: string };
export interface AuthApi {
  register(payload: RegisterPayload): Promise<AuthResponse>;
  login(payload: LoginPayload): Promise<AuthResponse>;

  // for backend OTP verification
  verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse>;
  resendOtp(requestId: string): Promise<OtpSessionResponse>;
}
