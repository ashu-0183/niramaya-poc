import { Award, BadgeCheck, Camera, Clock, GraduationCap, Sparkles } from "lucide-react";
import { useLang } from "@/i18n";
import { IMG } from "@/lib/site";
import { useSite } from "@/content/SiteProvider";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const InfoCard = ({ icon: Icon, title, children, className = "", testid, delay = 0 }) => (
  <Reveal
    delay={delay}
    className={`rounded-[1.5rem] border border-[#0b6b7b]/12 bg-white p-6 md:p-7 ${className}`}
    data-testid={testid}
  >
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f3f5] text-[#0b6b7b]">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#0b6b7b]">{title}</h3>
    </div>
    <div className="mt-5 text-[15px] leading-relaxed text-[#0f2327]">{children}</div>
  </Reveal>
);

const List = ({ items }) => (
  <ul className="space-y-2">
    {items.map((q) => (
      <li key={q} className="flex gap-3">
        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#49b646]" />
        {q}
      </li>
    ))}
  </ul>
);

const PhotoPlaceholder = ({ p, photo }) => (
  <Reveal className="relative lg:sticky lg:top-28">
    <div className="grain relative isolate mx-auto aspect-[4/5] max-w-[440px] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-[#01687b]" data-testid="profile-photo-placeholder">
      {photo ? (
        <img src={photo} alt={p.name} className="absolute inset-0 h-full w-full object-cover" data-testid="profile-photo" />
      ) : (
        <>
          <img src={IMG.mark} alt="" className="absolute left-1/2 top-[40%] w-[64%] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#052f36]/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 z-10 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
            <Camera className="h-5 w-5 shrink-0 text-[#c6f0a8]" />
            <span className="text-sm">{p.photo}</span>
          </div>
        </>
      )}
    </div>
    <div className="absolute -right-2 top-10 rounded-[1.25rem] bg-[#49b646] px-5 py-4 text-[#052f36] shadow-[0_24px_50px_-20px_rgba(5,47,54,0.6)] sm:right-0 lg:-right-6" data-testid="profile-years-badge">
      <span className="block font-display text-4xl leading-none">{p.years}</span>
      <span className="mt-1 block text-xs font-semibold">{p.yearsLabel}</span>
    </div>
  </Reveal>
);

export const Profile = () => {
  const { t } = useLang();
  const p = t.profile;
  const { img } = useSite();

  return (
    <section id="profile" className="relative bg-[#f4f1e8] py-24 md:py-36" data-testid="profile-section">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <PhotoPlaceholder p={p} photo={img("profile")} />
        </div>
        <div className="lg:col-span-7">
          <SectionHeading label={p.label} title={p.name} testid="profile-name" />
          <Reveal delay={0.1}>
            <p className="mt-4 text-base font-semibold text-[#26752a]">{p.role}</p>
          </Reveal>
          <Reveal delay={0.15}>
            <blockquote className="mt-10 border-l-2 border-[#49b646] pl-6 font-display text-2xl italic leading-snug text-[#0f2327] md:text-3xl">
              {p.quote}
            </blockquote>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <InfoCard icon={GraduationCap} title={p.qualificationsT} testid="profile-qualifications">
              <List items={p.qualifications} />
            </InfoCard>
            <InfoCard icon={Clock} title={p.experienceT} testid="profile-experience" delay={0.06}>
              <p>{p.experience}</p>
            </InfoCard>
            <InfoCard icon={Sparkles} title={p.expertiseT} className="sm:col-span-2" testid="profile-expertise">
              <div className="flex flex-wrap gap-2">
                {p.expertise.map((e) => (
                  <span key={e} className="rounded-full border border-[#0b6b7b]/20 bg-[#e6f3f5] px-4 py-2 text-sm text-[#0b6b7b] transition-colors duration-300 hover:bg-[#0b6b7b] hover:text-white">
                    {e}
                  </span>
                ))}
              </div>
            </InfoCard>
            <InfoCard icon={BadgeCheck} title={p.registrationT} testid="profile-registration">
              <p>{p.registration}</p>
            </InfoCard>
            <InfoCard icon={Award} title={p.awardsT} testid="profile-awards" delay={0.06}>
              <List items={p.awards} />
            </InfoCard>
          </div>
        </div>
      </div>
    </section>
  );
};
