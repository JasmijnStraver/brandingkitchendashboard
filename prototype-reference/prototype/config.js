/* =====================================================================
   CONFIGURATIE — alles wat je als eigenaar wilt aanpassen staat hier.
   In de live versie komt dit uit de database en pas je het aan in je keuken.
   ===================================================================== */

// Beeld uit Portaal & huisstijl, anders je officiële standaard
// Het SC-monogram als icoon in elke kleur (via een masker op het witte monogram)
function monoIcoon(extra = '') { const m = LOGO_STANDAARD.monogram || ''; return m ? `<span class="mono ${extra}" style="--mono:url(${m})" aria-hidden="true"></span>` : '✦'; }
function beeld(key) { if (typeof FOTO_VAKKEN !== 'undefined' && FOTO_VAKKEN[key]?.bron) return fotoBron(key); return (typeof data !== 'undefined' && data.portaal?.[key]) || LOGO_STANDAARD[key] || ''; }

// Contact: altijd bereikbaar via app of mail (aan te passen in Portaal & huisstijl)
const CONTACT_STANDAARD = { mail:'info@studiocrave.nl', app:'' };
function contact() { const p = (typeof data !== 'undefined' && data.portaal) || {}; return { mail: p.contactMail || CONTACT_STANDAARD.mail, app: p.contactApp ?? CONTACT_STANDAARD.app }; }
function appLink(nr) { const n = (nr || '').replace(/[^0-9+]/g, '').replace(/^\+/, '').replace(/^0(?=6)/, '31'); return n ? 'https://wa.me/' + n : ''; }
function contactRegel(kort) { const c = contact(); const app = appLink(c.app);
  return `<p class="contactregel">${kort ? 'Vragen?' : 'Voor vragen ben ik altijd bereikbaar.'} ${app ? `<a href="${app}" target="_blank" rel="noopener">App me</a> of mail` : 'App of mail'} naar <a href="mailto:${esc(c.mail)}">${esc(c.mail)}</a>.</p>`; }

const PORTAAL = {
  welkomKop: 'Ready to create some cravings?',
  quotes: [
    'Mooi is de basis. Voelbaar is het doel.',
    'Een merk dat je niet voelt, vergeet je.',
    'Geen fastfood-branding. We koken met jouw eigen ingrediënten.',
    'Je hoeft niet harder te roepen. Je moet beter smaken.'
  ]
};

// De reis: 7 courses + de Signature Dish waarin alles samenkomt.
const COURSES = {
  '01': { nr:'01', naam:'Raw Ingredients', sub:'Wie je echt bent: verhaal, energie, expertise, rafelrandjes',
    jasmijn:['Diepte-interview over je verhaal in {vakgebied}: keerpunten en wat je meeneemt','Ik haal je energie, expertise en rafelrandjes naar boven, ook wat je zelf over het hoofd ziet','Je ontvangt je Raw Ingredients-overzicht: de bouwstenen van alles wat volgt'],
    jij:'Je leert je eigen verhaal vertellen zonder te twijfelen of het "genoeg" is. Met de tools maak je er direct content van.',
    aanleveren:'Foto\'s of momenten uit je verhaal, oude teksten waar je trots op bent, je CV of LinkedIn als inspiratie.' },
  '02': { nr:'02', naam:'Flavor Profile', sub:'Tone of voice, energie en vibe',
    jasmijn:['Ik analyseer hoe je nu klinkt: voice memo\'s, posts, berichten','We leggen je toon vast: woorden die wél bij je horen en woorden die nooit','Je vibe en energie vertaald naar een moodboard'],
    jij:'Schrijven zoals je praat. Vanaf hier klinkt elke tool in het portaal als jij.',
    aanleveren:'Drie voice memo\'s waarin je vertelt wat je doet, alsof je het aan een vriend(in), je partner of een collega uitlegt. Screenshots van posts die echt als jou voelen.' },
  '03': { nr:'03', naam:'Signature Sauce', sub:'Jouw unieke methode, visie en frameworks',
    jasmijn:['We vangen jouw werkwijze in een eigen methode, met een naam die blijft hangen','Ik werk je framework visueel uit, klaar om te laten zien','Je visie scherp op papier: waar sta jij voor, waar niet'],
    jij:'Autoriteit tonen zonder te schreeuwen. Je methode wordt de rode draad in je content en aanbod.',
    aanleveren:'Hoe je nu met {klanten} werkt: stappen, oefeningen, vaste vragen. Alles mag, ook als het rommelig is.' },
  '04': { nr:'04', naam:'Positioning Cut', sub:'Niche, claims en grenzen',
    jasmijn:['Je messaging plan: kernbelofte, doelgroep, content-pijlers','Je anti-positionering: wat je niet bent en niet doet','Scherpe claims die je met overtuiging durft te maken'],
    jasmijnShoot:['Je messaging plan: kernbelofte, doelgroep, content-pijlers','Je anti-positionering: wat je niet bent en niet doet','Je Craveable Identity: logo, kleuren, lettertypen, beeldstijl en brandbook, vanuit je positionering','De voorbereiding van je brand shoot: shotlist, regie, locatie en outfits'],
    jij:'Kiezen, en nee durven zeggen. Je Brand Foundation wordt hier definitief, en alle tools gebruiken hem.',
    jijShoot:'Kiezen, en nee durven zeggen. Je Brand Foundation wordt hier definitief, en je positionering bepaalt wat we tijdens je shoot in beeld brengen.',
    aanleveren:'Voorbeelden van concurrenten of collega\'s waar je je tegen wilt afzetten.' },
  '05': { nr:'05', naam:'Plating', sub:'Content formats, hooks en storytelling',
    jasmijn:['Je content-pijlers vertaald naar vaste formats','Hooks en storylijnen in jouw taal','Vaste formats en templates in jouw huisstijl'],
    jasmijnShoot:['Eerst je brand shoot: ik regisseer, fotografeer en bewerk je beelden in de Studio Crave-stijl','Daarna bouw ik je templates, met je eigen foto\'s uit de shoot','Je content-pijlers vertaald naar vaste formats, met hooks en storylijnen in jouw taal'],
    jij:'Hier word je zelfstandig. De tools maken captions, hooks, carrousels en story-weken die als jou klinken.',
    jijShoot:'Je kiest je favoriete foto\'s, en vanaf dan post je met beelden en templates die echt van jou zijn. De tools schrijven de teksten erbij, in jouw toon.',
    aanleveren:'Content die goed liep (of juist niet), en je planning of contentkalender als je die hebt.' },
  '06': { nr:'06', naam:'Pairing', sub:'Aanbod, prijs en klantreis',
    jasmijn:['Je {aanbod} gestructureerd en geprijsd op waarde','De reis van je {klanten}, van eerste contact tot ja','De basis voor je salespagina en weggever'],
    jij:'Verkopen zonder dat het voelt als verkopen. Met de tools schrijf je je salespagina, mails en masterclass.',
    aanleveren:'Je huidige {aanbod} en prijzen, en waar je twijfelt.' },
  '07': { nr:'07', naam:'The Experience', sub:'Hoe samenwerken met jou voelt',
    jasmijn:['De beleving van je {klanten}, van eerste DM tot afronding','Onboarding en momenten die je klant bijblijven','Exclusiviteit: wat maakt jou onvergetelijk'],
    jij:'Je {klanten} laten voelen wat jij nu voelt. Met de tools voer je sales-gesprekken en deel je resultaten.',
    aanleveren:'Hoe je nu {klanten} verwelkomt, en een paar reacties of testimonials.' },
  'finale': { nr:'✦', naam:'Signature Dish', sub:'Het dessert: je hele merk op één bord', dessert:true,
    jasmijn:['Je volledige merk samengebracht: van verhaal tot beleving','Eindpresentatie en overdracht van alle bestanden','Samen je volgende 90 dagen uitzetten'],
    jij:'Alles wat je hebt gemaakt komt hier samen. Met de planningstools zet je je merk om in een ritme dat past bij jouw week.',
    aanleveren:'Je vragen voor de afrondende sessie.' }
};

const PAKKETTEN = {
  dwy:   { naam:'7-Course Brand Experience', kort:'7-Course', prijs:'€1.500', duur:'8 weken', duurWeken:8, inbegrepen:['Brand shoot','Branded templates','Craveable Identity'], courses:['01','02','03','04','05','06','07'] },
  audit: { naam:'Brand Audit', kort:'Audit', prijs:'€77', duur:'4 weken', duurWeken:4, naMaanden:0, waarschuwDagen:7, courses:['01','02','04'] }
};
const EXTRAS = ['Brand shoot','Branded templates','Craveable Identity','Website'];
// Wat er in elke extra zit (voorstel: pas aan naar wat jij levert). Wordt getoond op Samenwerken en als checklist als het is bijgeboekt.
const EXTRA_INHOUD = {
  'Brand shoot': ['Voorbereiding: shotlist, regie, locatie en outfits vanuit je positionering','De shoot, geregisseerd op jouw verhaal','Je selectie in een online galerij','Bewerking in de Studio Crave-stijl, klaar om te downloaden'],
  'Branded templates': ['100+ social templates, afgestemd op je doel: zichtbaarheid en opbouw, lancering of verkoop','Brandbook en Brand Kit in Canva','Custom brand logo','Kleuren en lettertypen','1:1 brand sessies','Chatsupport tijdens het traject','Extra: toegang tot The Branding Kitchen, je online werkomgeving met skills, agents, je hele merk overzichtelijk bij elkaar, je workflow en de sous-chef, tot 2 maanden na oplevering'],
  'Craveable Identity': ['Full basic branding: je merk in de basis neergezet, zonder templates en shoot','Korte merkbasis vooraf: je verhaal en je gewenste gevoel (Raw Ingredients en Flavor Profile, light)','Custom logo-set: hoofdlogo, variant en beeldmerk of monogram, in licht en donker','Kleurpalet met alle codes (HEX, RGB, CMYK) en lettertypen voor koppen, tekst en accenten','Beeldstijl en grafische elementen: licht, sfeer, patronen, iconen','Brandbook, plus een ingerichte Brand Kit in Canva','Basistoepassingen: e-mailhandtekening, favicon, profielfoto\'s voor social media','Toegang tot The Branding Kitchen tot 2 maanden na oplevering'],
  'Website': ['Opzet en structuur vanuit je positionering en aanbod','Ontwerp in je visuele identiteit, met je eigen beelden','Teksten in jouw toon','Oplevering en uitleg om zelf aanpassingen te doen'] };
// Zit het in het pakket (7-Course: altijd shoot en templates) of is het bijgeboekt?
const inbegrepen = (pakket, e) => !!PAKKETTEN[pakket]?.inbegrepen?.includes(e);
const heeftExtra = (k, e) => inbegrepen(k.pakket, e) || (k.extras || []).includes(e);

