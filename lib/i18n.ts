import { SupportedLanguage } from "./types";

export const languageOptions: Array<{ code: SupportedLanguage; label: string }> = [
  { code: "en", label: "English" },
  { code: "am", label: "Amharic" },
  { code: "om", label: "Afaan Oromo" },
  { code: "so", label: "Somali" },
];

type CopyGroup = {
  tagline: string;
  emergency: string;
  assistantPrompt: string;
  payment: string;
};

const copyByLanguage: Record<SupportedLanguage, CopyGroup> = {
  en: {
    tagline: "Healing minds, one safe conversation at a time.",
    emergency: "Emergency support team has been alerted.",
    assistantPrompt: "How are you feeling today?",
    payment: "Payment confirmed. Your appointment is now secured.",
  },
  am: {
    tagline: "አእምሮን በደህና ውይይት እየፈወስን።",
    emergency: "የአስቸኳይ ድጋፍ ቡድን ተነሳስቷል።",
    assistantPrompt: "ዛሬ እንዴት ነው የሚሰማዎት?",
    payment: "ክፍያው ተረጋግጧል። ቀጠሮዎ ተያይዞአል።",
  },
  om: {
    tagline: "Waliin haasa'aa nageenyaan sammuu fayyisna.",
    emergency: "Gareen gargaarsa hatattamaa beeksifameera.",
    assistantPrompt: "Har'a akkamitti ofitti dhagahaa jirta?",
    payment: "Kaffaltiin mirkanaa'eera. Beellamni kee qabameera.",
  },
  so: {
    tagline: "Bogsiinta maskaxda, wada hadal ammaan ah.",
    emergency: "Kooxda gurmadka degdegga ah waa la ogeysiiyay.",
    assistantPrompt: "Maanta sideed dareemaysaa?",
    payment: "Lacag bixinta waa la xaqiijiyay. Ballantaada waa la sugay.",
  },
};

export function getCopy(language: SupportedLanguage): CopyGroup {
  return copyByLanguage[language];
}
