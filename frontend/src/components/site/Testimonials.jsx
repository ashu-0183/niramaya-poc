import { useState } from "react";
import { MessageCircle, Play, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLang } from "@/i18n";
import { IMG, waLink } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const Stars = ({ label, tone }) => (
  <div className={`flex gap-1 ${tone}`} role="img" aria-label={label}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className="h-4 w-4 fill-current" />
    ))}
  </div>
);

const ReviewCard = ({ r, s, featured, className = "", index }) => (
  <Reveal
    delay={index * 0.08}
    className={`relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-7 md:p-9 ${
      featured ? "grain isolate bg-[#0b6b7b] text-white" : "border border-[#0b6b7b]/12 bg-white text-[#0f2327]"
    } ${className}`}
    data-testid={`review-card-${index}`}
  >
    <span aria-hidden className={`pointer-events-none absolute -top-6 right-6 font-display text-[10rem] leading-none ${featured ? "text-white/10" : "text-[#0b6b7b]/10"}`}>
      &ldquo;
    </span>
    <div className="relative z-10">
      <Stars label={s.ratingAria} tone={featured ? "text-[#8be04e]" : "text-[#49b646]"} />
      <p className={`mt-6 font-display leading-snug ${featured ? "text-3xl md:text-[2.4rem]" : "text-xl md:text-2xl"}`}>{r.text}</p>
    </div>
    <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 overflow-hidden rounded-full bg-[#01687b]">
          <img src={IMG.mark} alt="" className="h-full w-full object-cover" />
        </span>
        <div>
          <p className="text-sm font-semibold">{r.name}</p>
          <p className={`text-[13px] ${featured ? "text-white/80" : "text-[#4b656b]"}`}>{r.meta}</p>
        </div>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${featured ? "bg-white/15 text-white" : "bg-[#e6f3f5] text-[#0b6b7b]"}`}>
        {s.sample}
      </span>
    </div>
  </Reveal>
);

const VideoCard = ({ title, s, index, onOpen }) => (
  <Reveal delay={index * 0.08}>
    <button
      type="button"
      onClick={onOpen}
      className="grain group relative isolate flex aspect-[16/11] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#073f48] p-6 text-left text-white"
      data-testid={`video-testimonial-${index}`}
    >
      <img src={IMG.mark} alt="" className="absolute -right-10 -top-10 -z-10 w-48 rounded-full opacity-20 transition-transform duration-700 group-hover:scale-110" />
      <span className="relative z-10 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{s.soon}</span>
      <span className="relative z-10 grid h-16 w-16 place-items-center self-center rounded-full bg-[#49b646] text-[#052f36] transition-transform duration-500 group-hover:scale-110" aria-label={s.play}>
        <Play className="ml-1 h-6 w-6 fill-current" />
      </span>
      <span className="relative z-10 font-display text-xl md:text-2xl">{title}</span>
    </button>
  </Reveal>
);

export const Testimonials = () => {
  const { t } = useLang();
  const s = t.testimonials;
  const [video, setVideo] = useState(null);
  const [featured, ...rest] = s.reviews;

  return (
    <section id="testimonials" className="bg-[#e9f2f1] py-24 md:py-36" data-testid="testimonials-section">
      <div className="shell">
        <SectionHeading label={s.label} title={s.title} em={s.em} sub={s.sub} />
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <ReviewCard r={featured} s={s} featured index={0} className="lg:col-span-7" />
          <div className="grid gap-4 lg:col-span-5">
            {rest.map((r, i) => (
              <ReviewCard key={`${r.meta}-${i}`} r={r} s={s} index={i + 1} />
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h3 className="font-display text-3xl text-[#0b6b7b] md:text-4xl">{s.videoT}</h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[15px] text-[#4b656b]">{s.videoSub}</p>
          </Reveal>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {s.videos.map((v, i) => (
            <VideoCard key={v} title={v} s={s} index={i} onOpen={() => setVideo(v)} />
          ))}
        </div>
      </div>

      <Dialog open={Boolean(video)} onOpenChange={(o) => !o && setVideo(null)}>
        <DialogContent className="max-w-lg rounded-[1.75rem] border-none bg-[#fbfaf6] p-0 sm:rounded-[1.75rem]" data-testid="video-testimonial-dialog">
          <div className="grain relative isolate grid aspect-video place-items-center overflow-hidden rounded-t-[1.75rem] bg-[#073f48]">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#49b646] text-[#052f36]">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
          </div>
          <div className="p-7">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[#0b6b7b]">{video || s.dialogTitle}</DialogTitle>
              <DialogDescription className="pt-2 text-[15px] leading-relaxed text-[#4b656b]">{s.dialogText}</DialogDescription>
            </DialogHeader>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-leaf mt-6" data-testid="video-dialog-share-link">
              <MessageCircle className="h-4 w-4" />
              {s.share}
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
