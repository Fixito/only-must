import { createFileRoute } from '@tanstack/react-router';

import { Badge } from '@/components/ui/badge.tsx';
import { gameQueryOptions } from '@/features/games/use-games.ts';
import { formatdate } from '@/lib/date.ts';
import { queryClient } from '@/router.tsx';

export const Route = createFileRoute('/games/$slug')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(gameQueryOptions(params.slug)),
});

function RouteComponent() {
  const {
    data: { title, platforms, releaseDate, description, genres, developers, metaScore },
  } = Route.useLoaderData();

  const formatter = new Intl.ListFormat('en', { type: 'conjunction' });
  const formattedPlatforms = formatter.format(platforms.map((p) => p.name));

  return (
    <>
      <div className="container py-12">
        <h1 className="text-4xl font-semibold">{title}</h1>

        <div className="mbs-4 w-max space-y-4">
          <div className="bg-muted text-muted-foreground p-4">
            <p>
              <strong className="text-foreground font-semibold">Platforms:</strong>{' '}
              {formattedPlatforms}
            </p>

            <p>
              <strong className="text-foreground font-semibold">Initial release date:</strong>{' '}
              {releaseDate ? formatdate(releaseDate) : 'Unknown'}
            </p>
          </div>

          <div className="bg-muted text-muted-foreground p-4">
            <p>
            <p>
              <strong className="text-foreground font-semibold">
                {developers.length > 1 ? 'Developers:' : 'Developer:'}
              </strong>{' '}
              {developers.length > 0
                ? formatter.format(developers.map((d) => d.name))
                : 'Unknown'}
            </p>
          </div>

          <div className="bg-muted text-muted-foreground flex flex-wrap items-center gap-2 p-4">
            <strong className="text-foreground font-semibold">Genres:</strong>
            {genres.map((g) => (
              <Badge key={g.id} className="text-xs">
                {g.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mbs-4">
          <h2 className="font-semibold tracking-widest uppercase">Metascore</h2>

          <div className="mbs-4 flex gap-4">
            <img
              src="/must-play.svg"
              alt="must-play"
              loading="lazy"
              className="aspect-square w-16 object-cover"
            />

            <span className="inline-flex aspect-square w-16 items-center justify-center rounded-md bg-green-900 px-1 text-3xl font-semibold text-white">
              {metaScore}
            </span>
          </div>
        </div>

        <div className="mbs-12">
          <h2 className="text-2xl font-semibold">Summary</h2>

          <p className="text-muted-foreground mbs-4">{description}</p>
        </div>
      </div>
    </>
  );
}
