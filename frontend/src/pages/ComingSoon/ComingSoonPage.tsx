import { Link } from 'react-router-dom';

export interface ComingSoonSlot {
  title: string;
  detail: string;
  badge?: string;
}

interface ComingSoonPageProps {
  title: string;
  phase: string;
  summary: string;
  slots?: readonly ComingSoonSlot[];
}

export function ComingSoonPage({
  title,
  phase,
  summary,
  slots = [],
}: ComingSoonPageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
      <section className="rounded-[28px] border border-white/10 bg-panel/80 p-6 shadow-glow lg:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          Locked · {phase}
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-paper md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-mist">{summary}</p>
        <p className="mt-5 rounded-2xl border border-cyan/20 bg-cyan/5 px-4 py-3 text-sm leading-6 text-mist break-words">
          This wing is sealed in the lobby. No fake match data is shown. The
          live engine arrives in the listed phase.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-gold px-5 py-3 font-display text-sm font-extrabold uppercase tracking-wide text-void shadow-play"
        >
          Return to lobby
        </Link>
      </section>

      {slots.length > 0 ? (
        <section className="mt-6" aria-label="Locked slots">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold uppercase tracking-wide">
              Locked loadout
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
              Preview only
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {slots.map((slot) => (
              <article
                key={slot.title}
                className="rounded-[24px] border border-white/10 bg-void/60 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold text-paper">
                    {slot.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-gold/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                    {slot.badge ?? 'Locked'}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-mist">{slot.detail}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
