import { Reveal } from "./Reveal";

export const SectionHeading = ({ label, title, em, sub, dark = false, className = "", testid }) => (
  <div className={`max-w-3xl ${className}`} data-testid={testid}>
    <Reveal>
      <span className={`eyebrow ${dark ? "text-[#c6f0a8]" : "text-[#26752a]"}`}>{label}</span>
    </Reveal>
    <Reveal delay={0.08}>
      <h2
        className={`font-display leading-display mt-6 text-4xl tracking-tight sm:text-5xl lg:text-6xl ${
          dark ? "text-white" : "text-[#0b6b7b]"
        }`}
      >
        {title}{" "}
        {em && <em className={dark ? "text-[#8be04e]" : "text-[#2e8a2b]"}>{em}</em>}
      </h2>
    </Reveal>
    {sub && (
      <Reveal delay={0.16}>
        <p className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${dark ? "text-white/80" : "text-[#4b656b]"}`}>
          {sub}
        </p>
      </Reveal>
    )}
  </div>
);
