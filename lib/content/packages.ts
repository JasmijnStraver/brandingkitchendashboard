import type { CourseId } from "./courses";
import type { Pakket } from "@/lib/supabase/types";

export interface PakketContent {
  naam: string;
  kort: string;
  prijs: string;
  duur: string;
  duurWeken?: number;
  naOplevering?: number;
  waarschuwDagen?: number;
  zelf?: boolean;
  inbegrepen?: string[];
  courses: CourseId[];
}

export const PAKKETTEN: Record<Pakket, PakketContent> = {
  dwy: {
    naam: "7-Course Brand Experience",
    kort: "7-Course",
    prijs: "€1.500",
    duur: "8 weken",
    duurWeken: 8,
    inbegrepen: ["Brand shoot", "Branded templates", "Craveable Identity"],
    courses: ["01", "02", "03", "04", "05", "06", "07"],
  },
  audit: {
    naam: "Brand Audit",
    kort: "Audit",
    prijs: "€77",
    duur: "4 weken",
    duurWeken: 4,
    naOplevering: 0,
    waarschuwDagen: 7,
    courses: ["01", "02", "04"],
  },
  templates: {
    naam: "Branded Templates",
    kort: "Templates",
    prijs: "in overleg",
    duur: "",
    naOplevering: 2,
    courses: ["05"],
  },
  identity: {
    naam: "Craveable Identity",
    kort: "Identity",
    prijs: "in overleg",
    duur: "",
    naOplevering: 2,
    courses: ["01", "02"],
  },
  zelf: {
    naam: "Be Your Own Chef",
    kort: "Be Your Own Chef",
    prijs: "prijs in te vullen",
    duur: "",
    zelf: true,
    courses: ["01", "02", "03", "04", "05", "06", "07"],
  },
};

export const EXTRAS = ["Brand shoot", "Branded templates", "Craveable Identity", "Website"] as const;

export const EXTRA_INHOUD: Record<(typeof EXTRAS)[number], string[]> = {
  "Brand shoot": [
    "Voorbereiding: shotlist, regie, locatie en outfits vanuit je positionering",
    "De shoot, geregisseerd op jouw verhaal",
    "Je selectie in een online galerij",
    "Bewerking in de Studio Crave-stijl, klaar om te downloaden",
  ],
  "Branded templates": [
    "100+ social templates, afgestemd op je doel: zichtbaarheid en opbouw, lancering of verkoop",
    "Brandbook en Brand Kit in Canva",
    "Custom brand logo",
    "Kleuren en lettertypen",
    "1:1 brand sessies",
    "Chatsupport tijdens het traject",
    "Extra: toegang tot The Branding Kitchen, je online werkomgeving met skills, agents, je hele merk overzichtelijk bij elkaar, je workflow en de sous-chef, tot 2 maanden na oplevering",
  ],
  "Craveable Identity": [
    "Full basic branding: je merk in de basis neergezet, zonder templates en shoot",
    "Korte merkbasis vooraf: je verhaal en je gewenste gevoel (Raw Ingredients en Flavor Profile, light)",
    "Custom logo-set: hoofdlogo, variant en beeldmerk of monogram, in licht en donker",
    "Kleurpalet met alle codes (HEX, RGB, CMYK) en lettertypen voor koppen, tekst en accenten",
    "Beeldstijl en grafische elementen: licht, sfeer, patronen, iconen",
    "Brandbook, plus een ingerichte Brand Kit in Canva",
    "Basistoepassingen: e-mailhandtekening, favicon, profielfoto's voor social media",
    "Toegang tot The Branding Kitchen tot 2 maanden na oplevering",
  ],
  Website: [
    "Opzet en structuur vanuit je positionering en aanbod",
    "Ontwerp in je visuele identiteit, met je eigen beelden",
    "Teksten in jouw toon",
    "Oplevering en uitleg om zelf aanpassingen te doen",
  ],
};

export function inbegrepen(pakket: Pakket, extra: string): boolean {
  return !!PAKKETTEN[pakket]?.inbegrepen?.includes(extra);
}
export function heeftExtra(extras: string[], pakket: Pakket, extra: string): boolean {
  return inbegrepen(pakket, extra) || extras.includes(extra);
}

export const STANDAARD_WELKOM =
  "Welkom bij Studio Crave. Dit is je eigen keuken. Hier vind je alles van ons traject: je menu, je documenten en alles wat we samen opdienen. Begin met de quiz, dan weet ik meteen een beetje hoe jouw merk smaakt.";

export const PORTAAL = {
  welkomKop: "Ready to create some cravings?",
  quotes: [
    "Mooi is de basis. Voelbaar is het doel.",
    "Een merk dat je niet voelt, vergeet je.",
    "Geen fastfood-branding. We koken met jouw eigen ingrediënten.",
    "Je hoeft niet harder te roepen. Je moet beter smaken.",
  ],
};

export const CONTACT_STANDAARD = { mail: "info@studiocrave.nl", app: "" };
