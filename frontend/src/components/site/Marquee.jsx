import { Leaf } from "lucide-react";
import { useLang } from "@/i18n";
import { SERVICE_KEYS } from "@/lib/site";

export const Marquee = () => {
  const { t } = useLang();
  const items = SERVICE_KEYS.map((k) => t.services.items[k]?.title ?? "");

  return (
    <section
      aria-label={t.services.label}
      className="overflow-hidden border-b border-[#0b6b7b]/15 bg-[#f4f1e8] py-8 md:py-10"
      data-testid="editorial-marquee"
    >
      <div className="marquee-track flex w-max">
        {[0, 1].map((dup) => (
          <div key={dup} aria-hidden={dup === 1} className="flex shrink-0 items-center">
            {items.map((it) => (
              <span key={`${dup}-${it}`} className="flex items-center">
                <span className="whitespace-nowrap px-8 font-display text-4xl italic text-[#0b6b7b] md:px-12 md:text-6xl">
                  {it}
                </span>
                <Leaf className="h-6 w-6 shrink-0 text-[#49b646] md:h-8 md:w-8" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
