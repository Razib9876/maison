import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { seedProducts } from "../data/products";
import { load, save } from "../lib/storage";
import { slugify } from "../lib/format";

const KEY = "mw_products_v1";
const Ctx = createContext(null);
export const useProducts = () => useContext(Ctx);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = load(KEY, null);
    return Array.isArray(saved) && saved.length ? saved : seedProducts;
  });

  useEffect(() => save(KEY, products), [products]);

  const getById = useCallback((id) => products.find((p) => p.id === Number(id)), [products]);
  const getBySlug = useCallback((slug) => products.find((p) => p.slug === slug), [products]);

  const addProduct = useCallback((data) => {
    setProducts((ps) => {
      const id = Math.max(0, ...ps.map((p) => p.id)) + 1;
      let slug = slugify(data.name) || `product-${id}`;
      if (ps.some((p) => p.slug === slug)) slug = `${slug}-${id}`;
      const product = {
        warranty: "1 Year",
        rating: 0,
        reviews: 0,
        ...data,
        id,
        slug,
        createdAt: new Date().toISOString(),
      };
      return [product, ...ps];
    });
  }, []);

  const updateProduct = useCallback((id, data) => {
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, ...data } : p)));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((ps) => ps.filter((p) => p.id !== id));
  }, []);

  // sign = -1 reduces stock (order placed), +1 restores stock (order cancelled)
  const adjustStock = useCallback((items, sign) => {
    setProducts((ps) =>
      ps.map((p) => {
        const qty = items.filter((i) => i.productId === p.id).reduce((s, i) => s + i.qty, 0);
        return qty ? { ...p, stock: Math.max(0, p.stock + sign * qty) } : p;
      })
    );
  }, []);

  const resetProducts = useCallback(() => setProducts(seedProducts), []);

  const value = useMemo(
    () => ({ products, getById, getBySlug, addProduct, updateProduct, deleteProduct, adjustStock, resetProducts }),
    [products, getById, getBySlug, addProduct, updateProduct, deleteProduct, adjustStock, resetProducts]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
