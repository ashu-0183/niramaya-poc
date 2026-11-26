import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRANCH_LIST } from "@/content/branches";
import { useSite } from "@/content/SiteProvider";
import { useLang } from "@/i18n";
import { NAV_IDS } from "@/lib/site";
import { scrollToId } from "@/lib/smooth";
import { EASE } from "./Reveal";

export const MobileMenu = ({ open, setOpen, onBook }) => {
  const { t } = useLang();
  const { settings, phoneTel, branch } = useSite();
  const navigate = useNavigate();

  const go = (id) => {
    setOpen(false);
    if (branch) {
      setTimeout(() => navigate(id === "home" ? "/" : `/#${id}`), 150);
      return;
    }
    setTimeout(() => scrollToId(id), 380);
  };

  const goBranch = (path) => {
    setOpen(false);
    setTimeout(() => navigate(path), 150);
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
        className="grain w-full border-none bg-[#073f48] p-0 text-white sm:max-w-md [&>button]:right-6 [&>button]:top-6 [&>button]:z-20 [&>button]:text-white [&>button]:opacity-90"
        data-testid="mobile-menu"
      >
        <SheetTitle className="sr-only">{t.nav.menu}</SheetTitle>
        <div className="relative z-10 flex h-full flex-col justify-between overflow-y-auto p-8 pt-20">
          <div>
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

            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c6f0a8]">
                Branches
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => goBranch("/")}
                  className={`w-full rounded-xl px-3.5 py-2 text-left text-base transition-colors hover:bg-white/10 hover:text-[#8be04e] ${
                    !branch ? "font-semibold text-[#8be04e]" : "text-white/90"
                  }`}
                  data-testid="mobile-branch-main"
                >
                  Life Republic (Main)
                </button>
                {BRANCH_LIST.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/branches/${b.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goBranch(`/branches/${b.slug}`);
                    }}
                    className={`rounded-xl px-3.5 py-2 text-base transition-colors hover:bg-white/10 hover:text-[#8be04e] ${
                      branch?.slug === b.slug ? "font-semibold text-[#8be04e]" : "text-white/90"
                    }`}
                    data-testid={`mobile-branch-${b.slug}`}
                  >
                    {b.shortName}
                  </Link>
                ))}
              </div>
            </div>
          </div>

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
            <a href={phoneTel} className="btn-ghost-light w-full" data-testid="mobile-menu-call-link">
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};