// Skills-bibliotheek. De instructies worden in deze demo gevuld met je echte SKILL.md-bestanden.
const SKILLS = [
  { id:'origin-story-reeks', naam:'Origin Story Reeks', course:'01', wat:'Een story-reeks over jouw reis', vb:'het moment dat ik besloot het anders te doen voor {doelgroep}', kennis:['instagram'] },
  { id:'tone-of-voice', naam:'Tone of Voice', course:'02', wat:'Check of een tekst echt als jou klinkt', vb:'deze tekst herschrijven zodat hij {toon} klinkt', concept:true, kennis:['markt'] },
  { id:'authority-carrousel', naam:'Authority Carrousel', course:'03', wat:'Laat je expertise zien in een carrousel', vb:'wat {doelgroep} altijd verkeerd doet bij {pijn}', kennis:['instagram','linkedin'] },
  { id:'signature-method', naam:'Signature Method', course:'03', wat:'Benoem en visualiseer je eigen methode', vb:'de stappen die ik met elke klant doorloop', concept:true, kennis:['markt'] },
  { id:'linkedin-profiel', naam:'LinkedIn Profiel', course:'04', wat:'Profiel en posts vertellen hetzelfde verhaal', vb:'mijn LinkedIn-headline voor {doelgroep}', kennis:['linkedin'] },
  { id:'messaging-plan', naam:'Messaging Plan', course:'04', wat:'Je kernbelofte en pijlers scherp', vb:'mijn belofte aan {doelgroep}', kennis:['markt'] },
  { id:'brand-foundation', naam:'Brand Foundation', course:'04', wat:'Je merkkaartje dat alle tools voedt', vb:'mijn Brand Foundation bijwerken', kennis:['markt'] },
  { id:'anti-positionering-carrousel', naam:'Anti-positionering Carrousel', course:'04', wat:'Wat jij niet bent, en waarom dat werkt', vb:'waarom ik niet {nooit} ben', kennis:['instagram','linkedin'] },
  { id:'linkedin-post-writer', naam:'LinkedIn Post Writer', course:'05', wat:'Posts in jouw toon, voor jouw klanttype', vb:'een LinkedIn-post voor {doelgroep} over {pijn}', kennis:['linkedin'] },
  { id:'short-video-script', naam:'Short Video Script', course:'05', wat:'Scripts voor Reels, TikTok en Shorts', vb:'een video van 30 seconden over {pijn}', kennis:['tiktok','instagram','youtube','facebook'] },
  { id:'caption-writer', naam:'Caption Writer', course:'05', wat:'Captions die klinken als jij', vb:'een caption voor {doelgroep} over {pijn}', kennis:['instagram','facebook'] },
  { id:'funnel-hook-generator', naam:'Funnel Hook Generator', course:'05', wat:'Hooks voor elke fase van je funnel', vb:'hooks over {resultaat}', kennis:['instagram','linkedin','facebook','tiktok','youtube'] },
  { id:'normal-story-week', naam:'Normal Story Week', course:'05', wat:'Een week stories die zichtbaarheid opbouwt', vb:'een story-week rond {pijn}', kennis:['instagram'] },
  { id:'resultaat-carrousel', naam:'Resultaat Carrousel', course:'05', wat:'Laat zien waar je klant uitkomt', vb:'van {pijn} naar {resultaat}', kennis:['instagram','linkedin'] },
  { id:'launch-carrousel-story', naam:'Launch Carrousel & Story', course:'05', wat:'Content voor je lancering', vb:'de lancering van mijn nieuwe aanbod', kennis:['instagram'] },
  { id:'stories-voor-leads', naam:'Stories voor Leads', course:'05', wat:'Een story-reeks die leads trekt', vb:'aanmeldingen voor mijn wachtlijst', kennis:['instagram'] },
  { id:'lead-magnet-story-week', naam:'Lead Magnet Story Week', course:'05', wat:'Zes dagen naar je weggever', vb:'mijn gratis weggever voor {doelgroep}', kennis:['instagram'] },
  { id:'offer-builder', naam:'Offer Builder', course:'06', wat:'Je aanbod verpakt en geprijsd', vb:'een aanbod dat {doelgroep} helpt naar {resultaat}', kennis:['markt'] },
  { id:'checkout-page', naam:'Checkout Page', course:'06', wat:'Je salespagina schrijven', vb:'de salespagina voor mijn traject', kennis:['website'] },
  { id:'email-funnel-writer', naam:'Email Funnel Writer', course:'06', wat:'Mails en lanceerseries', vb:'een welkomstmail voor nieuwe inschrijvers', kennis:['email'] },
  { id:'masterclass-schrijver', naam:'Masterclass Schrijver', course:'06', wat:'De tekst van je masterclass', vb:'een masterclass over {pijn}', kennis:['live'] },
  { id:'webinar-script-builder', naam:'Webinar Script Builder', course:'06', wat:'Script met slides en timing', vb:'een webinar van 45 minuten voor {doelgroep}', kennis:['live'] },
  { id:'dm-sales-coach', naam:'DM Sales Coach', course:'07', wat:'Hulp bij je DM-gesprekken', vb:'een lead die vroeg naar mijn prijs', kennis:['verkoop'] },
  { id:'client-result-carrousel', naam:'Client Result Carrousel', course:'07', wat:'Een klantresultaat als swipe-verhaal', vb:'het resultaat van een klant die vastzat in {pijn}', kennis:['instagram','linkedin'] },
  { id:'onder-de-radar-pitch', naam:'Onder-de-radar Pitch', course:'07', wat:'Stil verkopen via DM en community', vb:'twee plekken in mijn traject, zonder lancering', kennis:['verkoop'] },
  { id:'jaardoel', naam:'Jaardoel', course:'finale', wat:'Je jaardoel terugrekenen naar maanden', vb:'mijn omzetdoel voor volgend jaar', kennis:['markt'] },
  { id:'perfecte-week-planner', naam:'Perfecte Week', course:'finale', wat:'Een werkweek die past bij jouw energie', vb:'hoeveel klanten ik aankan naast content', kennis:['markt'] },
  { id:'sprint-doel', naam:'Sprint-Doel', course:'finale', wat:'Twee weken, concrete targets', vb:'een sprint naar mijn volgende lancering', kennis:['markt'] }
];

// Onboarding-quiz: "Welk gerecht ben jij?" — jouw archetype-quiz.
// Elke vraag hoort bij één course, zodat de quiz de klant al door het menu leidt.
const ARCHETYPES = {
  A: { naam:'The Classic', kort:'Classic', sub:'Tijdloos. Vertrouwd. Altijd goed.', badge:'Bewezen recept', woorden:['rustig','deskundig','betrouwbaar'],
    tekst:'The Classic is geen experiment, geen seizoensding. Jij bent een instelling. Klanten komen niet bij jou voor verrassing — ze komen voor zekerheid. Je merk drijft op kwaliteit die zichzelf bewijst, jaar na jaar, klant na klant. In een markt waar iedereen schreeuwt om de nieuwste te zijn, is rust een radicale positionering. Je categorie? Tijdloos. Je belofte? Bewezen. Je risico voor de klant? Minimaal.',
    looks:'Terughoudend, premium, tijdloos. Serif typografie. Een ingehouden kleurenpalet. Witruimte als luxe. Je beelden zijn gebouwd om over tien jaar nog te werken — niet om morgen viral te gaan. Geen trend-mee, geen gimmicks.',
    sounds:'Autoritatief zonder arrogant. Je laat je werk spreken — cases, jaren ervaring, klanten met namen. Je belooft minder dan je waarmaakt. En dáárom geloven ze je.',
    works:'Bij klanten die een grote beslissing maken en geen risico willen lopen. High-stakes werk, lange-termijn samenwerkingen, premium budgetten. Niemand kiest jou voor flair. Iedereen kiest jou voor zekerheid.',
    blind:'Het gevaar van The Classic: onzichtbaarheid. Als je niet actief claimt waarom jij de beste klassieker bent, verdwijnt je merk in de massa van \'ook-goed-maar-niet-anders\'. Je merk heeft een hoek nodig — een standpunt. Niet meer aanbod. Een scherper verhaal.',
    start:'04', startTekst:'Jouw fundament is sterk — het verhaal eromheen verdient een scherpere hoek. In Positioning Cut geven we je klassieker een standpunt dat niemand kan negeren.' },
  B: { naam:'The Signature', kort:'Signature', sub:'Eén ding. Jouw ding. Onkopieerbaar.', badge:'Signature gerecht', woorden:['helder','eigen','herkenbaar'],
    tekst:'The Signature is een merk gebouwd op één ding — en dat ding doe jij beter dan iedereen. Geen alleskunner, geen breed aanbod: één methode, één framework, één signature-aanpak die alleen bij jou te krijgen is. Klanten komen niet bij jou voor \'coaching\' of \'strategie\' in het algemeen — ze komen specifiek voor JOUW ding. Dat maakt The Signature geen beperking; het maakt \'m onkopieerbaar. Een categorie van één.',
    looks:'Eén look, oneindig verfijnd. Geen aanpasbaar moodboard — een gedefinieerd merk. Mensen herkennen je content zonder je naam te zien. Je hebt visuele eigendom: een kleur, een vorm of een compositie die jouw handtekening is.',
    sounds:'Jouw stem komt altijd terug op jouw methode, jouw concept, jouw view. Je hoeft niet steeds nieuw te zijn — je gaat dieper. Je content is bewijs van Het Ene Ding, in twintig variaties.',
    works:'Bij klanten die hun probleem opgelost willen krijgen op JOUW manier. Ze hebben anderen geprobeerd, ze hebben kopieën gezien — ze willen het origineel. Ze betalen premium voor jouw methode, niet voor jouw tijd.',
    blind:'Het gevaar van The Signature: te smal worden. Als jouw hele merk op één ding rust, moet dat ene ding uitstekend gecommuniceerd worden. Veel Signatures verliezen klanten niet door gebrek aan kwaliteit — maar door gebrek aan zichtbaarheid en een verhaal dat verder gaat dan het product.',
    start:'02', startTekst:'Jouw ding is goed — de wereld moet het alleen nog horen. In Flavor Profile vinden we de stem die net zo herkenbaar is als je methode.' },
  C: { naam:'Chef\'s Special', kort:'Chef\'s Special', sub:'Verandert. Verrast. Verdwijnt nooit.', badge:'Seizoensgerecht', woorden:['direct','persoonlijk','levendig'],
    tekst:'Chef\'s Special is een merk dat ademt met de tijd. Jij bent geen vastgepind concept — je bent een levend ding dat zich aanpast aan seizoen, energie, ontwikkeling. En dat klinkt als chaos, maar voor jou is het de enige manier waarop het werkt. De rode draad? Jij. Jouw smaak, jouw oog, jouw stem — die blijven hangen. De vorm waarin het verschijnt mag verschuiven.',
    looks:'Een gedefinieerde wereld waarin meerdere collecties leven. Niet één look — meerdere expressies van dezelfde DNA. De grammar is consistent, de woorden veranderen. Variabele kleurenpaletten binnen één kader.',
    sounds:'Direct, persoonlijk, in het moment. Je deelt waar je nú bent, niet waar je drie jaar geleden was. Mensen volgen jou voor de evolutie, niet voor een vastgepind eindbeeld.',
    works:'Bij klanten die je vinden in een specifiek hoofdstuk en willen meegroeien. Bij mensen die geloven dat een merk een mens is, geen monument. Je trekt loyale fans aan, geen one-off klanten.',
    blind:'Het gevaar van Chef\'s Special: diffuus overkomen. Zonder een visuele lijn en een heldere toon word je \'leuk maar verwarrend\'. Klanten die niet meteen snappen wie je bent, boeken niet. Jouw chaos heeft een container nodig — een merk dat de veelzijdigheid omhult zonder haar te doven.',
    start:'05', startTekst:'Jouw energie is raak — je merk moet het vasthouden. In Plating bouwen we de vaste formats en de visuele lijn waarin al jouw kanten passen.' },
  D: { naam:'The Fusion', kort:'Fusion', sub:'Twee werelden. Eén bord. Niemand anders doet dit.', badge:'Fusion gerecht', woorden:['verrassend','verbindend','slim'],
    tekst:'The Fusion is een merk op een kruispunt waar verder niemand staat. Jij hebt twee werelden in je gecombineerd — een vakgebied, een achtergrond, een methodiek — die normaal niet bij elkaar voorkomen. En die combinatie is geen bijproduct. Het is je hele propositie. Jij bent de vertaler, de bridge, de categorie-creator.',
    looks:'Codes uit beide werelden, samengesmolten tot een nieuwe taal. Niet 50/50 — een hybride dat aanvoelt als een nieuwe categorie, niet als compromis. Je merk voelt onbekend maar logisch.',
    sounds:'Jouw stem bouwt voortdurend bruggen. Je vertaalt jargon naar toegankelijk, of geeft simpele dingen onverwacht diepte. Je content is vertaal-werk: je legt veld A uit met de taal van veld B.',
    works:'Bij klanten wiens probleem niet in één hokje past. Ze hebben specialisten geprobeerd en gemerkt: die snappen maar de helft. Jij snapt het hele verhaal — en daar betalen ze premium voor.',
    blind:'Het gevaar van The Fusion: te complex klinken. Als je niet kristalhelder kunt uitleggen wat de kruising oplevert voor de klant, haak je mensen af voordat ze begrijpen hoe bijzonder je bent. Jouw positionering is je grootste kans — en je grootste werk.',
    start:'04', startTekst:'Jouw intersectie is goud — ze moet alleen vertaald worden naar één heldere zin. Dat doen we in Positioning Cut.' }
};

