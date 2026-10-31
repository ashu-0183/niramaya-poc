import { IMG } from "@/lib/site";

export const BrandMark = ({ className = "" }) => (
  <span className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
    <span className="relative h-9 w-9 shrink-0 sm:h-10 sm:w-10 overflow-hidden rounded-full bg-[#01687b] ring-1 ring-white/25 md:h-11 md:w-11">
      <img src={IMG.mark} alt="Niramaya Physiotherapy logo" className="h-full w-full object-cover" />
    </span>
    <span className="leading-none text-white">
      <span className="block font-display text-[1.35rem] tracking-tight md:text-[1.5rem]">Niramaya</span>
      <span className="mt-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/85 sm:tracking-[0.18em]">
        Physiotherapy
        <span className="font-deva text-[13px] normal-case tracking-normal text-[#c6f0a8]">निरामयाः</span>
      </span>
    </span>
  </span>
);
