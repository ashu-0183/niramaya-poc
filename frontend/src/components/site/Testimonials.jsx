import { useState } from "react";
import { ExternalLink, MessageCircle, Play, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSite } from "@/content/SiteProvider";
import { videoInfo } from "@/content/video";
import { useLang } from "@/i18n";
import { IMG } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const Stars = ({ label, rating, tone }) => (
  <div className={`flex gap-1 ${tone}`} role="img" aria-label={`${label}: ${rating}/5`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Star key={i} className={`h-4 w-4 fill-current ${i < rating ? "" : "opacity-25"}`} />
    ))}
  </div>
);

const VideoMedia = ({ info }) => {
  if (info?.kind === "file") {
    return <video src={info.embed} controls autoPlay playsInline className="aspect-video w-full rounded-t-[1.75rem] bg-black" />;
  }
  if (info?.embed) {
    return (
      <iframe
        src={`${info.embed}?autoplay=1`}
        title="Video testimonial"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="aspect-video w-full rounded-t-[1.75rem] border-0 bg-black"
      />
    );
  }
  return (
    <div className="grain relative isolate grid aspect-video place-items-center overflow-hidden rounded-t-[1.75rem] bg-[#073f48]">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-[#49b646] text-[#052f36]">
        <Play className="ml-1 h-6 w-6 fill-current" />
      </span>
    </div>
  );
};

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
      <Stars label={s.ratingAria} rating={r.rating} tone={featured ? "text-[#8be04e]" : "text-[#49b646]"} />
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
      {r.sample && (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${featured ? "bg-white/15 text-white" : "bg-[#e6f3f5] text-[#0b6b7b]"}`}>
          {s.sample}
        </span>
      )}
    </div>
  </Reveal>
);

const VideoCard = ({ v, s, index, onOpen }) => (
  <Reveal delay={index * 0.08}>
    <button
      type="button"
      onClick={onOpen}
      className="grain group relative isolate flex aspect-[16/11] w-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[#073f48] p-6 text-left text-white"
      data-testid={`video-testimonial-${index}`}
    >
      {v.info?.thumb ? (
        <>
          <img src={v.info.thumb} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105" />
          <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#052f36] via-[#052f36]/40 to-transparent" />
        </>
      ) : (
        <img src={IMG.mark} alt="" className="absolute -right-10 -top-10 -z-10 w-48 rounded-full opacity-20 transition-transform duration-700 group-hover:scale-110" />
      )}
      <span className="relative z-10 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{v.info ? s.play : s.soon}</span>
      <span className="relative z-10 grid h-16 w-16 place-items-center self-center rounded-full bg-[#49b646] text-[#052f36] transition-transform duration-500 group-hover:scale-110" aria-label={s.play}>
        <Play className="ml-1 h-6 w-6 fill-current" />
      </span>
      <span className="relative z-10 font-display text-xl md:text-2xl">{v.title}</span>
    </button>
  </Reveal>
);

export const Testimonials = () => {
  const { t, lang } = useLang();
  const { reviews, videos, waLink } = useSite();
  const s = t.testimonials;
  const [video, setVideo] = useState(null);
  const list = (Array.isArray(reviews) ? reviews : [])
    .map((r, i) => ({
      key: r?.id ?? `r-${i}`,
      sample: Boolean(r?.sample),
      rating: Math.min(5, Math.max(1, Number(r?.rating) || 5)),
      name: r?.name?.trim() || s.anon,
      meta: t.services.items[r?.service]?.title ?? "",
      text: r?.text?.[lang]?.trim() || r?.text?.en?.trim() || "",
    }))
    .filter((r) => r.text);
  const [featured, ...rest] = list;
  const side = rest.slice(0, 2);
  const extra = rest.slice(2);
  const vids = (Array.isArray(videos) ? videos : [])
    .map((v, i) => ({
      key: v?.id ?? `v-${i}`,
      url: v?.url ?? "",
      info: videoInfo(v?.url),
      title: v?.title?.[lang]?.trim() || v?.title?.en?.trim() || "",
    }))
    .filter((v) => v.title || v.url);

  return (
    <section id="testimonials" className="bg-[#e9f2f1] py-24 md:py-36" data-testid="testimonials-section">
      <div className="shell">
        <SectionHeading label={s.label} title={s.title} em={s.em} sub={s.sub} />
        {featured && (
          <div className="mt-14 grid gap-4 lg:grid-cols-12" data-testid="reviews-grid">
            <ReviewCard r={featured} s={s} featured index={0} className={side.length ? "lg:col-span-7" : "lg:col-span-12"} />
            {side.length > 0 && (
              <div className="grid gap-4 lg:col-span-5">
                {side.map((r, i) => (
                  <ReviewCard key={r.key} r={r} s={s} index={i + 1} />
                ))}
              </div>
            )}
            {extra.map((r, i) => (
              <ReviewCard key={r.key} r={r} s={s} index={i + 3} className="lg:col-span-4" />
            ))}
          </div>
        )}

        {vids.length > 0 && (
        <div className="mt-20 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <h3 className="font-display text-3xl text-[#0b6b7b] md:text-4xl">{s.videoT}</h3>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[15px] text-[#4b656b]">{s.videoSub}</p>
          </Reveal>
        </div>
        )}
        {vids.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {vids.map((v, i) => (
              <VideoCard key={v.key} v={v} s={s} index={i} onOpen={() => setVideo(v)} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={Boolean(video)} onOpenChange={(o) => { if (!o) setVideo(null); }}>
        <DialogContent
          className={`${video?.info?.embed ? "max-w-3xl" : "max-w-lg"} rounded-[1.75rem] border-none bg-[#fbfaf6] p-0 sm:rounded-[1.75rem]`}
          data-testid="video-testimonial-dialog"
        >
          <VideoMedia info={video?.info} />
          <div className="p-7">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl text-[#0b6b7b]">{video?.title || s.dialogTitle}</DialogTitle>
              <DialogDescription className="pt-2 text-[15px] leading-relaxed text-[#4b656b]">
                {video?.info?.embed ? s.dialogTitle : s.dialogText}
              </DialogDescription>
            </DialogHeader>
            {video?.info?.kind === "link" && (
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-leaf mt-6" data-testid="video-dialog-open-link">
                <ExternalLink className="h-4 w-4" />
                {s.play}
              </a>
            )}
            {!video?.info && (
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn-leaf mt-6" data-testid="video-dialog-share-link">
                <MessageCircle className="h-4 w-4" />
                {s.share}
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
