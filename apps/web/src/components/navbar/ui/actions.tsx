import { Moon } from 'lucide-react';

export function NavbarActions() {
  return (
    <button
      type="button"
      className="focus:outline-ring text-muted-foreground hover:text-navbar-accent-foreground relative rounded-full p-1 focus:outline-2 focus:outline-offset-2"
    >
      <span className="absolute -inset-1.5" />
      <span className="sr-only">Activer/désactiver le mode sombre</span>
      <Moon aria-hidden="true" className="size-6" />
    </button>
  );
}
