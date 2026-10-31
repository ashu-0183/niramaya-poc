import { IMG } from "@/lib/site";

export const DEFAULT_SETTINGS = {
  phone: "+91 76660 03113",
  whatsapp: "917666003113",
  address: "Shop No 34, R10 Commercial, Life Republic Rd, Jambe, Maharashtra 411057",
  waMessage: "Hi, I want to book an appointment",
};

export const DEFAULT_IMAGES = {
  hero: IMG.hero,
  about: IMG.about,
  profile: "",
  sports: IMG.knee,
  electro: IMG.electro,
  cond0: IMG.spine,
  cond1: IMG.shoulder,
  cond2: IMG.knee,
  cond3: IMG.rehab,
};

export const IMAGE_SLOTS = [
  { key: "hero", label: "Hero photo", hint: "Top of the page. A tall (portrait) photo works best." },
  { key: "about", label: "About Us photo", hint: "Tall (portrait) photo." },
  { key: "profile", label: "Physiotherapist photo", hint: "Portrait photo. Leave empty to show the logo placeholder." },
  { key: "sports", label: "Sports Injury card", hint: "Large services card. Any shape." },
  { key: "electro", label: "Electrotherapy card", hint: "Wide services card. Landscape photo." },
  { key: "cond0", label: "Conditions — area 1", hint: "Spine & Neck. Landscape photo." },
  { key: "cond1", label: "Conditions — area 2", hint: "Shoulder & Arm. Landscape photo." },
  { key: "cond2", label: "Conditions — area 3", hint: "Hip, Knee & Foot. Landscape photo." },
  { key: "cond3", label: "Conditions — area 4", hint: "Brain & Nerves. Landscape photo." },
];

export const DEFAULT_REVIEWS = [
  {
    id: "sample-1", name: "", service: "back", rating: 5, sample: true,
    text: {
      en: "After weeks of lower-back pain, the step-by-step plan and home exercises helped me get back to work without pain.",
      hi: "हफ़्तों के कमर दर्द के बाद, चरण-दर-चरण योजना और घर के व्यायामों ने मुझे बिना दर्द के काम पर लौटने में मदद की।",
      mr: "आठवडे चाललेल्या कंबरदुखीनंतर, टप्प्याटप्प्याच्या योजनेमुळे आणि घरच्या व्यायामांमुळे मी वेदनेशिवाय कामावर परत जाऊ शकलो.",
    },
  },
  {
    id: "sample-2", name: "", service: "postsurgery", rating: 5, sample: true,
    text: {
      en: "My knee recovery after surgery felt smooth. Every session was explained clearly and my progress was tracked.",
      hi: "सर्जरी के बाद घुटने की रिकवरी बहुत आसान रही। हर सत्र स्पष्ट रूप से समझाया गया और मेरी प्रगति पर नज़र रखी गई।",
      mr: "शस्त्रक्रियेनंतर गुडघ्याची पुनर्प्राप्ती अगदी सहज झाली. प्रत्येक सत्र स्पष्टपणे समजावले गेले आणि माझ्या प्रगतीवर लक्ष ठेवले गेले.",
    },
  },
  {
    id: "sample-3", name: "", service: "geriatric", rating: 5, sample: true,
    text: {
      en: "Gentle, patient care for my mother's balance problems. She walks with much more confidence now.",
      hi: "मेरी माँ की संतुलन की समस्या के लिए सौम्य और धैर्यपूर्ण देखभाल। अब वे कहीं ज़्यादा आत्मविश्वास से चलती हैं।",
      mr: "माझ्या आईच्या तोलाच्या समस्येसाठी सौम्य आणि संयमी काळजी. आता ती खूप अधिक आत्मविश्वासाने चालते.",
    },
  },
];

export const DEFAULT_VIDEOS = [
  { id: "video-1", url: "", title: { en: "Back on the field", hi: "फिर से मैदान पर", mr: "पुन्हा मैदानावर" } },
  { id: "video-2", url: "", title: { en: "Walking with confidence", hi: "आत्मविश्वास के साथ चलना", mr: "आत्मविश्वासाने चालणे" } },
  { id: "video-3", url: "", title: { en: "Life after knee surgery", hi: "घुटने की सर्जरी के बाद का जीवन", mr: "गुडघा शस्त्रक्रियेनंतरचे आयुष्य" } },
];
