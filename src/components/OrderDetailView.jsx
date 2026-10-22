import Img from "./ui/Img";
import StatusBadge from "./ui/StatusBadge";
import { PAYMENT_METHODS } from "../data/config";
import { formatDate, formatPrice } from "../lib/format";

const STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function OrderDetailView({ order }) {
  const cancelled = order.status === "Cancelled";
  const currentIdx = STEPS.indexOf(order.status);
  const method = PAYMENT_METHODS.find((m) => m.id === order.payment.method);
  const atFor = (s) => {
    const h = order.history.find((x) => x.status === s);
    return h ? formatDate(h.at) : "";
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section className="card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Order</p>
              <h2 className="font-serif text-2xl">{order.id}</h2>
              <p className="text-xs text-ink/60">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {cancelled ? (
            <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-800">This order was cancelled.</p>
          ) : (
            <ol className="mt-6 space-y-4">
              {STEPS.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <li key={s} className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem] ${done ? "border-gold bg-gold text-white" : "border-ink/30"}`}>
                      {done ? "✓" : ""}
                    </span>
                    <div>
                      <p className={`text-sm ${done ? "font-medium" : "text-ink/50"}`}>{s}</p>
                      {done && <p className="text-xs text-ink/50">{atFor(s)}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <h3 className="font-serif text-xl">Items</h3>
          <ul className="mt-4 divide-y divide-ink/10">
            {order.items.map((it, idx) => (
              <li key={`${it.productId}-${idx}`} className="flex gap-4 py-4">
                <Img src={it.image} alt={it.name} className="h-20 w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-tight">{it.name}</p>
                  {it.color && <p className="text-xs text-ink/60">Color: {it.color}</p>}
                  <p className="text-xs text-ink/60">Qty: {it.qty} × {formatPrice(it.price)}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="space-y-8">
        <section className="card p-5 sm:p-6">
          <h3 className="font-serif text-xl">Summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.pricing.subtotal)}</dd></div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-green-700"><dt>Discount {order.pricing.coupon && `(${order.pricing.coupon})`}</dt><dd>-{formatPrice(order.pricing.discount)}</dd></div>
            )}
            <div className="flex justify-between"><dt>Delivery</dt><dd>{order.pricing.shipping ? formatPrice(order.pricing.shipping) : "Free"}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium"><dt>Total</dt><dd>{formatPrice(order.pricing.total)}</dd></div>
          </dl>
        </section>

        <section className="card p-5 text-sm sm:p-6">
          <h3 className="font-serif text-xl">Delivery</h3>
          <p className="mt-3 font-medium">{order.customer.name}</p>
          <p>{order.customer.phone}</p>
          {order.customer.email && <p>{order.customer.email}</p>}
          <p className="mt-2 text-ink/70">{order.address.address}, {order.address.district}</p>
          {order.address.note && <p className="mt-2 text-xs text-ink/60">Note: {order.address.note}</p>}
        </section>

        <section className="card p-5 text-sm sm:p-6">
          <h3 className="font-serif text-xl">Payment</h3>
          <p className="mt-3">{method ? method.label : order.payment.method}</p>
          {order.payment.trxId && (
            <p className="mt-1 text-xs text-ink/60">TrxID: {order.payment.trxId} · From: {order.payment.senderNumber}</p>
          )}
        </section>
      </aside>
    </div>
  );
}
