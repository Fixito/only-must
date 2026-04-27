import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { setThemeServFn } from '@/lib/theme.ts';

export function NavbarActions() {
  const { theme } = useRouteContext({ from: '__root__' });
  const router = useRouter();

  // SSR-friendly: always render an icon using the loader theme for SSR, then sync with system preference on mount if needed
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark' | 'system'>(theme);

  useEffect(() => {
    if (theme === 'system') {
      setEffectiveTheme(
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
    } else {
      setEffectiveTheme(theme === 'dark' ? 'dark' : 'light');
    }
  }, [theme]);

  let nextTheme: 'light' | 'dark';
  if (effectiveTheme === 'system') {
    // On SSR, propose dark par défaut (ou light, selon préférence)
    nextTheme = 'dark';
  } else {
    nextTheme = effectiveTheme === 'dark' ? 'light' : 'dark';
  }

  const toggleTheme = () => {
    setThemeServFn({ data: nextTheme })
      .then(() => router.invalidate())
      .catch((_error) => {
        // Revert DOM to match current theme on error
        const html = document.documentElement;
        html.classList.remove('dark', 'auto');
        html.style.colorScheme = '';

        if (theme === 'dark') {
          html.classList.add('dark');
          html.style.colorScheme = 'dark';
        } else if (theme === 'light') {
          html.style.colorScheme = 'light';
        } else {
          html.classList.add('auto');
          html.style.colorScheme = 'light dark';
        }
      });
  };

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark', 'auto');
    html.style.colorScheme = '';

    if (theme === 'dark') {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else if (theme === 'light') {
      html.style.colorScheme = 'light';
    } else {
      html.classList.add('auto');
      html.style.colorScheme = 'light dark';
    }
  }, [theme]);

  return (
    <button
      type="button"
      className="focus:outline-ring text-muted-foreground hover:text-navbar-accent-foreground relative rounded-full p-1 focus:outline-2 focus:outline-offset-2"
      onClick={toggleTheme}
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">
        {effectiveTheme === 'dark'
          ? 'Switch to light mode'
          : effectiveTheme === 'light'
            ? 'Switch to dark mode'
            : 'Switch theme'}
      </span>
      {effectiveTheme === 'system' ? (
        <Monitor aria-hidden="true" className="size-6" />
      ) : nextTheme === 'light' ? (
        <Sun aria-hidden="true" className="size-6" />
      ) : (
        <Moon aria-hidden="true" className="size-6" />
      )}
    </button>
  );
}
