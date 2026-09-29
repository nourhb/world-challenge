interface PageStateProps {
  title: string;
  body: string;
}

export function PageState({ title, body }: PageStateProps) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-panel/80 p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-mist">{body}</p>
    </div>
  );
}
