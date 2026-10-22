import { Link, useParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import OrderDetailView from "../components/OrderDetailView";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useToast } from "../context/ToastContext";

export default function AccountOrder() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getOrder, updateStatus } = useOrders();
  const toast = useToast();
  const order = getOrder(id);

  if (!order || (order.userId !== user.id && user.role !== "admin")) {
    return (
      <div className="wrap">
        <EmptyState title="Order not found" actionLabel="Back to my account" actionTo="/account" />
      </div>
    );
  }

  const cancel = () => {
    if (!window.confirm("Cancel this order?")) return;
    updateStatus(order.id, "Cancelled");
    toast("Order cancelled.");
  };

  return (
    <>
      <PageHeader title="Order Details" eyebrow="My Account" crumbs={[{ label: "Account", to: "/account" }, { label: order.id }]} />
      <div className="wrap py-10 sm:py-14">
        <OrderDetailView order={order} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/account" className="btn">← All orders</Link>
          {order.status === "Pending" && <button onClick={cancel} className="btn !border-red-700 !text-red-700 hover:!bg-red-700 hover:!text-white">Cancel order</button>}
        </div>
      </div>
    </>
  );
}
