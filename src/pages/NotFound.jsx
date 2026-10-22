import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="wrap">
      <EmptyState title="404 · Page not found" text="The page you are looking for doesn't exist or has moved." actionLabel="Back to home" actionTo="/" />
    </div>
  );
}
