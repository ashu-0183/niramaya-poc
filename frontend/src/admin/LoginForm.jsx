import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatApiError } from "@/content/api";
import { IMG } from "@/lib/site";
import { FieldLabel } from "./ui";

export const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(formatApiError(err.response?.data?.detail) || err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grain relative grid min-h-screen place-items-center bg-[#0b6b7b] px-4 py-10" data-testid="admin-login-page">
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded-[2rem] bg-[#fbfaf6] p-8 shadow-[0_50px_100px_-40px_rgba(2,30,35,0.8)] md:p-10" data-testid="admin-login-form">
        <div className="flex items-center gap-3">
          <span className="h-12 w-12 overflow-hidden rounded-full bg-[#01687b]">
            <img src={IMG.mark} alt="" className="h-full w-full object-cover" />
          </span>
          <div>
            <p className="font-display text-2xl leading-none text-[#0b6b7b]">Niramaya</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4b656b]">Admin · <span className="normal-case tracking-normal">निरामयाः</span></p>
          </div>
        </div>
        <h1 className="mt-8 font-display text-3xl text-[#0f2327]">Sign in to edit the website</h1>
        <div className="mt-8 space-y-5">
          <div>
            <FieldLabel htmlFor="admin-email">Email</FieldLabel>
            <Input id="admin-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-xl bg-white" data-testid="admin-login-email-input" />
          </div>
          <div>
            <FieldLabel htmlFor="admin-password">Password</FieldLabel>
            <Input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-12 rounded-xl bg-white" data-testid="admin-login-password-input" />
          </div>
        </div>
        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-[#b42318]" role="alert" data-testid="admin-login-error">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-teal mt-8 w-full !py-3.5" data-testid="admin-login-submit-btn">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Sign in
        </button>
        <a href="/" className="mt-5 block text-center text-sm text-[#4b656b] underline-offset-4 hover:underline" data-testid="admin-login-back-link">
          Back to website
        </a>
      </form>
    </div>
  );
};
