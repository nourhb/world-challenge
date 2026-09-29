import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { getHealth } from '../../services/api';
import { formatPassportProgress } from '../../utils/passport';


const GAME_MODES = [
  {
    title: 'Culture Code',
    mode: 'Diplomacy',
    body: 'Etiquette and the rules that get you invited back — or shown the door.',
    to: '/games',
  },
  {
    title: 'History Clash',
    mode: 'Expert',
    body: 'Turning points, treaties, and revolutions. Causes, not slogans.',
    to: '/games',
  },
  {
    title: 'Guess the Word',
    mode: 'Language',
    body: 'Untranslatable terms. Distractors are the usual tourist myths.',
    to: '/games',
  },
  {
    title: 'Mystery Cuisine',
    mode: 'Foodways',
    body: 'Ferments and techniques — not “where is pizza from.”',
    to: '/games',
  },
  {
    title: 'Sound Atlas',
    mode: 'Music',
    body: 'Maqam, raga, instruments, and living performance codes.',
    to: '/games',
  },
  {
    title: 'World Map',
    mode: 'Precision',
    body: 'Drop a pin on the real coordinates. Closer clicks, higher score.',
    to: '/games',
  },
  {
    title: 'Scene Read',
    mode: 'Social',
    body: 'Watch a described scene and name the cultural code being performed.',
    to: '/games',
  },
  {
    title: 'Country Quiz',
    mode: 'Geography',
    body: 'Flags, capitals, and the traps that catch tourists.',
    to: '/games',
  },
] as const;

export function LandingPage() {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  });

  const healthTone =
    healthQuery.data?.status === 'ok'
      ? 'ok'
      : healthQuery.isError || healthQuery.data?.status === 'degraded'
        ? 'warn'
        : 'neutral';

  const healthLabel = healthQuery.isPending
    ? 'Connecting servers'
    : healthQuery.isError
      ? 'Servers unreachable'
      : healthQuery.data?.database === 'connected'
        ? `Servers online · ${healthQuery.data.countriesSeeded} countries loaded`
        : 'API up · database offline';

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow lg:p-8">
          <StatusBadge label={healthLabel} tone={healthTone} />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">
            Multiplayer culture arena
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-paper md:text-6xl">
            Play the world.
            <span className="mt-2 block text-cyan">Unlock the passport.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-mist">
            Challenge players from other countries in short culture games. Every
            finished match stamps their country into your book and ranks you up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center rounded-2xl bg-gold px-6 py-3.5 font-display text-sm font-extrabold uppercase tracking-[0.14em] text-void shadow-play motion-safe:animate-pulseGlow"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3.5 text-sm font-semibold text-paper hover:border-cyan/40 hover:text-cyan"
            >
              Log in
            </Link>
          </div>
          <p className="mt-4 text-xs text-mist/80">
            Demo pilots: Nour / Alex · password DemoPass123!
          </p>
        </div>

        <article
          aria-label="Passport preview"
          className="relative overflow-hidden rounded-[28px] border border-gold/30 bg-void p-6"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10" />
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
                Virtual passport
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold">
                Collection
              </h2>
            </div>
            <p className="rounded-full border border-gold/30 px-3 py-1 text-[10px] font-semibold text-gold sm:text-xs">
              {healthQuery.data
                ? formatPassportProgress(0, healthQuery.data.countriesSeeded)
                : 'Sign in required'}
            </p>
          </div>
          <p className="mt-6 text-sm leading-6 text-mist">
            Stamps come from finished multiplayer games. This card does not invent
            unlocks. After login, your real passport loads from the API.
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-[28px] border border-white/10 bg-hull/70 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan">
              Daily challenge
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold">
              Stamp a new country today
            </h2>
          </div>
          <Link
            to="/login"
            className="rounded-xl bg-cyan px-4 py-2 text-sm font-bold uppercase tracking-wide text-void"
          >
            Play
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-mist">
          Complete one qualifying game with a player from another country. You
          do not need to win to unlock the stamp.
        </p>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">
            Game modes
          </h2>
          <Link to="/games" className="text-xs font-semibold uppercase tracking-wider text-cyan">
            All modes
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {GAME_MODES.map((game) => (
            <Link
              key={game.title}
              to={game.to}
              className="group rounded-[24px] border border-white/10 bg-panel/80 p-5 transition-colors hover:border-cyan/40 hover:bg-panel"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">{game.title}</h3>
                <span className="rounded-full border border-cyan/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
                  {game.mode}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-mist">{game.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          { label: 'XP', value: '50', detail: 'for finishing a game' },
          { label: 'Country', value: '+100', detail: 'first discovery bonus' },
          { label: 'Level', value: 'N²', detail: '100 × N² XP to rank up' },
        ].map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-void/60 px-4 py-4"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-mist">
              {stat.label}
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold text-gold">
              {stat.value}
            </p>
            <p className="text-xs text-mist">{stat.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
