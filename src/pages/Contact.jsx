import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../context/ToastContext";
import { SITE } from "../data/config";
import { isValidEmail } from "../lib/format";
import { load, save } from "../lib/storage";

export default function Contact() {
  const toast = useToast();
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!isValidEmail(f.email)) er.email = "Please enter a valid email.";
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const list = load("mw_messages", []);
    save("mw_messages", [...list, { ...f, at: new Date().toISOString() }]);
    setF({ name: "", email: "", message: "" });
    toast("Message sent. We'll get back to you soon.");
  };

  const cls = (k) => `input ${errors[k] ? "input-error" : ""}`;

  return (
    <>
      <PageHeader title="Contact Us" eyebrow="Get in touch" crumbs={[{ label: "Contact" }]} />
      <div className="wrap grid gap-10 py-10 sm:py-14 lg:grid-cols-[1fr_22rem]">
        <form onSubmit={submit} noValidate className="card space-y-5 p-5 sm:p-8">
          <div>
            <label htmlFor="cname" className="label">Name</label>
            <input id="cname" value={f.name} onChange={set("name")} className={cls("name")} />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cemail" className="label">Email</label>
            <input id="cemail" type="email" value={f.email} onChange={set("email")} className={cls("email")} />
            {errors.email && <p className="err">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="cmsg" className="label">Message</label>
            <textarea id="cmsg" rows={5} value={f.message} onChange={set("message")} className={cls("message")} />
            {errors.message && <p className="err">{errors.message}</p>}
          </div>
          <button className="btn-solid">Send message</button>
        </form>

        <aside className="space-y-6 text-sm">
          <div><h3 className="eyebrow">Showroom</h3><p className="mt-2">{SITE.address}</p></div>
          <div><h3 className="eyebrow">Phone</h3><p className="mt-2">{SITE.phone}</p></div>
          <div><h3 className="eyebrow">Email</h3><p className="mt-2">{SITE.email}</p></div>
          <div><h3 className="eyebrow">Hours</h3><p className="mt-2">{SITE.hours}</p></div>
        </aside>
      </div>
    </>
  );
}
