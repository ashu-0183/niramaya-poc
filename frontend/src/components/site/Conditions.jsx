import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, MessageCircle } from "lucide-react";
import { useLang } from "@/i18n";
import { IMG, waLink } from "@/lib/site";
import { EASE, Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const REGION_IMG = [IMG.spine, IMG.shoulder, IMG.knee, IMG.rehab];

export const Conditions = () => {
  const { t } = useLang();
  const c = t.conditions;
  const [active, setActive] = useState(0);
  const region = c.regions[active] ?? c.regions[0];

  return (
    <section id="conditions" className="grain relative isolate overflow-hidden bg-[#073f48] py-24 text-white md:py-36" data-testid="conditions-section">
      <div className="shell relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading dark label={c.label} title={c.title} em={c.em} sub={c.sub} />
          <Reveal delay={0.1} className="mt-12 border-t border-white/15" role="tablist">
            {c.regions.map((r, i) => (
              <button
                key={r.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`group flex w-full items-center justify-between gap-4 border-b border-white/15 py-5 text-left transition-colors duration-300 ${
                  i === active ? "text-[#8be04e]" : "text-white/80 hover:text-white"
                }`}
                data-testid={`condition-tab-${i}`}
              >
                <span className="flex items-baseline gap-5">
                  <span className="font-display text-sm italic">0{i + 1}</span>
                  <span className="font-display text-2xl md:text-3xl">{r.name}</span>
                </span>
                <ArrowRight
                  className={`h-5 w-5 shrink-0 transition-[transform,opacity] duration-500 ${
                    i === active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:opacity-60"
                  }`}
                />
              </button>
            ))}
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal className="relative aspect-[16/11] overflow-hidden rounded-[2rem] md:rounded-tr-[8rem]" data-testid="conditions-image-frame">
            {REGION_IMG.map((src, i) => (
              <motion.img
                key={src}
                src={src}
                alt={c.regions[i]?.name ?? ""}
                loading="lazy"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.08 }}
                transition={{ duration: 1, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#052f36]/80 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-display text-3xl italic text-white md:text-5xl">{region.name}</span>
          </Reveal>
          <motion.ul
            key={`${active}-${region.name}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-8 grid gap-x-10 sm:grid-cols-2"
            data-testid="conditions-list"
          >
            {region.items.map((it) => (
              <li key={it} className="flex items-center gap-3 border-b border-white/10 py-4 text-[17px] text-white/90">
                <Leaf className="h-4 w-4 shrink-0 text-[#8be04e]" />
                {it}
              </li>
            ))}
          </motion.ul>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-white/80">{c.note}</p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light shrink-0"
              data-testid="conditions-ask-whatsapp-link"
            >
              <MessageCircle className="h-4 w-4" />
              {c.ask}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
