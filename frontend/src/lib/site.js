const PUB = process.env.PUBLIC_URL || "";

export const PHONE_DISPLAY = "+91 76660 03113";
export const PHONE_TEL = "tel:+917666003113";
export const WA_NUMBER = "917666003113";
export const WA_DEFAULT_MSG = "Hi, I want to book an appointment";
export const waLink = (text = WA_DEFAULT_MSG) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const ADDRESS_LINE = "Shop No 34, R10 Commercial, Life Republic Rd, Jambe, Maharashtra 411057";
const mapQuery = encodeURIComponent(ADDRESS_LINE);
export const MAP_EMBED = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
export const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

export const SERVICE_KEYS = [
  "sports", "back", "neck", "arthritis", "postsurgery", "neuro",
  "pediatric", "geriatric", "dryneedling", "manual", "electro",
];

export const NAV_IDS = ["home", "about", "services", "conditions", "testimonials", "contact"];

export const IMG = {
  hero: `${PUB}/assets/hands.jpg`,
  about: `${PUB}/assets/hero.jpg`,
  knee: `${PUB}/assets/knee.jpg`,
  electro: `${PUB}/assets/electro.jpg`,
  shoulder: `${PUB}/assets/shoulder.jpg`,
  rehab: `${PUB}/assets/rehab.jpg`,
  spine: `${PUB}/assets/spine.jpg`,
  mark: `${PUB}/assets/logo-mark.png`,
};
