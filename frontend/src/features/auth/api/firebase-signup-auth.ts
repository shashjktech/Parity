import { env } from '@/config/env';
import type { ConfirmationResult } from '@react-native-firebase/auth';

const MOCK_OTP = '123456';
const EXPIRY_SEC = 60;
const RESEND_SEC = 30;

let confirmation: ConfirmationResult | undefined;
let activePhone: string | undefined;

async function getFirebaseAuth() {
  return import('@react-native-firebase/auth');
}

export type PhoneVerificationResult = {
  firebaseUid: string;
  firebaseIdToken: string;
};


export type PhoneVerificationSession = {
  requestId: 'firebase';
  expiresInSec: number;
  resendInSec: number;
};

export async function startPhoneVerification(phone: string): Promise<PhoneVerificationSession> {
  activePhone = phone;

  if (!env.useMockOtp) {
    const { getAuth, signInWithPhoneNumber } = await getFirebaseAuth();
    confirmation = await signInWithPhoneNumber(getAuth(), phone);
  }

  return { requestId: 'firebase', expiresInSec: EXPIRY_SEC, resendInSec: RESEND_SEC };
}

export async function resendPhoneVerification(): Promise<PhoneVerificationSession> {
  if (!activePhone) {
    throw new Error('Verification session expired. Please enter your phone number again.');
  }

  if (!env.useMockOtp) {
    const { getAuth, signInWithPhoneNumber } = await getFirebaseAuth();
    confirmation = await signInWithPhoneNumber(getAuth(), activePhone);
  }

  return { requestId: 'firebase', expiresInSec: EXPIRY_SEC, resendInSec: RESEND_SEC };
}

export async function confirmPhoneVerification(otp: string): Promise<PhoneVerificationResult> {
  if (env.useMockOtp) {
    if (otp !== MOCK_OTP) {
      throw new Error('Incorrect code. Please try again.');
    }
    clearVerificationSession();
    return {
      firebaseUid: 'mock-firebase-uid',
      firebaseIdToken: 'mock-firebase-id-token',
    };
  }

  if (!confirmation) {
    throw new Error('Verification session expired. Please request a new code.');
  }

  const credential = await confirmation.confirm(otp);
  const firebaseUser = credential.user;
  const firebaseIdToken = await credential.user.getIdToken();

  clearVerificationSession();
  return {
    firebaseUid: firebaseUser.uid,
    firebaseIdToken,
  };
}

export function clearVerificationSession(): void {
  confirmation = undefined;
  activePhone = undefined;
}