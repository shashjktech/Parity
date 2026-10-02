export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
  /** Mock API stays ON unless EXPO_PUBLIC_USE_MOCK_API=false. */
  useMockApi: process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false',
  /** Mock phone verification stays ON unless EXPO_PUBLIC_USE_MOCK_OTP=false. */
  useMockOtp: process.env.EXPO_PUBLIC_USE_MOCK_OTP !== 'false',
  termsUrl: process.env.EXPO_PUBLIC_TERMS_URL ?? 'https://example.com/terms',
  privacyUrl: process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://example.com/privacy',
} as const;
