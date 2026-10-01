/* =====================================================================
   HUMAN DESIGN — chart berekenen uit geboortedatum, -tijd en -plaats
   Gebruikt Astronomy Engine (ware ecliptica van datum, schijnbare posities).
   ===================================================================== */
const HD_WIEL = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
const HD_CENTRA = {
  hoofd:{ naam:'Hoofd', gates:[64,61,63] }, ajna:{ naam:'Ajna', gates:[47,24,4,17,43,11] },
  keel:{ naam:'Keel', gates:[62,23,56,31,8,33,45,20,16,35,12] }, g:{ naam:'G-centrum', gates:[7,1,13,10,15,2,46,25] },
  hart:{ naam:'Hart (ego)', gates:[21,51,26,40] }, sacraal:{ naam:'Sacraal', gates:[34,5,14,29,27,59,42,3,9] },
  milt:{ naam:'Milt', gates:[48,57,44,50,18,28,32] }, zonnevlecht:{ naam:'Zonnevlecht', gates:[22,36,37,6,49,55,30] },
  wortel:{ naam:'Wortel', gates:[53,60,52,58,38,54,19,39,41] } };
const HD_KANALEN = [
  [64,47,'Abstractie'],[61,24,'Bewustzijn'],[63,4,'Logica'],[17,62,'Acceptatie'],[43,23,'Structurering'],[11,56,'Nieuwsgierigheid'],
  [31,7,'De Alfa'],[8,1,'Inspiratie'],[33,13,'De Verloren Zoon'],[10,20,'Ontwaken'],[45,21,'Geld'],[20,34,'Charisma'],[16,48,'Golflengte'],[20,57,'Hersengolf'],
  [12,22,'Openheid'],[35,36,'Vergankelijkheid'],[10,34,'Verkenning'],[15,5,'Ritme'],[2,14,'De Beat'],[46,29,'Ontdekking'],[10,57,'Perfecte Vorm'],
  [25,51,'Initiatie'],[26,44,'Overgave'],[37,40,'Gemeenschap'],[27,50,'Behoud'],[34,57,'Kracht'],[59,6,'Intimiteit'],[42,53,'Volwassenheid'],
  [3,60,'Mutatie'],[9,52,'Concentratie'],[18,58,'Oordeel'],[28,38,'Strijd'],[32,54,'Transformatie'],[19,49,'Synthese'],[39,55,'Emotie'],[41,30,'Herkenning'] ];
const HD_PLANETEN = ['Zon','Aarde','Noordknoop','Zuidknoop','Maan','Mercurius','Venus','Mars','Jupiter','Saturnus','Uranus','Neptunus','Pluto'];
const HD_PROFIELLIJNEN = {
  1:{ naam:'Onderzoeker', business:'Je bouwt vertrouwen op een stevig fundament. Diep onderzoek, bewijs en onderbouwing geven jou (en je klanten) zekerheid.' },
  2:{ naam:'Natuurtalent', business:'Je talent wordt ontdekt als je er zelf even niet mee bezig bent. Geef jezelf ruimte en laat anders je roepen voor wat je van nature kunt.' },
  3:{ naam:'Experimenteerder', business:'Je leert door te doen en te bijsturen. Wat misgaat is materiaal: deel je lessen, dat maakt je geloofwaardig.' },
  4:{ naam:'Netwerker', business:'Je kansen lopen via mensen die je al kennen. Warme relaties en je netwerk verkopen beter dan koude acquisitie.' },
  5:{ naam:'Probleemoplosser', business:'Mensen projecteren oplossingen op je. Wees helder over wat je wel en niet oplost, en lever dan praktisch resultaat.' },
  6:{ naam:'Rolmodel', business:'Je werkt in fasen en groeit uit tot voorbeeld. Authentiek laten zien hoe jij het doet, is jouw sterkste marketing.' } };
const HD_STRATEGIE = { 'Generator':'Wachten om te reageren', 'Manifesting Generator':'Wachten om te reageren, dan informeren', 'Projector':'Wachten op de uitnodiging', 'Manifestor':'Informeren voordat je handelt', 'Reflector':'Een maancyclus wachten' };

