import { IMG } from "@/lib/site";

export const DEFAULT_SETTINGS = {
  phone: "+91 76660 03113",
  whatsapp: "917666003113",
  address: "Shop No 34, R10 Commercial, Life Republic Rd, Jambe, Maharashtra 411057",
  waMessage: "Hi, I want to book an appointment",
  timing: "7:30 AM to 9:00 PM",
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
    id: "sample-1",
    name: "Ashutosh Sharma",
    service: "back",
    rating: 5,
    sample: false,
    text: {
      en: "Suffered a severe lower back injury due to heavy lifting at the gym. The step-by-step spine therapy and corrective exercises helped me fully recover and get back to training pain-free.",
      hi: "जिम में भारी वजन उठाने के कारण कमर के निचले हिस्से में गंभीर चोट लग गई थी। चरण-दर-चरण रीढ़ की थेरेपी और सही व्यायामों ने मुझे पूरी तरह ठीक होने और बिना दर्द के दोबारा ट्रेनिंग शुरू करने में मदद की।",
      mr: "जिममध्ये जड वजन उचलल्यामुळे पाठीच्या खालच्या भागात तीव्र दुखापत झाली होती. टप्प्याटप्प्याने केलेल्या थेरपीमुळे आणि योग्य व्यायामांमुळे मी पूर्णपणे बरा झालो आणि पुन्हा वर्कआउट सुरू करू शकलो.",
    },
  },
  {
    id: "sample-2",
    name: "Mayank Shrivastava",
    service: "spine",
    rating: 5,
    sample: false,
    text: {
      en: "Developed chronic neck pain and posture stiffness from long hours of sitting at my desk. The posture correction routines and targeted physical therapy brought immediate relief.",
      hi: "डेस्क पर लंबे समय तक बैठने से गर्दन में पुराना दर्द और अकड़न हो गई थी। पोस्चर सुधार की दिनचर्या और लक्षित फिजियोथेरेपी से तुरंत राहत मिली।",
      mr: "डेस्कवर तासनतास बसल्यामुळे मानदुखी आणि आखडण्याचा त्रास सुरू झाला होता. पोस्चर सुधारण्याच्या सत्रांमुळे आणि फिजियोथेरपीमुळे मला त्वरित आराम मिळाला.",
    },
  },
  {
    id: "sample-3",
    name: "Prashant Agarwal",
    service: "shoulder",
    rating: 5,
    sample: false,
    text: {
      en: "Struggling with a painful shoulder injury for months. Thanks to customized electrotherapy sessions and guided rehab, I regained full range of motion.",
      hi: "महीनों से कंधे की दर्दनाक चोट से परेशान था। अनुकूलित इलेक्ट्रोथेरेपी सत्रों और निर्देशित पुनर्वास के लिए धन्यवाद, मुझे कंधे की पूरी मूवमेंट वापस मिल गई।",
      mr: "अनेक महिन्यांपासून खांद्याच्या दुखापतीमुळे त्रस्त होतो. इलेक्ट्रोथेरपी सत्रांमुळे आणि योग्य मार्गदर्शनामुळे माझ्या खांद्याची हालचाल पूर्णपणे पूर्ववत झाली.",
    },
  },
  {
    id: "sample-4",
    name: "More patient stories coming soon...",
    service: "general",
    rating: 5,
    sample: false,
    text: {
      en: "We are continually documenting patient recovery journeys to share their success stories here.",
      hi: "हम लगातार नए रोगियों की रिकवरी यात्रा को दर्ज कर रहे हैं ताकि उनकी सफलता की कहानियां यहां साझा की जा सकें।",
      mr: "आम्ही सतत नवीन रुग्णांच्या पुनर्प्राप्तीचा प्रवास नोंदवत आहोत जेणेकरून त्यांच्या यशोगाथा येथे सामायिक करता येतील.",
    },
  },
];

export const DEFAULT_VIDEOS = [];