import { ApiError } from '@only-must/shared';
import axios, { isAxiosError } from 'axios';

const apiUrl = import.meta.env['VITE_API_URL'];

if (!apiUrl || apiUrl.trim() === '') {
  throw new Error('VITE_API_URL environment variable is required but not configured');
}

export const apiClient = axios.create({
  baseURL: apiUrl,
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const payload = isAxiosError(error) ? error.response?.data : undefined;

    const message =
      typeof payload?.message === 'string' && payload.message.trim() !== ''
        ? payload.message
        : String(payload?.code ?? 'UNKNOWN');

    const statusCode: number = isAxiosError(error) ? (error.response?.status ?? 0) : 0;

    return Promise.reject(new ApiError(message, statusCode));
  },
);
