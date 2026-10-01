import type { CourseId } from "./courses";

export type ArchetypeId = "A" | "B" | "C" | "D";

export interface Archetype {
  naam: string;
  kort: string;
  sub: string;
  badge: string;
  woorden: string[];
  tekst: string;
  looks: string;
  sounds: string;
  works: string;
  blind: string;
  start: CourseId;
  startTekst: string;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  A: {
    naam: "The Classic",
    kort: "Classic",
    sub: "Tijdloos. Vertrouwd. Altijd goed.",
    badge: "Bewezen recept",
    woorden: ["rustig", "deskundig", "betrouwbaar"],
    tekst:
      "The Classic is geen experiment, geen seizoensding. Jij bent een instelling. Klanten komen niet bij jou voor verrassing — ze komen voor zekerheid. Je merk drijft op kwaliteit die zichzelf bewijst, jaar na jaar, klant na klant. In een markt waar iedereen schreeuwt om de nieuwste te zijn, is rust een radicale positionering. Je categorie? Tijdloos. Je belofte? Bewezen. Je risico voor de klant? Minimaal.",
    looks:
      "Terughoudend, premium, tijdloos. Serif typografie. Een ingehouden kleurenpalet. Witruimte als luxe. Je beelden zijn gebouwd om over tien jaar nog te werken — niet om morgen viral te gaan. Geen trend-mee, geen gimmicks.",
    sounds:
      "Autoritatief zonder arrogant. Je laat je werk spreken — cases, jaren ervaring, klanten met namen. Je belooft minder dan je waarmaakt. En dáárom geloven ze je.",
    works:
      "Bij klanten die een grote beslissing maken en geen risico willen lopen. High-stakes werk, lange-termijn samenwerkingen, premium budgetten. Niemand kiest jou voor flair. Iedereen kiest jou voor zekerheid.",
    blind:
      "Het gevaar van The Classic: onzichtbaarheid. Als je niet actief claimt waarom jij de beste klassieker bent, verdwijnt je merk in de massa van 'ook-goed-maar-niet-anders'. Je merk heeft een hoek nodig — een standpunt. Niet meer aanbod. Een scherper verhaal.",
    start: "04",
    startTekst:
      "Jouw fundament is sterk — het verhaal eromheen verdient een scherpere hoek. In Positioning Cut geven we je klassieker een standpunt dat niemand kan negeren.",
  },
  B: {
    naam: "The Signature",
    kort: "Signature",
    sub: "Eén ding. Jouw ding. Onkopieerbaar.",
    badge: "Signature gerecht",
    woorden: ["helder", "eigen", "herkenbaar"],
    tekst:
      "The Signature is een merk gebouwd op één ding — en dat ding doe jij beter dan iedereen. Geen alleskunner, geen breed aanbod: één methode, één framework, één signature-aanpak die alleen bij jou te krijgen is. Klanten komen niet bij jou voor 'coaching' of 'strategie' in het algemeen — ze komen specifiek voor JOUW ding. Dat maakt The Signature geen beperking; het maakt 'm onkopieerbaar. Een categorie van één.",
    looks:
      "Eén look, oneindig verfijnd. Geen aanpasbaar moodboard — een gedefinieerd merk. Mensen herkennen je content zonder je naam te zien. Je hebt visuele eigendom: een kleur, een vorm of een compositie die jouw handtekening is.",
    sounds:
      "Jouw stem komt altijd terug op jouw methode, jouw concept, jouw view. Je hoeft niet steeds nieuw te zijn — je gaat dieper. Je content is bewijs van Het Ene Ding, in twintig variaties.",
    works:
      "Bij klanten die hun probleem opgelost willen krijgen op JOUW manier. Ze hebben anderen geprobeerd, ze hebben kopieën gezien — ze willen het origineel. Ze betalen premium voor jouw methode, niet voor jouw tijd.",
    blind:
      "Het gevaar van The Signature: te smal worden. Als jouw hele merk op één ding rust, moet dat ene ding uitstekend gecommuniceerd worden. Veel Signatures verliezen klanten niet door gebrek aan kwaliteit — maar door gebrek aan zichtbaarheid en een verhaal dat verder gaat dan het product.",
    start: "02",
    startTekst: "Jouw ding is goed — de wereld moet het alleen nog horen. In Flavor Profile vinden we de stem die net zo herkenbaar is als je methode.",
  },
  C: {
    naam: "Chef's Special",
    kort: "Chef's Special",
    sub: "Verandert. Verrast. Verdwijnt nooit.",
    badge: "Seizoensgerecht",
    woorden: ["direct", "persoonlijk", "levendig"],
    tekst:
      "Chef's Special is een merk dat ademt met de tijd. Jij bent geen vastgepind concept — je bent een levend ding dat zich aanpast aan seizoen, energie, ontwikkeling. En dat klinkt als chaos, maar voor jou is het de enige manier waarop het werkt. De rode draad? Jij. Jouw smaak, jouw oog, jouw stem — die blijven hangen. De vorm waarin het verschijnt mag verschuiven.",
    looks:
      "Een gedefinieerde wereld waarin meerdere collecties leven. Niet één look — meerdere expressies van dezelfde DNA. De grammar is consistent, de woorden veranderen. Variabele kleurenpaletten binnen één kader.",
    sounds:
      "Direct, persoonlijk, in het moment. Je deelt waar je nú bent, niet waar je drie jaar geleden was. Mensen volgen jou voor de evolutie, niet voor een vastgepind eindbeeld.",
    works:
      "Bij klanten die je vinden in een specifiek hoofdstuk en willen meegroeien. Bij mensen die geloven dat een merk een mens is, geen monument. Je trekt loyale fans aan, geen one-off klanten.",
    blind:
      "Het gevaar van Chef's Special: diffuus overkomen. Zonder een visuele lijn en een heldere toon word je 'leuk maar verwarrend'. Klanten die niet meteen snappen wie je bent, boeken niet. Jouw chaos heeft een container nodig — een merk dat de veelzijdigheid omhult zonder haar te doven.",
    start: "05",
    startTekst: "Jouw energie is raak — je merk moet het vasthouden. In Plating bouwen we de vaste formats en de visuele lijn waarin al jouw kanten passen.",
  },
  D: {
    naam: "The Fusion",
    kort: "Fusion",
    sub: "Twee werelden. Eén bord. Niemand anders doet dit.",
    badge: "Fusion gerecht",
    woorden: ["verrassend", "verbindend", "slim"],
    tekst:
      "The Fusion is een merk op een kruispunt waar verder niemand staat. Jij hebt twee werelden in je gecombineerd — een vakgebied, een achtergrond, een methodiek — die normaal niet bij elkaar voorkomen. En die combinatie is geen bijproduct. Het is je hele propositie. Jij bent de vertaler, de bridge, de categorie-creator.",
    looks:
      "Codes uit beide werelden, samengesmolten tot een nieuwe taal. Niet 50/50 — een hybride dat aanvoelt als een nieuwe categorie, niet als compromis. Je merk voelt onbekend maar logisch.",
    sounds:
      "Jouw stem bouwt voortdurend bruggen. Je vertaalt jargon naar toegankelijk, of geeft simpele dingen onverwacht diepte. Je content is vertaal-werk: je legt veld A uit met de taal van veld B.",
    works:
      "Bij klanten wiens probleem niet in één hokje past. Ze hebben specialisten geprobeerd en gemerkt: die snappen maar de helft. Jij snapt het hele verhaal — en daar betalen ze premium voor.",
    blind:
      "Het gevaar van The Fusion: te complex klinken. Als je niet kristalhelder kunt uitleggen wat de kruising oplevert voor de klant, haak je mensen af voordat ze begrijpen hoe bijzonder je bent. Jouw positionering is je grootste kans — en je grootste werk.",
    start: "04",
    startTekst: "Jouw intersectie is goud — ze moet alleen vertaald worden naar één heldere zin. Dat doen we in Positioning Cut.",
  },
};

