import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useLang } from "@/i18n";
import { useSite } from "@/content/SiteProvider";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const InfoRow = ({ icon: Icon, title, children, testid }) => (
  <li className="flex gap-4" data-testid={testid}>
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 text-[#8be04e]">
      <Icon className="h-5 w-5" />
    </span>
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/75">{title}</p>
      <div className="mt-1.5 text-base leading-relaxed text-white">{children}</div>
    </div>
  </li>
);

export const Contact = ({ service, setService }) => {
  const { t } = useLang();
  const c = t.contact;
  const { settings, phoneTel, mapEmbed, mapDirections } = useSite();

  return (
    <section id="contact" className="grain relative isolate overflow-hidden bg-[#0b6b7b] py-24 text-white md:py-36" data-testid="contact-section">
      <div className="shell relative z-10 grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading dark label={c.label} title={c.title} em={c.em} sub={c.sub} />
          <Reveal delay={0.1}>
            <ul className="mt-12 space-y-7">
              <InfoRow icon={MapPin} title={c.visitT} testid="contact-address">
                <address className="not-italic">{settings.address}</address>
              </InfoRow>
              <InfoRow icon={Phone} title={c.callT} testid="contact-phone">
                <a href={phoneTel} className="underline-offset-4 hover:underline" data-testid="contact-phone-link">{settings.phone}</a>
              </InfoRow>
              <InfoRow icon={Clock} title={c.hoursT} testid="contact-hours">
                {c.hours}
              </InfoRow>
            </ul>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
            <a href={mapDirections} target="_blank" rel="noopener noreferrer" className="btn-leaf" data-testid="contact-directions-btn">
              <Navigation className="h-4 w-4" />
              {c.directions}
            </a>
            <a href={phoneTel} className="btn-ghost-light" data-testid="contact-call-btn">
              <Phone className="h-4 w-4" />
              {c.call}
            </a>
          </Reveal>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <Reveal>
            <EnquiryForm service={service} setService={setService} />
          </Reveal>
          <Reveal delay={0.1} className="overflow-hidden rounded-[2rem] border border-white/15 bg-[#073f48]">
            <iframe
              title={c.mapTitle}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[16/10] w-full border-0 md:aspect-[16/8]"
              data-testid="contact-map-iframe"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
