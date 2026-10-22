import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOrders } from "../../context/OrdersContext";
import { useProducts } from "../../context/ProductsContext";
import { useToast } from "../../context/ToastContext";
import { formatDate, formatPrice } from "../../lib/format";

function Stat({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="text-[0.68rem] uppercase tracking-[0.2em] text-ink/60">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/50">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { orders } = useOrders();
  const { products, resetProducts } = useProducts();
  const toast = useToast();

  const valid = orders.filter((o) => o.status !== "Cancelled");
  const revenue = valid.reduce((s, o) => s + o.pricing.total, 0);
  const pending = orders.filter((o) => o.status === "Pending").length;
  const low = products.filter((p) => p.stock <= 3);
  const recent = orders.slice(0, 5);

  const reset = () => {
    if (!window.confirm("Reset all products to the original demo data? Stock changes and edits will be lost.")) return;
    resetProducts();
    toast("Products reset to demo data.");
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-4 xs:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue" value={formatPrice(revenue)} hint="Excluding cancelled orders" />
        <Stat label="Orders" value={orders.length} hint={`${valid.length} active`} />
        <Stat label="Pending" value={pending} hint="Waiting for confirmation" />
        <Stat label="Products" value={products.length} hint={`${low.length} low or out of stock`} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Recent orders</h2>
            <Link to="/admin/orders" className="text-xs uppercase tracking-[0.18em] underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {recent.map((o) => (
                <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div className="min-w-0">
                    <Link to={`/admin/orders/${o.id}`} className="font-medium underline">{o.id}</Link>
                    <p className="text-xs text-ink/60">{o.customer.name} · {formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3"><StatusBadge status={o.status} /><span>{formatPrice(o.pricing.total)}</span></div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl">Low stock</h2>
            <Link to="/admin/products" className="text-xs uppercase tracking-[0.18em] underline">Manage</Link>
          </div>
          {low.length === 0 ? (
            <p className="mt-4 text-sm text-ink/60">All products are well stocked.</p>
          ) : (
            <ul className="mt-4 divide-y divide-ink/10">
              {low.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <span className="min-w-0 truncate">{p.name}</span>
                  <span className={p.stock === 0 ? "text-red-700" : "text-amber-700"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <button onClick={reset} className="text-xs uppercase tracking-[0.18em] text-red-700 underline">Reset products to demo data</button>
    </div>
  );
}