export interface QuizOption {
  l: ArchetypeId;
  t: string;
  m: string;
}
export interface QuizQuestion {
  course: CourseId;
  v: string;
  sub: string;
  o: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    course: "01",
    v: "Een klant vraagt wat jij doet. Wat is jouw eerste reflex?",
    sub: "Niet wat je zou moeten zeggen — wat er écht als eerste uit komt.",
    o: [
      { l: "A", t: "Ik leg rustig uit wat ik doe, stap voor stap. Betrouwbaar en helder.", m: "“Ik werk al jaren met coaches die...”" },
      { l: "B", t: "Ik val meteen in op dat ene specifieke ding waar ik écht goed in ben.", m: "“Ik doe eigenlijk maar één ding, maar dan perfect.”" },
      { l: "C", t: "Ik vertel een verhaal dat iedere keer net anders klinkt, afhankelijk van wie ik tegenover me heb.", m: "“Het hangt er een beetje van af, want...”" },
      { l: "D", t: "Ik leg een onverwachte combinatie uit die mensen doet denken: dat heb ik nog nooit gehoord.", m: "“Ik combineer eigenlijk X en Y, en dat is waar de magie zit.”" },
    ],
  },
  {
    course: "02",
    v: "Je content werkt goed. Wat is de meest voorkomende reactie die je krijgt?",
    sub: "Van klanten, volgers of collega's.",
    o: [
      { l: "A", t: "“Ik vertrouw je meteen. Je lijkt zo betrouwbaar en ervaren.”", m: "Vertrouwen als eerste indruk" },
      { l: "B", t: "“Dit is zo herkenbaar. Ik weet meteen dat dit van jou is.”", m: "Herkenbaarheid als merk" },
      { l: "C", t: "“Wauw, je bent elke keer weer anders maar toch altijd jezelf.”", m: "Verrassing als constante" },
      { l: "D", t: "“Ik had nog nooit op deze manier naar dit probleem gekeken.”", m: "Inzicht als onderscheider" },
    ],
  },
  {
    course: "03",
    v: "Je mag maar één ding op je Instagram-profiel zetten dat jou omschrijft. Wat kies je?",
    sub: "Je hebt 5 seconden. Geen tijd om na te denken.",
    o: [
      { l: "A", t: "Bewezen resultaten. Reviews, cases, cijfers. Consistentie is mijn signature.", m: "“Al 200+ ondernemers geholpen.”" },
      { l: "B", t: "Die ene methode of aanpak waar alles om draait. Mijn naam = mijn ding.", m: "“De bedenker van [jouw framework].”" },
      { l: "C", t: "Een statement dat mensen wakker schudt. Onverwacht, scherp, persoonlijk.", m: "“Ik help je niet groeien. Ik help je jezelf worden.”" },
      { l: "D", t: "De unieke kruising van twee werelden die normaal nooit samenkomen.", m: "“Waar [vakgebied X] en [vakgebied Y] elkaar ontmoeten.”" },
    ],
  },
  {
    course: "04",
    v: "Je ziet een concurrent die nagenoeg hetzelfde doet als jij. Wat is je eerste reactie?",
    sub: "Geen sugarcoating. Wat voel je écht?",
    o: [
      { l: "A", t: "Weinig. Mijn track record spreekt voor zich. Klanten kiezen mij om bewezen resultaten, niet om originaliteit.", m: "Zekerheid in bewijs" },
      { l: "B", t: "Ze kunnen mijn aanpak kopiëren, maar niet mijn signature. Dat is van mij.", m: "Zekerheid in eigenheid" },
      { l: "C", t: "Ik verander gewoon. Ik beweeg altijd sneller dan de markt.", m: "Zekerheid in beweging" },
      { l: "D", t: "Niemand heeft precies mijn combinatie van achtergrond en expertise. Dat valt niet te kopiëren.", m: "Zekerheid in kruising" },
    ],
  },
  {
    course: "05",
    v: "Stel: je moet morgen een brand shoot doen. Wat is je eerste gedachte?",
    sub: "Wees eerlijk — je dramt of je straalt.",
    o: [
      { l: "A", t: "Fijn, ik weet al precies wat ik draag en hoe het eruit moet zien. Ik heb een stijl en die volg ik.", m: "Consistentie is comfortabel" },
      { l: "B", t: "Ik heb al een moodboard klaar. Die ene look die écht mij is, verfijn ik al jaren.", m: "Eén look, perfect uitgevoerd" },
      { l: "C", t: "Ik wil meerdere looks, verschillende sferen. Eén look voelt te beperkt.", m: "Meer dan één kant van mezelf" },
      { l: "D", t: "Ik denk aan een concept dat mensen niet verwachten bij iemand in mijn vakgebied.", m: "Verwachtingen doorbreken" },
    ],
  },
  {
    course: "06",
    v: "Als jouw merk een gerecht zou zijn in een restaurant — wat staat er op de menukaart?",
    sub: "Kies wat het meest resoneert, niet wat het slimst klinkt.",
    o: [
      { l: "A", t: "Een klassieker die altijd op de kaart staat. Uitgeperfectioneerd. Mensen bestellen het zonder nadenken.", m: "Steak, croissant, Caesar — tijdloos" },
      { l: "B", t: "Het handtekeninggerecht van de chef. Het gerecht waar het restaurant om bekend staat.", m: "“Vraag naar de Signature”" },
      { l: "C", t: "Het Seizoensgerecht. Anders iedere keer, altijd verrassend, nooit inwisselbaar.", m: "Speciaal van vandaag" },
      { l: "D", t: "Een fusion die niemand had verwacht maar iedereen bijblijft. Twee werelden op één bord.", m: "“Hoe komen die twee smaken samen?”" },
    ],
  },
  {
    course: "07",
    v: "Je meest succesvolle klant tot nu toe — waardoor werkte jullie samenwerking écht?",
    sub: "Niet wat je aanbood, maar wat er werkelijk klikte.",
    o: [
      { l: "A", t: "Ze wisten precies wat ze kregen. Geen verrassingen, geen vaagheid. Dat vertrouwen maakte alles.", m: "Structuur als fundament" },
      { l: "B", t: "Jij had iets unieks dat niemand anders kon bieden — en zij voelden dat direct.", m: "Expertise als magneet" },
      { l: "C", t: "Jij paste je aan aan waar zij op dat moment was. De samenwerking voelde custom, niet van-de-plank.", m: "Aanpassing als kracht" },
      { l: "D", t: "Jij bracht een invalshoek die ze nog nooit hadden overwogen — en dat opende alles.", m: "Perspectief als katalysator" },
    ],
  },
];

export function berekenUitslag(antwoorden: ArchetypeId[]): { uitslag: ArchetypeId; scores: Record<ArchetypeId, number> } {
  const tel: Record<ArchetypeId, number> = { A: 0, B: 0, C: 0, D: 0 };
  antwoorden.forEach((x) => tel[x]++);
  const uitslag = (Object.entries(tel).sort((a, b) => b[1] - a[1])[0][0] as ArchetypeId) ?? "A";
  return { uitslag, scores: tel };
}
