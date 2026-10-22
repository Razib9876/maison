import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../lib/format";

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state && location.state.from;
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to={from || "/account"} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (!isValidEmail(form.email)) er.email = "Please enter a valid email address.";
    if (form.password.length < 6) er.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) er.confirm = "Passwords do not match.";
    setErrors(er);
    if (Object.keys(er).length) return;
    const r = register(form);
    if (!r.ok) return setErrors({ email: r.error });
    toast("Account created. Welcome!");
    navigate(from || "/account", { replace: true });
  };

  const cls = (k) => `input ${errors[k] ? "input-error" : ""}`;

  return (
    <>
      <PageHeader title="Create Account" eyebrow="Account" crumbs={[{ label: "Register" }]} />
      <div className="wrap py-10 sm:py-14">
        <form onSubmit={submit} noValidate className="card mx-auto max-w-md space-y-5 p-5 sm:p-8">
          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input id="name" autoComplete="name" value={form.name} onChange={set("name")} className={cls("name")} />
            {errors.name && <p className="err">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} className={cls("email")} />
            {errors.email && <p className="err">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" type="password" autoComplete="new-password" value={form.password} onChange={set("password")} className={cls("password")} />
            {errors.password && <p className="err">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="label">Confirm password</label>
            <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} className={cls("confirm")} />
            {errors.confirm && <p className="err">{errors.confirm}</p>}
          </div>
          <button className="btn-solid w-full">Create Account</button>
          <p className="text-center text-sm text-ink/70">
            Already have an account? <Link to="/login" state={{ from }} className="underline hover:text-gold">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
}
