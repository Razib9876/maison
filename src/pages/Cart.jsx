import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import Img from "../components/ui/Img";
import { MinusIcon, PlusIcon, TrashIcon } from "../components/ui/Icons";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { COUPONS, SHIPPING } from "../data/config";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const { lines, subtotal, discount, coupon, updateQty, removeItem, applyCoupon, removeCoupon } = useCart();
  const toast = useToast();
  const [code, setCode] = useState("");

  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="Your Cart" />
        <div className="wrap">
          <EmptyState title="Your cart is empty" text="Looks like you haven't added anything yet." actionLabel="Start shopping" actionTo="/shop" />
        </div>
      </>
    );
  }

  const submitCoupon = (e) => {
    e.preventDefault();
    const r = applyCoupon(code);
    toast(r.message, r.ok ? "success" : "error");
    if (r.ok) setCode("");
  };

  const remainingForFree = Math.max(0, SHIPPING.freeAbove - subtotal);

  return (
    <>
      <PageHeader title="Your Cart" crumbs={[{ label: "Cart" }]} />
      <div className="wrap grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_22rem]">
        <section className="min-w-0">
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <Link to={`/product/${l.product.slug}`} className="shrink-0">
                  <Img src={l.product.images && l.product.images[0]} alt={l.product.name} className="h-24 w-24 sm:h-28 sm:w-28" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <Link to={`/product/${l.product.slug}`} className="font-serif text-lg leading-tight hover:text-gold sm:text-xl">{l.product.name}</Link>
                    {l.color && <p className="mt-1 text-xs text-ink/60">Color: {l.color}</p>}
                    <p className="mt-1 text-sm">{formatPrice(l.product.price)}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center border border-ink/20 bg-white">
                      <button onClick={() => updateQty(l.key, l.qty - 1)} aria-label="Decrease quantity" className="grid h-9 w-9 place-items-center"><MinusIcon size={14} /></button>
                      <span className="w-8 text-center text-sm">{l.qty}</span>
                      <button onClick={() => updateQty(l.key, l.qty + 1)} disabled={l.qty >= l.product.stock} aria-label="Increase quantity" className="grid h-9 w-9 place-items-center disabled:opacity-30"><PlusIcon size={14} /></button>
                    </div>
                    <p className="w-24 text-right text-sm font-medium">{formatPrice(l.product.price * l.qty)}</p>
                    <button onClick={() => removeItem(l.key)} aria-label={`Remove ${l.product.name}`} className="text-ink/50 hover:text-red-700"><TrashIcon size={18} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/shop" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] underline underline-offset-4 hover:text-gold">← Continue shopping</Link>
        </section>

        <aside className="card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl">Order Summary</h2>

          {coupon && discount > 0 ? (
            <div className="mt-4 flex items-center justify-between border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
              <span>{coupon} applied</span>
              <button onClick={removeCoupon} className="text-xs underline">Remove</button>
            </div>
          ) : (
            <form onSubmit={submitCoupon} className="mt-4 flex gap-2">
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="input !py-2 uppercase" />
              <button className="btn !px-4">Apply</button>
            </form>
          )}
          {coupon && discount === 0 && COUPONS[coupon] && (
            <p className="mt-2 text-xs text-amber-700">Coupon {coupon} needs a minimum order of {formatPrice(COUPONS[coupon].min)}.</p>
          )}

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd>-{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between text-ink/60"><dt>Delivery</dt><dd>Calculated at checkout</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium"><dt>Estimated total</dt><dd>{formatPrice(subtotal - discount)}</dd></div>
          </dl>

          {remainingForFree > 0 && (
            <p className="mt-3 text-xs text-ink/60">Add {formatPrice(remainingForFree)} more for free delivery.</p>
          )}

          <Link to="/checkout" className="btn-solid mt-6 w-full">Proceed to Checkout</Link>
        </aside>
      </div>
    </>
  );
}
