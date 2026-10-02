export class ApiError extends Error {
  readonly status: number; // 0 = no response (network / timeout)
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    code: string,
    message: string,
    extras: { fieldErrors?: Record<string, string>; details?: Record<string, unknown> } = {},
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = extras.fieldErrors;
    this.details = extras.details;
  }
}

export function toApiError(error: unknown): ApiError {
  console.error('RAW ERROR:', JSON.stringify(error), error);
  if (error instanceof ApiError) return error;
  return new ApiError(0, 'UNKNOWN', 'Something went wrong. Please try again.');
}