const QUIZ = [
  { course:'01', v:'Een klant vraagt wat jij doet. Wat is jouw eerste reflex?', sub:'Niet wat je zou moeten zeggen — wat er écht als eerste uit komt.', o:[
    { l:'A', t:'Ik leg rustig uit wat ik doe, stap voor stap. Betrouwbaar en helder.', m:'“Ik werk al jaren met coaches die...”' },
    { l:'B', t:'Ik val meteen in op dat ene specifieke ding waar ik écht goed in ben.', m:'“Ik doe eigenlijk maar één ding, maar dan perfect.”' },
    { l:'C', t:'Ik vertel een verhaal dat iedere keer net anders klinkt, afhankelijk van wie ik tegenover me heb.', m:'“Het hangt er een beetje van af, want...”' },
    { l:'D', t:'Ik leg een onverwachte combinatie uit die mensen doet denken: dat heb ik nog nooit gehoord.', m:'“Ik combineer eigenlijk X en Y, en dat is waar de magie zit.”' } ]},
  { course:'02', v:'Je content werkt goed. Wat is de meest voorkomende reactie die je krijgt?', sub:'Van klanten, volgers of collega\'s.', o:[
    { l:'A', t:'“Ik vertrouw je meteen. Je lijkt zo betrouwbaar en ervaren.”', m:'Vertrouwen als eerste indruk' },
    { l:'B', t:'“Dit is zo herkenbaar. Ik weet meteen dat dit van jou is.”', m:'Herkenbaarheid als merk' },
    { l:'C', t:'“Wauw, je bent elke keer weer anders maar toch altijd jezelf.”', m:'Verrassing als constante' },
    { l:'D', t:'“Ik had nog nooit op deze manier naar dit probleem gekeken.”', m:'Inzicht als onderscheider' } ]},
  { course:'03', v:'Je mag maar één ding op je Instagram-profiel zetten dat jou omschrijft. Wat kies je?', sub:'Je hebt 5 seconden. Geen tijd om na te denken.', o:[
    { l:'A', t:'Bewezen resultaten. Reviews, cases, cijfers. Consistentie is mijn signature.', m:'“Al 200+ ondernemers geholpen.”' },
    { l:'B', t:'Die ene methode of aanpak waar alles om draait. Mijn naam = mijn ding.', m:'“De bedenker van [jouw framework].”' },
    { l:'C', t:'Een statement dat mensen wakker schudt. Onverwacht, scherp, persoonlijk.', m:'“Ik help je niet groeien. Ik help je jezelf worden.”' },
    { l:'D', t:'De unieke kruising van twee werelden die normaal nooit samenkomen.', m:'“Waar [vakgebied X] en [vakgebied Y] elkaar ontmoeten.”' } ]},
  { course:'04', v:'Je ziet een concurrent die nagenoeg hetzelfde doet als jij. Wat is je eerste reactie?', sub:'Geen sugarcoating. Wat voel je écht?', o:[
    { l:'A', t:'Weinig. Mijn track record spreekt voor zich. Klanten kiezen mij om bewezen resultaten, niet om originaliteit.', m:'Zekerheid in bewijs' },
    { l:'B', t:'Ze kunnen mijn aanpak kopiëren, maar niet mijn signature. Dat is van mij.', m:'Zekerheid in eigenheid' },
    { l:'C', t:'Ik verander gewoon. Ik beweeg altijd sneller dan de markt.', m:'Zekerheid in beweging' },
    { l:'D', t:'Niemand heeft precies mijn combinatie van achtergrond en expertise. Dat valt niet te kopiëren.', m:'Zekerheid in kruising' } ]},
  { course:'05', v:'Stel: je moet morgen een brand shoot doen. Wat is je eerste gedachte?', sub:'Wees eerlijk — je dramt of je straalt.', o:[
    { l:'A', t:'Fijn, ik weet al precies wat ik draag en hoe het eruit moet zien. Ik heb een stijl en die volg ik.', m:'Consistentie is comfortabel' },
    { l:'B', t:'Ik heb al een moodboard klaar. Die ene look die écht mij is, verfijn ik al jaren.', m:'Eén look, perfect uitgevoerd' },
    { l:'C', t:'Ik wil meerdere looks, verschillende sferen. Eén look voelt te beperkt.', m:'Meer dan één kant van mezelf' },
    { l:'D', t:'Ik denk aan een concept dat mensen niet verwachten bij iemand in mijn vakgebied.', m:'Verwachtingen doorbreken' } ]},
  { course:'06', v:'Als jouw merk een gerecht zou zijn in een restaurant — wat staat er op de menukaart?', sub:'Kies wat het meest resoneert, niet wat het slimst klinkt.', o:[
    { l:'A', t:'Een klassieker die altijd op de kaart staat. Uitgeperfectioneerd. Mensen bestellen het zonder nadenken.', m:'Steak, croissant, Caesar — tijdloos' },
    { l:'B', t:'Het handtekeninggerecht van de chef. Het gerecht waar het restaurant om bekend staat.', m:'“Vraag naar de Signature”' },
    { l:'C', t:'Het Seizoensgerecht. Anders iedere keer, altijd verrassend, nooit inwisselbaar.', m:'Speciaal van vandaag' },
    { l:'D', t:'Een fusion die niemand had verwacht maar iedereen bijblijft. Twee werelden op één bord.', m:'“Hoe komen die twee smaken samen?”' } ]},
  { course:'07', v:'Je meest succesvolle klant tot nu toe — waardoor werkte jullie samenwerking écht?', sub:'Niet wat je aanbood, maar wat er werkelijk klikte.', o:[
    { l:'A', t:'Ze wisten precies wat ze kregen. Geen verrassingen, geen vaagheid. Dat vertrouwen maakte alles.', m:'Structuur als fundament' },
    { l:'B', t:'Jij had iets unieks dat niemand anders kon bieden — en zij voelden dat direct.', m:'Expertise als magneet' },
    { l:'C', t:'Jij paste je aan aan waar zij op dat moment was. De samenwerking voelde custom, niet van-de-plank.', m:'Aanpassing als kracht' },
    { l:'D', t:'Jij bracht een invalshoek die ze nog nooit hadden overwogen — en dat opende alles.', m:'Perspectief als katalysator' } ]}
];
const optTekst = (q, l) => q.o.find(x => x.l === l)?.t || '';

// Vragenlijst "Wie ben jij & je business". Dit is de startversie: je past hem aan in je keuken.
// In teksten kun je {voornaam}, {archetype} en {woorden} gebruiken. Is het archetype nog onbekend
// (quiz nog niet gedaan), dan valt de zin met {archetype} weg en wordt {woorden} "warm, eerlijk, scherp".
// "tool" koppelt een antwoord aan de persoonlijke laag die alle tools gebruiken.
const TOOL_VELDEN = { platformen:'Kanalen waarop ze actief is', gevoel:'Gewenst merkgevoel', kleurwens:'Kleurwensen', behouden:'Wat ze wil behouden', vakgebied:'Vakgebied', klantwoord:'Hoe ze haar klanten noemt', aanbodwoord:'Hoe ze haar aanbod noemt', doelgroep:'Doelgroep', pijn:'Waar haar klant vastloopt', resultaat:'Resultaat dat ze levert', toon:'Toon', nooit:'Klinkt nooit' };
const STANDAARD_VRAGENLIJST = [
  { id:'jij', titel:'Jij', intro:'Je quiz zegt {archetype}. Nu wil ik weten wie erachter zit.', vragen:[
    { id:'verhaal', l:'Hoe ben je hier gekomen? Vertel het zoals je het zou vertellen aan iemand die je vertrouwt: een vriend(in), je partner of een collega.', t:'area', vb:'Bijv. ik werkte tien jaar in de zorg tot ik merkte dat...' },
    { id:'trots', l:'Waar ben je stiekem het meest trots op in je werk?', t:'area' },
    { id:'rafels', l:'Welke rafelrandjes horen bij jou, maar laat je nu nog weg?', t:'area', vb:'Bijv. ik ben chaotisch, ik huil makkelijk, ik ben geen ochtendmens' } ]},
  { id:'business', titel:'Je business', intro:'Waar staat je keuken nu?', vragen:[
    { id:'wat', l:'Wat doe je, in één of twee zinnen?', t:'area', vb:'Zoals je het nu zou zeggen, ook als het nog niet lekker loopt' },
    { id:'vakgebied', l:'In welk vakgebied werk je?', t:'text', vb:'Bijv. burn-outpreventie, loopbaancoaching, financieel advies', tool:'vakgebied' },
    { id:'klantwoord', l:'Hoe noem jij de mensen met wie je werkt?', t:'text', vb:'Bijv. klanten, cliënten, deelnemers, founders', tool:'klantwoord' },
    { id:'aanbodwoord', l:'Hoe noem jij wat je aanbiedt?', t:'text', vb:'Bijv. traject, programma, sessies, opdracht', tool:'aanbodwoord' },
    { id:'sinds', l:'Hoe lang ben je ondernemer?', t:'keuze', opties:['Korter dan 1 jaar','1 tot 3 jaar','3 tot 5 jaar','Langer dan 5 jaar'] },
    { id:'platformen', l:'Op welke kanalen ben je actief, of wil je actief worden?', t:'meerkeuze', opties:['Instagram','LinkedIn','Facebook','TikTok','YouTube','Pinterest','E-mail en nieuwsbrief'], tool:'platformen' },
    { id:'kanaal', l:'Waar komen je klanten nu vooral vandaan?', t:'keuze', opties:['Instagram','LinkedIn','Netwerk en mond-tot-mond','Website en Google','Nog geen vast kanaal'] },
    { id:'capaciteit', l:'Hoeveel klanten wil je tegelijk begeleiden?', t:'text' } ]},
  { id:'klant', titel:'Je klant', intro:'Voor wie kook je eigenlijk?', vragen:[
    { id:'doelgroep', l:'Voor wie werk je het allerliefst? Eén zin.', t:'text', vb:'Bijv. coaches die klaar zijn met gratis advies geven', tool:'doelgroep' },
    { id:'pijn', l:'Waar lopen je klanten tegenaan als ze bij jou aankloppen?', t:'area', tool:'pijn' },
    { id:'resultaat', l:'Wat is er voor hen anders als jullie samen klaar zijn?', t:'area', tool:'resultaat' } ]},
  { id:'stem', titel:'Je stem', intro:'Als {archetype} klink je waarschijnlijk {woorden}. Klopt dat?', vragen:[
    { id:'toon', l:'Drie woorden: zo wil je klinken', t:'text', vb:'Bijv. {woorden}', tool:'toon' },
    { id:'nooit', l:'Zo wil je nóóit klinken', t:'text', vb:'Bijv. zweverig, schreeuwerig, belerend', tool:'nooit' },
    { id:'bewonder', l:'Welke merken of mensen raken jou, en waarom?', t:'area' } ]},
  { id:'merkgevoel', titel:'Je merkgevoel', intro:'Hoe moet jouw merk voelen, en wat mag blijven?', vragen:[
    { id:'gevoel', l:'Welk gevoel wil je dat mensen krijgen als ze met jou en je merk in aanraking komen?', t:'area', vb:'Bijv. rust, vertrouwen, "eindelijk iemand die me snapt"', tool:'gevoel' },
    { id:'kleuren', l:'Wat zijn je lievelingskleuren, of welke kleuren gebruik je nu in je branding?', t:'text', vb:'Bijv. diep groen, zand en goud', tool:'kleurwens' },
    { id:'behouden', l:'Wat doe je nu al in je branding dat je graag wilt houden? (optioneel)', t:'area', vb:'Bijv. mijn logo, mijn foto\'s, de manier waarop ik mijn posts afsluit', tool:'behouden' } ]},
  { id:'logo', titel:'Je logo', voorwaarde:'logo', intro:'Zodat ik weet waar we starten.', vragen:[
    { id:'logo', l:'Heb je al een logo?', t:'keuze', opties:['Ja, en die wil ik houden','Ja, maar ik wil een nieuw logo','Nee, nog niet'] },
    { id:'logovoorbeelden', l:'Wil je een nieuw logo? Geef voorbeelden of links van logo\'s die je mooi vindt, en waarom. Heb je al een logo? Lever het aan bij de eerste gang.', t:'area', vb:'Bijv. een link naar een Pinterest-bord, of: strak en rustig, zoals…' } ]},
  { id:'templatewensen', titel:'Je templates', voorwaarde:'templates', intro:'Zodat je templates precies doen wat jij nodig hebt.', vragen:[
    { id:'tdoel', l:'Waar moeten je templates je vooral bij helpen?', t:'meerkeuze', opties:['Zichtbaarheid en opbouw','Een lancering','Verkopen','Autoriteit en vertrouwen'] },
    { id:'tformats', l:'Welke formats gebruik je (of wil je gaan gebruiken)?', t:'meerkeuze', opties:['Instagram posts','Carrousels','Stories','Reels-covers','LinkedIn posts','Pinterest pins','Nieuwsbrief'] },
    { id:'tsoort', l:'Wat voor content post je het meest?', t:'area', vb:'Bijv. tips, klantverhalen, achter de schermen, aanbod' },
    { id:'tvoorbeeld', l:'Welke accounts of templates vind je mooi, en waarom?', t:'area', vb:'Links of namen, en wat je er zo goed aan vindt' },
    { id:'tlastig', l:'Wat vind je nu het lastigst aan je content maken?', t:'area' },
    { id:'tplanning', l:'Staat er binnenkort iets op de planning, zoals een lancering?', t:'text', vb:'Bijv. in maart lanceer ik mijn groepsprogramma' } ]},
  { id:'aanbod', titel:'Je aanbod', intro:'Wat staat er nu op je kaart?', vragen:[
    { id:'aanbod', l:'Wat bied je nu aan, en voor welke prijs?', t:'area' },
    { id:'meer', l:'Wat wil je méér verkopen?', t:'text' } ]},
  { id:'wensen', titel:'Je wensen', intro:'Zodat ik precies weet waar we naartoe werken.', vragen:[
    { id:'succes', l:'Wanneer is dit traject voor jou een succes?', t:'area' },
    { id:'spannend', l:'Wat vind je spannend aan dit traject?', t:'area' },
    { id:'samenwerken', l:'Hoe wil je dat ik met je werk?', t:'text', vb:'Bijv. direct maar warm, veel sparren' } ]},
  { id:'praktisch', titel:'Praktisch', intro:'Laatste stap, {voornaam}. Dan kan het feest beginnen.', vragen:[
    { id:'instagram', l:'Instagram', t:'text', vb:'@jouwnaam' },
    { id:'website', l:'Website', t:'text' },
    { id:'shoot', l:'Ideeën of plekken voor je brand shoot?', t:'area' } ]}
];
// Vult {voornaam}, {archetype}, {woorden} in; zinnen met een onbekende waarde vallen weg.
function tekstMet(tpl, k) {
  const a = k?.quiz && ARCHETYPES[k.quiz.uitslag];
  const w = { voornaam: k ? voornaam(k) : '', archetype: a ? a.naam : '', woorden: a ? a.woorden.join(', ') : 'warm, eerlijk, scherp' };
  return (tpl || '').split(/(?<=[.!?])\s+/).filter(z => !/\{(\w+)\}/.test(z) || [...z.matchAll(/\{(\w+)\}/g)].every(m => w[m[1]]))
    .map(z => z.replace(/\{(\w+)\}/g, (_, x) => w[x] ?? '')).join(' ');
}

