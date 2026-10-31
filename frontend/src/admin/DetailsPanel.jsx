import { ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildSite } from "@/content/SiteProvider";
import { Card, FieldLabel, PanelHeader } from "./ui";

export const DetailsPanel = ({ settings, onChange }) => {
  const preview = buildSite({ settings });
  const s = settings ?? {};
  return (
    <div data-testid="admin-details-panel">
      <PanelHeader title="Contact details" desc="Used for the call buttons, WhatsApp buttons, enquiry form, map and footer. Press Save to publish." />
      <Card className="space-y-5">
        <div>
          <FieldLabel htmlFor="set-phone">Phone number (as shown)</FieldLabel>
          <Input id="set-phone" value={s.phone ?? ""} onChange={(e) => onChange("phone", e.target.value)} className="h-11 rounded-xl bg-white" data-testid="admin-settings-phone" />
        </div>
        <div>
          <FieldLabel htmlFor="set-wa">WhatsApp number (digits, with country code)</FieldLabel>
          <Input id="set-wa" inputMode="numeric" value={s.whatsapp ?? ""} onChange={(e) => onChange("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 15))} className="h-11 rounded-xl bg-white" data-testid="admin-settings-whatsapp" />
          <p className="mt-1.5 text-[13px] text-[#4b656b]">Example: 917666003113 (91 is India's code).</p>
        </div>
        <div>
          <FieldLabel htmlFor="set-address">Clinic address (also used for the map)</FieldLabel>
          <Textarea id="set-address" rows={2} value={s.address ?? ""} onChange={(e) => onChange("address", e.target.value)} className="rounded-xl bg-white" data-testid="admin-settings-address" />
        </div>
        <div>
          <FieldLabel htmlFor="set-msg">Pre-filled WhatsApp message</FieldLabel>
          <Input id="set-msg" value={s.waMessage ?? ""} onChange={(e) => onChange("waMessage", e.target.value)} className="h-11 rounded-xl bg-white" data-testid="admin-settings-wa-message" />
        </div>
        <div className="flex flex-wrap gap-3 border-t border-[#0b6b7b]/10 pt-5">
          <a href={preview.waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6b7b] hover:underline" data-testid="admin-settings-test-wa">
            <ExternalLink className="h-4 w-4" /> Test WhatsApp link
          </a>
          <a href={preview.mapDirections} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6b7b] hover:underline" data-testid="admin-settings-test-map">
            <ExternalLink className="h-4 w-4" /> Check address on Google Maps
          </a>
        </div>
      </Card>
    </div>
  );
};
