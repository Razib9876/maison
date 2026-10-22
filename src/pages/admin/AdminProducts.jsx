import { useState } from "react";
import Img from "../../components/ui/Img";
import { CATEGORIES } from "../../data/products";
import { useProducts } from "../../context/ProductsContext";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../lib/format";

const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
const commas = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

function ProductForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(() => ({
    name: (initial && initial.name) || "",
    category: (initial && initial.category) || CATEGORIES[0],
    price: initial ? String(initial.price) : "",
    oldPrice: initial && initial.oldPrice ? String(initial.oldPrice) : "",
    stock: initial ? String(initial.stock) : "",
    material: (initial && initial.material) || "",
    dimensions: (initial && initial.dimensions) || "",
    colors: ((initial && initial.colors) || []).join(", "),
    images: ((initial && initial.images) || []).join("\n"),
    description: (initial && initial.description) || "",
    features: ((initial && initial.features) || []).join("\n"),
    featured: !!(initial && initial.featured),
    isNew: !!(initial && initial.isNew),
  }));
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    const price = Number(f.price);
    const oldPrice = f.oldPrice === "" ? 0 : Number(f.oldPrice);
    const stock = Number(f.stock);
    if (f.name.trim().length < 3) er.name = "Name is required (min 3 characters).";
    if (!(price > 0)) er.price = "Enter a valid price.";
    if (f.oldPrice !== "" && !(oldPrice > price)) er.oldPrice = "Old price must be higher than the price (or leave empty).";
    if (f.stock === "" || !Number.isInteger(stock) || stock < 0) er.stock = "Enter a whole number (0 or more).";
    if (f.description.trim().length < 10) er.description = "Add a short description.";
    setErrors(er);
    if (Object.keys(er).length) return;

    const data = {
      name: f.name.trim(),
      category: f.category,
      price,
      stock,
      material: f.material.trim(),
      dimensions: f.dimensions.trim(),
      colors: commas(f.colors),
      images: lines(f.images),
      description: f.description.trim(),
      features: lines(f.features),
      featured: f.featured,
      isNew: f.isNew,
    };
    if (oldPrice > 0) data.oldPrice = oldPrice;
    else data.oldPrice = undefined;
    onSave(data);
  };

  const cls = (k) => `input ${errors[k] ? "input-error" : ""}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:p-8" role="dialog" aria-modal="true">
      <form onSubmit={submit} noValidate className="my-4 w-full max-w-3xl bg-sand p-5 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">{initial ? "Edit product" : "Add product"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none">×</button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pn">Name *</label>
            <input id="pn" value={f.name} onChange={set("name")} className={cls("name")} />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div>
            <label className="label" htmlFor="pc">Category *</label>
            <select id="pc" value={f.category} onChange={set("category")} className="input">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ps">Stock *</label>
            <input id="ps" inputMode="numeric" value={f.stock} onChange={set("stock")} className={cls("stock")} />
            {errors.stock && <p className="err">{errors.stock}</p>}
          </div>
          <div>
            <label className="label" htmlFor="pp">Price (৳) *</label>
            <input id="pp" inputMode="numeric" value={f.price} onChange={set("price")} className={cls("price")} />
            {errors.price && <p className="err">{errors.price}</p>}
          </div>
          <div>
            <label className="label" htmlFor="po">Old price (৳)</label>
            <input id="po" inputMode="numeric" value={f.oldPrice} onChange={set("oldPrice")} className={cls("oldPrice")} />
            {errors.oldPrice && <p className="err">{errors.oldPrice}</p>}
          </div>
          <div>
            <label className="label" htmlFor="pm">Material</label>
            <input id="pm" value={f.material} onChange={set("material")} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="pd">Dimensions</label>
            <input id="pd" value={f.dimensions} onChange={set("dimensions")} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pcol">Colors (comma separated)</label>
            <input id="pcol" value={f.colors} onChange={set("colors")} placeholder="Walnut, White Oak" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pi">Image URLs (one per line)</label>
            <textarea id="pi" rows={3} value={f.images} onChange={set("images")} placeholder="https://…" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pde">Description *</label>
            <textarea id="pde" rows={3} value={f.description} onChange={set("description")} className={cls("description")} />
            {errors.description && <p className="err">{errors.description}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="pf">Features (one per line)</label>
            <textarea id="pf" rows={3} value={f.features} onChange={set("features")} className="input" />
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={set("featured")} className="h-4 w-4 accent-ink" /> Featured on home page</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.isNew} onChange={set("isNew")} className="h-4 w-4 accent-ink" /> Mark as new</label>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-solid">{initial ? "Save changes" : "Add product"}</button>
          <button type="button" onClick={onClose} className="btn">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const toast = useToast();
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [q, setQ] = useState("");

  const list = products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.trim().toLowerCase()));

  const save = (data) => {
    if (editing === "new") {
      addProduct(data);
      toast("Product added.");
    } else {
      updateProduct(editing.id, data);
      toast("Product updated.");
    }
    setEditing(null);
  };

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    deleteProduct(p.id);
    toast("Product deleted.");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Products ({products.length})</h1>
        <div className="flex flex-wrap gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" aria-label="Search products" className="input !w-48 !py-2" />
          <button onClick={() => setEditing("new")} className="btn-solid !py-2">Add product</button>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.18em] text-ink/60">
            <tr><th className="p-3">Product</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Img src={p.images && p.images[0]} alt="" className="h-12 w-12 shrink-0" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className={`p-3 ${p.stock === 0 ? "text-red-700" : p.stock <= 3 ? "text-amber-700" : ""}`}>{p.stock}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(p)} className="mr-4 underline">Edit</button>
                  <button onClick={() => remove(p)} className="text-red-700 underline">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-ink/60">No products found.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && <ProductForm initial={editing === "new" ? null : editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}
