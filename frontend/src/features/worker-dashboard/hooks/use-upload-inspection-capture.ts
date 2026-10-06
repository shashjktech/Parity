import { useState } from 'react';

import { uploadInspectionCapture } from '../api/inspection-capture-api';
import type { CaptureUploadResult } from '../types/capture-types';

interface CapturePhoto {
  uri: string;
  mimeType?: string;
}

export function useUploadInspectionCapture() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (
    propertyId: string,
    spaceId: string,
    photo: CapturePhoto,
  ): Promise<CaptureUploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadInspectionCapture(
        propertyId,
        spaceId,
        photo,
      );

      return result;
    } catch (cause) {
      const normalizedError =
        cause instanceof Error
          ? cause
          : new Error('Could not upload the photo.');

      setError(normalizedError);

      throw cause;
    } finally {
      setIsUploading(false);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return {
    upload,
    isUploading,
    error,
    resetError,
  };
}