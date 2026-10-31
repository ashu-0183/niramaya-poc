import { useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { api, formatApiError } from "@/content/api";
import { Card, ConfirmDelete, FieldLabel, PanelHeader } from "./ui";

const PasswordCard = () => {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.next.length < 8) return toast.error("New password must be at least 8 characters");
    if (form.next !== form.confirm) return toast.error("New passwords don't match");
    setBusy(true);
    try {
      await api.post("/auth/change-password", { current_password: form.current, new_password: form.next });
      toast.success("Password changed");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <Card>
      <h2 className="font-display text-2xl text-[#0b6b7b]">Change your password</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-3" data-testid="admin-password-form">
        {[["current", "Current password", "current-password"], ["next", "New password", "new-password"], ["confirm", "Repeat new password", "new-password"]].map(([k, label, ac]) => (
          <div key={k}>
            <FieldLabel htmlFor={`pw-${k}`}>{label}</FieldLabel>
            <Input id={`pw-${k}`} type="password" autoComplete={ac} value={form[k]} onChange={set(k)} required className="h-11 rounded-xl bg-white" data-testid={`admin-password-${k}`} />
          </div>
        ))}
        <div className="md:col-span-3">
          <button type="submit" disabled={busy} className="btn-teal" data-testid="admin-password-submit">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
          </button>
        </div>
      </form>
    </Card>
  );
};

const AdminsCard = ({ user }) => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api.get("/admins").then((res) => {
      if (alive) setAdmins(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/admins", { ...form, name: form.name.trim() || "Admin" });
      setAdmins((list) => [...list, data]);
      setForm({ name: "", email: "", password: "" });
      toast.success("Admin added — share the password with them privately");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/admins/${id}`);
      setAdmins((list) => list.filter((a) => a.id !== id));
      toast.success("Admin removed");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail));
    }
  };

  return (
    <Card>
      <h2 className="font-display text-2xl text-[#0b6b7b]">Admins</h2>
      <p className="mt-1 text-[14px] text-[#4b656b]">Everyone listed here can sign in and edit the website. Changes here apply immediately.</p>
      <ul className="mt-5 divide-y divide-[#0b6b7b]/10 rounded-xl border border-[#0b6b7b]/12" data-testid="admin-list">
        {admins.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 px-4 py-3" data-testid={`admin-row-${a.email}`}>
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#0f2327]">{a.name}{a.id === user.id && <span className="ml-2 rounded-full bg-[#e6f3f5] px-2 py-0.5 text-xs text-[#0b6b7b]">You</span>}</p>
              <p className="truncate text-[13px] text-[#4b656b]">{a.email}</p>
            </div>
            {a.id !== user.id && <ConfirmDelete label={`Remove ${a.email}`} onConfirm={() => remove(a.id)} testid={`admin-remove-${a.email}`} />}
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="mt-6 grid gap-4 md:grid-cols-3" data-testid="admin-add-form">
        <div>
          <FieldLabel htmlFor="new-admin-name">Name</FieldLabel>
          <Input id="new-admin-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl bg-white" data-testid="admin-add-name" />
        </div>
        <div>
          <FieldLabel htmlFor="new-admin-email">Email</FieldLabel>
          <Input id="new-admin-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-11 rounded-xl bg-white" data-testid="admin-add-email" />
        </div>
        <div>
          <FieldLabel htmlFor="new-admin-password">Temporary password (8+ characters)</FieldLabel>
          <Input id="new-admin-password" type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 rounded-xl bg-white" data-testid="admin-add-password" />
        </div>
        <div className="md:col-span-3">
          <button type="submit" disabled={busy} className="btn-teal" data-testid="admin-add-submit">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Add admin
          </button>
        </div>
      </form>
    </Card>
  );
};

export const AccountPanel = ({ user }) => (
  <div className="space-y-4" data-testid="admin-account-panel">
    <PanelHeader title="Account & admins" desc={`Signed in as ${user.email}.`} />
    <PasswordCard />
    <AdminsCard user={user} />
  </div>
);
