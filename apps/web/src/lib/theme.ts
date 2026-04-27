import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';

const storageKey = 'theme';

export const getThemeServFn = createServerFn().handler(() => getCookie(storageKey) ?? 'auto');

export const toggleTheme = () => {
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  const next = isDark ? 'light' : 'dark';
  root.classList.remove('light', 'dark');
  root.classList.add(next);
  root.style.colorScheme = next;
  document.cookie = `theme=${next};path=/;max-age=31536000;SameSite=Lax`;
};
