import { Award, BadgeCheck, Clock, GraduationCap, Sparkles } from "lucide-react";
import { useLang } from "@/i18n";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const InfoCard = ({ icon: Icon, title, children, className = "", testid, delay = 0 }) => (
  <Reveal
    delay={delay}
    className={`rounded-[1.5rem] border border-[#0b6b7b]/12 bg-white p-6 md:p-7 ${className}`}
    data-testid={testid}
  >
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e6f3f5] text-[#0b6b7b]">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#0b6b7b]">{title}</h3>
    </div>
    <div className="mt-5 text-[15px] leading-relaxed text-[#0f2327]">{children}</div>
  </Reveal>
);

const List = ({ items }) => (
  <ul className="space-y-2">
    {items.map((q) => (
      <li key={q} className="flex gap-3">
        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#49b646]" />
        {q}
      </li>
    ))}
  </ul>
);

const DoctorCard = ({ doc, t }) => (
  <div className="grid gap-14 lg:grid-cols-12 lg:gap-14 mb-24 last:mb-0 border-b border-[#0b6b7b]/15 pb-24 last:border-none last:pb-0">
    {/* Doctor Photo & Years Badge Column */}
    <div className="lg:col-span-5">
      <Reveal className="relative lg:sticky lg:top-28">
        <div className="grain relative isolate mx-auto aspect-[4/5] max-w-[440px] overflow-hidden rounded-b-[2rem] rounded-t-[999px] bg-[#01687b]" data-testid="profile-photo-placeholder">
          <img src={doc.photo} alt={doc.name} className="absolute inset-0 h-full w-full object-cover" data-testid="profile-photo" />
        </div>
        <div className="absolute -right-2 top-10 rounded-[1.25rem] bg-[#49b646] px-5 py-4 text-[#052f36] shadow-[0_24px_50px_-20px_rgba(5,47,54,0.6)] sm:right-0 lg:-right-6" data-testid="profile-years-badge">
          <span className="block font-display text-4xl leading-none">{doc.years}</span>
          <span className="mt-1 block text-xs font-semibold">{doc.yearsLabel}</span>
        </div>
      </Reveal>
    </div>

    {/* Doctor Details Column */}
    <div className="lg:col-span-7">
      <SectionHeading label={doc.label} title={doc.name} testid="profile-name" />
      <Reveal delay={0.1}>
        <p className="mt-4 text-base font-semibold text-[#26752a]">{doc.role}</p>
      </Reveal>
      <Reveal delay={0.15}>
        <blockquote className="mt-10 border-l-2 border-[#49b646] pl-6 font-display text-2xl italic leading-snug text-[#0f2327] md:text-3xl">
          "{doc.quote}"
        </blockquote>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <InfoCard icon={GraduationCap} title={t.qualificationsT} testid="profile-qualifications">
          <List items={doc.qualifications} />
        </InfoCard>
        <InfoCard icon={Clock} title={t.experienceT} testid="profile-experience" delay={0.06}>
          <p>{doc.experience}</p>
        </InfoCard>
        <InfoCard icon={Sparkles} title={t.expertiseT} className="sm:col-span-2" testid="profile-expertise">
          <div className="flex flex-wrap gap-2">
            {doc.expertise.map((e) => (
              <span key={e} className="rounded-full border border-[#0b6b7b]/20 bg-[#e6f3f5] px-4 py-2 text-sm text-[#0b6b7b] transition-colors duration-300 hover:bg-[#0b6b7b] hover:text-white">
                {e}
              </span>
            ))}
          </div>
        </InfoCard>
        <InfoCard icon={BadgeCheck} title={t.registrationT} testid="profile-registration">
          <p>{doc.registration}</p>
        </InfoCard>
        <InfoCard icon={Award} title={t.awardsT} testid="profile-awards" delay={0.06}>
          <List items={doc.awards} />
        </InfoCard>
      </div>
    </div>
  </div>
);

export const Profile = () => {
  const { t } = useLang();
  const p = t.profile;

  const doctors = [
    {
      label: p.label,
      name: "Dr. Ashwini More (PT)",
      role: "Lead Physiotherapist · Niramaya Physiotherapy",
      photo: "/assets/dr-ashwini.jpg.jpeg",
      years: "8+",
      yearsLabel: "years of experience",
      quote: "Dedicated to providing evidence-based musculoskeletal care and advanced rehabilitation techniques for pain-free living.",
      qualifications: [
        "MPT (Musculoskeletal Sciences)",
        "BPT (Bachelor of Physiotherapy)"
      ],
      experience: "8+ years of clinical practice in musculoskeletal rehabilitation and sports injury management.",
      expertise: [
        "Musculoskeletal Rehabilitation",
        "Sports Injury Management",
        "Evidence-Based Physiotherapy",
        "Manual Therapy",
        "Dry Needling",
        "Cupping Therapy"
      ],
      registration: "GAPT Reg. No: GAPT/21/G00331",
      awards: [
        "Dry Needling Practitioner",
        "Cupping Therapy Certified",
        "Evidence-Based Rehab"
      ]
    },
    {
      label: p.label,
      name: "Dr. Neha Anjum",
      role: "Orthopaedic Physiotherapist · Niramaya Physiotherapy",
      photo: "/assets/dr-neha.jpg.jpeg",
      years: "4+",
      yearsLabel: "years of experience",
      quote: "Focused on compassionate, specialized orthopaedic rehabilitation to restore full function and mobility.",
      qualifications: [
        "MPT (Orthopaedics)",
        "BPT (Bachelor of Physiotherapy)"
      ],
      experience: "4+ years of clinical experience across clinic and hospital settings.",
      expertise: [
        "Orthopaedic Physiotherapy",
        "Slip Disc & Sciatica",
        "Frozen Shoulder & Knee Pain",
        "Post-Surgical Rehab",
        "Joint Mobilisation",
        "Posture Correction"
      ],
      registration: "GAPT Reg. No: GAPT/24/G00671",
      awards: [
        "Orthopaedic Rehabilitation Specialist",
        "Joint Mobilisation Certified",
        "Post-Surgical Care"
      ]
    }
  ];

  return (
    <section id="profile" className="relative bg-[#f4f1e8] py-24 md:py-36" data-testid="profile-section">
      <div className="shell">
        {doctors.map((doc, index) => (
          <DoctorCard key={index} doc={doc} t={p} />
        ))}
      </div>
    </section>
  );
};