import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isValidEmail } from "../lib/format";

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state && location.state.from;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to={from || (user.role === "admin" ? "/admin" : "/account")} replace />;

  const submit = (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return setError("Please enter a valid email address.");
    if (!form.password) return setError("Please enter your password.");
    const r = login(form.email, form.password);
    if (!r.ok) return setError(r.error);
    toast("Welcome back!");
    navigate(from || (r.role === "admin" ? "/admin" : "/account"), { replace: true });
  };

  return (
    <>
      <PageHeader title="Login" eyebrow="Account" crumbs={[{ label: "Login" }]} />
      <div className="wrap py-10 sm:py-14">
        <form onSubmit={submit} noValidate className="card mx-auto max-w-md space-y-5 p-5 sm:p-8">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          </div>
          {error && <p className="err">{error}</p>}
          <button className="btn-solid w-full">Login</button>
          <p className="text-center text-sm text-ink/70">
            New here? <Link to="/register" state={{ from }} className="underline hover:text-gold">Create an account</Link>
          </p>
        </form>
        <p className="mx-auto mt-6 max-w-md text-center text-xs text-ink/50">
          Demo admin: admin@maisonwood.com / admin123
        </p>
      </div>
    </>
  );
}
