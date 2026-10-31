import { ArrowUp, ArrowUpRight } from "lucide-react";
import { useLang } from "@/i18n";
import { ADDRESS_LINE, NAV_IDS, PHONE_DISPLAY, PHONE_TEL, waLink } from "@/lib/site";
import { scrollToId } from "@/lib/smooth";
import { BrandMark } from "./BrandMark";
import { Reveal } from "./Reveal";

export const Footer = ({ onBook }) => {
  const { t } = useLang();
  const f = t.footer;
  const go = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="relative overflow-hidden bg-[#052f36] text-white" data-testid="site-footer">
      <div className="shell pt-24 md:pt-32">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-16 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="font-display leading-display max-w-2xl text-4xl md:text-6xl">{f.cta}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <button type="button" onClick={onBook} className="btn-leaf group" data-testid="footer-book-btn">
              {f.ctaBtn}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </Reveal>
        </div>

        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <BrandMark />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-white/75">{f.tagline}</p>
          </div>
          <div className="md:col-span-3">
            <h3 className="eyebrow text-[#c6f0a8]">{f.quick}</h3>
            <ul className="mt-6 space-y-3">
              {NAV_IDS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => go(e, id)} className="text-[15px] text-white/80 transition-colors hover:text-white" data-testid={`footer-link-${id}`}>
                    {t.nav[id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 md:col-span-5">
            <div>
              <h3 className="eyebrow text-[#c6f0a8]">{f.contactT}</h3>
              <address className="mt-6 max-w-sm text-[15px] not-italic leading-relaxed text-white/80">{ADDRESS_LINE}</address>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                <a href={PHONE_TEL} className="text-white transition-colors hover:text-[#8be04e]" data-testid="footer-phone-link">{PHONE_DISPLAY}</a>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-white transition-colors hover:text-[#8be04e]" data-testid="footer-whatsapp-link">WhatsApp</a>
              </div>
            </div>
            <div>
              <h3 className="eyebrow text-[#c6f0a8]">{f.hoursT}</h3>
              <p className="mt-4 text-[15px] text-white/80">{t.contact.hours}</p>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[3vw] whitespace-nowrap text-center font-display text-[24vw] leading-[0.85] tracking-tight text-white/[0.06]">
          Niramaya
        </p>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
        <p>{f.rights}</p>
        <a href="#home" onClick={(e) => go(e, "home")} className="inline-flex items-center gap-2 transition-colors hover:text-white" data-testid="footer-back-to-top">
          {f.top}
          <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
};
