// Ported 1:1 uit prototype/config.js (COURSES). De 7-Course Brand Method + de Signature Dish-finale.
// Geen Supabase-tabel hiervoor: dit blijft statische app-config, zoals in het prototype.
export type CourseId = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "finale";

export interface CourseContent {
  nr: string;
  naam: string;
  sub: string;
  jasmijn: string[];
  jasmijnShoot?: string[];
  jij: string;
  jijShoot?: string;
  aanleveren: string;
  dessert?: boolean;
}

export const COURSES: Record<CourseId, CourseContent> = {
  "01": {
    nr: "01",
    naam: "Raw Ingredients",
    sub: "Wie je echt bent: verhaal, energie, expertise, rafelrandjes",
    jasmijn: [
      "Diepte-interview over je verhaal in {vakgebied}: keerpunten en wat je meeneemt",
      "Ik haal je energie, expertise en rafelrandjes naar boven, ook wat je zelf over het hoofd ziet",
      "Je ontvangt je Raw Ingredients-overzicht: de bouwstenen van alles wat volgt",
    ],
    jij: "Je leert je eigen verhaal vertellen zonder te twijfelen of het \"genoeg\" is. Met de tools maak je er direct content van.",
    aanleveren: "Foto's of momenten uit je verhaal, oude teksten waar je trots op bent, je CV of LinkedIn als inspiratie.",
  },
  "02": {
    nr: "02",
    naam: "Flavor Profile",
    sub: "Tone of voice, energie en vibe",
    jasmijn: [
      "Ik analyseer hoe je nu klinkt: voice memo's, posts, berichten",
      "We leggen je toon vast: woorden die wél bij je horen en woorden die nooit",
      "Je vibe en energie vertaald naar een moodboard",
    ],
    jij: "Schrijven zoals je praat. Vanaf hier klinkt elke tool in het portaal als jij.",
    aanleveren:
      "Drie voice memo's waarin je vertelt wat je doet, alsof je het aan een vriend(in), je partner of een collega uitlegt. Screenshots van posts die echt als jou voelen.",
  },
  "03": {
    nr: "03",
    naam: "Signature Sauce",
    sub: "Jouw unieke methode, visie en frameworks",
    jasmijn: [
      "We vangen jouw werkwijze in een eigen methode, met een naam die blijft hangen",
      "Ik werk je framework visueel uit, klaar om te laten zien",
      "Je visie scherp op papier: waar sta jij voor, waar niet",
    ],
    jij: "Autoriteit tonen zonder te schreeuwen. Je methode wordt de rode draad in je content en aanbod.",
    aanleveren: "Hoe je nu met {klanten} werkt: stappen, oefeningen, vaste vragen. Alles mag, ook als het rommelig is.",
  },
  "04": {
    nr: "04",
    naam: "Positioning Cut",
    sub: "Niche, claims en grenzen",
    jasmijn: [
      "Je messaging plan: kernbelofte, doelgroep, content-pijlers",
      "Je anti-positionering: wat je niet bent en niet doet",
      "Scherpe claims die je met overtuiging durft te maken",
    ],
    jasmijnShoot: [
      "Je messaging plan: kernbelofte, doelgroep, content-pijlers",
      "Je anti-positionering: wat je niet bent en niet doet",
      "Je Craveable Identity: logo, kleuren, lettertypen, beeldstijl en brandbook, vanuit je positionering",
      "De voorbereiding van je brand shoot: shotlist, regie, locatie en outfits",
    ],
    jij: "Kiezen, en nee durven zeggen. Je Brand Foundation wordt hier definitief, en alle tools gebruiken hem.",
    jijShoot:
      "Kiezen, en nee durven zeggen. Je Brand Foundation wordt hier definitief, en je positionering bepaalt wat we tijdens je shoot in beeld brengen.",
    aanleveren: "Voorbeelden van concurrenten of collega's waar je je tegen wilt afzetten.",
  },
  "05": {
    nr: "05",
    naam: "Plating",
    sub: "Content formats, hooks en storytelling",
    jasmijn: [
      "Je content-pijlers vertaald naar vaste formats",
      "Hooks en storylijnen in jouw taal",
      "Vaste formats en templates in jouw huisstijl",
    ],
    jasmijnShoot: [
      "Eerst je brand shoot: ik regisseer, fotografeer en bewerk je beelden in de Studio Crave-stijl",
      "Daarna bouw ik je templates, met je eigen foto's uit de shoot",
      "Je content-pijlers vertaald naar vaste formats, met hooks en storylijnen in jouw taal",
    ],
    jij: "Hier word je zelfstandig. De tools maken captions, hooks, carrousels en story-weken die als jou klinken.",
    jijShoot:
      "Je kiest je favoriete foto's, en vanaf dan post je met beelden en templates die echt van jou zijn. De tools schrijven de teksten erbij, in jouw toon.",
    aanleveren: "Content die goed liep (of juist niet), en je planning of contentkalender als je die hebt.",
  },
  "06": {
    nr: "06",
    naam: "Pairing",
    sub: "Aanbod, prijs en klantreis",
    jasmijn: [
      "Je {aanbod} gestructureerd en geprijsd op waarde",
      "De reis van je {klanten}, van eerste contact tot ja",
      "De basis voor je salespagina en weggever",
    ],
    jij: "Verkopen zonder dat het voelt als verkopen. Met de tools schrijf je je salespagina, mails en masterclass.",
    aanleveren: "Je huidige {aanbod} en prijzen, en waar je twijfelt.",
  },
  "07": {
    nr: "07",
    naam: "The Experience",
    sub: "Hoe samenwerken met jou voelt",
    jasmijn: [
      "De beleving van je {klanten}, van eerste DM tot afronding",
      "Onboarding en momenten die je klant bijblijven",
      "Exclusiviteit: wat maakt jou onvergetelijk",
    ],
    jij: "Je {klanten} laten voelen wat jij nu voelt. Met de tools voer je sales-gesprekken en deel je resultaten.",
    aanleveren: "Hoe je nu {klanten} verwelkomt, en een paar reacties of testimonials.",
  },
  finale: {
    nr: "✦",
    naam: "Signature Dish",
    sub: "Het dessert: je hele merk op één bord",
    dessert: true,
    jasmijn: [
      "Je volledige merk samengebracht: van verhaal tot beleving",
      "Eindpresentatie en overdracht van alle bestanden",
      "Samen je volgende 90 dagen uitzetten",
    ],
    jij: "Alles wat je hebt gemaakt komt hier samen. Met de planningstools zet je je merk om in een ritme dat past bij jouw week.",
    aanleveren: "Je vragen voor de afrondende sessie.",
  },
};

export const COURSE_ORDER: CourseId[] = ["01", "02", "03", "04", "05", "06", "07", "finale"];

// Woorden van de klant (vakgebied, klantwoord, aanbodwoord) ingevuld in {}-placeholders.
export function courseTekst(tpl: string, woorden: { klanten?: string; aanbod?: string; vakgebied?: string }): string {
  const w = { klanten: woorden.klanten || "klanten", aanbod: woorden.aanbod || "aanbod", vakgebied: woorden.vakgebied || "jouw vak" };
  return (tpl || "").replace(/\{(klanten|aanbod|vakgebied)\}/g, (_, x: keyof typeof w) => w[x]);
}
