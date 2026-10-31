import { useEffect, useState } from "react";
import { ExternalLink, Loader2, LogOut, Save } from "lucide-react";
import { toast } from "sonner";
import { BrandMark } from "@/components/site/BrandMark";
import { api, formatApiError } from "@/content/api";
import { setIn } from "@/content/merge";
import { AccountPanel } from "./AccountPanel";
import { DetailsPanel } from "./DetailsPanel";
import { PhotosPanel } from "./PhotosPanel";
import { ReviewsPanel } from "./ReviewsPanel";
import { TextPanel } from "./TextPanel";
import { VideosPanel } from "./VideosPanel";

const TEXT_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About Us" },
  { id: "services", label: "Services" },
  { id: "conditions", label: "Conditions" },
  { id: "profile", label: "Physiotherapist" },
  { id: "testimonials", label: "Testimonials text" },
  { id: "contact", label: "Contact & form" },
  { id: "nav", label: "Menu" },
  { id: "footer", label: "Footer" },
  { id: "whatsapp", label: "WhatsApp button" },
];
const MANAGE = [
  { id: "reviews", label: "Reviews" },
  { id: "videos", label: "Video stories" },
  { id: "photos", label: "Photos" },
  { id: "details", label: "Contact details" },
  { id: "account", label: "Account & admins" },
];

const NavGroup = ({ title, items, active, onSelect }) => (
  <div className="contents lg:block">
    <p className="mb-2 hidden px-3 text-xs font-bold uppercase tracking-[0.16em] text-[#4b656b] lg:block">{title}</p>
    {items.map((it) => (
      <button
        key={it.id}
        type="button"
        onClick={() => onSelect(it.id)}
        className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors lg:mb-1 lg:block lg:w-full lg:rounded-xl lg:text-left ${
          active === it.id ? "bg-[#0b6b7b] text-white" : "bg-white text-[#0f2327] hover:bg-[#e6f3f5] lg:bg-transparent"
        }`}
        data-testid={`admin-nav-${it.id}`}
      >
        {it.label}
      </button>
    ))}
  </div>
);

export const EditorShell = ({ user, onLogout, onExpired, draft, setDraft, dirty, onSaved }) => {
  const [active, setActive] = useState("hero");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (path, value) => setDraft((d) => setIn(d, path, value));
  const textSection = TEXT_SECTIONS.find((s) => s.id === active);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/content", draft);
      onSaved(data);
      toast.success("Saved — your changes are live on the website");
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Your session expired. Sign in again — your edits are kept.");
        onExpired();
      } else {
        toast.error(formatApiError(err.response?.data?.detail));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1e8] text-[#0f2327]" data-testid="admin-editor">
      <header className="sticky top-0 z-30 bg-[#0b6b7b] text-white shadow-[0_12px_30px_-20px_rgba(5,47,54,0.8)]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-4 py-3 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark className="hidden sm:flex" />
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Content editor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`hidden text-sm md:inline ${dirty ? "text-[#c6f0a8]" : "text-white/75"}`} data-testid="admin-save-status">
              {dirty ? "Unsaved changes" : "All changes saved"}
            </span>
            <a href="/" target="_blank" rel="noopener noreferrer" className="hidden h-10 items-center gap-1.5 rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10 md:inline-flex" data-testid="admin-view-site-link">
              <ExternalLink className="h-4 w-4" /> View site
            </a>
            <button type="button" onClick={save} disabled={!dirty || saving} className="btn-leaf !py-2.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0" data-testid="admin-save-btn">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            <button type="button" onClick={onLogout} aria-label="Sign out" title="Sign out" className="grid h-10 w-10 place-items-center rounded-full border border-white/25 hover:bg-white/10" data-testid="admin-logout-btn">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1320px] gap-6 px-4 py-6 md:px-8 md:py-10 lg:grid-cols-[230px_1fr] lg:gap-10">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:block lg:space-y-6 lg:self-start lg:overflow-visible lg:px-0" data-testid="admin-sidebar">
          <NavGroup title="Page text" items={TEXT_SECTIONS} active={active} onSelect={setActive} />
          <NavGroup title="Manage" items={MANAGE} active={active} onSelect={setActive} />
        </nav>
        <main className="min-w-0 pb-16">
          {textSection && <TextPanel section={textSection.id} title={textSection.label} text={draft.text} update={update} />}
          {active === "reviews" && <ReviewsPanel reviews={draft.reviews} services={draft.text?.en?.services?.items} onChange={(v) => update(["reviews"], v)} />}
          {active === "videos" && <VideosPanel videos={draft.videos} onChange={(v) => update(["videos"], v)} />}
          {active === "photos" && <PhotosPanel images={draft.images} onChange={(k, v) => update(["images", k], v)} onExpired={onExpired} />}
          {active === "details" && <DetailsPanel settings={draft.settings} onChange={(k, v) => update(["settings", k], v)} />}
          {active === "account" && <AccountPanel user={user} />}
        </main>
      </div>
    </div>
  );
};
