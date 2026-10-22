import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "../lib/storage";

const KEY = "mw_wishlist_v1";
const Ctx = createContext(null);
export const useWishlist = () => useContext(Ctx);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    const saved = load(KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => save(KEY, ids), [ids]);

  const has = useCallback((id) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id) => {
      const added = !ids.includes(id);
      setIds((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));
      return added;
    },
    [ids]
  );

  const value = useMemo(() => ({ ids, has, toggle }), [ids, has, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
