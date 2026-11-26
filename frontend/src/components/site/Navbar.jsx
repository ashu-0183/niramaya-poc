import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BRANCH_LIST } from "@/content/branches";
import { useSite } from "@/content/SiteProvider";
import { useLang } from "@/i18n";
import { NAV_IDS } from "@/lib/site";
import { scrollToId } from "@/lib/smooth";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { EASE } from "./Reveal";

export const Navbar = ({ onBook }) => {
  const { t } = useLang();
  const { branch } = useSite();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 500);
    setScrolled(y > 40);
  });

  useEffect(() => {
    if (!branchesOpen) return;
    const onOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBranchesOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, [branchesOpen]);

  const go = (e, id) => {
    e.preventDefault();
    setBranchesOpen(false);
    if (branch) {
      navigate(id === "home" ? "/" : `/#${id}`);
      return;
    }
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
        className={`mx-auto flex max-w-[1440px] items-center justify-between gap-2 rounded-full border border-white/15 py-2 pl-3 pr-2 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 md:pl-4 ${
          scrolled ? "bg-[#0b6b7b]/92 shadow-[0_24px_60px_-24px_rgba(5,47,54,0.7)]" : "bg-[#0b6b7b]/60"
        }`}
      >
        <a
          href="#home"
          onClick={(e) => go(e, "home")}
          className="shrink-0"
          data-testid="nav-logo-link"
          aria-label="Niramaya Physiotherapy"
        >
          <BrandMark />
        </a>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_IDS.map((id) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                className="nav-link whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13.5px] font-medium text-white/90 transition-colors duration-300 hover:text-white"
                data-testid={`nav-link-${id}`}
              >
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <div ref={dropdownRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => setBranchesOpen((prev) => !prev)}
              aria-expanded={branchesOpen}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/15"
              data-testid="nav-branches-btn"
            >
              <span>{branch ? branch.shortName : "Branches"}</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${branchesOpen ? "rotate-180" : ""}`} />
            </button>
            {branchesOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/15 bg-[#052f36]/95 p-1.5 text-white shadow-2xl backdrop-blur-xl"
                data-testid="nav-branches-menu"
              >
                <Link
                  to="/"
                  onClick={() => setBranchesOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-[#8be04e]"
                  data-testid="nav-branch-main"
                >
                  Life Republic (Main)
                </Link>
                {BRANCH_LIST.map((b) => (
                  <Link
                    key={b.slug}
                    to={`/branches/${b.slug}`}
                    onClick={() => setBranchesOpen(false)}
                    className={`block rounded-xl px-3.5 py-2.5 text-sm transition-colors hover:bg-white/10 hover:text-[#8be04e] ${
                      branch?.slug === b.slug ? "font-semibold text-[#8be04e]" : "text-white/90"
                    }`}
                    data-testid={`nav-branch-${b.slug}`}
                  >
                    {b.shortName}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={onBook}
            className="btn-leaf hidden shrink-0 whitespace-nowrap !px-4 !py-2.5 text-[13.5px] sm:inline-flex"
            data-testid="nav-book-consultation-btn"
          >
            <span>{t.nav.book}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </button>

          <MobileMenu open={open} setOpen={setOpen} onBook={onBook} />
        </div>
      </nav>
    </motion.header>
  );
};