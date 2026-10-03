export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'ACTION_REQUIRED';

export type OwnerProperty = {
  id: string;
  owner_id: string;
  name: string;
  address: string | null;
  timezone: string | null;
  verification_status: VerificationStatus;
  subscription_plan_id: string | null;
  created_at: string;
};