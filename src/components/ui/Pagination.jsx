export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  const btn = "min-w-[2.25rem] border px-3 py-2 text-xs transition";
  return (
    <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)} className={`${btn} border-ink/20 hover:border-ink disabled:opacity-30`}>
        Prev
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-ink/40">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`${btn} ${p === page ? "border-ink bg-ink text-sand" : "border-ink/20 hover:border-ink"}`}
          >
            {p}
          </button>
        )
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)} className={`${btn} border-ink/20 hover:border-ink disabled:opacity-30`}>
        Next
      </button>
    </nav>
  );
}
