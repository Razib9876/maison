import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrdersContext";
import { useToast } from "../context/ToastContext";
import { DISTRICTS } from "../data/config";
import { formatDate, formatPrice, isValidPhone } from "../lib/format";

function ProfileForm({ user, onSave }) {
  const [f, setF] = useState({ name: user.name, phone: user.phone || "", district: user.district || "", address: user.address || "" });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (f.phone && !isValidPhone(f.phone)) er.phone = "Enter a valid Bangladeshi mobile number.";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave({ name: f.name.trim(), phone: f.phone.trim(), district: f.district, address: f.address.trim() });
  };

  return (
    <form onSubmit={submit} noValidate className="card grid max-w-2xl gap-5 p-5 sm:grid-cols-2 sm:p-6">
      <div>
        <label htmlFor="pname" className="label">Full name</label>
        <input id="pname" value={f.name} onChange={set("name")} className={`input ${errors.name ? "input-error" : ""}`} />
        {errors.name && <p className="err">{errors.name}</p>}
      </div>
      <div>
        <label className="label">Email</label>
        <input value={user.email} disabled className="input opacity-60" />
      </div>
      <div>
        <label htmlFor="pphone" className="label">Mobile number</label>
        <input id="pphone" type="tel" value={f.phone} onChange={set("phone")} placeholder="01XXXXXXXXX" className={`input ${errors.phone ? "input-error" : ""}`} />
        {errors.phone && <p className="err">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="pdistrict" className="label">District</label>
        <select id="pdistrict" value={f.district} onChange={set("district")} className="input">
          <option value="">Select district</option>
          {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="paddress" className="label">Default address</label>
        <textarea id="paddress" rows={3} value={f.address} onChange={set("address")} className="input" />
      </div>
      <button className="btn-solid sm:col-span-2 sm:w-fit">Save changes</button>
    </form>
  );
}

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const { orders } = useOrders();
  const toast = useToast();
  const [tab, setTab] = useState("orders");
  const mine = orders.filter((o) => o.userId === user.id);

  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} eyebrow="My Account" crumbs={[{ label: "Account" }]} />
      <div className="wrap py-10 sm:py-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10">
          <div className="flex gap-6">
            {[["orders", "My Orders"], ["profile", "Profile"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-[0.18em] ${tab === id ? "border-gold text-gold" : "border-transparent"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-4 pb-3">
            {user.role === "admin" && <Link to="/admin" className="text-xs uppercase tracking-[0.18em] underline">Admin panel</Link>}
            <button onClick={logout} className="text-xs uppercase tracking-[0.18em] text-red-700 underline">Log out</button>
          </div>
        </div>

        {tab === "orders" &&
          (mine.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-ink/70">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-solid mt-6">Start shopping</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {mine.map((o) => (
                <li key={o.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="font-serif text-xl">{o.id}</p>
                    <p className="text-xs text-ink/60">{formatDate(o.createdAt)} · {o.items.reduce((s, i) => s + i.qty, 0)} items</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <StatusBadge status={o.status} />
                    <span className="text-sm font-medium">{formatPrice(o.pricing.total)}</span>
                    <Link to={`/account/orders/${o.id}`} className="btn !py-2">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          ))}

        {tab === "profile" && (
          <ProfileForm
            user={user}
            onSave={(patch) => {
              updateProfile(patch);
              toast("Profile updated.");
            }}
          />
        )}
      </div>
    </>
  );
}