// Lokale tijd in een tijdzone omzetten naar UTC (browser kent historische zomertijden)
function hdNaarUtc(datum, tijd, tz) {
  const [y, m, d] = datum.split('-').map(Number); const [h, mi] = (tijd || '12:00').split(':').map(Number);
  const offset = t => { const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle:'h23', year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' }).formatToParts(new Date(t)).map(x => [x.type, x.value]));
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t; };
  const lokaal = Date.UTC(y, m - 1, d, h, mi); let t = lokaal - offset(lokaal); t = lokaal - offset(t);
  return new Date(t);
}
function hdPoort(lon) {
  const o = ((lon - 302) % 360 + 360) % 360; const i = Math.floor(o / 5.625);
  return { gate: HD_WIEL[i], line: Math.floor((o - i * 5.625) / 0.9375) + 1, lon };
}
// Ware maansknoop (Meeus, hfst. 47)
function hdKnoop(date) {
  const T = (Astronomy.MakeTime(date).tt) / 36525; const r = x => x * Math.PI / 180;
  const D = 297.8501921 + 445267.1114034*T - 0.0018819*T*T; const M = 357.5291092 + 35999.0502909*T; const Mm = 134.9633964 + 477198.8675055*T + 0.0087414*T*T;
  const F = 93.2720950 + 483202.0175233*T - 0.0036539*T*T; const O = 125.0445479 - 1934.1362891*T + 0.0020754*T*T;
  const w = O - 1.4979*Math.sin(r(2*(D-F))) - 0.1500*Math.sin(r(M)) - 0.1226*Math.sin(r(2*D)) + 0.1176*Math.sin(r(2*F)) - 0.0801*Math.sin(r(2*(F-Mm)));
  return ((w % 360) + 360) % 360;
}
function hdLengtes(date) {
  const A = Astronomy; const ecl = b => A.Ecliptic(A.GeoVector(b, date, true)).elon;
  const zon = ecl(A.Body.Sun); const knoop = hdKnoop(date);
  return { Zon:zon, Aarde:(zon+180)%360, Noordknoop:knoop, Zuidknoop:(knoop+180)%360, Maan:ecl(A.Body.Moon), Mercurius:ecl(A.Body.Mercury), Venus:ecl(A.Body.Venus),
    Mars:ecl(A.Body.Mars), Jupiter:ecl(A.Body.Jupiter), Saturnus:ecl(A.Body.Saturn), Uranus:ecl(A.Body.Uranus), Neptunus:ecl(A.Body.Neptune), Pluto:ecl(A.Body.Pluto) };
}
// Design-moment: het moment dat de zon 88° eerder stond (±88 dagen voor de geboorte)
function hdDesignMoment(geboorte) {
  const doel = ((hdLengtes(geboorte).Zon - 88) % 360 + 360) % 360;
  const verschil = t => { let d = hdLengtes(new Date(t)).Zon - doel; return ((d + 540) % 360) - 180; };
  let lo = geboorte.getTime() - 96 * 864e5, hi = geboorte.getTime() - 80 * 864e5;
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (verschil(mid) > 0) hi = mid; else lo = mid; }
  return new Date((lo + hi) / 2);
}
function hdChart({ datum, tijd, tz }) {
  const geboorte = hdNaarUtc(datum, tijd, tz); const design = hdDesignMoment(geboorte);
  const P = {}, D = {}; const lp = hdLengtes(geboorte), ld = hdLengtes(design);
  HD_PLANETEN.forEach(pl => { P[pl] = hdPoort(lp[pl]); D[pl] = hdPoort(ld[pl]); });
  const actief = new Set([...Object.values(P), ...Object.values(D)].map(x => x.gate));
  const centrumVan = g => Object.keys(HD_CENTRA).find(c => HD_CENTRA[c].gates.includes(g));
  const kanalen = HD_KANALEN.filter(([a, b]) => actief.has(a) && actief.has(b)).map(([a, b, naam]) => ({ a, b, naam, van:centrumVan(a), naar:centrumVan(b) }));
  const gedefinieerd = new Set(kanalen.flatMap(k => [k.van, k.naar]));
  const buren = c => kanalen.filter(k => k.van === c || k.naar === c).map(k => k.van === c ? k.naar : k.van);
  const verbonden = (van, doel) => { const zien = new Set([van]); const rij = [van]; while (rij.length) { const c = rij.shift(); if (c === doel) return true; buren(c).forEach(n => { if (!zien.has(n)) { zien.add(n); rij.push(n); } }); } return false; };
  const motorNaarKeel = ['sacraal','zonnevlecht','hart','wortel'].some(m => gedefinieerd.has(m) && verbonden(m, 'keel'));
  let type;
  if (!gedefinieerd.size) type = 'Reflector';
  else if (gedefinieerd.has('sacraal')) type = motorNaarKeel ? 'Manifesting Generator' : 'Generator';
  else type = ['zonnevlecht','hart','wortel'].some(m => gedefinieerd.has(m) && verbonden(m, 'keel')) ? 'Manifestor' : 'Projector';
  let autoriteit;
  if (gedefinieerd.has('zonnevlecht')) autoriteit = 'Emotioneel';
  else if (gedefinieerd.has('sacraal')) autoriteit = 'Sacraal';
  else if (gedefinieerd.has('milt')) autoriteit = 'Splenisch';
  else if (gedefinieerd.has('hart')) autoriteit = 'Ego';
  else if (gedefinieerd.has('g') && verbonden('g', 'keel')) autoriteit = 'Zelf-geprojecteerd';
  else if (type === 'Reflector') autoriteit = 'Lunair';
  else autoriteit = 'Omgeving';
  // Definitie: aantal losse groepen gedefinieerde centra
  const zien = new Set(); let groepen = 0;
  gedefinieerd.forEach(c => { if (zien.has(c)) return; groepen++; const rij = [c]; zien.add(c); while (rij.length) { const x = rij.shift(); buren(x).forEach(n => { if (!zien.has(n)) { zien.add(n); rij.push(n); } }); } });
  const definitie = ['Geen definitie','Enkelvoudige definitie','Gesplitste definitie','Drievoudige splitsing','Viervoudige splitsing'][groepen] || `${groepen} delen`;
  const profiel = `${P.Zon.line}/${D.Zon.line}`;
  const hoek = ['4/1'].includes(profiel) ? 'Juxtapositie' : ['5/1','5/2','6/2','6/3'].includes(profiel) ? 'Linkerhoek' : 'Rechterhoek';
  return { geboorteUtc:geboorte.toISOString(), designUtc:design.toISOString(), persoonlijkheid:P, design:D, kanalen, gedefinieerd:[...gedefinieerd],
    type, strategie:HD_STRATEGIE[type], autoriteit, profiel, definitie,
    kruis:{ hoek, gates:`${P.Zon.gate}/${P.Aarde.gate} | ${D.Zon.gate}/${D.Aarde.gate}` } };
}

