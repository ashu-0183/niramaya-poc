import { ArrowDown, ArrowUp, CheckCircle2, CircleAlert, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { videoInfo } from "@/content/video";
import { Card, ConfirmDelete, FieldLabel, IconBtn, LANG_TABS, PanelHeader, move, newId } from "./ui";

const LinkStatus = ({ url }) => {
  if (!url.trim()) return <p className="mt-1.5 text-[13px] text-[#4b656b]">No link — the card shows "Coming soon".</p>;
  const info = videoInfo(url);
  if (!info || !url.trim().startsWith("http")) {
    return <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#b42318]"><CircleAlert className="h-4 w-4" />Paste a full link starting with https://</p>;
  }
  const label = { youtube: "YouTube video — plays on the page", vimeo: "Vimeo video — plays on the page", file: "Video file — plays on the page", link: "Other link — opens in a new tab" }[info.kind];
  return <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-[#26752a]"><CheckCircle2 className="h-4 w-4" />{label}</p>;
};

export const VideosPanel = ({ videos, onChange }) => {
  const list = Array.isArray(videos) ? videos : [];
  const set = (i, patch) => onChange(list.map((v, j) => (j === i ? { ...v, ...patch } : v)));
  const add = () => onChange([...list, { id: newId(), url: "", title: { en: "", hi: "", mr: "" } }]);

  return (
    <div data-testid="admin-videos-panel">
      <PanelHeader title="Video stories" desc="Paste a YouTube, Vimeo or video file link. Upload patient videos to YouTube (Unlisted works) and paste the link here.">
        <button type="button" onClick={add} disabled={list.length >= 12} className="btn-teal" data-testid="admin-add-video-btn">
          <Plus className="h-4 w-4" /> Add video
        </button>
      </PanelHeader>
      {list.length === 0 && <Card className="text-[15px] text-[#4b656b]">No videos. The video area is hidden on the website.</Card>}
      <div className="space-y-4">
        {list.map((v, i) => {
          const p = `admin-video-${i}`;
          return (
            <Card key={v.id ?? i} data-testid={p}>
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl text-[#0b6b7b]">Video {i + 1}</h3>
                <div className="flex gap-2">
                  <IconBtn label="Move up" disabled={i === 0} onClick={() => onChange(move(list, i, -1))} testid={`${p}-up`}><ArrowUp className="h-4 w-4" /></IconBtn>
                  <IconBtn label="Move down" disabled={i === list.length - 1} onClick={() => onChange(move(list, i, 1))} testid={`${p}-down`}><ArrowDown className="h-4 w-4" /></IconBtn>
                  <ConfirmDelete label="Remove this video" onConfirm={() => onChange(list.filter((_, j) => j !== i))} testid={`${p}-delete`} />
                </div>
              </div>
              <div className="mt-5">
                <FieldLabel htmlFor={`${p}-url`}>Video link</FieldLabel>
                <Input id={`${p}-url`} value={v.url ?? ""} onChange={(e) => set(i, { url: e.target.value })} placeholder="https://youtu.be/..." className="h-11 rounded-xl bg-white" data-testid={`${p}-url`} />
                <LinkStatus url={v.url ?? ""} />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {LANG_TABS.map((l) => (
                  <div key={l.code}>
                    <FieldLabel htmlFor={`${p}-title-${l.code}`}>Title — {l.label}</FieldLabel>
                    <Input id={`${p}-title-${l.code}`} value={v.title?.[l.code] ?? ""} onChange={(e) => set(i, { title: { ...(v.title ?? {}), [l.code]: e.target.value } })} className="h-11 rounded-xl bg-white" data-testid={`${p}-title-${l.code}`} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
