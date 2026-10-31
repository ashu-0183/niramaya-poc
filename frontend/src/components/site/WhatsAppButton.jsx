import { motion } from "framer-motion";
import { useLang } from "@/i18n";
import { useSite } from "@/content/SiteProvider";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const WhatsAppButton = () => {
  const { t } = useLang();
  const { waLink } = useSite();
  return (
    <motion.a
      href={waLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 260, damping: 18 }}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 md:bottom-7 md:right-7"
      data-testid="floating-whatsapp-btn"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#052f36] opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        {t.whatsapp.label}
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-12px_rgba(37,211,102,0.75)] transition-transform duration-300 group-hover:scale-110">
        <span className="wa-pulse absolute inset-0 rounded-full bg-[#25D366]" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </motion.a>
  );
};
