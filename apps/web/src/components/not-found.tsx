import { useRouter } from '@tanstack/react-router';

import { Button } from './ui/button.tsx';

interface NotFoundProps {
  title?: string;
  message?: string;
}

export function NotFound({
  title = 'Page not found',
  message = 'The page you are looking for does not exist.',
}: NotFoundProps) {
  const router = useRouter();

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <p className="text-muted-foreground mt-2 text-sm">{message}</p>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => window.history.back()}>Go back</Button>

        <Button variant="outline" onClick={() => router.navigate({ to: '/' })}>
          Back to games
        </Button>
      </div>
    </div>
  );
}
