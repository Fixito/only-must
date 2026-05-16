import { Link } from '@tanstack/react-router';

import { TableCell, TableRow } from '@/components/ui/table.tsx';
import { ScoreBadge } from '@/features/games/components/score-badge.tsx';
import { formatDuration } from '@/lib/time';

interface GameListRowProps {
  game: {
    id: string;
    slug: string;
    title: string;
    releaseDate: string | null;
    metaScore: number;
    heroImage: string;
    durations: { mainStorySeconds: number | null } | null;
  };
  index: number;
  showDuration?: boolean;
}

export function GameListRow({ game, index, showDuration = false }: GameListRowProps) {
  const { slug, title, heroImage, releaseDate, metaScore, durations } = game;
  const playtime = formatDuration(durations?.mainStorySeconds ?? null);

  return (
    <TableRow className="hover:bg-accent relative">
      {/* Rank */}
      <TableCell className="text-muted-foreground w-8 text-right tabular-nums">
        {index + 1}
      </TableCell>

      {/* Cover */}
      <TableCell className="w-10">
        <img
          src={heroImage}
          alt={title}
          className="h-10 w-10 rounded-sm object-cover"
          loading="lazy"
        />
      </TableCell>

      {/* Title */}
      <TableCell className="font-medium">
        <Link
          to="/games/$slug"
          params={{ slug }}
          className="line-clamp-1 focus-visible:outline-none"
          preload="intent"
        >
          {title}
          <span aria-hidden="true" className="absolute inset-0 z-10" />
        </Link>
      </TableCell>

      {/* Score */}
      <TableCell className="w-12">
        <ScoreBadge score={metaScore} size="sm" />
      </TableCell>

      {/* Year */}
      <TableCell className="text-muted-foreground w-14 text-right tabular-nums">
        <time dateTime={releaseDate ?? undefined}>
          {releaseDate ? new Date(releaseDate).getFullYear() : '—'}
        </time>
      </TableCell>

      {/* Playtime */}
      {showDuration && (
        <TableCell className="text-muted-foreground w-16 text-right tabular-nums">
          {playtime ?? '—'}
        </TableCell>
      )}
    </TableRow>
  );
}
