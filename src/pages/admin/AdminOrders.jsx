import { useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/ui/StatusBadge";
import { useOrders } from "../../context/OrdersContext";
import { ORDER_STATUSES } from "../../data/config";
import { formatDate, formatPrice } from "../../lib/format";

export default function AdminOrders() {
  const { orders } = useOrders();
  const [status, setStatus] = useState("All");
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const list = orders.filter((o) => {
    if (status !== "All" && o.status !== status) return false;
    if (term && !`${o.id} ${o.customer.name} ${o.customer.phone}`.toLowerCase().includes(term)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl">Orders ({orders.length})</h1>
        <div className="flex flex-wrap gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ID, name, phone" aria-label="Search orders" className="input !w-56 !py-2" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" className="input !w-auto !py-2">
            <option>All</option>
            {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b border-ink/10 text-[0.68rem] uppercase tracking-[0.18em] text-ink/60">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Date</th><th className="p-3">Payment</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {list.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.customer.name}<p className="text-xs text-ink/60">{o.customer.phone}</p></td>
                <td className="p-3 text-xs">{formatDate(o.createdAt)}</td>
                <td className="p-3 uppercase">{o.payment.method}</td>
                <td className="p-3">{formatPrice(o.pricing.total)}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-right"><Link to={`/admin/orders/${o.id}`} className="underline">Open</Link></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-ink/60">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
