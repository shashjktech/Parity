export type WorkerProperty = {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  address: string;
  verification_status:
    | 'PENDING'
    | 'VERIFIED'
    | 'ACTION_REQUIRED';
  
};

export type WorkerDashboardData = {
  workerId: string;
  workerName: string;
  property: WorkerProperty | null;
};