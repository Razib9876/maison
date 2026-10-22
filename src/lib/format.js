export const formatPrice = (n) => "৳" + Number(n || 0).toLocaleString("en-IN");

export function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
}

export const slugify = (s) =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const cleanPhone = (v) => String(v || "").replace(/[\s-]/g, "");
export const isValidPhone = (v) => /^(?:\+?88)?01[3-9]\d{8}$/.test(cleanPhone(v));
export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
export const last11 = (v) => String(v || "").replace(/\D/g, "").slice(-11);

export const discountPercent = (price, old) =>
  old && old > price ? Math.round((1 - price / old) * 100) : 0;
