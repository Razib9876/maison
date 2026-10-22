import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import ProductCard from "../components/ProductCard";
import { FilterIcon } from "../components/ui/Icons";
import { CATEGORIES } from "../data/products";
import { useProducts } from "../context/ProductsContext";

const PAGE_SIZE = 12;
const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price-asc", "Price: Low to High"],
  ["price-desc", "Price: High to Low"],
  ["rating", "Top Rated"],
];

export default function Shop() {
  const { products } = useProducts();
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";
  const inStock = params.get("stock") === "1";
  const minN = Number(params.get("min")) || 0;
  const maxN = Number(params.get("max")) || 0;
  const page = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);

  const [min, setMin] = useState(params.get("min") || "");
  const [max, setMax] = useState(params.get("max") || "");
  const [showFilters, setShowFilters] = useState(false);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v == null || v === false) next.delete(k);
      else next.set(k, String(v));
    });
    if (!("page" in patch)) next.delete("page");
    setParams(next);
  };

  const clearAll = () => {
    setMin("");
    setMax("");
    setParams(new URLSearchParams());
  };

  const list = useMemo(() => {
    const term = q.toLowerCase();
    const r = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (term && !`${p.name} ${p.category} ${p.material || ""}`.toLowerCase().includes(term)) return false;
      if (inStock && p.stock <= 0) return false;
      if (minN && p.price < minN) return false;
      if (maxN && p.price > maxN) return false;
      return true;
    });
    const sorted = [...r];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    return sorted;
  }, [products, q, category, sort, inStock, minN, maxN]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const hasFilters = q || category !== "All" || inStock || minN || maxN;

  return (
    <>
      <PageHeader
        title={category === "All" ? "All Furniture" : `${category}s`}
        eyebrow="Shop"
        crumbs={[{ label: "Shop", to: category === "All" ? undefined : "/shop" }, ...(category === "All" ? [] : [{ label: category }])]}
      />

      <div className="wrap py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className="btn lg:hidden">
            <FilterIcon size={16} /> Filters
          </button>
          <p className="text-sm text-ink/60">
            {list.length} {list.length === 1 ? "product" : "products"}
            {q && <> for “{q}”</>}
          </p>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
            Sort
            <select value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? "" : e.target.value })} className="input !w-auto !py-2">
              {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>

        <div className="grid gap-10 lg:grid-cols-[15rem_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} space-y-8 lg:block`}>
            <div>
              <h3 className="label">Category</h3>
              <ul className="space-y-2 text-sm">
                {["All", ...CATEGORIES].map((c) => (
                  <li key={c}>
                    <button
                      onClick={() => update({ category: c === "All" ? "" : c })}
                      className={`transition hover:text-gold ${category === c ? "font-medium text-gold" : ""}`}
                    >
                      {c === "All" ? "All Furniture" : `${c}s`}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="label">Price (৳)</h3>
              <div className="flex items-center gap-2">
                <input value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} placeholder="Min" inputMode="numeric" className="input !px-3" aria-label="Minimum price" />
                <input value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} placeholder="Max" inputMode="numeric" className="input !px-3" aria-label="Maximum price" />
              </div>
              <button onClick={() => update({ min, max })} className="btn mt-3 w-full">Apply</button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={inStock} onChange={(e) => update({ stock: e.target.checked ? "1" : "" })} className="h-4 w-4 accent-ink" />
              In stock only
            </label>

            {hasFilters && <button onClick={clearAll} className="text-xs uppercase tracking-[0.18em] text-red-700 underline">Clear all filters</button>}
          </aside>

          <section className="min-w-0">
            {visible.length === 0 ? (
              <div>
                <EmptyState title="No products found" text="Try changing or clearing your filters." />
                <div className="text-center"><button onClick={clearAll} className="btn">Clear filters</button></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
                {visible.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
            <Pagination page={current} totalPages={totalPages} onChange={(p) => { update({ page: p === 1 ? "" : p }); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </section>
        </div>
      </div>
    </>
  );
}
