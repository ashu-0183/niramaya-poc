import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_KEYS } from "@/lib/site";
import { Card, ConfirmDelete, FieldLabel, IconBtn, LANG_TABS, NativeSelect, PanelHeader, move, newId } from "./ui";

const ReviewEditor = ({ r, i, count, services, set, onMove, onRemove }) => {
  const p = `admin-review-${i}`;
  return (
    <Card data-testid={p}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-xl text-[#0b6b7b]">Review {i + 1}</h3>
          {i === 0 && <span className="rounded-full bg-[#49b646] px-2.5 py-0.5 text-xs font-semibold text-[#052f36]">Shown large</span>}
        </div>
        <div className="flex gap-2">
          <IconBtn label="Move up" disabled={i === 0} onClick={() => onMove(-1)} testid={`${p}-up`}><ArrowUp className="h-4 w-4" /></IconBtn>
          <IconBtn label="Move down" disabled={i === count - 1} onClick={() => onMove(1)} testid={`${p}-down`}><ArrowDown className="h-4 w-4" /></IconBtn>
          <ConfirmDelete label="Remove this review" onConfirm={onRemove} testid={`${p}-delete`} />
        </div>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div>
          <FieldLabel htmlFor={`${p}-name`}>Patient name</FieldLabel>
          <Input id={`${p}-name`} value={r.name ?? ""} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Priya S." className="h-11 rounded-xl bg-white" data-testid={`${p}-name`} />
        </div>
        <div>
          <FieldLabel htmlFor={`${p}-service`}>Treatment</FieldLabel>
          <NativeSelect id={`${p}-service`} value={r.service ?? ""} onChange={(v) => set({ service: v })} testid={`${p}-service`}>
            <option value="">— None —</option>
            {SERVICE_KEYS.map((k) => (
              <option key={k} value={k}>{services?.[k]?.title ?? k}</option>
            ))}
          </NativeSelect>
        </div>
        <div>
          <FieldLabel htmlFor={`${p}-rating`}>Stars</FieldLabel>
          <NativeSelect id={`${p}-rating`} value={r.rating ?? 5} onChange={(v) => set({ rating: Number(v) })} testid={`${p}-rating`}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{"★".repeat(n)} ({n})</option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {LANG_TABS.map((l) => (
          <div key={l.code}>
            <FieldLabel htmlFor={`${p}-text-${l.code}`}>Review — {l.label}</FieldLabel>
            <Textarea id={`${p}-text-${l.code}`} rows={4} value={r.text?.[l.code] ?? ""} onChange={(e) => set({ text: { ...(r.text ?? {}), [l.code]: e.target.value } })} className="rounded-xl bg-white text-[15px]" data-testid={`${p}-text-${l.code}`} />
          </div>
        ))}
      </div>
      <label className="mt-4 flex items-center gap-3 text-sm text-[#0f2327]">
        <Switch checked={Boolean(r.sample)} onCheckedChange={(v) => set({ sample: v })} data-testid={`${p}-sample-switch`} />
        Show the "Sample review" tag
      </label>
    </Card>
  );
};

export const ReviewsPanel = ({ reviews, services, onChange }) => {
  const list = Array.isArray(reviews) ? reviews : [];
  const set = (i, patch) => onChange(list.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const add = () => onChange([...list, { id: newId(), name: "", service: "", rating: 5, sample: false, text: { en: "", hi: "", mr: "" } }]);

  return (
    <div data-testid="admin-reviews-panel">
      <PanelHeader title="Reviews" desc="Add real patient reviews. The first one is shown large. If Hindi or Marathi is left empty, the English text is shown. Reviews with no text are hidden.">
        <button type="button" onClick={add} disabled={list.length >= 30} className="btn-teal" data-testid="admin-add-review-btn">
          <Plus className="h-4 w-4" /> Add review
        </button>
      </PanelHeader>
      {list.length === 0 && <Card className="text-[15px] text-[#4b656b]">No reviews yet. The reviews area is hidden on the website until you add one.</Card>}
      <div className="space-y-4">
        {list.map((r, i) => (
          <ReviewEditor
            key={r.id ?? i}
            r={r}
            i={i}
            count={list.length}
            services={services}
            set={(patch) => set(i, patch)}
            onMove={(dir) => onChange(move(list, i, dir))}
            onRemove={() => onChange(list.filter((_, j) => j !== i))}
          />
        ))}
      </div>
    </div>
  );
};
