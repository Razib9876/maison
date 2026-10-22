import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  ["Dashboard", "/admin", true],
  ["Products", "/admin/products", false],
  ["Orders", "/admin/orders", false],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const cls = ({ isActive }) =>
    `border-b-2 px-1 pb-3 text-xs uppercase tracking-[0.18em] ${isActive ? "border-gold text-gold" : "border-transparent hover:text-gold"}`;

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-ink/10 bg-white">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/admin" className="font-serif text-xl uppercase tracking-[0.2em]">Maison Wood <span className="text-gold">Admin</span></Link>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.15em]">
            <span className="hidden text-ink/50 sm:inline">{user.email}</span>
            <Link to="/" className="underline hover:text-gold">View site</Link>
            <button onClick={logout} className="text-red-700 underline">Log out</button>
          </div>
        </div>
        <nav className="wrap flex gap-6 overflow-x-auto">
          {TABS.map(([label, to, end]) => (
            <NavLink key={to} to={to} end={end} className={cls}>{label}</NavLink>
          ))}
        </nav>
      </header>
      <div className="wrap py-8 sm:py-10">
        <Outlet />
      </div>
    </div>
  );
}
