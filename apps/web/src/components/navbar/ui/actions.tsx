import { useRouteContext, useRouter } from '@tanstack/react-router';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

import { setThemeServFn } from '@/lib/theme.ts';

export function NavbarActions() {
  const themes = ['light', 'dark', 'system'] as const;
  const { theme } = useRouteContext({ from: '__root__' });
  const router = useRouter();
  const currentIndex = themes.findIndex((t) => t === theme);
  const nextTheme =
    themes[(currentIndex === -1 ? 0 : currentIndex + 1) % themes.length] ?? 'system';

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

  // Sync theme value to DOM on mount and when theme changes
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
      <span className="sr-only">Toggle dark mode</span>
      {nextTheme === 'dark' ? (
        <Sun aria-hidden="true" className="size-6" />
      ) : nextTheme === 'light' ? (
        <Moon aria-hidden="true" className="size-6" />
      ) : (
        <Monitor aria-hidden="true" className="size-6" />
      )}
    </button>
  );
}
