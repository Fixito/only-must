import { Link } from '@tanstack/react-router';

import { Button } from './ui/button.tsx';

interface NotFoundProps {
  children?: React.ReactNode;
}

export function NotFound({ children }: NotFoundProps) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>

      <p className="flex flex-wrap items-center gap-2">
        <Button onClick={() => window.history.back()}>Go back</Button>

        <Link
          to="/"
          className="rounded-sm bg-cyan-600 px-2 py-1 text-sm font-black text-white uppercase"
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
