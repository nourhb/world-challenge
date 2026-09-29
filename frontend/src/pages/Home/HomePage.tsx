import { useQuery } from '@tanstack/react-query';
import { GameMode, GameType, xpRequiredForLevel } from '@world-challenge/shared';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuthStore } from '../../features/auth/auth-store';
import { GAME_META } from '../../features/games/game-meta';
import { createSession, getGames, getMySessions, getPassport } from '../../services/api';

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [playError, setPlayError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const passportQuery = useQuery({
    queryKey: ['passport'],
    queryFn: getPassport,
    enabled: Boolean(user),
  });
  const sessionsQuery = useQuery({
    queryKey: ['sessions', 'mine'],
    queryFn: getMySessions,
    enabled: Boolean(user),
  });
  const gamesQuery = useQuery({
    queryKey: ['games'],
    queryFn: getGames,
    enabled: Boolean(user),
  });

  if (!user) {
    return null;
  }

  const nextLevelXp = xpRequiredForLevel(user.level + 1);
  const currentLevelXp = user.level === 1 ? 0 : xpRequiredForLevel(user.level);
  const progress = Math.min(
    100,
    Math.max(
      0,
      Math.round(((user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100),
    ),
  );

  async function playSolo(gameType: GameType): Promise<void> {
    setPlayError(null);
    setStarting(true);
    try {
      const session = await createSession({
        gameType,
        mode: GameMode.SOLO,
      });
      navigate(`/games/${session.id}`);
    } catch (error) {
      setPlayError(error instanceof Error ? error.message : 'Could not start the game');
    } finally {
      setStarting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow lg:p-8">
          <StatusBadge label={`${user.country.flagEmoji ?? ''} ${user.country.name}`} tone="ok" />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            Pilot brief
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-paper md:text-6xl">
            Hello {user.username}.
            <span className="mt-2 block text-cyan">Level {user.level}</span>
          </h1>
          <p className="mt-4 text-sm text-mist">
            {user.xp} XP · next rank at {nextLevelXp} XP
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-cyan" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={starting}
              onClick={() => void playSolo(GameType.CULTURE_CODE)}
              className="rounded-2xl bg-gold px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-void shadow-play disabled:opacity-60"
            >
              {starting ? 'Opening room…' : 'Play Culture Code'}
            </button>
            <Link
              to="/games"
              className="rounded-2xl bg-cyan px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-void"
            >
              All arenas
            </Link>
            {playError ? <p className="basis-full text-sm text-ember">{playError}</p> : null}
            <Link
              to="/discover"
              className="rounded-2xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-paper hover:border-cyan/40 hover:text-cyan"
            >
              Discover players
            </Link>
          </div>
        </div>

        <article className="rounded-[28px] border border-gold/30 bg-void p-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
            Virtual passport
          </p>
          {passportQuery.isPending ? (
            <p className="mt-4 text-sm text-mist">Loading stamps from the server…</p>
          ) : passportQuery.isError ? (
            <p className="mt-4 text-sm text-ember">Passport could not be loaded.</p>
          ) : (
            <>
              <h2 className="mt-2 font-display text-3xl font-extrabold">
                {passportQuery.data.unlockedCount} / {passportQuery.data.totalCount}
              </h2>
              <p className="mt-2 text-sm text-mist">
                Home base: {passportQuery.data.homeCountry.flagEmoji}{' '}
                {passportQuery.data.homeCountry.name}
              </p>
              <Link to="/passport" className="mt-4 inline-block text-sm font-semibold text-cyan">
                Open full passport
              </Link>
            </>
          )}
        </article>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">
          Live modes
        </h2>
        {gamesQuery.data && gamesQuery.data.length > 0 ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {gamesQuery.data.map((game) => {
              const meta = GAME_META[game.type];
              return (
                <button
                  key={game.id}
                  type="button"
                  disabled={starting || !game.isActive}
                  onClick={() => void playSolo(game.type)}
                  className="rounded-[24px] border border-white/10 bg-panel/80 p-5 text-left hover:border-cyan/40 disabled:opacity-50"
                >
                  <p className="text-[10px] uppercase tracking-wider text-cyan">
                    {meta?.tag ?? game.type}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold">{game.name}</p>
                  <p className="mt-2 text-xs leading-5 text-mist">
                    {meta?.blurb ?? game.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">
          Continue games
        </h2>
        {sessionsQuery.isPending ? (
          <div className="mt-3">
            <PageState title="Loading" body="Checking your active sessions…" />
          </div>
        ) : sessionsQuery.isError ? (
          <div className="mt-3">
            <PageState title="Error" body="Active games could not be loaded." />
          </div>
        ) : sessionsQuery.data.length === 0 ? (
          <div className="mt-3">
            <PageState
              title="No live rooms"
              body="Start a solo quiz or challenge someone from Discover."
            />
          </div>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {sessionsQuery.data.map((session) => (
              <Link
                key={session.id}
                to={`/games/${session.id}`}
                className="rounded-[24px] border border-white/10 bg-panel/80 p-5 hover:border-cyan/40"
              >
                <p className="font-display text-lg font-bold">{session.gameName}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-mist">
                  {session.mode} · {session.status}
                </p>
                <p className="mt-2 text-sm text-mist">
                  {session.players.map((player) => player.username).join(' vs ') || 'Waiting'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