// Wat je per klant altijd doet. Items met "auto" vinken zichzelf af.
const CHECKLIST = [
  { fase:'Vóór de start', items:[
    { id:'voorstel', t:'Voorstel verstuurd en akkoord' },
    { id:'aanbetaling', t:'Aanbetaling of eerste factuur voldaan' },
    { id:'contracten', t:'Overeenkomst, voorwaarden en verwerkersovereenkomst getekend', auto:k=>k.documenten.filter(d=>d.tekenen&&!['Beeldrechten & licentie','Modelrelease'].includes(d.type)).every(d=>d.status==='getekend') },
    { id:'uitnodiging', t:'Portaal-uitnodiging verstuurd', auto:k=>k.uitgenodigd },
    { id:'welkom', t:'Welkomstboodschap persoonlijk gemaakt', auto:k=>k.welkom!==STANDAARD_WELKOM },
    { id:'kickoff', t:'Kick-off call gepland', alleen:k=>!PAKKETTEN[k.pakket].zelf } ]},
  { fase:'Onboarding', items:[
    { id:'todos', t:'Persoonlijke to-do\'s klaargezet', auto:k=>(k.todos||[]).length>0 },
    { id:'quiz', t:'Quiz gedaan', auto:k=>!!k.quiz },
    { id:'audit', t:'Brand Audit gedeeld met de klant', alleen:k=>k.pakket==='audit', auto:k=>k.audit?.status==='gedeeld' },
    { id:'intake', t:'Vragenlijst ingevuld', auto:k=>k.intake.klaar },
    { id:'profiel', t:'Vragenlijst gelezen en persoonlijke laag voor de tools gecheckt' },
    { id:'aanlevering', t:'Eerste aanlevering ontvangen (foto\'s, teksten, voice memo\'s)', auto:k=>Object.values(k.courses).some(c=>c.uploads.length) } ]},
  { fase:'Tijdens het traject', items:[
    { id:'deliverables', t:'Bij elke afgeronde course een deliverable geplaatst', alleen:k=>!PAKKETTEN[k.pakket].zelf, auto:k=>{const a=Object.values(k.courses).filter(c=>c.status==='klaar');return a.length>0&&a.every(c=>c.bestanden.some(b=>b.soort==='opgediend'))} },
    { id:'geheugen', t:'Merkgeheugen bijgewerkt: Brand Foundation, stem en kerninhoud', auto:k=>!!k.geheugen?.bijgewerkt && !!k.profiel?.kernbelofte && (k.geheugen.stem||[]).length>0 },
    { id:'checkin', t:'Tussentijdse check-in gedaan' },
    { id:'aanbieding', t:'Passende aanbieding klaargezet', auto:k=>k.aanbiedingen.length>0 } ]},
  { fase:'Brand shoot', items:[
    { id:'shootdatum', t:'Shootdatum en locatie vastgelegd (al tijdens Flavor Profile)', alleen:k=>!!k.shoot, auto:k=>!!k.shoot?.datum },
    { id:'shotlist', t:'Shotlist en regie klaar (in Positioning Cut)', alleen:k=>!!k.shoot, auto:k=>!!k.shoot?.shotlistKlaar },
    { id:'shootaanlevering', t:'Moodboard-favorieten en outfits aangeleverd', alleen:k=>!!k.shoot, auto:k=>(k.shoot?.uploads||[]).length>0 },
    { id:'beeldrechten', t:'Beeldrechten en modelrelease getekend', alleen:k=>!!k.shoot, auto:k=>{const d=k.documenten.filter(x=>['Beeldrechten & licentie','Modelrelease'].includes(x.type));return d.length>0&&d.every(x=>x.status==='getekend')} },
    { id:'selectielink', t:'Pixieset-galerij voor de selectie geplaatst (in Plating)', alleen:k=>!!k.shoot, auto:k=>!!k.shoot?.selectie },
    { id:'selectieklaar', t:'Klant heeft haar selectie gemaakt', alleen:k=>!!k.shoot, auto:k=>!!k.shoot?.selectieKlaar },
    { id:'finallink', t:'Bewerkte foto\'s geplaatst (Pixieset-downloadgalerij, in Plating)', alleen:k=>!!k.shoot, auto:k=>!!k.shoot?.final } ]},
  { fase:'Afronding', items:[
    { id:'eindbestanden', t:'Alle eindbestanden gedeeld in de Signature Dish', auto:k=>(k.merk?.bestanden||[]).length>0 },
    { id:'evaluatie', t:'Evaluatie verstuurd' },
    { id:'testimonial', t:'Toestemming voor testimonial gevraagd' },
    { id:'nazorg', t:'Toegang en nazorg na het traject afgesproken (looptijd + 3 maanden, daarna verlengen)' },
    { id:'merkopen', t:'Dessert geserveerd: Signature Dish open voor de klant', auto:k=>merkOpen(k) },
    { id:'eindfactuur', t:'Eindfactuur voldaan' } ]}
];

const STANDAARD_DOCS = [
  { titel:'Overeenkomst van opdracht', type:'Overeenkomst', tekenen:true },
  { titel:'Algemene voorwaarden', type:'Algemene voorwaarden', tekenen:true },
  { titel:'Verwerkersovereenkomst', type:'Verwerkersovereenkomst', tekenen:true },
  { titel:'Welkomstgids', type:'Overig', tekenen:false }
];
const SHOOT_DOCS = [
  { titel:'Beeldrechten & licentie brand shoot', type:'Beeldrechten & licentie', tekenen:true },
  { titel:'Modelrelease', type:'Modelrelease', tekenen:true }
];
const DOC_TYPES = ['Voorstel','Overeenkomst','Algemene voorwaarden','Verwerkersovereenkomst','Beeldrechten & licentie','Modelrelease','Factuur','Overig'];
const STATUS = { dicht:'Vergrendeld', open:'Open', bezig:'Bezig', klaar:'Afgerond' };
const STANDAARD_WELKOM = 'Welkom bij Studio Crave. Dit is je eigen keuken. Hier vind je alles van ons traject: je menu, je documenten en alles wat we samen opdienen. Begin met de quiz, dan weet ik meteen een beetje hoe jouw merk smaakt.';

// Suggesties voor persoonlijke aanbiedingen, op basis van pakket en extra's.
function suggesties(k) {
  const s = []; const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  // Op basis van de quizuitslag: zit de course met de meeste winst niet in haar pakket?
  if (a && !k.courses[a.start]) s.push({ titel:`Jouw grootste winst: ${COURSES[a.start].naam}`, tekst:`Als ${a.naam} zit jouw blinde vlek precies in Course ${a.start}, ${COURSES[a.start].naam}. Je kunt deze gang los bijboeken, of hem meenemen in de volledige 7-Course Brand Experience.`, knop:'Deze gang bijboeken', trigger:'login' });
  if (a && k.quiz.uitslag === 'C' && !heeftExtra(k, 'Craveable Identity')) s.push({ titel:'Een container voor al jouw kanten', tekst:'Als Chef\'s Special heb je meerdere looks nodig binnen één herkenbare wereld. Met een visuele identiteit van Studio Crave krijgt jouw veelzijdigheid een vaste vorm.', knop:'Ik wil dit', trigger:'na-02' });
  if (a && k.quiz.uitslag === 'B' && !heeftExtra(k, 'Brand shoot')) s.push({ titel:'Jouw signature, in beeld', tekst:'Als The Signature wil je dat mensen je herkennen zonder je naam te zien. Een brand shoot rond jouw ene look maakt dat vanaf nu vanzelfsprekend.', knop:'Ik wil een shoot', trigger:'na-02' });
  if (k.pakket === 'audit') s.push({ titel:'Klaar voor het hele menu?', tekst:'Je audit laat zien waar de smaak zit. In de 7-Course Brand Experience maken we er in acht weken een merk van dat je niet meer vergeet. Vraag me gerust wat dat voor jou betekent.', knop:'Vertel me meer', trigger:'na-04' });
  if (!heeftExtra(k, 'Brand shoot')) s.push({ titel:'Jouw verhaal, in beeld', tekst:'Nu je Flavor Profile staat, weet ik precies hoe jij eruit moet zien. Een brand shoot met Studio Crave, geregisseerd op jouw merk.', knop:'Ik wil een shoot', trigger:'na-02' });
  if (!heeftExtra(k, 'Branded templates')) s.push({ titel:'Templates in jouw smaak', tekst:'Je content-formats staan. Met maatwerk templates van Studio Crave post je voortaan in een paar minuten, en altijd on brand.', knop:'Laat zien', trigger:'na-05' });
  return s;
}

// Taal van de klant: haar eigen woorden in de standaardteksten, en (na jouw akkoord) haar vertaalde dashboard.
function woordenVan(k) { const p = k?.profiel || {}; return { klanten: p.klantwoord || 'klanten', aanbod: p.aanbodwoord || 'aanbod', vakgebied: p.vakgebied || 'jouw vak' }; }
function ctekst(tpl, k) { const w = woordenVan(k); return (tpl || '').replace(/\{(klanten|aanbod|vakgebied)\}/g, (_, x) => w[x]); }
function basisTekst(k, c, f) {
  if (k?.pakket === 'audit' && AUDIT_TEKST[c]?.[f]) return AUDIT_TEKST[c][f];
  if (PAKKET_TEKST[k?.pakket]?.[c]?.[f]) return PAKKET_TEKST[k.pakket][c][f];
  const o = (typeof data !== 'undefined' && data.courseTeksten?.[c]) || {}; const d = COURSES[c] || {};
  const leeg = v => v == null || (Array.isArray(v) ? !v.filter(Boolean).length : !String(v).trim());
  if (k?.shoot) { const v = !leeg(o[f+'Shoot']) ? o[f+'Shoot'] : d[f+'Shoot']; if (!leeg(v)) return v; }
  return !leeg(o[f]) ? o[f] : d[f];
}
function courseTekst(k, c, f) {
  const live = k.taal?.live?.courses?.[c]?.[f];
  if (f === 'jasmijn') return (Array.isArray(live) && live.filter(Boolean).length ? live.filter(Boolean) : (basisTekst(k, c, 'jasmijn') || []).map(x => ctekst(x, k)));
  return live || ctekst(basisTekst(k, c, f), k);
}
function toolVb(k, sid) { return k.taal?.live?.tools?.[sid] || vul(toolData(sid)?.vb || '', k.profiel || {}); }

// Merkgeheugen: alles wat de tools over een klant weten, in één blok.
const KERN_HINT = { '01':'Haar kernverhaal, keerpunten, energie en expertise', '02':'Toonregels: woorden wél en nooit, zinslengte, emoji ja of nee, aanspreekvorm',
  '03':'De naam van haar methode en de stappen', '04':'Kernbelofte, claims en grenzen', '05':'Vaste formats en hooks die werken',
  '06':'Haar aanbod, prijzen en klantreis', '07':'Hoe samenwerken met haar voelt, vaste rituelen', 'finale':'Focus en plannen voor de komende 90 dagen' };
const STEM_BRONNEN = ['Voice memo (uitgeschreven)','Post','Mail of bericht','Website','Anders'];
function merkContext(k) {
  const p = k.profiel || {}; const w = woordenVan(k); const a = k.quiz && ARCHETYPES[k.quiz.uitslag]; const g = k.geheugen || {};
  const r = [`BRAND FOUNDATION — ${k.bedrijf || k.naam}`,
    `Vakgebied: ${w.vakgebied}. Ze noemt haar klanten "${w.klanten}" en haar aanbod "${w.aanbod}".`,
    `Doelgroep: ${p.doelgroep || 'onbekend'}`, `Waar haar klant vastloopt: ${p.pijn || 'onbekend'}`, `Resultaat dat ze levert: ${p.resultaat || 'onbekend'}`];
  if (p.kernbelofte) r.push(`Kernbelofte: ${p.kernbelofte}`);
  if (p.positionering) r.push(`Positionering (wat dit NIET is): ${p.positionering}`);
  if ((p.pijlers || []).length) r.push(`Content-pijlers: ${p.pijlers.join(', ')}`);
  if (p.gevoel) r.push(`Gevoel dat mensen bij het merk moeten krijgen: ${p.gevoel}`);
  if (p.kleurwens) r.push(`Kleurwensen of huidige kleuren: ${p.kleurwens}`);
  if (p.behouden) r.push(`Wil ze behouden in haar branding: ${p.behouden}`);
  r.push(`Toon: ${p.toon || 'onbekend'} — nooit: ${p.nooit || 'onbekend'}`);
  if (a) r.push(`Smaakprofiel: ${a.naam} (${a.sub}). Blinde vlek: ${a.blind}`);
  const kern = Object.entries(g.kern || {}).filter(([, t]) => (t || '').trim());
  if (kern.length) { r.push('', 'KERNINHOUD UIT HAAR TRAJECT'); kern.forEach(([c, t]) => r.push(`${COURSES[c]?.naam || c}: ${t.trim()}`)); }
  const hdt = k.werkplek?.hdInToon !== false ? hdToon(k) : null;
  if (hdt?.regels.length) { r.push('', `TONE OF VOICE VANUIT HUMAN DESIGN (${hdt.label}). Een lens: de toon en stemvoorbeelden van het merk blijven leidend.`); hdt.regels.forEach(x => r.push('- ' + x)); }
  if ((g.stem || []).length) { r.push('', 'STEMVOORBEELDEN (zo klinkt ze echt: neem ritme en woordkeus over, kopieer niet letterlijk)'); g.stem.forEach(x => r.push(`— ${x.bron}: "${x.tekst.trim()}"`)); }
  return r.join('\n');
}

