export default function Rating({ value = 0, count }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink/70">
      <span className="tracking-widest text-gold" aria-label={`${value} out of 5`}>
        {"★".repeat(full)}
        <span className="text-ink/20">{"★".repeat(Math.max(0, 5 - full))}</span>
      </span>
      {count != null && <span>({count})</span>}
    </span>
  );
}
