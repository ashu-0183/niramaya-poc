import { useRef, useState } from "react";
import { Loader2, RotateCcw, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { api, fileUrl, formatApiError } from "@/content/api";
import { DEFAULT_IMAGES, IMAGE_SLOTS } from "@/content/defaults";
import { Card, PanelHeader } from "./ui";

const MAX_BYTES = 8 * 1024 * 1024;

const PhotoSlot = ({ slot, value, onChange, onExpired }) => {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const src = fileUrl(value || DEFAULT_IMAGES[slot.key] || "");
  const isDefault = !value || value === DEFAULT_IMAGES[slot.key];
  const p = `admin-photo-${slot.key}`;

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("Image must be under 8 MB");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/uploads", form);
      onChange(data.url);
      toast.success("Photo uploaded — press Save to publish it");
    } catch (err) {
      if (err.response?.status === 401) onExpired();
      toast.error(formatApiError(err.response?.data?.detail));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex flex-col gap-4 !p-4" data-testid={p}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e6f3f5]">
        {src ? (
          <img src={src} alt={slot.label} className="h-full w-full object-cover" data-testid={`${p}-preview`} />
        ) : (
          <div className="grid h-full place-items-center text-center text-sm text-[#4b656b]">
            <span className="flex flex-col items-center gap-2"><UserRound className="h-8 w-8" />Logo placeholder is shown</span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-6 w-6 animate-spin text-[#0b6b7b]" />
          </div>
        )}
      </div>
      <div>
        <p className="font-semibold text-[#0f2327]">{slot.label}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-[#4b656b]">{slot.hint}</p>
      </div>
      <div className="mt-auto flex gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className="btn-teal flex-1 !py-2.5" data-testid={`${p}-upload-btn`}>
          <Upload className="h-4 w-4" /> Upload
        </button>
        {!isDefault && (
          <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-1.5 rounded-full border border-[#0b6b7b]/20 px-4 text-sm font-semibold text-[#0b6b7b] hover:bg-[#e6f3f5]" data-testid={`${p}-reset-btn`}>
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pick} data-testid={`${p}-input`} />
    </Card>
  );
};

export const PhotosPanel = ({ images, onChange, onExpired }) => (
  <div data-testid="admin-photos-panel">
    <PanelHeader title="Photos" desc="Upload JPG, PNG or WebP photos (up to 8 MB). Large photos are resized automatically. Press Save to publish." />
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {IMAGE_SLOTS.map((slot) => (
        <PhotoSlot key={slot.key} slot={slot} value={images?.[slot.key] ?? ""} onChange={(v) => onChange(slot.key, v)} onExpired={onExpired} />
      ))}
    </div>
  </div>
);
