import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang } from "@/i18n";
import { NAV_IDS } from "@/lib/site";
import { scrollToId } from "@/lib/smooth";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { EASE } from "./Reveal";

export const Navbar = ({ onBook }) => {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 500);
    setScrolled(y > 40);
  });

  const go = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <motion.header
      animate={{ y: hidden && !open ? "-190%" : "0%" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
      data-testid="site-header"
    >
      <nav
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border border-white/15 py-2 pl-3 pr-2 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 md:pl-4 ${
          scrolled ? "bg-[#0b6b7b]/92 shadow-[0_24px_60px_-24px_rgba(5,47,54,0.7)]" : "bg-[#0b6b7b]/60"
        }`}
      >
        <a href="#home" onClick={(e) => go(e, "home")} data-testid="nav-logo-link" aria-label="Niramaya Physiotherapy">
          <BrandMark />
        </a>
        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_IDS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                className="nav-link rounded-full px-3.5 py-2 text-[14px] font-medium text-white/90 transition-colors duration-300 hover:text-white"
                data-testid={`nav-link-${id}`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={onBook}
            className="btn-leaf hidden !py-2.5 sm:inline-flex"
            data-testid="nav-book-consultation-btn"
          >
            {t.nav.book}
            <ArrowUpRight className="h-4 w-4" />
          </button>
          <MobileMenu open={open} setOpen={setOpen} onBook={onBook} />
        </div>
      </nav>
    </motion.header>
  );
};