/* =====================================================================
   UITBREIDINGEN: zelfstudie, samenwerken, werkplek, kennisbank
   ===================================================================== */
PAKKETTEN.templates = { naam:'Branded Templates', kort:'Templates', prijs:'in overleg', duur:'', courses:['05'], naOplevering:2 };
PAKKETTEN.identity = { naam:'Craveable Identity', kort:'Identity', prijs:'in overleg', duur:'', courses:['01','02'], naOplevering:2 };
PAKKETTEN.zelf = { naam:'Be Your Own Chef', kort:'Be Your Own Chef', prijs:'prijs in te vullen', duur:'', zelf:true,
  courses:['01','02','03','04','05','06','07'] };

// Standaard to-do's voor een Be Your Own Chef-klant. Per klant pas je ze aan.
const ZELF_TODOS = [
  { t:'Doe de quiz: welk gerecht ben jij?', c:'' },
  { t:'Vul de vragenlijst in over jou en je business', c:'' },
  { t:'Schrijf je origin story met de Origin Story Reeks', c:'01' },
  { t:'Leg je toon vast: drie woorden wél, drie woorden nooit', c:'02' },
  { t:'Beschrijf je werkwijze in maximaal vijf stappen', c:'03' },
  { t:'Maak je messaging plan en je Brand Foundation', c:'04' },
  { t:'Plan één week content met de Normal Story Week', c:'05' },
  { t:'Zet je aanbod op papier met de Offer Builder', c:'06' },
  { t:'Beschrijf hoe een klant zich voelt na samenwerken met jou', c:'07' }
];

// Wat klanten bij je kunnen boeken of aanvragen via de pagina "Samenwerken".
const BOEKEN = [
  { id:'dwy', titel:'7-Course Brand Experience', tekst:'Acht weken samen aan tafel. Ik serveer je hele merk, van verhaal tot beleving, inclusief brand shoot en templates met je eigen beelden.', prijs:'€1.500', toon:k => k.pakket !== 'dwy' },
  { id:'audit', titel:'Brand Audit', tekst:'Ik proef je merk zoals het nu is, en vertel je precies waar de smaak zit en waar niet.', prijs:'€77', toon:k => k.pakket === 'zelf' },
  { id:'shoot-kickoff', titel:'Kick Off shoot', extra:'Brand shoot', tekst:'1 uur shooten, minimaal 15 foto\'s. Buitenlocatie gratis; studio of andere ruimte voor eigen kosten. Excl. reiskosten en btw.', waarom:'Kies dit als je snel wilt starten met een eerste set eigen beelden: voor je profielfoto, je website en je eerste posts.', prijs:'€295', toon:() => true },
  { id:'shoot-full', titel:'Full Shoot', extra:'Brand shoot', tekst:'3 tot 4 uur shooten, minimaal 60 tot 80 foto\'s. Buitenlocatie gratis; studio of andere ruimte voor eigen kosten. Excl. reiskosten en btw.', waarom:'Kies dit als je voor maanden aan content wilt: meerdere looks, locaties en momenten die je hele verhaal vertellen.', prijs:'in overleg', toon:() => true },
  { id:'shoot-anders', titel:'Andere shoots en campagnes', extra:'Brand shoot', tekst:'Een campagne, een lancering, een team of iets heel anders? Vertel me wat je voor ogen hebt.', prijs:'op aanvraag', toon:() => true },
  { id:'losse-gang', titel:'Losse gang bijboeken', tekst:'Wil je één gang uit de 7-Course, zonder het hele menu? Kies de gang die je nu het meest nodig hebt.', prijs:'in overleg', gang:true, toon:k => Object.keys(COURSES).filter(c => /^\d/.test(COURSES[c].nr) && !k.courses[c]).length > 0 },
  { id:'templates', titel:'Branded templates', extra:'Branded templates', uitgelicht:true, tekst:'100+ social templates in jouw kleuren, lettertypen en beeldstijl, met brandbook, logo en 1:1 sessies. We bepalen samen wat je precies nodig hebt.', prijs:'in overleg', toon:() => true },
  { id:'identiteit', titel:'Craveable Identity', extra:'Craveable Identity', uitgelicht:true, tekst:'Full basic branding: je logo, kleuren, lettertypen, beeldstijl en brandbook. Zonder templates en shoot.', prijs:'in overleg', toon:() => true },
  { id:'website', titel:'Website op maat', extra:'Website', tekst:'Een website die net zo voelt als je merk: gebouwd op je verhaal, je toon en je eigen beelden.', prijs:'in overleg', toon:k => !heeftExtra(k, 'Website') },
  { id:'anders', titel:'Iets anders', tekst:'Een sparringsessie, een losse vraag of een idee? Vertel het me.', prijs:'', toon:() => true }
];

// Human Design als lens op je werkritme (opt-in voor de klant).
const ENERGIETYPES = {
  'Generator': { kort:'Duurzame energie als je doet waar je een ja op voelt.', werk:'Werk in lange, diepe blokken aan wat je écht leuk vindt. Plan je week niet vol met wat "moet".', content:'Laat zien waar je enthousiast van wordt: je energie is je beste marketing.', verkopen:'Reageer op vragen en kansen in plaats van te pushen. Een stevig ja of nee in je lijf is je kompas.', valkuil:'Doorgaan met iets dat je al lang geen voldoening meer geeft.' },
  'Manifesting Generator': { kort:'Snel, veelzijdig, energie voor meerdere dingen tegelijk.', werk:'Wissel af tussen projecten en sla stappen over waar het kan. Korte sprints werken voor jou.', content:'Je content mag gevarieerd zijn. Laat je proces en je snelheid zien.', verkopen:'Reageer, en informeer anderen voordat je versnelt.', valkuil:'Halverwege afhaken zonder af te ronden of mensen mee te nemen.' },
  'Projector': { kort:'Ziet mensen en systemen haarscherp; energie komt in golven.', werk:'Korte, gerichte blokken en veel rust. Minder uren, meer diepte.', content:'Deel je inzicht en je visie, zodat je gezien wordt als gids.', verkopen:'Werk met uitnodigingen: content die mensen laat vragen om jouw blik.', valkuil:'Ongevraagd advies geven en jezelf uitputten om te bewijzen dat je genoeg doet.' },
  'Manifestor': { kort:'Initiator: jij zet dingen in beweging.', werk:'Volg je impuls om te starten en laat een deel van de uitvoering los. Werk in uitbarstingen met rust ertussen.', content:'Kondig aan, neem het voortouw, zet de toon.', verkopen:'Informeer je netwerk over wat je gaat doen. Dat opent deuren.', valkuil:'Weerstand voelen omdat je anderen niet meeneemt in je plannen.' },
  'Reflector': { kort:'Je weerspiegelt je omgeving: zeldzaam en fijngevoelig voor plek en mensen.', werk:'Neem tijd voor grote besluiten en kies je werkplek bewust.', content:'Reflecteer op wat je om je heen ziet. Jouw spiegel is uniek.', verkopen:'Kies zorgvuldig met wie je werkt: de juiste omgeving is alles.', valkuil:'Besluiten nemen onder druk van anderen.' }
};
const AUTORITEITEN = { 'Emotioneel':'Slaap er een nacht over. Beslis niet op een emotionele piek of in een dal.', 'Sacraal':'Luister naar je directe ja of nee in je buik, niet naar je hoofd.',
  'Splenisch':'Vertrouw je eerste, stille ingeving. Die komt één keer.', 'Ego':'Vraag jezelf: wil ik dit écht, en heb ik er de wilskracht voor?',
  'Zelf-geprojecteerd':'Praat hardop met iemand die je vertrouwt en luister naar wat je zelf zegt.', 'Omgeving':'Bespreek het in verschillende omgevingen en voel waar het klopt.', 'Lunair':'Neem een volle maancyclus de tijd voor grote besluiten.' };

// Kennisbank ("jouw brein"): wat de chat weet over jou, je werk en het portaal. Bewerkbaar in je keuken.
const STANDAARD_KENNIS = [
  { titel:'Hoe het portaal werkt', tekst:'Welkom: begin met de quiz en de vragenlijst, zodat alles persoonlijk wordt. Jouw menu: de 7 courses van The Branding Kitchen™, de methode van Studio Crave. Jasmijn geeft ze vrij (bij Be Your Own Chef staan ze allemaal open). In elke course staat wat Jasmijn doet, wat jij ermee kunt, bestanden, tools en een plek om aan te leveren. Documenten: contracten en voorwaarden, akkoord geven met één klik. Workflow: focusblokken met chef\'s tips, je weekfocus, je ideeënvoorraad, een energiecheck, je Human Design en je eigen tools. Signature Dish: het dessert na de zeven gangen. Daar staat haar hele merk op één bord (belofte, toon, kleuren, fonts, logo\'s, beelden, templates en alle stukken), plus de planningstools voor de volgende 90 dagen. Ze houdt er toegang toe. Samenwerken: een traject boeken of een shoot of design-opdracht aanvragen. Eigen tools: in Workflow en in elke course bouwt de klant naast Jasmijns skills haar eigen agents, die haar merk automatisch kennen. Mijn stijl: na Plating (course 05), of aan het einde van het traject, kan de klant het portaal in haar eigen kleuren, lettertypen en met haar eigen foto\'s zetten.' },
  { titel:'De 7-Course Method', tekst:'01 Raw Ingredients: wie je echt bent, je verhaal, energie, expertise en rafelrandjes. 02 Flavor Profile: tone of voice, energie en vibe. 03 Signature Sauce: je unieke methode, visie en frameworks. 04 Positioning Cut: niche, claims en grenzen. 05 Plating: content formats, hooks en storytelling. 06 Pairing: aanbod, prijs en klantreis. 07 The Experience: hoe samenwerken met jou voelt. Daarna, los van de zeven gangen, het dessert: de Signature Dish, alles samen op één bord. Brand shoot (als die bij het traject hoort) is geen aparte gang maar een onderdeel: de voorbereiding (datum, locatie, moodboard, outfits, shotlist, beeldrechten) zit in Positioning Cut, de shoot zelf en de foto\'s in Plating. Eerst moeten verhaal, moodboard, gevoel, tone of voice en positionering helder zijn; daarna volgen de templates met de eigen beelden. Na de shoot kiest de klant haar favorieten in een Pixieset-galerij, Jasmijn bewerkt ze, en de bewerkte foto\'s download ze via een tweede Pixieset-galerij.' },
  { titel:'Studio Crave en The Branding Kitchen™', tekst:'Studio Crave is het bedrijf van Jasmijn Straver. The Branding Kitchen™ is haar methode: de 7-Course Brand Experience is het traject dat daaruit voortkomt. Noem het bedrijf altijd Studio Crave. Studio Crave is gebouwd rond één principe: mensen laten verlangen. Studio Crave maakt visuele werelden die voelen als een merkervaring: brand shoots en editorial fotografie (cinematic, warm, editorial), brand visuals, maatwerk templates en complete visuele identiteiten. Van positionering en tone of voice tot brand shoot en templates: alles komt uit één studio. De 7-Course Brand Experience bevat altijd een brand shoot en maatwerk templates, gebouwd met de eigen foto\'s uit de shoot. Bij ander aanbod (Brand Audit, Be Your Own Chef) zijn een brand shoot en templates bij te boeken. Bij te boeken extra\'s: brand shoot, branded templates, een visuele identiteit en een website. De prijzen daarvan gaan altijd in overleg, omdat de omvang per opdracht verschilt. Aanvragen en boeken gaat via de pagina Samenwerken.' },
  { titel:'Contact', tekst:'Voor vragen is Jasmijn altijd bereikbaar: appen of mailen naar info@studiocrave.nl. Verwijs hiernaar bij persoonlijke, dringende of praktische vragen, of als de sous-chef iets niet weet.' },
  { titel:'Hoe Jasmijn werkt', tekst:'Jasmijn maakt de deliverables zelf. De tools voor Instagram en LinkedIn worden elke week bijgewerkt met de nieuwste inzichten over wat nu werkt, zodat klanten altijd actueel en strategisch posten, in hun eigen toon. Het portaal ondersteunt: het laat zien wat zij doet en wat jij ermee kunt, en de tools helpen je zelfstandig verder in je eigen taal. Aan het eind komt alles samen in je Signature Dish en op de pagina Jouw merk. Vragen over planning, prijzen of maatwerk gaan via de pagina Samenwerken, of rechtstreeks naar Jasmijn.' }
];
const AANVRAAG_STATUS = { nieuw:'Nieuw', behandeling:'In behandeling', afgerond:'Afgerond' };
// Het dessert (Signature Dish) gaat open als alle gangen zijn geserveerd, of eerder als jij dat kiest
function merkOpen(k) { const c = Object.values(k.courses || {}); return !!(k.merk?.open || (c.length && c.every(x => x.status === 'klaar'))); }

