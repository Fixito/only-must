import { TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { GameListRow } from '@/features/games/components/game-list-row.tsx';

interface Game {
  id: string;
  slug: string;
  title: string;
  releaseDate: string | null;
  metaScore: number;
  heroImage: string;
  durations: { mainStorySeconds: number | null } | null;
}

interface GameListProps {
  games: Array<Game>;
  pageOffset?: number;
  showDuration?: boolean;
}

export function GameList({ games, pageOffset = 0, showDuration = false }: GameListProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full caption-bottom text-xs">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-8" />
            <TableHead className="w-10" />
            <TableHead>Title</TableHead>
            <TableHead className="w-12">Score</TableHead>
            <TableHead className="w-14 text-right">Year</TableHead>
            {showDuration && <TableHead className="w-16 text-right">Playtime</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, i) => (
            <GameListRow
              key={game.id}
              game={game}
              index={pageOffset + i}
              showDuration={showDuration}
            />
          ))}
        </TableBody>
      </table>
    </div>
  );
}
