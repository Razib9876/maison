import { COUPONS, SHIPPING } from "../data/config";

export function calcDiscount(subtotal, code) {
  const c = COUPONS[code];
  if (!c || subtotal < c.min) return 0;
  const d = c.type === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  return Math.min(d, subtotal);
}

export function calcShipping(subtotal, district) {
  if (!district) return 0;
  if (subtotal >= SHIPPING.freeAbove) return 0;
  return district === "Dhaka" ? SHIPPING.dhaka : SHIPPING.outside;
}