// Links (Canva, Loom, Google Docs, Pinterest, Notion...): alleen echte https-links worden bewaard.
function schoneUrl(u) { u = (u || '').trim(); if (!u) return ''; try { const x = new URL(u); return x.protocol === 'https:' ? x.href : ''; } catch (e) { return ''; } }
function isCanva(u) { try { const h = new URL(u).hostname; return h === 'canva.com' || h.endsWith('.canva.com') || h === 'canva.link'; } catch (e) { return false; } }
// Knoptekst die past bij de soort link
const LINK_SOORTEN = [
  [/(^|\.)canva\.(com|link)$/, 'Openen in Canva'], [/(^|\.)loom\.com$/, 'Bekijk video'], [/(^|\.)docs\.google\.com$/, 'Openen in Google Docs'],
  [/(^|\.)drive\.google\.com$/, 'Openen in Google Drive'], [/(^|\.)pinterest\.[a-z.]+$|(^|\.)pin\.it$/, 'Bekijk moodboard'], [/(^|\.)notion\.(so|site)$/, 'Openen in Notion'],
  [/(^|\.)miro\.com$/, 'Openen in Miro'], [/(^|\.)pixieset\.com$/, 'Bekijk galerij'], [/(^|\.)(youtube\.com|youtu\.be|vimeo\.com)$/, 'Bekijk video'] ];
function linkLabel(u) { try { const h = new URL(u).hostname.replace(/^www\./, ''); return (LINK_SOORTEN.find(([r]) => r.test(h)) || [null, 'Openen'])[1]; } catch (e) { return 'Openen'; } }
function linkKnop(b, soort) {
  if (!b.canva) return '';
  return `<a class="btn sm ${soort||''}" href="${esc(b.canva)}" target="_blank" rel="noopener" data-a="canva-open" data-id="${b.id}">${linkLabel(b.canva)}</a>`;
}

// Brand shoot: onderdeel binnen Positioning Cut (voorbereiding) en Plating (shoot, selectie, foto's)
function nieuweShoot() { return { datum:'', locatie:'', notitie:'', shotlistKlaar:false, uploads:[], selectie:'', deadline:'', selectieKlaar:false, selectieOp:null, final:'', finalOp:null }; }
function isPixieset(u) { try { return new URL(u).hostname.endsWith('pixieset.com'); } catch (e) { return false; } }

// Platformkennis: wat nu werkt per platform. Gaat mee met elke tool die bij dat platform hoort.
// Live ververst een wekelijkse serverfunctie dit met webonderzoek; jij keurt goed (of laat het automatisch doorvoeren).
const STANDAARD_PLATFORMKENNIS = {
  linkedin: { titel:'LinkedIn', bijgewerkt:'2026-09-28', tekst:
`- LinkedIn verspreidt op relevantie, niet op viraliteit: het doel is bereik bij de juiste mensen, bewaard worden en gesprekken.
- Topic authority: consequent posten over 3–4 onderwerpen die ook op het profiel staan, geeft meer bereik. Profiel en posts moeten hetzelfde verhaal vertellen.
- Aandachtssignalen wegen het zwaarst: leestijd (dwell time), klikken op "meer weergeven", een documentpost helemaal doorswipen, en bewaren.
- Inhoudelijke reacties wegen zwaarder dan likes. Korte reacties als "Eens!" tellen nauwelijks.
- Elke post wordt eerst aan een kleine groep getoond; de reacties in het eerste uur bepalen of hij verder reist. Reageer die eerste tijd zelf inhoudelijk.
- Externe links in de post kosten bereik (onderzoek van Richard van der Blom: ongeveer 19% minder bij één link). Links in reacties worden ook afgeremd. Gebruik Uitgelicht op het profiel of DM.
- Engagement bait ("reageer JA"), pods en automatisering worden herkend en afgestraft. Polls presteren zwak.
- Documentposts (carrousels als pdf) scoren het hoogst op interactie; tekst met een sterk beeld werkt goed; hashtags voegen weinig toe.
- Hook: alleen de eerste ~140 tekens (mobiel) tot ~210 (desktop) zijn zichtbaar vóór "meer weergeven".
- Gemiddeld bereik ligt structureel lager dan in 2024; betrokkenheid bij goede, gerichte content is juist gestegen. Frequentie: 3–5 keer per week werkt voor wie het kan volhouden, kwaliteit gaat voor.`,
    bronnen:['Richard van der Blom, Algorithm Insights 2026','LinkedIn-team via Buffer (Relevance, Expertise, Engagement)','Hootsuite, How the LinkedIn algorithm works in 2026 (juli 2026)','SocialBee, LinkedIn algorithm 2026 guide (juli 2026)'] },
  instagram: { titel:'Instagram', bijgewerkt:'2026-09-28', tekst:
`- Instagram werkt niet met één algoritme: Feed, Reels, Stories en Verkennen rangschikken elk anders.
- De drie belangrijkste signalen (bevestigd door Adam Mosseri, hoofd van Instagram): kijktijd, likes per bereik en sends per bereik (hoe vaak mensen je post via DM doorsturen).
- Likes wegen iets zwaarder bij je volgers; doorsturen weegt iets zwaarder om nieuwe mensen te bereiken. Schrijf dus content die iemand naar een vriendin wil sturen.
- Kijktijd telt het hardst, inclusief herhalingen. De eerste seconden van een Reel beslissen of iemand blijft: begin direct met de spanning, niet met een intro.
- Bewaren en echte gesprekken in de reacties wegen mee; de diepte van een gesprek telt meer dan het aantal reacties.
- Hashtags vergroten je bereik niet (maximaal vijf per post); gebruik er hooguit een paar voor onderwerpsduidelijkheid.
- Hergebruikte content van andere platforms (met watermerk) en reposts worden lager gezet. Origineel en menselijk, liefst echt en ongepolijst, wordt beloond.
- Een helder onderwerp per account helpt: kijkers kunnen onderwerpen zelf aan- en uitzetten.
- Consistentie gaat boven volume: rond twee Reels en drie tot vijf feedposts per week is een gezond ritme voor groei.
- Trial Reels laten je een Reel eerst testen bij niet-volgers.`,
    bronnen:['Adam Mosseri, hoofd van Instagram (openbare updates 2025–2026, via creators.instagram.com)','Hootsuite, Instagram algorithm tips for 2026 (juli 2026)','Eclincher, How the Instagram algorithm works in 2026 (juli 2026)','Blck Alpaca, Instagram Algorithm 2026 (augustus 2026)'] },
  facebook:{ titel:'Facebook', bijgewerkt:'2026-09-30', tekst:
`- Facebook toont nieuwe posts eerst aan een kleine testgroep; de reactie daar bepaalt of een post verder reist.
- Echte interactie weegt zwaar: reacties met inhoud, delen, en vooral doorsturen via privéberichten.
- Links in de post zelf kosten bereik. Zet een link liever in de eerste reactie, of stuur hem via DM.
- Engagement bait ("reageer JA", "deel als je het eens bent") wordt herkend en afgestraft.
- Korte verticale video (Reels) krijgt voorrang; een groot deel van wat mensen zien komt van accounts die ze niet volgen.
- Origineel en menselijk wint: hergebruikte video met watermerk of weinig bewerking bereikt minder mensen.
- Groepen blijven sterk voor gesprekken met je doelgroep; een oud gesprek kan opnieuw opleven.
- Hashtags voegen weinig toe. Organisch bereik van pagina's is laag: kwaliteit en gesprek gaan voor volume.`,
    bronnen:["Meta Transparency Center (via SocialBee, juli 2026)", "SocialPilot, Facebook algorithm (september 2026)", "Webtonic, How the Facebook algorithm works in 2026", "Metadata Reactor, Facebook algorithm 2026"] },
  tiktok:{ titel:'TikTok', bijgewerkt:'2026-09-30', tekst:
`- Kijktijd en het percentage dat je video afkijkt zijn het sterkste signaal, gevolgd door opnieuw kijken, delen, bewaren en reacties.
- De eerste 3 seconden beslissen of iemand blijft: begin direct met de spanning of de belofte.
- Kort is geen doel op zich: kies de lengte die mensen afkijken. Kijk in je statistieken naar gemiddelde kijktijd.
- TikTok werkt steeds meer als zoekmachine: zet duidelijke zoekwoorden in je caption, tekst op beeld en gesproken tekst.
- Een herkenbare niche en vaste formats (series) helpen TikTok te begrijpen voor wie je content is.
- Origineel en menselijk wint het van generieke of volledig AI-gemaakte video.
- Een duidelijke vervolgstap aan het eind (volgen, bewaren, vraag in de reacties) werkt, zolang het niet om een truc draait.`,
    bronnen:["Hootsuite, How the TikTok algorithm works in 2026 (juli 2026)", "Darkroom, TikTok algorithm guide 2026", "likes.io, TikTok algorithm 2026 (september 2026)", "HeyOrca, How TikTok's algorithm actually works (2026)"] },
  youtube:{ titel:'YouTube', bijgewerkt:'2026-09-30', tekst:
`- Kijkerstevredenheid is het belangrijkste signaal geworden, naast kijktijd: korte enquêtes, opnieuw kijken en delen tellen mee.
- Een korte video die mensen afkijken en waardevol vinden, wint het van een lange video met veel afhakers. Geen opvulling.
- De eerste 30 seconden van een lange video en de eerste 3 seconden van een Short zijn beslissend.
- Shorts en lange video werken met aparte systemen. Shorts zijn vooral een manier om gevonden te worden; lange video bouwt vertrouwen.
- Kleine kanalen worden sneller getest bij kleine, gerichte groepen: een duidelijke niche helpt.
- Series en terugkerende formats zorgen dat kijkers terugkomen.
- Eigen stem of eigen muziek in Shorts werkt beter dan steeds dezelfde trending audio.`,
    bronnen:["SocialPilot, YouTube algorithm (september 2026)", "vidIQ, Understanding the YouTube algorithm (2026)", "Metricool, YouTube Shorts algorithm (september 2026)", "Dataslayer, YouTube algorithm 2026"] },
  pinterest:{ titel:'Pinterest', bijgewerkt:'2026-09-30', tekst:
`- Pinterest is een zoekmachine, geen social feed: zoekwoorden in je pintitel, beschrijving, tekst op beeld en bordnamen bepalen of je gevonden wordt.
- Nieuwe pins (een nieuw beeld of ontwerp) krijgen voorrang. Maak meerdere ontwerpen voor dezelfde pagina in plaats van dezelfde pin opnieuw te delen.
- Consistent werkt beter dan veel in één keer: een paar nieuwe pins per dag of per week, verspreid.
- Staand formaat (2:3) is de norm. Houd tekst op beeld goed leesbaar; vermijd sierlijke letters voor zoekwoorden.
- Seizoenscontent 1 tot 3 maanden vóór het moment plaatsen: mensen plannen vooruit.
- Bewaren en doorklikken zijn sterke signalen. Pins blijven maanden tot jaren verkeer opleveren.`,
    bronnen:["Your Pin Coach, Pinterest SEO strategy 2026", "Shatter Studios, Pinterest SEO 2026", "Genviral, Pinterest tips and tricks 2026", "12AM Agency, Pinterest SEO checklist 2026"] },
  email:{ titel:'E-mail en nieuwsbrief', bijgewerkt:'2026-09-28', tekst:
`- Meet niet op openingspercentages: die zeggen steeds minder. Kijk naar kliks, antwoorden, conversie (aanmelding, geboekt gesprek, aankoop) en afmeldingen.
- Persoonlijke nieuwsbrieven van een mens presteren beter dan merk-nieuwsbrieven: schrijf vanuit jezelf, met je mening, je inzichten en je aanbevelingen.
- Maar een klein deel van je lijst is op elk moment klaar om te kopen. Blijf dus consequent zichtbaar in de inbox, zodat je er bent als het moment komt.
- Vraag lezers zelf wat ze willen (keuzevakjes, een korte vraag) en stem je mails daarop af.
- Vraag om antwoorden: een reactie op je mail is voor coaches en consultants een sterk signaal van interesse.
- Technisch op orde (SPF, DKIM en DMARC ingesteld) is een basisvoorwaarde om in de inbox te landen.
- Er melden zich wat meer mensen af dan voorheen, maar wie blijft is actiever: zie afmeldingen niet als falen.
- Deel ervaringen en resultaten van klanten (met toestemming) als inhoud van je mails.`,
    bronnen:['Litmus, Email marketing trends 2026','Knak, 2026 Email marketing trends (juli 2026)','HubSpot, Future of newsletters (augustus 2026)','MailerLite, Email marketing trends 2026','mean.ceo, Email marketing trends augustus 2026'] },
  verkoop:{ titel:'Verkoop en DM-gesprekken', bijgewerkt:'2026-09-30', tekst:
`- Voor coaches en dienstverleners converteren persoonlijke gesprekken via DM veel beter dan een linkje naar een salespagina: vertrouwen sluit de deal.
- Snel reageren maakt een groot verschil: wie binnen korte tijd antwoordt, maakt veel meer kans op een gesprek.
- Werk in stappen: gesprek openen, doorvragen (doel, timing, wat ze al probeerde), pas daarna je aanbod, en sluit af met één duidelijke vervolgstap.
- Nodig bij een groter aanbod uit voor een kennismakingsgesprek, in plaats van meteen een betaallink te sturen.
- Volg op: een vriendelijke follow-up na 1 à 2 dagen haalt veel stilgevallen gesprekken terug.
- Content die aanzet tot een DM (een reactie met een woord, een vraag in je story) vult je inbox met de juiste mensen.
- Automatisering mag een gesprek openen; een mens sluit het.`,
    bronnen:["AiGrow, How to sell on Instagram DM (2026)", "SellByChat, How to sell in DMs (2026)", "brandID, Instagram DM marketing 2026", "SetSmart, Instagram sales funnel: DMs to booked calls (2026)"] },
  website:{ titel:'Salespagina en website', bijgewerkt:'2026-09-30', tekst:
`- Eén pagina, één doel: één duidelijke vervolgstap, herhaald op logische plekken (bovenaan, na het opbouwen van verlangen, onderaan).
- De kop is het belangrijkste element: beloof een concreet resultaat voor een specifieke klant.
- Minder velden in formulieren leveren meer aanvragen op. Vraag alleen wat je echt nodig hebt.
- Echte, specifieke klantverhalen en resultaten verhogen vertrouwen en conversie.
- Laat duidelijk zien hoe het traject verloopt (wat ze krijgt, wanneer, hoe): dat wordt vaak vergeten en is juist voor coaches belangrijk.
- Een beperkt aantal plekken of een heldere startdatum werkt beter dan "altijd open", als het echt is.
- Snel laden en mobiel eerst: het meeste verkeer komt via de telefoon. Haal afleidende menu's weg op een salespagina.`,
    bronnen:["Lovable, Landing page best practices 2026", "Communipass, Coaching sales page conversion rate 2026", "Digital Applied, Landing page statistics 2026", "Leadsuite, Landing page optimization 2026"] },
  live:{ titel:'Masterclass, webinar en live', bijgewerkt:'2026-09-30', tekst:
`- Ongeveer de helft van de aanmelders kijkt live mee; met de opname erbij stijgt dat. Plan dus ook je replay.
- Live bijeenkomsten converteren duidelijk beter dan opnames op aanvraag: de interactie maakt het verschil.
- Rond de 60 minuten is een goede lengte voor aanwezigheid en aandacht.
- Maandag en vrijdag doen het meestal minder goed dan midden in de week.
- Betrek mensen live (vragen, chat, polls): hoe meer interactie, hoe beter de conversie op je aanbod.
- Stuur herinneringen (dag ervoor, uur ervoor, bij de start) en maak van je live-sessie daarna korte clips en een mail.`,
    bronnen:["TwentyThree, State of Webinars 2026", "Univid Webinar Insights 2026", "Presentr, Webinar statistics 2026 (juli 2026)", "Digital Applied, Webinar statistics 2026"] },
  markt:{ titel:'Merk, aanbod en markt', bijgewerkt:'2026-09-28', tekst:
`- Maar een klein deel van je doelgroep is op elk moment klaar om te kopen. Een 90-dagenplan draait dus om consequent zichtbaar blijven en je lijst laten groeien, niet om één lancering.
- Stuur op leadkwaliteit en conversie (van lead naar klant), niet op bereik alleen: dat zijn ook de cijfers waar marketeers in 2026 het meest op letten.
- Eigen kanalen (e-mail, je website, je community) worden belangrijker naarmate het organische bereik op social media onvoorspelbaarder wordt.
- Mensen kopen van mensen: persoonlijke verhalen, meningen en resultaten van klanten bouwen sneller vertrouwen dan merkboodschappen.
- Solopreneurs zetten in 2026 vooral in op e-mail, LinkedIn, blog en SEO, samenwerkingen en gastoptredens in podcasts.`,
    bronnen:['HubSpot State of Marketing Report 2026 (via hubspot.com/marketing-statistics)','Litmus, Email marketing trends 2026 (Ehrenberg-Bass Institute)','Knak, 2026 Email marketing trends','Adriana Tica, State of Solopreneurship 2026'] }
};
// Kennisdomeinen: elke skill hoort bij één of meer domeinen. Kanalen (kanaal:true) bepalen ook welke tools een klant ziet.
const KENNISDOMEINEN = {
  instagram:{ titel:'Instagram', kanaal:true }, linkedin:{ titel:'LinkedIn', kanaal:true }, facebook:{ titel:'Facebook', kanaal:true }, tiktok:{ titel:'TikTok', kanaal:true },
  youtube:{ titel:'YouTube', kanaal:true }, pinterest:{ titel:'Pinterest', kanaal:true }, email:{ titel:'E-mail en nieuwsbrief', kanaal:true },
  verkoop:{ titel:'Verkoop en DM-gesprekken' }, website:{ titel:'Salespagina en website' }, live:{ titel:'Masterclass, webinar en live' },
  markt:{ titel:'Merk, aanbod en markt' } };
