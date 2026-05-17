import { useNavigate, useSearch } from '@tanstack/react-router';

export function useGamesSearch() {
  return useSearch({ from: '/' });
}

export function useGamesNavigate() {
  return useNavigate({ from: '/' });
}
