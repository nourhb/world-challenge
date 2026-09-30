import { useQuery } from '@tanstack/react-query';
import { GameMode, GameType } from '@world-challenge/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { CHALLENGE_GAME_TYPES, GAME_META } from '../../features/games/game-meta';
import { createSession, getDiscoverUsers } from '../../services/api';

export function DiscoverPage() {
  const [search, setSearch] = useState('');
  const [gameType, setGameType] = useState<GameType>(GameType.CULTURE_CODE);
  const navigate = useNavigate();
  const usersQuery = useQuery({
    queryKey: ['discover', search],
    queryFn: () => getDiscoverUsers(search || undefined),
  });

  async function challenge(userId: string): Promise<void> {
    const session = await createSession({
      gameType,
      mode: GameMode.DUEL,
      invitedUserId: userId,
    });
    navigate(`/games/${session.id}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        Discover
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">Players</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist">
        Real accounts from the database. Emails stay private. Pick a live mode, then challenge.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search username or country"
          className="w-full max-w-md rounded-2xl border border-white/10 bg-void px-4 py-3"
        />
        <select
          value={gameType}
          onChange={(event) => setGameType(event.target.value as GameType)}
          className="rounded-2xl border border-white/10 bg-void px-4 py-3 text-sm"
        >
          {CHALLENGE_GAME_TYPES.map((type) => (
            <option key={type} value={type}>
              {GAME_META[type].tag} · {type.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {usersQuery.isPending ? (
        <div className="mt-6">
          <PageState title="Loading" body="Fetching players from the API…" />
        </div>
      ) : usersQuery.isError ? (
        <div className="mt-6">
          <PageState title="Error" body="Players could not be loaded." />
        </div>
      ) : usersQuery.data.items.length === 0 ? (
        <div className="mt-6">
          <PageState
            title="Empty lobby"
            body="No other players yet. Register a second account or use the Nour / Alex demo users."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {usersQuery.data.items.map((player) => (
            <article
              key={player.id}
              className="rounded-[24px] border border-white/10 bg-panel/80 p-5"
            >
              <p className="font-display text-xl font-bold">{player.username}</p>
              <p className="mt-1 text-sm text-mist">
                {player.country.flagEmoji} {player.country.name} · {player.rankTitle} · Lv{' '}
                {player.level} · {player.xp} XP
              </p>
              <p className="mt-3 text-sm text-mist">{player.bio ?? 'No bio yet.'}</p>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/users/${player.id}`}
                  className="rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => void challenge(player.id)}
                  className="rounded-xl bg-cyan px-3 py-2 text-sm font-bold uppercase tracking-wide text-void"
                >
                  Challenge
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
