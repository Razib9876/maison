import { Link, useParams } from "react-router-dom";
import OrderDetailView from "../../components/OrderDetailView";
import { useOrders } from "../../context/OrdersContext";
import { useToast } from "../../context/ToastContext";
import { ORDER_STATUSES } from "../../data/config";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { getOrder, updateStatus } = useOrders();
  const toast = useToast();
  const order = getOrder(id);

  if (!order) {
    return (
      <div>
        <p className="text-sm">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 inline-block underline">← Back to orders</Link>
      </div>
    );
  }

  const change = (e) => {
    const next = e.target.value;
    if (next === "Cancelled" && !window.confirm("Cancel this order? Stock will be restored.")) return;
    updateStatus(order.id, next);
    toast(`Status updated to ${next}.`);
  };

  return (
    <div>
      <Link to="/admin/orders" className="text-xs uppercase tracking-[0.18em] underline">← Back to orders</Link>
      <div className="card my-6 flex flex-wrap items-center gap-4 p-5">
        <label htmlFor="st" className="label !mb-0">Update status</label>
        <select id="st" value={order.status} onChange={change} className="input !w-auto !py-2">
          {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <OrderDetailView order={order} />
    </div>
  );
}
