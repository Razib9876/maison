import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import OrderDetailView from "../components/OrderDetailView";
import { CheckIcon } from "../components/ui/Icons";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";

export default function OrderSuccess() {
  const { id } = useParams();
  const { getOrder } = useOrders();
  const { user } = useAuth();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="wrap">
        <EmptyState title="Order not found" text="We couldn't find this order on this device." actionLabel="Track an order" actionTo="/track-order" />
      </div>
    );
  }

  const mobilePay = order.payment.method !== "cod";

  return (
    <div className="wrap py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white"><CheckIcon size={28} /></span>
        <h1 className="h-display mt-5 text-3xl sm:text-5xl">Thank you, {order.customer.name.split(" ")[0]}!</h1>
        <p className="mt-3 text-sm text-ink/70">
          Your order <b>{order.id}</b> has been placed. {mobilePay ? "We will verify your payment and confirm shortly." : "Our team will call you to confirm delivery."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn">Continue shopping</Link>
          {user ? <Link to={`/account/orders/${order.id}`} className="btn-solid">View my order</Link> : <Link to="/track-order" className="btn-solid">Track order</Link>}
        </div>
        <p className="mt-4 text-xs text-ink/50">Save your order ID. You will need it with your phone number to track this order.</p>
      </div>

      <div className="mt-12">
        <OrderDetailView order={order} />
      </div>
    </div>
  );
}
