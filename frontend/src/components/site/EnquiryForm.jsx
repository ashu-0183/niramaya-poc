import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { en, useLang } from "@/i18n";
import { SERVICE_KEYS, WA_DEFAULT_MSG, waLink } from "@/lib/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

const FIELD = "h-auto rounded-none border-0 border-b border-[#0b6b7b]/25 bg-transparent px-0 py-3 text-lg text-[#0f2327] shadow-none placeholder:text-[#6b8186] focus-visible:border-[#0b6b7b] focus-visible:ring-0";

const FieldError = ({ msg, id }) =>
  msg ? <p className="mt-2 text-sm font-medium text-[#b42318]" data-testid={`enquiry-error-${id}`}>{msg}</p> : null;

export const EnquiryForm = ({ service, setService }) => {
  const { t } = useLang();
  const f = t.contact.form;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    const next = {};
    if (!name.trim()) next.name = f.errName;
    if (!/^\d{10}$/.test(digits)) next.phone = f.errPhone;
    if (!service) next.service = f.errService;
    setErrors(next);
    if (Object.keys(next).length) return;

    const serviceName = service === "other" ? en.contact.form.other : en.services.items[service]?.title;
    const text = [
      `${WA_DEFAULT_MSG}.`,
      `Name: ${name.trim()}`,
      `Phone: +91 ${digits}`,
      `Service: ${serviceName}`,
      message.trim() && `Message: ${message.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    toast.success(f.toast);
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] bg-[#fbfaf6] p-7 text-[#0f2327] shadow-[0_50px_100px_-40px_rgba(2,30,35,0.7)] md:p-12" data-testid="enquiry-form">
      <h3 className="font-display text-3xl text-[#0b6b7b]">{t.contact.formTitle}</h3>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <Label htmlFor="enq-name" className="text-xs font-bold uppercase tracking-[0.16em] text-[#4b656b]">{f.name}</Label>
          <Input id="enq-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={f.namePh} autoComplete="name" className={FIELD} data-testid="enquiry-name-input" />
          <FieldError msg={errors.name} id="name" />
        </div>
        <div>
          <Label htmlFor="enq-phone" className="text-xs font-bold uppercase tracking-[0.16em] text-[#4b656b]">{f.phone}</Label>
          <Input id="enq-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={f.phonePh} autoComplete="tel" className={FIELD} data-testid="enquiry-phone-input" />
          <FieldError msg={errors.phone} id="phone" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="enq-service" className="text-xs font-bold uppercase tracking-[0.16em] text-[#4b656b]">{f.service}</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="enq-service" className={`${FIELD} focus:ring-0 focus:ring-offset-0`} data-testid="enquiry-service-select">
              <SelectValue placeholder={f.servicePh} />
            </SelectTrigger>
            <SelectContent data-lenis-prevent className="max-h-72 rounded-xl" data-testid="enquiry-service-options">
              {SERVICE_KEYS.map((k) => (
                <SelectItem key={k} value={k} className="py-2.5 text-[15px]" data-testid={`enquiry-service-option-${k}`}>
                  {t.services.items[k]?.title}
                </SelectItem>
              ))}
              <SelectItem value="other" className="py-2.5 text-[15px]" data-testid="enquiry-service-option-other">{f.other}</SelectItem>
            </SelectContent>
          </Select>
          <FieldError msg={errors.service} id="service" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="enq-message" className="text-xs font-bold uppercase tracking-[0.16em] text-[#4b656b]">{f.message}</Label>
          <Textarea id="enq-message" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={f.messagePh} className={`${FIELD} min-h-[96px] resize-none`} data-testid="enquiry-message-input" />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-leaf group" data-testid="enquiry-submit-btn">
          <WhatsAppIcon className="h-5 w-5" />
          {f.submit}
        </button>
        <p className="max-w-xs text-[13px] leading-relaxed text-[#4b656b]">{f.note}</p>
      </div>
    </form>
  );
};
