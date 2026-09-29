import { useQuery } from '@tanstack/react-query';
import { PassportStatus } from '@world-challenge/shared';
import { PageState } from '../../components/ui/PageState';
import { getPassport } from '../../services/api';
import { formatPassportProgress } from '../../utils/passport';

const STATUS_LABEL: Record<PassportStatus, string> = {
  [PassportStatus.LOCKED]: 'Locked',
  [PassportStatus.DISCOVERED]: 'Discovered',
  [PassportStatus.COMPLETED]: 'Completed',
  [PassportStatus.MASTERED]: 'Mastered',
};

export function PassportPage() {
  const passportQuery = useQuery({
    queryKey: ['passport'],
    queryFn: getPassport,
  });

  if (passportQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageState title="Loading" body="Reading your passport from the API…" />
      </main>
    );
  }

  if (passportQuery.isError || !passportQuery.data) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <PageState title="Error" body="Passport data could not be loaded." />
      </main>
    );
  }

  const passport = passportQuery.data;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        Virtual passport
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">Collection</h1>
      <p className="mt-2 text-sm text-mist">
        {formatPassportProgress(passport.unlockedCount, passport.totalCount)}. Home country is
        your origin, not a game unlock.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {passport.countries.map((entry) => {
          const locked = entry.status === PassportStatus.LOCKED && !entry.isHome;
          return (
            <article
              key={entry.country.id}
              className={[
                'rounded-2xl border px-4 py-4',
                locked
                  ? 'border-white/10 bg-white/5 opacity-60'
                  : 'border-cyan/20 bg-cyan/5',
              ].join(' ')}
            >
              <p className="font-display text-sm font-bold">
                {entry.country.flagEmoji ? `${entry.country.flagEmoji} ` : ''}
                {entry.country.name}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-mist">
                {entry.country.iso2} · {entry.isHome ? 'Home' : STATUS_LABEL[entry.status]}
              </p>
              {entry.gamesPlayed > 0 ? (
                <p className="mt-2 text-xs text-mist">
                  {entry.gamesPlayed} games · best {entry.bestScore}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}
