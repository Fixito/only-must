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
    const status: number = isAxiosError(error) ? (error.response?.status ?? 0) : 0;
    const code: string = isAxiosError(error)
      ? String(error.response?.data?.code ?? 'UNKNOWN')
      : 'UNKNOWN';

    return Promise.reject(new ApiError(code, status));
  },
);
