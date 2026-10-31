import { forwardRef } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const LANG_TABS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

export const PanelHeader = ({ title, desc, children }) => (
  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="font-display text-3xl text-[#0b6b7b] md:text-4xl">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#4b656b]">{desc}</p>}
    </div>
    {children}
  </div>
);

export const Card = ({ children, className = "", ...rest }) => (
  <div className={`rounded-2xl border border-[#0b6b7b]/12 bg-white p-5 md:p-6 ${className}`} {...rest}>
    {children}
  </div>
);

export const FieldLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-bold uppercase tracking-[0.12em] text-[#4b656b]">
    {children}
  </label>
);

export const IconBtn = forwardRef(({ label, tone = "default", className = "", testid, children, ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    title={label}
    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
      tone === "danger" ? "border-red-200 text-[#b42318] hover:bg-red-50" : "border-[#0b6b7b]/20 text-[#0b6b7b] hover:bg-[#e6f3f5]"
    } ${className}`}
    data-testid={testid}
    {...rest}
  >
    {children}
  </button>
));
IconBtn.displayName = "IconBtn";

export const LangTabs = ({ value, onChange }) => (
  <div className="inline-flex rounded-full border border-[#0b6b7b]/20 bg-white p-1" role="tablist" data-testid="admin-lang-tabs">
    {LANG_TABS.map((l) => (
      <button
        key={l.code}
        type="button"
        role="tab"
        aria-selected={value === l.code}
        onClick={() => onChange(l.code)}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
          value === l.code ? "bg-[#0b6b7b] text-white" : "text-[#0b6b7b] hover:bg-[#e6f3f5]"
        }`}
        data-testid={`admin-lang-tab-${l.code}`}
      >
        {l.label}
      </button>
    ))}
  </div>
);

export const ConfirmDelete = ({ label, onConfirm, testid }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <IconBtn label={label} tone="danger" testid={testid}>
        <Trash2 className="h-4 w-4" />
      </IconBtn>
    </AlertDialogTrigger>
    <AlertDialogContent className="rounded-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle>{label}?</AlertDialogTitle>
        <AlertDialogDescription>This can't be undone once saved.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel data-testid={`${testid}-cancel`}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-[#b42318] hover:bg-[#912018]" data-testid={`${testid}-confirm`}>
          Remove
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const NativeSelect = ({ id, value, onChange, children, testid }) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="h-11 w-full rounded-xl border border-input bg-white px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0b6b7b]/30"
    data-testid={testid}
  >
    {children}
  </select>
);

export const move = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
};

export const newId = () =>
  (window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`).slice(0, 36);
