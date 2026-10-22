import { useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Img from "../components/ui/Img";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useProducts } from "../context/ProductsContext";
import { useToast } from "../context/ToastContext";
import { DISTRICTS, PAYMENT_METHODS } from "../data/config";
import { calcShipping } from "../lib/pricing";
import { cleanPhone, formatPrice, isValidEmail, isValidPhone } from "../lib/format";

export default function Checkout() {
  const { lines, subtotal, discount, coupon, clear } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const { getById } = useProducts();
  const toast = useToast();
  const navigate = useNavigate();
  const placed = useRef(false);

  const [form, setForm] = useState(() => ({
    name: (user && user.name) || "",
    phone: (user && user.phone) || "",
    email: (user && user.email) || "",
    district: (user && user.district) || "",
    address: (user && user.address) || "",
    note: "",
    payment: "cod",
    senderNumber: "",
    trxId: "",
  }));
  const [errors, setErrors] = useState({});

  if (lines.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const shipping = calcShipping(subtotal, form.district);
  const total = subtotal - discount + shipping;
  const mobilePay = form.payment !== "cod";
  const method = PAYMENT_METHODS.find((m) => m.id === form.payment);

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your full name.";
    if (!isValidPhone(form.phone)) er.phone = "Enter a valid Bangladeshi mobile number (e.g. 01712345678).";
    if (form.email.trim() && !isValidEmail(form.email)) er.email = "Enter a valid email address.";
    if (!form.district) er.district = "Please select your district.";
    if (form.address.trim().length < 10) er.address = "Please enter your full delivery address.";
    if (mobilePay) {
      if (!isValidPhone(form.senderNumber)) er.senderNumber = "Enter the number you paid from.";
      if (!/^[A-Za-z0-9]{6,}$/.test(form.trxId.trim())) er.trxId = "Enter a valid transaction ID (at least 6 letters/numbers).";
    }
    return er;
  };

  const submit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      toast("Please fix the highlighted fields.", "error");
      const first = document.querySelector("[data-invalid='true']");
      if (first && first.scrollIntoView) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    for (const l of lines) {
      const fresh = getById(l.product.id);
      if (!fresh || fresh.stock < l.qty) {
        toast(`Sorry, "${l.product.name}" is no longer available in the requested quantity.`, "error");
        return;
      }
    }

    const order = placeOrder({
      userId: user ? user.id : null,
      customer: { name: form.name.trim(), phone: cleanPhone(form.phone), email: form.email.trim() },
      address: { district: form.district, address: form.address.trim(), note: form.note.trim() },
      payment: {
        method: form.payment,
        senderNumber: mobilePay ? cleanPhone(form.senderNumber) : "",
        trxId: mobilePay ? form.trxId.trim().toUpperCase() : "",
      },
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        image: (l.product.images && l.product.images[0]) || "",
        price: l.product.price,
        qty: l.qty,
        color: l.color,
      })),
      pricing: { subtotal, discount, shipping, total, coupon: discount > 0 ? coupon : "" },
    });

    placed.current = true;
    clear();
    navigate(`/order-success/${order.id}`, { replace: true });
  };

  const field = (k) => ({
    value: form[k],
    onChange: set(k),
    "data-invalid": errors[k] ? "true" : undefined,
    className: `input ${errors[k] ? "input-error" : ""}`,
  });

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <form onSubmit={submit} noValidate className="wrap grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="font-serif text-2xl">Delivery details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label">Full name *</label>
                <input id="name" autoComplete="name" {...field("name")} />
                {errors.name && <p className="err">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">Mobile number *</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" {...field("phone")} />
                {errors.phone && <p className="err">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="email" className="label">Email (optional)</label>
                <input id="email" type="email" autoComplete="email" {...field("email")} />
                {errors.email && <p className="err">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="district" className="label">District *</label>
                <select id="district" {...field("district")}>
                  <option value="">Select district</option>
                  {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.district && <p className="err">{errors.district}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="label">Full address *</label>
                <textarea id="address" rows={3} autoComplete="street-address" placeholder="House, road, area, thana" {...field("address")} />
                {errors.address && <p className="err">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="label">Order note (optional)</label>
                <textarea id="note" rows={2} placeholder="Floor / lift availability, preferred delivery time…" {...field("note")} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl">Payment</h2>
            <div className="mt-5 space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-start gap-3 border p-4 transition ${form.payment === m.id ? "border-ink bg-white" : "border-ink/20 hover:border-ink/50"}`}>
                  <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={set("payment")} className="mt-1 accent-ink" />
                  <span>
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="block text-xs text-ink/60">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {mobilePay && (
              <div className="mt-5 border border-gold/40 bg-white p-4">
                <p className="text-sm">
                  Send <b>{formatPrice(total)}</b> to <b>{method.number}</b> via {method.label}, then enter the details below. We confirm your order after verifying the payment.
                </p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="senderNumber" className="label">Paid from (number) *</label>
                    <input id="senderNumber" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" {...field("senderNumber")} />
                    {errors.senderNumber && <p className="err">{errors.senderNumber}</p>}
                  </div>
                  <div>
                    <label htmlFor="trxId" className="label">Transaction ID *</label>
                    <input id="trxId" placeholder="e.g. 9A7B6C5D4E" {...field("trxId")} />
                    {errors.trxId && <p className="err">{errors.trxId}</p>}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="card h-fit p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-serif text-2xl">Your order</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-3 py-3">
                <Img src={l.product.images && l.product.images[0]} alt={l.product.name} className="h-16 w-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{l.product.name}</p>
                  <p className="text-xs text-ink/60">{l.color && `${l.color} · `}Qty {l.qty}</p>
                </div>
                <p className="text-sm">{formatPrice(l.product.price * l.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount ({coupon})</dt><dd>-{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{!form.district ? "Select district" : shipping ? formatPrice(shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>

          <button type="submit" className="btn-solid mt-6 w-full">Place Order</button>
          <p className="mt-3 text-center text-[0.7rem] text-ink/50">By placing your order you agree to our Terms & Conditions.</p>
        </aside>
      </form>
    </>
  );
}
