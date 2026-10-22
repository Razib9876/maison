import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { load, save } from "../lib/storage";
import { useProducts } from "./ProductsContext";
import { COUPONS } from "../data/config";
import { calcDiscount } from "../lib/pricing";
import { formatPrice } from "../lib/format";

const KEY = "mw_cart_v1";
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

const keyOf = (productId, color) => `${productId}|${color || ""}`;

export function CartProvider({ children }) {
  const { getById } = useProducts();
  const [state, setState] = useState(() => {
    const saved = load(KEY, null);
    return saved && Array.isArray(saved.items) ? saved : { items: [], coupon: "" };
  });

  useEffect(() => save(KEY, state), [state]);

  // Cart lines are derived from live product data so price/stock are always current
  const lines = useMemo(() => {
    const out = [];
    for (const i of state.items) {
      const product = getById(i.productId);
      if (!product || product.stock <= 0) continue;
      const qty = Math.min(i.qty, product.stock);
      if (qty < 1) continue;
      out.push({ key: keyOf(i.productId, i.color), product, color: i.color || "", qty });
    }
    return out;
  }, [state.items, getById]);

  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const coupon = state.coupon;
  const discount = calcDiscount(subtotal, coupon);

  const addItem = useCallback(
    (productId, qty = 1, color = "") => {
      const product = getById(productId);
      if (!product || product.stock <= 0) return { ok: false, message: "This item is out of stock." };
      const existing = state.items.find((i) => keyOf(i.productId, i.color) === keyOf(productId, color));
      const current = existing ? existing.qty : 0;
      const wanted = current + qty;
      const finalQty = Math.min(wanted, product.stock);
      setState((s) => {
        const found = s.items.some((i) => keyOf(i.productId, i.color) === keyOf(productId, color));
        const items = found
          ? s.items.map((i) => (keyOf(i.productId, i.color) === keyOf(productId, color) ? { ...i, qty: finalQty } : i))
          : [...s.items, { productId, color, qty: finalQty }];
        return { ...s, items };
      });
      if (wanted > product.stock) {
        return { ok: true, message: `Only ${product.stock} available. Cart updated to ${finalQty}.` };
      }
      return { ok: true, message: "Added to cart." };
    },
    [getById, state.items]
  );

  const updateQty = useCallback(
    (key, qty) => {
      setState((s) => ({
        ...s,
        items: s.items
          .map((i) => {
            if (keyOf(i.productId, i.color) !== key) return i;
            const p = getById(i.productId);
            const max = p ? p.stock : i.qty;
            return { ...i, qty: Math.max(0, Math.min(qty, max)) };
          })
          .filter((i) => i.qty > 0),
      }));
    },
    [getById]
  );

  const removeItem = useCallback((key) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => keyOf(i.productId, i.color) !== key) }));
  }, []);

  const clear = useCallback(() => setState({ items: [], coupon: "" }), []);

  const applyCoupon = useCallback(
    (raw) => {
      const code = String(raw || "").trim().toUpperCase();
      const c = COUPONS[code];
      if (!c) return { ok: false, message: "Invalid coupon code." };
      if (subtotal < c.min) return { ok: false, message: `This coupon needs a minimum order of ${formatPrice(c.min)}.` };
      setState((s) => ({ ...s, coupon: code }));
      return { ok: true, message: `Coupon applied: ${c.label}.` };
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => setState((s) => ({ ...s, coupon: "" })), []);

  const value = useMemo(
    () => ({ lines, count, subtotal, coupon, discount, addItem, updateQty, removeItem, clear, applyCoupon, removeCoupon }),
    [lines, count, subtotal, coupon, discount, addItem, updateQty, removeItem, clear, applyCoupon, removeCoupon]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
