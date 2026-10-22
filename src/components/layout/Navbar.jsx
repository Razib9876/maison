import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BagIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "../ui/Icons";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const LINKS = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Track Order", "/track-order"],
];

function Badge({ n }) {
  if (!n) return null;
  return (
    <span className="absolute -right-2 -top-2 grid h-4 min-w-[1rem] place-items-center rounded-full bg-gold px-1 text-[0.6rem] leading-none text-white">
      {n}
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { ids } = useWishlist();

  useEffect(() => setOpen(false), [pathname]);

  const submit = (e) => {
    e.preventDefault();
    const t = q.trim();
    navigate(t ? `/shop?q=${encodeURIComponent(t)}` : "/shop");
    setQ("");
    setOpen(false);
  };

  const linkCls = ({ isActive }) =>
    `text-xs uppercase tracking-[0.2em] transition hover:text-gold ${isActive ? "text-gold" : ""}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/95 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
          <Link
            to="/"
            className="truncate font-serif text-lg uppercase tracking-[0.18em] xs:text-xl sm:tracking-[0.25em] sm:text-2xl"
          >
            Maison
          </Link>
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === "/"} className={linkCls}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <form
            onSubmit={submit}
            className="hidden items-center border-b border-ink/30 xl:flex"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search furniture"
              aria-label="Search"
              className="w-40 bg-transparent py-1 text-sm outline-none placeholder:text-ink/40"
            />
            <button type="submit" aria-label="Search">
              <SearchIcon size={18} />
            </button>
          </form>

          <Link to="/wishlist" className="relative" aria-label="Wishlist">
            <HeartIcon />
            <Badge n={ids.length} />
          </Link>
          <Link to="/cart" className="relative" aria-label="Cart">
            <BagIcon />
            <Badge n={count} />
          </Link>
          <Link
            to={user ? "/account" : "/login"}
            className="hidden sm:block"
            aria-label="Account"
          >
            <UserIcon />
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-sand lg:hidden">
          <div className="wrap flex flex-col py-3">
            <form
              onSubmit={submit}
              className="mb-2 flex items-center border border-ink/20 bg-white px-3"
            >
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search furniture"
                aria-label="Search"
                className="w-full bg-transparent py-3 text-sm outline-none"
              />
              <button type="submit" aria-label="Search">
                <SearchIcon size={18} />
              </button>
            </form>
            {LINKS.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={(s) => `${linkCls(s)} border-b border-ink/5 py-3`}
              >
                {label}
              </NavLink>
            ))}
            {user ? (
              <>
                {user.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="py-3 text-xs uppercase tracking-[0.2em]"
                  >
                    Admin Panel
                  </NavLink>
                )}
                <NavLink
                  to="/account"
                  className="py-3 text-xs uppercase tracking-[0.2em]"
                >
                  My Account ({user.name.split(" ")[0]})
                </NavLink>
                <button
                  onClick={logout}
                  className="py-3 text-left text-xs uppercase tracking-[0.2em] text-red-700"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="py-3 text-xs uppercase tracking-[0.2em]"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="py-3 text-xs uppercase tracking-[0.2em]"
                >
                  Create Account
                </NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
