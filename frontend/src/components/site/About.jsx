import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/i18n";
import { useSite } from "@/content/SiteProvider";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export const About = () => {
  const { t } = useLang();
  const a = t.about;
  const { img } = useSite();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);

  return (
    <section id="about" className="relative bg-[#f4f1e8] py-24 md:py-36" data-testid="about-section">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading label={a.label} title={a.title} em={a.em} />
          <Reveal delay={0.1} className="mt-12">
            <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] md:rounded-tl-[10rem]">
              <motion.img
                src={img("about")}
                alt={a.imgAlt}
                loading="lazy"
                style={{ y, scale: 1.2 }}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-5 left-5 rounded-full bg-[#f4f1e8]/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b6b7b] backdrop-blur">
                {a.chip}
              </span>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 lg:pt-28">
          <Reveal>
            <p className="font-display text-3xl leading-[1.22] text-[#0f2327] md:text-[2.5rem]" data-testid="about-lead">
              {a.lead}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-base leading-relaxed text-[#4b656b] md:text-lg">{a.body}</p>
          </Reveal>
          <ol className="mt-14 border-t border-[#0b6b7b]/15">
            {a.pillars.map((p, i) => (
              <Reveal
                as="li"
                key={p.t}
                delay={0.08 * i}
                className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-[#0b6b7b]/15 py-7"
                data-testid={`about-pillar-${i}`}
              >
                <span className="font-display text-xl italic text-[#2e8a2b]">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl text-[#0b6b7b] transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                    {p.t}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4b656b]">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
