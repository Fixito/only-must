import { ApiError, ProblemDetailsSchema } from '@only-must/shared';
import axios, { isAxiosError } from 'axios';

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
    const rawPayload = isAxiosError(error) ? error.response?.data : undefined;
    const parsed = ProblemDetailsSchema.safeParse(rawPayload);

    let message = 'UNKNOWN';
    if (parsed.success && parsed.data.detail) {
      message = parsed.data.detail;
    } else if (typeof rawPayload === 'string') {
      message = rawPayload;
    } else if (rawPayload && typeof rawPayload === 'object' && 'message' in rawPayload && typeof rawPayload.message === 'string') {
      message = rawPayload.message;
    } else if (error instanceof Error && error.message) {
      message = error.message;
    } else if (rawPayload !== undefined) {
      message = JSON.stringify(rawPayload);
    }

    const statusCode: number = isAxiosError(error) ? (error.response?.status ?? 0) : 0;

    return Promise.reject(new ApiError(message, statusCode));
  },
);