// Human Design vertaald naar schrijfstijl: gaat mee in het merkgeheugen (tenzij uitgezet)
const HD_TOON = {
  type:{ 'Generator':'Laat je enthousiasme horen: schrijf vanuit wat je echt leuk vindt, en reageer op wat je klanten vragen en zeggen.',
    'Manifesting Generator':'Energiek en afwisselend: korte zinnen en tempo. Laat zien dat je veel kanten op kunt, met één rode draad.',
    'Projector':'Schrijf als gids: scherpe inzichten en een heldere blik die uitnodigen tot een vraag of gesprek. Niet pushen.',
    'Manifestor':'Kondig aan en zet de toon: direct en zelfverzekerd. Vertel wat er komt voordat het er is.',
    'Reflector':'Reflecterend en spiegelend: benoem wat je om je heen ziet, zodat de lezer zichzelf herkent.' },
  autoriteit:{ 'Emotioneel':'Geen haast in je teksten: geen "nu of nooit". Laat je lezer ruimte om te voelen en te beslissen.',
    'Sacraal':'Stel vragen waar je lezer direct een ja of nee op voelt.', 'Splenisch':'Kort en intuïtief: vertrouw op je eerste formulering, zonder overdreven uitleg.',
    'Ego':'Schrijf vanuit wat jij wilt en belooft: stevig, met commitment.', 'Zelf-geprojecteerd':'Schrijf alsof je hardop praat: persoonlijk, vanuit wie je bent en waar je heen gaat.',
    'Omgeving':'Laat verschillende perspectieven zien, en schrijf vanuit gesprekken die je voerde.', 'Lunair':'Rustig en beschouwend, zonder druk.' },
  lijn:{ 1:'Onderbouw: bewijs, bronnen en diepgang geven vertrouwen.', 2:'Natuurlijk en ongedwongen: minder uitleggen, meer laten zien.',
    3:'Eerlijk over wat je probeerde en wat misging: dat is je bewijs.', 4:'Warm en persoonlijk, alsof je schrijft aan iemand uit je netwerk.',
    5:'Praktisch en oplossingsgericht: maak concreet wat je oplost.', 6:'Overzicht en voorbeeld: laat rustig zien hoe jij het doet.' } };
function hdToon(k) {
  const w = k?.werkplek || {}; const c = w.hd?.chart; const type = c?.type || w.energietype; const aut = c?.autoriteit || w.autoriteit; const prof = c?.profiel || w.profiel;
  if (!type && !aut && !prof) return null;
  const r = []; if (HD_TOON.type[type]) r.push(HD_TOON.type[type]); if (HD_TOON.autoriteit[aut]) r.push(HD_TOON.autoriteit[aut]);
  if (prof) { const [a, b] = prof.split('/'); if (HD_TOON.lijn[a]) r.push(HD_TOON.lijn[a]); if (b !== a && HD_TOON.lijn[b]) r.push(HD_TOON.lijn[b]); }
  return { label:[type, aut && aut+' autoriteit', prof && 'profiel '+prof].filter(Boolean).join(', '), regels:r };
}
