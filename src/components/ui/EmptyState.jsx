import { Link } from "react-router-dom";

export default function EmptyState({ title, text, actionLabel, actionTo }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h2 className="h-display text-2xl sm:text-3xl">{title}</h2>
      {text && <p className="mt-3 text-sm text-ink/70">{text}</p>}
      {actionTo && (
        <Link to={actionTo} className="btn-solid mt-8">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
