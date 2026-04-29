import axios from 'axios';

const apiUrl = import.meta.env['VITE_API_URL'];

if (!apiUrl || apiUrl.trim() === '') {
  throw new Error('VITE_API_URL environment variable is required but not configured');
}

export const apiClient = axios.create({
  baseURL: apiUrl,
});
