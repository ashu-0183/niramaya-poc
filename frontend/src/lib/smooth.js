import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis = null;

export const useLenis = () => {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let id = 0;
    const raf = (time) => {
      lenis?.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
};

export const scrollToId = (id) => {
  const el = id === "home" ? 0 : document.getElementById(id);
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    return;
  }
  if (el === 0) window.scrollTo({ top: 0, behavior: "smooth" });
  else el.scrollIntoView({ behavior: "smooth" });
};
