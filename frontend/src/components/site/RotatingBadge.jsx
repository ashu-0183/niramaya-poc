import { motion } from "framer-motion";
import { IMG } from "@/lib/site";
import { EASE } from "./Reveal";

export const RotatingBadge = ({ text, fit, onClick, className = "" }) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label={text.replace(/•/g, "").trim()}
    initial={{ scale: 0, rotate: -120 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay: 1.1, duration: 1, ease: EASE }}
    whileHover={{ scale: 1.07 }}
    className={`relative grid h-28 w-28 place-items-center rounded-full bg-[#49b646] text-[#052f36] shadow-[0_30px_60px_-20px_rgba(5,47,54,0.7)] sm:h-36 sm:w-36 ${className}`}
    data-testid="hero-rotating-badge"
  >
    <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
      </defs>
      <text className="fill-current font-semibold uppercase" style={{ fontSize: fit ? 14 : 17 }}>
        <textPath href="#badge-circle" {...(fit ? { textLength: 470, lengthAdjust: "spacing" } : {})}>
          {text}
        </textPath>
      </text>
    </svg>
    <span className="relative h-12 w-12 overflow-hidden rounded-full bg-[#01687b] sm:h-16 sm:w-16">
      <img src={IMG.mark} alt="" className="h-full w-full object-cover" />
    </span>
  </motion.button>
);
