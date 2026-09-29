interface StatusBadgeProps {
  label: string;
  tone?: 'ok' | 'warn' | 'neutral';
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const toneClass =
    tone === 'ok'
      ? 'border-cyan/30 bg-cyan/10 text-cyan'
      : tone === 'warn'
        ? 'border-ember/40 bg-ember/10 text-ember'
        : 'border-white/10 bg-white/5 text-mist';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${toneClass}`}
    >
      <span
        aria-hidden="true"
        className={[
          'h-2 w-2 rounded-full',
          tone === 'ok' ? 'bg-cyan' : tone === 'warn' ? 'bg-ember' : 'bg-gold',
        ].join(' ')}
      />
      {label}
    </span>
  );
}