const KANALEN = Object.keys(KENNISDOMEINEN).filter(d => KENNISDOMEINEN[d].kanaal);
function kennisVan(sid) { const t = eigenTool(sid); if (t) return t.kanalen || []; return data.skills?.[sid]?.kennis ?? SKILLS.find(s => s.id === sid)?.kennis ?? []; }
// Laat een tool zien als hij bij een van haar kanalen hoort, of niet kanaalgebonden is. Nog geen kanalen gekozen: alles.
function toolZichtbaar(k, sid) {
  const d = kennisVan(sid); const kan = d.filter(x => KENNISDOMEINEN[x]?.kanaal);
  if (!kan.length || !(k?.platformen || []).length) return true;
  return kan.some(x => k.platformen.includes(x));
}
function actueleDomeinen(k, sid) {
  return kennisVan(sid).filter(d => !KENNISDOMEINEN[d]?.kanaal || !(k?.platformen || []).length || k.platformen.includes(d))
    .filter(d => data.platform?.[d]?.tekst?.trim());
}
function platformContext(sid, k) {
  return actueleDomeinen(k, sid).map(d => { const x = data.platform[d];
    return `ACTUELE KENNIS ${x.titel.toUpperCase()} (bijgewerkt ${x.bijgewerkt || 'onbekend'}; actueler dan je eigen kennis, bij verschil wint dit):\n${x.tekst.trim()}`; }).join('\n\n');
}
function laatsteUpdate(k, sid) { const ds = actueleDomeinen(k, sid).map(d => data.platform[d].bijgewerkt).filter(Boolean).sort(); return ds[ds.length - 1] || ''; }
function platformOud(x) { if (!x?.bijgewerkt) return true; return (Date.now() - new Date(x.bijgewerkt)) / 864e5 > 9; }
// USP: de platform-tools worden elke week bijgewerkt
const USP_WEKELIJKS = 'Elke week werk ik al je tools bij met de nieuwste trends en inzichten over wat nu werkt: op je kanalen, in verkoop, e-mail en je aanbod. Zo werk je altijd actueel, strategisch en in je eigen toon.';

function kanalenUit(tekst) { const t = (tekst || '').toLowerCase(); return KANALEN.filter(d => t.includes(KENNISDOMEINEN[d].titel.toLowerCase().split(' ')[0].toLowerCase())); }

// Chef's tips: één minuut inchecken bij jezelf, los of halverwege een focusblok
const CHEFS_TIPS = [
  'Adem drie keer diep in en uit. Voel je voeten op de grond.',
  'Hoe zit je erbij? Laat je schouders zakken en ontspan je kaak.',
  'Drink een slok water. Een goed gerecht heeft ook rust nodig.',
  'Kijk even weg van je scherm, naar iets in de verte.',
  'Werk ik nog aan het belangrijkste, of aan het makkelijkste?',
  'Wat voel je nu: energie, onrust of flow? Geen oordeel, alleen opmerken.',
  'Klinkt wat je net maakte als jij? Lees één zin hardop.',
  'Wat zou je doen als het licht mocht voelen?' ];
const CHEFS_TIPS_TYPE = {
  'Generator':'Voel je nog een ja voor deze taak? Zo niet, mag je wisselen.',
  'Manifesting Generator':'Mag je iets overslaan of versnellen? En wie moet je daarover informeren?',
  'Projector':'Hoe is je energie? Een korte pauze maakt je scherper, niet luier.',
  'Manifestor':'Moet je iemand laten weten waar je mee bezig bent?',
  'Reflector':'Hoe voelt deze plek? Een andere plek kan je werk veranderen.' };
function chefsTip(k) { const lijst = [...CHEFS_TIPS]; const t = CHEFS_TIPS_TYPE[k?.werkplek?.energietype]; if (t) lijst.push(t, t);
  return lijst[Math.floor(Math.random() * lijst.length)]; }

// Eigen stijl van de klant (zie thema.js)
const KLANT_FOTOS = ['banner','fotoWerkplek','fotoDessert'];
const THEMA_FONTS = {
  koppen:['Times New Roman','Playfair Display','Cormorant Garamond','DM Serif Display','Fraunces','Libre Baskerville','Lora','Montserrat','Poppins'],
  tekst:['Be Vietnam Pro','Inter','DM Sans','Lato','Montserrat','Nunito Sans','Poppins','Work Sans'] };
const THEMA_STD = { actief:false, kleuren:{ donker:'#3D1419', primair:'#6B1A2A', accent:'#C9A060', licht:'#F5F0EB' }, koppen:'Times New Roman', tekst:'Be Vietnam Pro', fotos:{}, aspect:{}, uitsnede:{}, logo:'' };

// Toegang: looptijd van het traject + 3 maanden. Daarna verlengen per maand.
// Verlengen: 7-Course-klanten €15, alle anderen €20 per maand (pas hier aan)
const TOEGANG = { naMaanden:3, waarschuwDagen:30, prijzen:{ dwy:'€15 per maand', standaard:'€20 per maand' } };
const verlengPrijs = k => TOEGANG.prijzen[k?.pakket] || TOEGANG.prijzen.standaard;
// Geschatte kosten van Claude per klant (schatting, in euro). Pas aan zodra je je echte rekening ziet.
const KOSTEN = { perBericht:0.03, perTool:0.07 };
// Limieten voor de sous-chef en de tools, zodat je altijd marge houdt. Standaard hieronder; aan te passen in Portaal & huisstijl en per klant.
const LIMIET_STANDAARD = { dag:25, maand:150, toolsDag:30 };
function limietVan(k) { const g = { ...LIMIET_STANDAARD, ...((typeof data !== 'undefined' && data.limieten) || {}) }; return { ...g, ...(k?.limiet || {}) }; }
function gebruikVan(k) {
  const vandaag = new Date().toISOString().slice(0,10), maand = vandaag.slice(0,7);
  const vragen = (k?.chat || []).filter(m => m.rol === 'user');
  return { dag: vragen.filter(m => (m.op||'').startsWith(vandaag)).length, maand: vragen.filter(m => (m.op||'').startsWith(maand)).length,
    toolsDag: (typeof data !== 'undefined' ? data.activiteit : []).filter(x => x.klant === k?.id && x.type === 'skill' && x.op.startsWith(vandaag)).length };
}
function chatRuimte(k) { const l = limietVan(k), g = gebruikVan(k); return { dag: Math.max(0, l.dag - g.dag), maand: Math.max(0, l.maand - g.maand), l, g }; }
function toegangTot(k) {
  if (k.toegangTot) return k.toegangTot;
  const na = PAKKETTEN[k.pakket]?.naOplevering; if (na) { const c = Object.values(k.courses || {}); if (!c.length || !c.every(x => x.status === 'klaar')) return null;
    const op = c.map(x => x.klaarOp).filter(Boolean).sort().pop(); if (!op) return null; const d = new Date(op); d.setMonth(d.getMonth() + na); return d.toISOString().slice(0, 10); }
  const w = PAKKETTEN[k.pakket]?.duurWeken; if (!w) return null;
  const d = new Date(k.start); d.setDate(d.getDate() + w * 7); d.setMonth(d.getMonth() + (PAKKETTEN[k.pakket].naMaanden ?? TOEGANG.naMaanden)); return d.toISOString().slice(0, 10);
}
function toegangStatus(k) {
  if (k.verlengd) return 'verlengd'; const t = toegangTot(k); if (!t) return 'actief';
  const dagen = Math.ceil((new Date(t) - new Date(new Date().toISOString().slice(0,10))) / 864e5);
  return dagen < 0 ? 'verlopen' : dagen <= (PAKKETTEN[k.pakket]?.waarschuwDagen ?? TOEGANG.waarschuwDagen) ? 'bijna' : 'actief';
}
const toegangOpen = k => toegangStatus(k) !== 'verlopen';

