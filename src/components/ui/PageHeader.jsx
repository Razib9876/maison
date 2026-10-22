import { Link } from "react-router-dom";

export default function PageHeader({ title, eyebrow, crumbs = [] }) {
  return (
    <div className="border-b border-ink/10 bg-white">
      <div className="wrap py-10 sm:py-14">
        <nav className="mb-3 flex flex-wrap items-center gap-2 text-[0.65rem] uppercase tracking-[0.2em] text-ink/50">
          <Link to="/" className="hover:text-gold">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span>/</span>
              {c.to ? <Link to={c.to} className="hover:text-gold">{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="h-display mt-2 text-3xl sm:text-5xl">{title}</h1>
      </div>
    </div>
  );
}
