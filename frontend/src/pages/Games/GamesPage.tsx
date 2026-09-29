import { useQuery } from '@tanstack/react-query';
import { GameMode, GameType } from '@world-challenge/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { GAME_META } from '../../features/games/game-meta';
import { createSession, getGames, getMySessions, joinSession } from '../../services/api';

export function GamesPage() {
  const navigate = useNavigate();
  const [joinId, setJoinId] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [startingType, setStartingType] = useState<string | null>(null);
  const gamesQuery = useQuery({ queryKey: ['games'], queryFn: getGames });
  const sessionsQuery = useQuery({
    queryKey: ['sessions', 'mine'],
    queryFn: getMySessions,
  });

  async function startGame(gameType: GameType, mode: GameMode): Promise<void> {
    setStartingType(`${gameType}:${mode}`);
    try {
      const session = await createSession({ gameType, mode });
      navigate(`/games/${session.id}`);
    } finally {
      setStartingType(null);
    }
  }

  async function joinById(): Promise<void> {
    setJoinError(null);
    try {
      const session = await joinSession(joinId.trim());
      navigate(`/games/${session.id}`);
    } catch (error) {
      setJoinError(error instanceof Error ? error.message : 'Could not join');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        Arena
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">Games</h1>
      <p className="mt-2 max-w-2xl text-sm text-mist">
        Eight live modes. Solo to warm up, 1v1 when you want a stamp from someone
        else’s country. Servers score every answer.
      </p>

      <div className="mt-6 flex max-w-xl gap-2">
        <input
          value={joinId}
          onChange={(event) => setJoinId(event.target.value)}
          placeholder="Paste session id"
          className="flex-1 rounded-2xl border border-white/10 bg-void px-4 py-3"
        />
        <button
          type="button"
          onClick={() => void joinById()}
          className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold"
        >
          Join
        </button>
      </div>
      {joinError ? <p className="mt-2 text-sm text-ember">{joinError}</p> : null}

      <section className="mt-8">
        <h2 className="font-display text-xl font-extrabold uppercase">Catalog</h2>
        {gamesQuery.isPending ? (
          <div className="mt-3">
            <PageState title="Loading" body="Loading games from the API…" />
          </div>
        ) : gamesQuery.isError ? (
          <div className="mt-3">
            <PageState title="Error" body="Game catalog could not be loaded." />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {gamesQuery.data.map((game) => {
              const meta = GAME_META[game.type];
              return (
                <article
                  key={game.id}
                  className="rounded-[24px] border border-white/10 bg-panel/80 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold">{game.name}</h3>
                    <span className="rounded-full border border-cyan/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                      {meta?.intensity ?? 'Live'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-mist">{game.description}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-gold">
                    {meta?.tag ?? game.type} · {game.isActive ? 'Live' : 'Locked'}
                  </p>
                  {game.isActive ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={startingType !== null}
                        onClick={() => void startGame(game.type, GameMode.SOLO)}
                        className="rounded-xl bg-gold px-4 py-2 font-display text-xs font-extrabold uppercase text-void disabled:opacity-50"
                      >
                        {startingType === `${game.type}:${GameMode.SOLO}`
                          ? 'Opening…'
                          : 'Solo'}
                      </button>
                      <button
                        type="button"
                        disabled={startingType !== null}
                        onClick={() => void startGame(game.type, GameMode.DUEL)}
                        className="rounded-xl bg-cyan px-4 py-2 text-xs font-bold uppercase text-void disabled:opacity-50"
                      >
                        {startingType === `${game.type}:${GameMode.DUEL}`
                          ? 'Opening…'
                          : 'Open 1v1'}
                      </button>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-extrabold uppercase">Your rooms</h2>
        {sessionsQuery.data && sessionsQuery.data.length > 0 ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {sessionsQuery.data.map((session) => (
              <Link
                key={session.id}
                to={`/games/${session.id}`}
                className="rounded-[24px] border border-white/10 bg-panel/80 p-5 hover:border-cyan/40"
              >
                <p className="font-display font-bold">{session.gameName}</p>
                <p className="mt-1 text-xs uppercase text-mist">
                  {session.mode} · {session.status}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <PageState title="Empty" body="No active rooms yet." />
          </div>
        )}
      </section>
    </main>
  );
}
