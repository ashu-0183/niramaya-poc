import { MessageCircle } from "lucide-react";
import { useLang } from "@/i18n";
import { useSite } from "@/content/SiteProvider";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { ServiceCard } from "./ServiceCard";

const ORDER = [
  "sports", "back", "neck", "arthritis", "postsurgery", "neuro",
  "pediatric", "electro", "geriatric", "dryneedling", "manual",
];
const WIDE = { sports: "md:col-span-2 lg:row-span-2", electro: "md:col-span-2" };

const ServiceCta = ({ s, href, delay }) => (
  <Reveal
    delay={delay}
    className="flex flex-col justify-between rounded-[1.75rem] bg-[#49b646] p-7 text-[#052f36]"
    data-testid="service-cta-tile"
  >
    <h3 className="font-display text-2xl leading-tight md:text-[1.75rem]">{s.ctaTitle}</h3>
    <div>
      <p className="mt-4 text-[15px] leading-relaxed text-[#052f36]/90">{s.ctaText}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#052f36] px-5 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        data-testid="service-cta-whatsapp-link"
      >
        <MessageCircle className="h-4 w-4" />
        {s.ctaBtn}
      </a>
    </div>
  </Reveal>
);

export const Services = ({ onBook }) => {
  const { t } = useLang();
  const s = t.services;
  const { img, waLink } = useSite();
  const images = { sports: img("sports"), electro: img("electro") };

  return (
    <section id="services" className="bg-[#f4f1e8] pb-24 md:pb-36" data-testid="services-section">
      <div className="shell">
        <div className="flex flex-col gap-8 border-t border-[#0b6b7b]/15 pt-20 md:pt-28 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading label={s.label} title={s.title} em={s.em} />
          <Reveal delay={0.15} className="max-w-sm">
            <p className="text-base leading-relaxed text-[#4b656b] md:text-lg">{s.sub}</p>
          </Reveal>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(270px,auto)] lg:grid-cols-4" data-testid="services-grid">
          {ORDER.map((key, i) => (
            <ServiceCard
              key={key}
              id={key}
              num={String(i + 1).padStart(2, "0")}
              item={s.items[key]}
              image={images[key]}
              className={WIDE[key] ?? ""}
              bookLabel={s.book}
              onBook={onBook}
              delay={(i % 4) * 0.06}
            />
          ))}
          <ServiceCta s={s} href={waLink()} delay={0.18} />
        </div>
      </div>
    </section>
  );
};
