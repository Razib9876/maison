import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "../lib/storage";

const USERS_KEY = "mw_users_v1";
const SESSION_KEY = "mw_session_v1";

// Demo admin account. With a real backend this must live on the server.
const ADMIN = {
  id: "u_admin",
  name: "Admin",
  email: "admin@maisonwood.com",
  password: "admin123",
  role: "admin",
  phone: "",
  district: "",
  address: "",
};

function loadUsers() {
  const saved = load(USERS_KEY, []);
  const list = Array.isArray(saved) ? saved : [];
  return list.some((u) => u.id === ADMIN.id) ? list : [ADMIN, ...list];
}

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [sessionId, setSessionId] = useState(() => load(SESSION_KEY, null));

  useEffect(() => save(USERS_KEY, users), [users]);
  useEffect(() => save(SESSION_KEY, sessionId), [sessionId]);

  const user = useMemo(() => {
    const u = users.find((x) => x.id === sessionId);
    if (!u) return null;
    const { password, ...safe } = u;
    return safe;
  }, [users, sessionId]);

  const register = useCallback(
    ({ name, email, password }) => {
      const mail = email.trim().toLowerCase();
      if (users.some((u) => u.email === mail)) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const u = {
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: mail,
        password,
        role: "customer",
        phone: "",
        district: "",
        address: "",
      };
      setUsers((list) => [...list, u]);
      setSessionId(u.id);
      return { ok: true, user: { ...u, password: undefined } };
    },
    [users]
  );

  const login = useCallback(
    (email, password) => {
      const mail = email.trim().toLowerCase();
      const u = users.find((x) => x.email === mail && x.password === password);
      if (!u) return { ok: false, error: "Incorrect email or password." };
      setSessionId(u.id);
      return { ok: true, role: u.role };
    },
    [users]
  );

  const logout = useCallback(() => setSessionId(null), []);

  const updateProfile = useCallback(
    (patch) => {
      setUsers((list) => list.map((u) => (u.id === sessionId ? { ...u, ...patch } : u)));
    },
    [sessionId]
  );

  const value = useMemo(
    () => ({ user, register, login, logout, updateProfile }),
    [user, register, login, logout, updateProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
