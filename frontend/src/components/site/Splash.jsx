import { IMG } from "@/lib/site";

export const Splash = () => (
  <div className="fixed inset-0 z-[100] grid place-items-center bg-[#0b6b7b]" data-testid="site-splash">
    <span className="h-20 w-20 animate-pulse overflow-hidden rounded-full bg-[#01687b]">
      <img src={IMG.mark} alt="Niramaya Physiotherapy" className="h-full w-full object-cover" />
    </span>
  </div>
);
