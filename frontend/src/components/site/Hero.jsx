import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { useSite } from "@/content/SiteProvider";
import { scrollToId } from "@/lib/smooth";
import { EASE } from "./Reveal";
import { RotatingBadge } from "./RotatingBadge";

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

export const Hero = ({ onBook }) => {
  const { t, lang } = useLang();
  const { img, phoneTel, settings } = useSite();
  const h = t.hero;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const markX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 100, damping: 18 });
  const rotX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 100, damping: 18 });
  const px = useTransform(mx, (v) => `${v * 100}%`);
  const py = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${px} ${py}, rgba(139,224,78,0.16), transparent 65%)`;

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      className="grain relative isolate min-h-[100svh] overflow-hidden bg-[#0b6b7b] text-white"
      data-testid="hero-section"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: spotlight }} />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-[#49b646]/25 blur-[120px]" />
      <motion.div
        aria-hidden
        style={{ x: markX }}
        className="text-outline font-deva-display pointer-events-none absolute -bottom-[4vw] left-[-3vw] select-none whitespace-nowrap text-[38vw] leading-none lg:text-[24vw]"
      >
        निरामयाः
      </motion.div>

      <div className="shell relative z-10 grid items-center gap-16 pb-24 pt-32 md:pt-40 lg:grid-cols-12 lg:gap-8 lg:pb-32">
        <motion.div style={{ y: copyY }} className="lg:col-span-7">
          <motion.p {...fadeUp(0.1)} className="eyebrow text-[#d6f5c4]">
            {h.eyebrow}
          </motion.p>
          <h1
            key={lang}
            className="font-display leading-display mt-8 text-[3.3rem] tracking-[-0.02em] sm:text-7xl lg:text-[5.9rem] xl:text-[6.8rem]"
            data-testid="hero-headline"
          >
            {h.lines.map((line, i) => (
              <span key={line} className="mask-line block overflow-hidden">
                <motion.span
                  className={`block ${i === h.em ? "italic text-[#8be04e]" : ""}`}
                  initial={{ y: "118%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.15, delay: 0.25 + i * 0.14, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p {...fadeUp(0.75)} className="mt-8 max-w-xl text-base leading-relaxed text-white/85 md:text-lg" data-testid="hero-subtext">
            {h.sub}
          </motion.p>
          <motion.div {...fadeUp(0.9)} className="mt-10 flex flex-wrap items-center gap-3">
            <button type="button" onClick={onBook} className="btn-leaf group" data-testid="hero-book-consultation-btn">
              {h.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button type="button" onClick={() => scrollToId("services")} className="btn-ghost-light" data-testid="hero-explore-services-btn">
              {h.explore}
            </button>
          </motion.div>
          <motion.div {...fadeUp(1.05)} className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/85">
            <span className="flex items-center gap-2" data-testid="hero-location">
              <MapPin className="h-4 w-4 text-[#8be04e]" />
              {h.location}
            </span>
            <a href={phoneTel} className="flex items-center gap-2 transition-colors hover:text-white" data-testid="hero-call-link">
              <Phone className="h-4 w-4 text-[#8be04e]" />
              {settings.phone}
            </a>
          </motion.div>
        </motion.div>

        <div className="relative lg:col-span-5 [perspective:1400px]">
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY }}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.4, delay: 0.35, ease: EASE }}
            className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-b-[2.25rem] rounded-t-[999px] shadow-[0_60px_120px_-40px_rgba(2,30,35,0.85)]"
            data-testid="hero-image-frame"
          >
            <motion.img src={img("hero")} alt={h.imgAlt} style={{ y: imgY, scale: 1.2 }} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#052f36]/75 via-transparent to-[#0b6b7b]/10" />
            <div className="absolute inset-x-5 bottom-5 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-sm text-white backdrop-blur-md">
              <span className="font-deva">{h.caption}</span>
            </div>
          </motion.div>
          <RotatingBadge
            text={h.badge}
            fit={lang === "en"}
            onClick={onBook}
            className="!absolute -left-1 top-6 sm:-left-6 lg:-left-16 lg:top-auto lg:bottom-16"
          />
        </div>
      </div>

      <motion.button
        type="button"
        {...fadeUp(1.3)}
        onClick={() => scrollToId("about")}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 transition-colors hover:text-white md:flex"
        data-testid="hero-scroll-cue"
      >
        <span className="font-deva normal-case tracking-normal">{h.scroll}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.button>
    </section>
  );
};