/* ---------- Brand Audit: drie gangen, gevuld vanuit quiz en vragenlijst ---------- */
const AUDIT_TEKST = {
  '01': { jasmijn:['Ik lees je verhaal en je antwoorden, en kijk hoe dat nu naar buiten komt','Je krijgt een score: hoe sterk je eigen verhaal nu in je merk zit','Plus wat ik zie, en je eerste stap'],
    jij:'Je ziet in één oogopslag waar je kracht zit en wat nog onder de oppervlakte ligt.', aanleveren:'Je hoeft niets extra aan te leveren: ik werk met je quiz, je vragenlijst en wat ik online van je zie.',
    bron:['verhaal','trots','rafels','wat','sinds'] },
  '02': { jasmijn:['Ik vergelijk hoe je wilt klinken met hoe je nu klinkt, online en in je antwoorden','Je krijgt een score voor je tone of voice en je merkgevoel','Plus wat ik zie, en je eerste stap'],
    jij:'Je weet waarom je content wel of niet als jou voelt, en wat je morgen anders kunt doen.', aanleveren:'Niets extra nodig. Heb je posts waar je trots op bent? Upload ze gerust.',
    bron:['toon','nooit','bewonder','gevoel','kleuren','behouden'] },
  '04': { jasmijn:['Ik kijk hoe scherp je positionering is: voor wie, welk probleem, welk resultaat','Je krijgt een score en ik benoem waar het nog breed of vaag is','Plus wat ik zie, en je eerste stap'],
    jij:'Je weet hoe helder je nu bent voor je ideale klant, en wat je eerst moet aanscherpen.', aanleveren:'Niets extra nodig. Heb je een concurrent waar je je tegen wilt afzetten? Noem die gerust.',
    bron:['doelgroep','pijn','resultaat','aanbod','meer','succes'] } };
const AUDIT_ADVIES = ['7-Course Brand Experience','Be Your Own Chef','Craveable Identity','Branded templates','Brand shoot','Anders'];
function auditVan(k) { if (!k.audit) k.audit = { status:'concept', courses:{ '01':{}, '02':{}, '04':{} }, top3:['','',''], advies:'', adviesTekst:'' }; return k.audit; }

// De vragenlijst die bij het pakket van deze klant hoort (sommige delen zijn alleen voor bepaalde pakketten)
// Delen die alleen gelden als ze in het pakket van toepassing zijn (ook als het is bijgeboekt)
const VL_VOORWAARDEN = {
  logo: { label:'klanten die een logo krijgen: 7-Course, Branded Templates, Craveable Identity (ook bijgeboekt)', test:k => ['dwy','templates','identity'].includes(k?.pakket) || heeftExtra(k, 'Branded templates') || heeftExtra(k, 'Craveable Identity') },
  templates: { label:'klanten die templates krijgen: 7-Course en Branded Templates (ook bijgeboekt)', test:k => ['dwy','templates'].includes(k?.pakket) || heeftExtra(k, 'Branded templates') } };
function vragenlijstVoor(k) { return (typeof data !== 'undefined' ? data.vragenlijst : STANDAARD_VRAGENLIJST).filter(d => (!d.alleen || d.alleen.includes(k?.pakket)) && (!d.voorwaarde || VL_VOORWAARDEN[d.voorwaarde]?.test(k))); }

// ---------- Voor jou (alleen zichtbaar in je keuken): wat je per gang doet, en hoe lang het ongeveer duurt ----------
const JOUW_WERK = {
  '01': { opleveren:['Raw Ingredients-overzicht: haar verhaal, keerpunten en expertise (pdf of Canva)','Opname of verslag van het diepte-interview'], taken:['Diepte-interview voeren','Uitwerken tot overzicht'], tijd:'Interview 60 tot 90 min, uitwerken 2 tot 3 uur', doorloop:'± 1 week' },
  '02': { opleveren:['Tone of voice-gids met woorden wél en nooit','Moodboard (Canva of Pinterest)','Craveable Identity als los pakket: de hele identiteit wordt hier opgeleverd'], taken:['Voice memo\'s en posts analyseren','Gids en moodboard maken','Brand shoot datum vastleggen'], tijd:'Analyse 2 uur, gids 3 tot 4 uur, moodboard 2 uur', doorloop:'± 1 week' },
  '03': { opleveren:['Haar methode met naam, visueel uitgewerkt (Canva)'], taken:['Methode destilleren uit haar werk','Framework vormgeven'], tijd:'3 tot 4 uur, plus 2 uur vormgeving', doorloop:'± 1 week' },
  '04': { opleveren:['Messaging plan en anti-positionering','7-Course: Craveable Identity (moodboard, logo-set, kleuren en lettertypen, beeldstijl en brand visuals, brandbook en Brand Kit)','Voorbereiding brand shoot: shotlist, locatie, outfits'], taken:['Messaging plan schrijven','Identiteit ontwerpen, met een feedbackronde op logo en kleuren','Shoot voorbereiden en beeldrechten laten tekenen'], tijd:'Messaging 3 uur, identiteit 12 tot 20 uur, shootvoorbereiding 2 tot 3 uur', doorloop:'2 tot 3 weken door de identiteit. Plan de identiteit zo dat hij klaar is vóór de shoot.' },
  '05': { opleveren:['Brand shoot: selectiegalerij en bewerkte foto\'s (Pixieset)','Branded templates in Canva, met haar eigen foto\'s','Content-formats en hooks'], taken:['Shooten (1 tot 4 uur)','Wachten op haar selectie (± 1 week)','Bewerken (± 6 tot 12 uur, vaak 1 tot 2 weken)','Templates bouwen (± 8 tot 15 uur)'], tijd:'De grootste gang: samen ± 20 tot 30 uur', doorloop:'3 tot 4 weken. Plan deze gang ruim en start met bewerken binnen 48 uur na haar selectie.' },
  '06': { opleveren:['Aanbod met prijsonderbouwing','Klantreis','Basistekst salespagina (Google Doc)'], taken:['Aanbod en prijzen uitwerken','Salespagina-tekst schrijven'], tijd:'Aanbod 3 tot 4 uur, tekst 3 uur', doorloop:'± 1 week' },
  '07': { opleveren:['Klantbeleving van eerste contact tot afronding','Welkomstmail voor háár klanten'], taken:['Touchpoints in kaart brengen','Mailteksten schrijven'], tijd:'3 tot 4 uur', doorloop:'± 1 week' },
  'finale': { opleveren:['Brandbook of merkboek','Eindpresentatie (Canva) plus Loom','Afrondende call met 90-dagenplan'], taken:['Alles samenbrengen','Eindpresentatie maken','Afrondende call'], tijd:'4 tot 6 uur, plus een call van 60 minuten', doorloop:'± 1 week' } };
function jouwWerk(c) { const o = (typeof data !== 'undefined' && data.courseTeksten?.[c]?.jouwWerk); return o ? { ...JOUW_WERK[c], vrij:o } : JOUW_WERK[c]; }

// Teksten per course voor de losse pakketten
const PAKKET_TEKST = {
  templates: { '05': { jasmijn:['100+ social templates, afgestemd op je doel: opbouw, lancering of verkoop','Je custom brand logo, kleuren en lettertypen','Je brandbook en een ingerichte Brand Kit in Canva','1:1 brand sessies, en chatsupport tijdens het traject'],
      jij:'Je vult je templates zelf in Canva, in je eigen stijl. Na de oplevering heb je nog 2 maanden toegang tot deze werkomgeving: je tools, je sous-chef en je hele merk bij elkaar.',
      aanleveren:'Je huidige logo (als je dat houdt), beelden die je wilt gebruiken, en voorbeelden van templates of accounts die je mooi vindt.' } },
  identity: { '01': { jasmijn:['Een korte verdieping in je verhaal: wie je bent en waar je vandaan komt','De basis waarop je nieuwe identiteit rust'], jij:'Je merk krijgt een fundament, zodat je logo en kleuren kloppen met wie je bent.', aanleveren:'Je huidige logo en materialen, als je die hebt.' },
    '02': { jasmijn:['Je gewenste merkgevoel, vertaald naar beeld','Custom logo-set, kleurpalet en lettertypen','Beeldstijl, grafische elementen en een brandbook met Brand Kit in Canva'], jij:'Je hebt een complete, herkenbare identiteit die je overal consequent inzet.', aanleveren:'Voorbeelden van merken, kleuren en logo\'s die je aanspreken.' } } };

// Aanbod en prijzen: jouw aanpassingen (in je keuken onder "Aanbod & prijzen") gaan voor de standaard
function boekItem(b) { const o = (typeof data !== 'undefined' && data.aanbod?.[b.id]) || {}; return { ...b, ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null)) }; }
function inhoudVan(naam) { const o = typeof data !== 'undefined' && data.inhoud?.[naam]; return (o && o.length ? o : EXTRA_INHOUD[naam]) || []; }
function pakketPrijs(p) { return (typeof data !== 'undefined' && data.pakketPrijzen?.[p]) || PAKKETTEN[p]?.prijs || ''; }
function aanbodKaart(b, k) {
  const zitErin = k && b.extra && inbegrepen(k.pakket, b.extra) && b.uitgelicht; const inh = b.extra ? inhoudVan(b.extra) : [];
  const pk = { dwy:'dwy', audit:'audit', templates:'templates', identiteit:'identity' }[b.id];
  const eigen = typeof data !== 'undefined' && data.aanbod?.[b.id]?.prijs;
  const prijs = b.id === 'dwy' || b.id === 'audit' ? pakketPrijs(b.id) || b.prijs : (!eigen && pk && pakketPrijs(pk) && !/overleg|invullen/.test(pakketPrijs(pk)) ? pakketPrijs(pk) : b.prijs);
  return `<div class="tool aanbodkaart ${b.uitgelicht ? 'uitgelicht' : ''}" style="cursor:default"><strong>${esc(b.titel)}</strong>${zitErin ? '<span class="pill klaar" style="align-self:flex-start">Zit in jouw traject</span>' : ''}<span>${esc(b.tekst)}</span>
    ${b.waarom ? `<span class="waarom">${esc(b.waarom)}</span>` : ''}
    ${inh.length ? `<details class="inhoud"><summary>Wat zit erin</summary><ul>${inh.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
    ${zitErin ? '<em class="aanbodprijs">Extra nodig? Prijs in overleg</em>' : prijs ? `<em class="aanbodprijs">${prijs === 'in overleg' ? 'Prijs in overleg' : prijs === 'op aanvraag' ? 'Op aanvraag' : esc(prijs)}</em>` : ''}
    ${k ? `<button class="btn sm" style="margin-top:.8rem;align-self:flex-start" data-a="aanvraag-open" data-v="${b.id}">${b.id==='dwy'||b.id==='audit' ? 'Boeken' : zitErin ? 'Extra aanvragen' : 'Aanvragen'}</button>` : ''}</div>`;
}

// Wat er in elk pakket zit (aan te passen in Aanbod & prijzen)
const PAKKET_INHOUD = {
  dwy:['Alle 7 gangen, 8 weken samen aan tafel: van je verhaal tot hoe samenwerken met jou voelt','Brand shoot, geregisseerd op jouw verhaal','Branded templates met je eigen beelden','Craveable Identity: logo, kleuren, lettertypen, beeldstijl en brandbook','Je Signature Dish: je hele merk op één bord, dat blijft van jou','Tools en sous-chef die je merk kennen, wekelijks bijgewerkt','Toegang tijdens je traject plus 3 maanden'],
  audit:['Quiz en vragenlijst over jou en je business','Raw Ingredients, Flavor Profile en Positioning Cut: per gang een score, wat ik zie en je eerste stap','Je top 3 acties en mijn advies voor je volgende stap','Een persoonlijke video waarin ik je audit met je doorloop','4 weken toegang tot je portaal, tools en sous-chef'],
  zelf:['Alle 7 gangen om zelfstandig te doorlopen','Tools die je merk kennen, wekelijks bijgewerkt','Je sous-chef, workflow en 90-dagenplan','Bijboeken kan altijd: een gang, shoot of templates met mij'] };
function pakketInhoud(p) { const o = typeof data !== 'undefined' && data.pakketInhoud?.[p]; if (o && o.length) return o;
  if (PAKKET_INHOUD[p]) return PAKKET_INHOUD[p]; if (p === 'templates') return inhoudVan('Branded templates'); if (p === 'identity') return inhoudVan('Craveable Identity'); return []; }
function heeftAanbod(k, b) { if (b.id === 'dwy' || b.id === 'audit') return k.pakket === b.id; if (b.id === 'templates') return k.pakket === 'templates' || heeftExtra(k, 'Branded templates'); if (b.id === 'identiteit') return k.pakket === 'identity' || heeftExtra(k, 'Craveable Identity'); if (b.id === 'website') return heeftExtra(k, 'Website'); return false; }
