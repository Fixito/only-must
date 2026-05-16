import { ApiError, ProblemDetailsSchema } from '@only-must/shared';
import axios, { isAxiosError } from 'axios';

const apiUrl = import.meta.env['VITE_API_URL'];

if (!apiUrl || apiUrl.trim() === '') {
  throw new Error('VITE_API_URL environment variable is required but not configured');
}

// oxlint-disable-next-line import/no-named-as-default-member
export const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const rawPayload = isAxiosError(error) ? error.response?.data : undefined;
    const parsed = ProblemDetailsSchema.safeParse(rawPayload);

    const message = parsed.success && parsed.data.detail ? parsed.data.detail : 'UNKNOWN';
    const statusCode: number = isAxiosError(error) ? (error.response?.status ?? 0) : 0;

    return Promise.reject(new ApiError(message, statusCode));
  },
);
