import { useQuery } from '@tanstack/react-query';
import { GameMode, GameType } from '@world-challenge/shared';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageState } from '../../components/ui/PageState';
import { useAuthStore } from '../../features/auth/auth-store';
import { CHALLENGE_GAME_TYPES, GAME_META } from '../../features/games/game-meta';
import { createSession, getPublicUser } from '../../services/api';

export function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const me = useAuthStore((state) => state.user);
  const [gameType, setGameType] = useState<GameType>(GameType.HISTORY_CLASH);
  const userQuery = useQuery({
    queryKey: ['user', id],
    queryFn: () => getPublicUser(id ?? ''),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Missing" body="No player id was provided." />
      </main>
    );
  }

  if (userQuery.isPending) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Loading" body="Loading public profile…" />
      </main>
    );
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageState title="Not found" body="This player is hidden or does not exist." />
      </main>
    );
  }

  const player = userQuery.data;
  const isSelf = me?.id === player.id;

  async function challenge(): Promise<void> {
    const session = await createSession({
      gameType,
      mode: GameMode.DUEL,
      invitedUserId: player.id,
    });
    navigate(`/games/${session.id}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <section className="rounded-[28px] border border-white/10 bg-panel/80 p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Public profile
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">
          {player.username}
        </h1>
        <p className="mt-2 text-sm text-mist">
          {player.country.flagEmoji} {player.country.name} · Level {player.level} · {player.xp} XP
        </p>
        <p className="mt-4 text-sm leading-6 text-mist">{player.bio ?? 'No bio yet.'}</p>
        {!isSelf ? (
          <div className="mt-6 flex flex-wrap gap-3">
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
            <button
              type="button"
              onClick={() => void challenge()}
              className="rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase text-void"
            >
              Challenge
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
