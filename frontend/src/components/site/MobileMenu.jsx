import { motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useLang } from "@/i18n";
import { NAV_IDS, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";
import { scrollToId } from "@/lib/smooth";
import { EASE } from "./Reveal";

export const MobileMenu = ({ open, setOpen, onBook }) => {
  const { t } = useLang();
  const go = (id) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 380);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={t.nav.menu}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0b6b7b] transition-transform duration-300 hover:scale-105 xl:hidden"
          data-testid="mobile-menu-trigger"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        data-lenis-prevent
        className="grain w-full border-none bg-[#073f48] p-0 text-white sm:max-w-md [&>button]:right-6 [&>button]:top-6 [&>button]:text-white [&>button]:opacity-90"
        data-testid="mobile-menu"
      >
        <SheetTitle className="sr-only">{t.nav.menu}</SheetTitle>
        <div className="relative z-10 flex h-full flex-col justify-between overflow-y-auto p-8 pt-20">
          <ul className="space-y-1">
            {NAV_IDS.map((id, i) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  className="flex items-baseline gap-4 border-b border-white/10 py-3 font-display text-3xl transition-colors hover:text-[#8be04e] sm:text-4xl"
                  data-testid={`mobile-nav-link-${id}`}
                >
                  <span className="text-xs font-semibold text-[#8be04e]">0{i + 1}</span>
                  {t.nav[id]}
                </a>
              </motion.li>
            ))}
          </ul>
          <div className="mt-10 space-y-4">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(onBook, 380);
              }}
              className="btn-leaf w-full"
              data-testid="mobile-menu-book-btn"
            >
              {t.nav.book}
              <ArrowUpRight className="h-4 w-4" />
            </button>
            <a href={PHONE_TEL} className="btn-ghost-light w-full" data-testid="mobile-menu-call-link">
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
