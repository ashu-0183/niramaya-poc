import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/i18n/en";
import hi from "@/i18n/hi";
import mr from "@/i18n/mr";
import { fetchContent, fileUrl } from "./api";
import { DEFAULT_IMAGES, DEFAULT_REVIEWS, DEFAULT_SETTINGS, DEFAULT_VIDEOS } from "./defaults";
import { deepMerge } from "./merge";

export const DICTS = { en, hi, mr };

const digits = (s) => String(s ?? "").replace(/\D/g, "");
const withCountry = (d) => (d.length === 10 ? `91${d}` : d);
const nonEmpty = (obj) =>
  Object.fromEntries(Object.entries(obj ?? {}).filter(([, v]) => typeof v === "string" && v.trim()));

export const buildSite = (remote) => {
  const settings = { ...DEFAULT_SETTINGS, ...nonEmpty(remote?.settings) };
  const images = { ...DEFAULT_IMAGES, ...nonEmpty(remote?.images) };
  const text = Object.fromEntries(Object.entries(DICTS).map(([l, d]) => [l, deepMerge(d, remote?.text?.[l])]));
  const reviews = Array.isArray(remote?.reviews) ? remote.reviews : DEFAULT_REVIEWS;
  const videos = Array.isArray(remote?.videos) ? remote.videos : DEFAULT_VIDEOS;
  const wa = withCountry(digits(settings.whatsapp));
  const q = encodeURIComponent(settings.address);
  return {
    text,
    settings,
    images,
    reviews,
    videos,
    phoneTel: `tel:+${withCountry(digits(settings.phone))}`,
    waLink: (msg = settings.waMessage) => `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,
    mapEmbed: `https://www.google.com/maps?q=${q}&output=embed`,
    mapDirections: `https://www.google.com/maps/dir/?api=1&destination=${q}`,
    img: (key) => fileUrl(images[key] ?? ""),
  };
};

const SiteContext = createContext(null);

export const SiteProvider = ({ children }) => {
  const [remote, setRemote] = useState(undefined);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(() => {
      if (alive) setRemote((r) => (r === undefined ? null : r));
    }, 3500);
    fetchContent()
      .then((data) => {
        if (alive) setRemote(data);
      })
      .catch(() => {
        if (alive) setRemote((r) => r ?? null);
      });
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const site = useMemo(() => buildSite(remote), [remote]);
  const value = useMemo(() => ({ ...site, loading: remote === undefined, setRemote }), [site, remote]);
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

const fallback = { ...buildSite(null), loading: false, setRemote: () => {} };
export const useSite = () => useContext(SiteContext) ?? fallback;
