import { useQuery } from '@tanstack/react-query';
import { rankTitle } from '@world-challenge/shared';
import { Link } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { getLeaderboard } from '../../services/api';

export function LeaderboardPage() {
  const boardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboard,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        Global board
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">Ranks</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist">
        Live XP from finished matches. Rank titles are earned, not assigned.
      </p>

      {boardQuery.isPending ? (
        <div className="mt-6">
          <PageState title="Loading" body="Reading the XP table…" />
        </div>
      ) : boardQuery.isError ? (
        <div className="mt-6">
          <PageState title="Error" body="Ranks could not be loaded." />
        </div>
      ) : boardQuery.data.items.length === 0 ? (
        <div className="mt-6">
          <PageState title="Empty" body="No pilots on the board yet." />
        </div>
      ) : (
        <ol className="mt-6 space-y-2">
          {boardQuery.data.items.map((entry) => (
            <li key={entry.id}>
              <Link
                to={`/users/${entry.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-panel/80 px-4 py-3 hover:border-cyan/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-8 font-display text-lg font-extrabold text-gold">
                    {entry.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display font-bold">{entry.username}</p>
                    <p className="truncate text-xs uppercase tracking-wider text-mist">
                      {entry.country.flagEmoji} {entry.country.name} · {rankTitle(entry.level)}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-sm text-cyan">
                  Lv {entry.level} · {entry.xp} XP
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
