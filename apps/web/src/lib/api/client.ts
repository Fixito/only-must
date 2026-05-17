import { ApiError, ProblemDetailsSchema } from '@only-must/shared';
import axios, { isAxiosError } from 'axios';

import { NetworkError } from './errors.js';

const apiUrl = import.meta.env['VITE_API_URL'] || '';

// oxlint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.request.use((config) => {
  if (!apiUrl || apiUrl.trim() === '') {
    throw new Error('VITE_API_URL environment variable is required but not configured');
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    // No response → network failure (timeout, DNS, offline)
    if (!isAxiosError(error) || !error.response) {
      const message = error instanceof Error ? error.message : 'Network error';
      return Promise.reject(new NetworkError(message));
    }

    // API responded with an error HTTP status
    const rawPayload: unknown = error.response.data;
    const parsed = ProblemDetailsSchema.safeParse(rawPayload);

    let message = 'UNKNOWN';
    if (parsed.success && parsed.data.detail) {
      message = parsed.data.detail;
    } else if (typeof rawPayload === 'string') {
      message = rawPayload;
    } else if (
      rawPayload &&
      typeof rawPayload === 'object' &&
      'message' in rawPayload &&
      typeof rawPayload.message === 'string'
    ) {
      message = rawPayload.message;
    } else if (rawPayload !== undefined) {
      message = JSON.stringify(rawPayload);
    }

    return Promise.reject(new ApiError(message, error.response.status));
  },
);
