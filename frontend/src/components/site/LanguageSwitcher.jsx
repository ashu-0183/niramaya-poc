import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGS, useLang } from "@/i18n";

export const LanguageSwitcher = () => {
  const { lang, setLang, t } = useLang();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t.nav.language}
          className="flex h-10 items-center gap-1.5 rounded-full border border-white/25 px-2.5 text-sm sm:px-3 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
          data-testid="language-switcher-trigger"
        >
          <Globe className="h-4 w-4" />
          <span className="font-deva">{current.short}</span>
          <ChevronDown className="hidden h-3.5 w-3.5 opacity-70 sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        data-lenis-prevent
        className="z-[60] w-48 rounded-2xl border-[#0b6b7b]/15 bg-[#fbfaf6] p-1.5 shadow-[0_30px_60px_-20px_rgba(5,47,54,0.45)]"
        data-testid="language-switcher-menu"
      >
        <DropdownMenuLabel className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#4b656b]">
          {t.nav.language}
        </DropdownMenuLabel>
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLang(l.code)}
            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[15px] text-[#0f2327] focus:bg-[#e6f3f5]"
            data-testid={`language-option-${l.code}`}
          >
            <span className="font-deva">{l.label}</span>
            {lang === l.code && <Check className="h-4 w-4 text-[#26752a]" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
