import {
  Accessibility, Activity, ArrowUpRight, Baby, Bone, Brain, Hand,
  HeartPulse, PersonStanding, Syringe, Trophy, Zap,
} from "lucide-react";
import { Reveal } from "./Reveal";

const ICONS = {
  sports: Trophy, back: PersonStanding, neck: Activity, arthritis: Bone,
  postsurgery: HeartPulse, neuro: Brain, pediatric: Baby, geriatric: Accessibility,
  dryneedling: Syringe, manual: Hand, electro: Zap,
};

const BookBtn = ({ id, label, onBook, tone }) => (
  <button
    type="button"
    onClick={() => onBook(id)}
    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${tone}`}
    data-testid={`service-book-${id}`}
  >
    {label}
    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </button>
);

export const ServiceCard = ({ id, num, item, image, className = "", bookLabel, onBook, delay }) => {
  const Icon = ICONS[id] ?? Activity;

  if (image) {
    return (
      <Reveal
        delay={delay}
        whileHover={{ y: -6 }}
        className={`group relative isolate min-h-[340px] overflow-hidden rounded-[1.75rem] bg-[#052f36] text-white ${className}`}
        data-testid={`service-card-${id}`}
      >
        <img
          src={image}
          alt={item?.title}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80 transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#052f36] via-[#052f36]/55 to-[#052f36]/5" />
        <div className="flex h-full flex-col justify-between p-7 md:p-9">
          <div className="flex items-start justify-between">
            <span className="font-display text-base italic text-white/85">{num}</span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#49b646] text-[#052f36] transition-transform duration-500 group-hover:rotate-[-12deg]">
              <Icon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-24">
            <h3 className="font-display text-3xl leading-tight md:text-4xl">{item?.title}</h3>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85">{item?.desc}</p>
            <BookBtn id={id} label={bookLabel} onBook={onBook} tone="text-[#c6f0a8]" />
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal
      delay={delay}
      whileHover={{ y: -6 }}
      className={`group flex flex-col justify-between rounded-[1.75rem] border border-[#0b6b7b]/12 bg-white p-7 transition-colors duration-500 hover:bg-[#0b6b7b] ${className}`}
      data-testid={`service-card-${id}`}
    >
      <div className="flex items-start justify-between">
        <span className="font-display text-base italic text-[#4b656b] transition-colors duration-500 group-hover:text-white/80">{num}</span>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e6f3f5] text-[#0b6b7b] transition-[transform,background-color,color] duration-500 group-hover:rotate-[-12deg] group-hover:bg-[#49b646] group-hover:text-[#052f36]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-10">
        <h3 className="font-display text-2xl leading-tight text-[#0f2327] transition-colors duration-500 group-hover:text-white">
          {item?.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4b656b] transition-colors duration-500 group-hover:text-white/85">
          {item?.desc}
        </p>
        <BookBtn id={id} label={bookLabel} onBook={onBook} tone="text-[#0b6b7b] group-hover:text-[#c6f0a8]" />
      </div>
    </Reveal>
  );
};
