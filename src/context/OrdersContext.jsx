import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "../lib/storage";
import { useProducts } from "./ProductsContext";
import { last11 } from "../lib/format";

const KEY = "mw_orders_v1";
const Ctx = createContext(null);
export const useOrders = () => useContext(Ctx);

function makeId(existing) {
  const d = new Date();
  const stamp = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  let id;
  do {
    id = `MW-${stamp}-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existing.some((o) => o.id === id));
  return id;
}

export function OrdersProvider({ children }) {
  const { adjustStock } = useProducts();
  const [orders, setOrders] = useState(() => {
    const saved = load(KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => save(KEY, orders), [orders]);

  const placeOrder = useCallback(
    (data) => {
      const now = new Date().toISOString();
      const order = {
        ...data,
        id: makeId(orders),
        createdAt: now,
        status: "Pending",
        history: [{ status: "Pending", at: now }],
      };
      adjustStock(order.items, -1);
      setOrders((list) => [order, ...list]);
      return order;
    },
    [orders, adjustStock]
  );

  const updateStatus = useCallback(
    (id, status) => {
      const order = orders.find((o) => o.id === id);
      if (!order || order.status === status) return;
      if (status === "Cancelled") adjustStock(order.items, +1);
      else if (order.status === "Cancelled") adjustStock(order.items, -1);
      const at = new Date().toISOString();
      setOrders((list) =>
        list.map((o) => (o.id === id ? { ...o, status, history: [...o.history, { status, at }] } : o))
      );
    },
    [orders, adjustStock]
  );

  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);

  const trackOrder = useCallback(
    (id, phone) => {
      const o = orders.find((x) => x.id.toLowerCase() === String(id).trim().toLowerCase());
      if (!o) return null;
      return last11(o.customer.phone) === last11(phone) ? o : null;
    },
    [orders]
  );

  const value = useMemo(
    () => ({ orders, placeOrder, updateStatus, getOrder, trackOrder }),
    [orders, placeOrder, updateStatus, getOrder, trackOrder]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
