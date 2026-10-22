import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import OrderDetailView from "../components/OrderDetailView";
import { useOrders } from "../context/OrdersContext";
import { isValidPhone } from "../lib/format";

export default function TrackOrder() {
  const { trackOrder, getOrder } = useOrders();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [orderIdFound, setOrderIdFound] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setOrderIdFound("");
    if (!orderId.trim()) return setError("Please enter your order ID.");
    if (!isValidPhone(phone)) return setError("Please enter the mobile number used for the order.");
    const o = trackOrder(orderId, phone);
    if (!o) return setError("No order found with these details. Please check and try again.");
    setOrderIdFound(o.id);
  };

  // read live from context so status updates show up
  const found = orderIdFound ? getOrder(orderIdFound) : null;

  return (
    <>
      <PageHeader title="Track Your Order" eyebrow="Support" crumbs={[{ label: "Track Order" }]} />
      <div className="wrap py-10 sm:py-14">
        <form onSubmit={submit} noValidate className="card mx-auto grid max-w-2xl gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <label htmlFor="oid" className="label">Order ID</label>
            <input id="oid" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="MW-260101-1234" className="input" />
          </div>
          <div>
            <label htmlFor="ph" className="label">Mobile number</label>
            <input id="ph" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="input" />
          </div>
          {error && <p className="err sm:col-span-2">{error}</p>}
          <button className="btn-solid sm:col-span-2">Track Order</button>
        </form>

        {found && (
          <div className="mt-12">
            <OrderDetailView order={found} />
          </div>
        )}
      </div>
    </>
  );
}
