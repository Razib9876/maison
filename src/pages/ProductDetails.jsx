import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Img from "../components/ui/Img";
import Rating from "../components/ui/Rating";
import ProductCard from "../components/ProductCard";
import { HeartIcon, MinusIcon, PlusIcon, ReturnIcon, ShieldIcon, TruckIcon } from "../components/ui/Icons";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { discountPercent, formatPrice } from "../lib/format";
import { SHIPPING } from "../data/config";

function ProductView({ product }) {
  const { products } = useProducts();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  const images = product.images && product.images.length ? product.images : [""];
  const colors = product.colors || [];
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(colors[0] || "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  const out = product.stock <= 0;
  const off = discountPercent(product.price, product.oldPrice);
  const liked = has(product.id);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const add = () => {
    const r = addItem(product.id, qty, color);
    toast(r.message, r.ok ? "success" : "error");
    return r.ok;
  };

  const buyNow = () => {
    if (add()) navigate("/checkout");
  };

  return (
    <>
      <PageHeader
        title={product.name}
        eyebrow={product.category}
        crumbs={[{ label: "Shop", to: "/shop" }, { label: product.category, to: `/shop?category=${product.category}` }]}
      />

      <div className="wrap py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <div className="aspect-square overflow-hidden bg-stone-200">
              <Img src={images[Math.min(active, images.length - 1)]} alt={product.name} loading="eager" className="h-full w-full" />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <button key={i} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`} className={`aspect-square overflow-hidden border-2 ${i === active ? "border-ink" : "border-transparent"}`}>
                    <Img src={src} alt="" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Rating value={product.rating} count={product.reviews} />
            <p className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-serif text-3xl sm:text-4xl">{formatPrice(product.price)}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="bg-gold px-2 py-1 text-[0.65rem] uppercase tracking-widest text-white">Save {off}%</span>
                </>
              )}
            </p>

            <p className={`mt-3 text-sm ${out ? "text-red-700" : product.stock <= 3 ? "text-amber-700" : "text-green-700"}`}>
              {out ? "Out of stock" : product.stock <= 3 ? `Only ${product.stock} left in stock` : "In stock"}
            </p>

            <p className="mt-5 text-sm leading-relaxed text-ink/70">{product.description}</p>

            {colors.length > 0 && (
              <div className="mt-6">
                <h3 className="label">Color: <span className="normal-case tracking-normal text-ink">{color}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button key={c} onClick={() => setColor(c)} className={`border px-3 py-2 text-xs transition ${color === c ? "border-ink bg-ink text-sand" : "border-ink/20 hover:border-ink"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center border border-ink/20 bg-white">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={out} aria-label="Decrease quantity" className="grid h-11 w-11 place-items-center disabled:opacity-30"><MinusIcon size={16} /></button>
                <span className="w-10 text-center text-sm" aria-live="polite">{out ? 0 : qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={out || qty >= product.stock} aria-label="Increase quantity" className="grid h-11 w-11 place-items-center disabled:opacity-30"><PlusIcon size={16} /></button>
              </div>
              <button
                onClick={() => toast(toggle(product.id) ? "Saved to wishlist." : "Removed from wishlist.")}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="grid h-11 w-11 place-items-center border border-ink/20 bg-white hover:border-ink"
              >
                <HeartIcon filled={liked} className={liked ? "text-red-600" : ""} />
              </button>
            </div>

            <div className="mt-6 grid gap-3 xs:grid-cols-2">
              <button onClick={add} disabled={out} className="btn">Add to Cart</button>
              <button onClick={buyNow} disabled={out} className="btn-solid">Buy Now</button>
            </div>

            <ul className="mt-8 space-y-3 border-t border-ink/10 pt-6 text-sm text-ink/80">
              <li className="flex items-center gap-3"><TruckIcon size={20} className="text-gold" /> Delivery in 5–10 working days</li>
              <li className="flex items-center gap-3"><ShieldIcon size={20} className="text-gold" /> {product.warranty || "1 Year"} warranty</li>
              <li className="flex items-center gap-3"><ReturnIcon size={20} className="text-gold" /> 7 day return policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex gap-6 border-b border-ink/10">
            {[["description", "Details"], ["specs", "Specifications"], ["delivery", "Delivery"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.18em] ${tab === id ? "border-gold text-gold" : "border-transparent"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="max-w-3xl py-6 text-sm leading-relaxed text-ink/80">
            {tab === "description" && (
              <>
                <p>{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <ul className="mt-4 list-disc space-y-1 pl-5">
                    {product.features.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                )}
              </>
            )}
            {tab === "specs" && (
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
                <dt className="text-ink/50">Category</dt><dd>{product.category}</dd>
                {product.material && (<><dt className="text-ink/50">Material</dt><dd>{product.material}</dd></>)}
                {product.dimensions && (<><dt className="text-ink/50">Dimensions</dt><dd>{product.dimensions}</dd></>)}
                {colors.length > 0 && (<><dt className="text-ink/50">Colors</dt><dd>{colors.join(", ")}</dd></>)}
                <dt className="text-ink/50">Warranty</dt><dd>{product.warranty || "1 Year"}</dd>
              </dl>
            )}
            {tab === "delivery" && (
              <ul className="list-disc space-y-1 pl-5">
                <li>Inside Dhaka: {formatPrice(SHIPPING.dhaka)} · Outside Dhaka: {formatPrice(SHIPPING.outside)}</li>
                <li>Free delivery on orders above {formatPrice(SHIPPING.freeAbove)}</li>
                <li>Delivery takes 5–10 working days. Our team will call you before delivery.</li>
                <li>Cash on Delivery, bKash and Nagad accepted.</li>
              </ul>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="h-display text-2xl sm:text-4xl">You may also like</h2>
            <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-10 xs:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default function ProductDetails() {
  const { slug } = useParams();
  const { getBySlug } = useProducts();
  const product = getBySlug(slug);
  if (!product) {
    return (
      <div className="wrap">
        <EmptyState title="Product not found" text="This product may have been removed." actionLabel="Browse furniture" actionTo="/shop" />
      </div>
    );
  }
  // key resets local state (selected image / color / qty) when navigating between products
  return <ProductView key={product.id} product={product} />;
}
