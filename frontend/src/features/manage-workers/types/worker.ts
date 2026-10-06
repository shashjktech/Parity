export type WorkerStatus = 'ACTIVE' | 'PENDING';

export type Worker = {
  workerId: string;
  workerFirstName: string;
  workerLastName: string;
  status: WorkerStatus;
  isOnline: boolean;
  createdAt: string;
};