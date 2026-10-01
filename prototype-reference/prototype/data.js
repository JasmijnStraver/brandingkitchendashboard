/* =====================================================================
   DATA — in de live versie: Supabase-tabellen. Hier: je eigen browser.
   ===================================================================== */
const KEY = 'tbk-portaal-v38';
const uid = () => Math.random().toString(36).slice(2, 10);
const nu = () => new Date().toISOString();
const datum = iso => new Date(iso).toLocaleDateString('nl-NL', { day:'numeric', month:'long', year:'numeric' });
const tijd = iso => new Date(iso).toLocaleString('nl-NL', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const voornaam = k => (k.naam || '').split(' ')[0];
const grootte = b => b > 1e6 ? (b/1e6).toFixed(1)+' MB' : Math.max(1, Math.round(b/1e3))+' kB';

function maakKlant({ naam, bedrijf, email, pakket, extras = [] }) {
  const courses = {}; const zelf = !!PAKKETTEN[pakket].zelf;
  PAKKETTEN[pakket].courses.forEach(c => {
    courses[c] = { status: zelf ? 'open' : 'dicht', skills: SKILLS.filter(s => s.course === c && !s.concept).map(s => s.id), notitie:'', bestanden:[], uploads:[] };
  });
  const docs = zelf ? STANDAARD_DOCS.filter(d => d.type === 'Algemene voorwaarden') : [...STANDAARD_DOCS, ...((extras.includes('Brand shoot') || inbegrepen(pakket, 'Brand shoot')) ? SHOOT_DOCS : [])];
  return {
    id: uid(), naam, bedrijf, email: email.toLowerCase().trim(), pakket, extras, start: nu(),
    welkom: STANDAARD_WELKOM, uitgenodigd:false, laatsteLogin:null,
    courses, quiz:null, intake:{ velden:{}, klaar:false, stap:0 }, profiel:{},
    documenten: docs.map(d => ({ id:uid(), ...d, status: d.tekenen ? 'te-tekenen' : 'info', getekendOp:null })),
    checklist:{}, aanbiedingen:[], taal:{ concept:null, live:null, liveOp:null }, geheugen:{ stem:[], kern:{}, bijgewerkt:null },
    platformen: [],
    shoot: (extras.includes('Brand shoot') || inbegrepen(pakket, 'Brand shoot')) ? nieuweShoot() : null,
    extras: extras.filter(e => !inbegrepen(pakket, e)),
    todos: zelf ? ZELF_TODOS.map(x => ({ id:uid(), t:x.t, c:x.c, klaar:false })) : [],
    merk:{ open:false, boodschap:'', kleuren:[], fonts:[], templates:[], bestanden:[] },
    werkplek:{ focus:0, minuten:0, energietype:'', autoriteit:'' }, chat:[]
  };
}

function profielUitIntake(k, vl = vragenlijstVoor(k)) {
  const p = { ...k.profiel, archetype: k.quiz?.uitslag || '' };
  vl.forEach(d => d.vragen.forEach(q => { if (q.tool === 'platformen') { if (k.intake.velden[q.id]) k.platformen = kanalenUit(k.intake.velden[q.id]); } else if (q.tool) p[q.tool] = k.intake.velden[q.id] || ''; }));
  return p;
}

function demoData() {
  const d = new Date(); const dagen = n => new Date(d - n*864e5).toISOString();
  const vl = JSON.parse(JSON.stringify(STANDAARD_VRAGENLIJST));
  const sanne = maakKlant({ naam:'Sanne de Wit', bedrijf:'Sanne de Wit Coaching', email:'sanne@voorbeeld.nl', pakket:'dwy' });
  sanne.uitgenodigd = true; sanne.start = dagen(24);
  sanne.welkom = 'Sanne, wat fijn dat je aan tafel zit. Je verhaal staat en het is sterker dan je zelf denkt. Deze weken duiken we in je Flavor Profile: hoe klink jij als niemand meekijkt?';
  sanne.intake = { klaar:true, stap:6, velden:{
    vakgebied:'burn-outpreventie voor zorgprofessionals', klantwoord:'cliënten', aanbodwoord:'traject',
    gevoel:'Rust, en het gevoel: eindelijk mag ik ademen.', kleuren:'Salie, zand en warm wit', behouden:'Mijn foto\'s in de natuur',
    wat:'Ik begeleid vrouwen in de zorg terug naar rust en eigen regie.', sinds:'1 tot 3 jaar', kanaal:'Instagram', capaciteit:'Zes tegelijk, en straks een groep van tien',
    verhaal:'Ik was twaalf jaar verpleegkundige en brandde op. In mijn herstel ontdekte ik hoe weinig vrouwen leren om rust te nemen zonder schuldgevoel.',
    trots:'Dat klanten na drie maanden zeggen dat ze zichzelf terug hebben.', rafels:'Ik ben geen ochtendmens en ik huil makkelijk bij mooie verhalen.',
    doelgroep:'Vrouwen in de zorg die op het randje van een burn-out lopen', pijn:'Ze voelen zich schuldig als ze rust nemen en weten niet meer wat ze zelf willen',
    resultaat:'Ze kiezen weer voor zichzelf zonder schuldgevoel, en durven grenzen te stellen op werk', toon:'warm, eerlijk, geaard', nooit:'zweverig of belerend',
    bewonder:'Aesop, omdat alles rustig en doordacht voelt.', aanbod:'1-op-1 trajecten van 3 maanden, €1.200', meer:'Een groepsprogramma',
    succes:'Als ik mijn aanbod zonder te blozen kan uitleggen en mijn eerste groep vol krijg.', spannend:'Zichtbaar worden met mijn eigen verhaal.',
    samenwerken:'Rustig tempo, eerst voelen dan doen', instagram:'@sannedewit.coaching', website:'sannedewit.nl', shoot:'Buiten, in de bossen bij Ulvenhout' } };
  sanne.profiel = profielUitIntake(sanne, vl); sanne.intake = { velden:{}, klaar:false, stap:0 };

  sanne.taal = { concept:null, liveOp:dagen(10), live:{ courses:{
    '01':{ jasmijn:['Diepte-interview over jouw weg van de zorg naar je eigen praktijk: de keerpunten en wat je meeneemt','Ik haal je energie, je zorgervaring en je rafelrandjes naar boven, ook wat je zelf als "gewoon" wegzet','Je ontvangt je Raw Ingredients-overzicht: de bouwstenen van alles wat volgt'],
      jij:'Je leert je eigen verhaal vertellen, inclusief je eigen burn-out, zonder dat het voelt als te veel delen. Precies dat verhaal maakt dat zorgprofessionals zich in jou herkennen.', aanleveren:'Foto\'s uit je tijd in de zorg en uit je herstel, teksten waar je trots op bent, en je LinkedIn als inspiratie.' },
    '02':{ jasmijn:['Ik analyseer hoe je nu klinkt: je voice memo\'s, posts en berichten aan cliënten','We leggen je toon vast: woorden die rust geven, en woorden die nooit (zweverig, belerend)','Je vibe vertaald naar een moodboard dat voelt als ademruimte'],
      jij:'Schrijven zoals je met een cliënt praat: warm, eerlijk, zonder zorgjargon. Vanaf hier klinkt elke tool in het portaal als jij.', aanleveren:'Drie voice memo\'s waarin je vertelt wat je doet, alsof je het een collega uit de zorg uitlegt. Screenshots van posts die echt als jou voelen.' },
    '03':{ jasmijn:['We vangen hoe jij zorgprofessionals terugbrengt naar rust in een eigen methode, met een naam die blijft hangen','Ik werk je methode visueel uit, klaar voor je website en je kennismakingsgesprekken','Je visie scherp op papier: waarom rust geen luxe is, en waar je niet aan meedoet'],
      jij:'Autoriteit tonen zonder te schreeuwen. Je methode wordt de rode draad in je content en in je traject.', aanleveren:'Hoe je nu met cliënten werkt: je stappen, oefeningen, de vragen die je altijd stelt. Rommelig mag.' },
    '04':{ jasmijn:['Je messaging plan: je belofte aan zorgprofessionals op het randje, je doelgroep, je content-pijlers','Je anti-positionering: wat je niet bent (geen quick fix, geen zweverige coach)','Claims die je met overtuiging durft te maken, ook tegenover sceptische zorgcollega\'s','De voorbereiding van je brand shoot: jij als de zorgprofessional die weer ademt, vertaald naar shotlist, plek en outfits'],
      jij:'Kiezen, en nee durven zeggen tegen cliënten die niet bij je passen. Je Brand Foundation wordt hier definitief, en alle tools gebruiken hem.', aanleveren:'Voorbeelden van andere burn-out- of zorgcoaches waar je je tegen wilt afzetten.' },
    '05':{ jasmijn:['Eerst je brand shoot in de bossen bij Ulvenhout: ik regisseer, fotografeer en bewerk je beelden','Daarna bouw ik je templates, met je eigen foto\'s uit de shoot','Je content-pijlers in vaste formats, met hooks die herkenbaar zijn voor iedereen die in de zorg werkt'],
      jij:'Je kiest de foto\'s waarin je jezelf herkent, en vanaf dan post je met beelden en templates die echt van jou zijn. De tools schrijven de teksten erbij, zoals jij met cliënten praat.', aanleveren:'Posts die goed liepen (of juist niet), en je planning als je die hebt.' },
    '06':{ jasmijn:['Je 1-op-1 traject en je groepsprogramma gestructureerd en geprijsd op waarde','De reis van je cliënt, van eerste DM tot kennismaking','De basis voor je salespagina en een weggever voor zorgprofessionals'],
      jij:'Verkopen zonder schuldgevoel. Met de tools schrijf je je salespagina, mails en masterclass voor je eerste groep.', aanleveren:'Je huidige traject en prijs, en waar je twijfelt over de prijs van je groepsprogramma.' },
    '07':{ jasmijn:['De beleving van je cliënten, van eerste kennismaking tot afronding','Rustmomenten en rituelen die je cliënten bijblijven','Wat jouw traject onvergetelijk maakt voor iemand die op is'],
      jij:'Je cliënten laten voelen wat jij nu voelt: gezien worden. Met de tools voer je rustige salesgesprekken en deel je resultaten van cliënten.', aanleveren:'Hoe je nu cliënten verwelkomt, en een paar reacties of testimonials.' },
    'finale':{ jasmijn:['Je hele merk samengebracht: van je zorgverleden tot de beleving van je traject','Eindpresentatie en overdracht van alle bestanden','Samen je volgende 90 dagen uitzetten, richting je eerste groep'],
      jij:'Alles wat je hebt gemaakt komt hier samen. Met de planningstools zet je je merk om in een ritme dat past bij jouw energie, zonder zelf weer op te branden.', aanleveren:'Je vragen voor de afrondende sessie.' } },
    tools:{ 'origin-story-reeks':'mijn eigen burn-out en waarom ik uit de zorg stapte', 'authority-carrousel':'waarom zorgprofessionals pas rust nemen als het te laat is',
      'messaging-plan':'mijn belofte aan verpleegkundigen op het randje', 'brand-foundation':'mijn Brand Foundation bijwerken na onze sessie', 'anti-positionering-carrousel':'waarom ik geen quick fix-coach ben',
      'caption-writer':'een caption voor verpleegkundigen die zich schuldig voelen als ze rust nemen', 'funnel-hook-generator':'hooks over grenzen stellen op de afdeling',
      'normal-story-week':'een story-week over schuldgevoel en rust', 'resultaat-carrousel':'van uitgeput na elke dienst naar weer zin in je werk',
      'launch-carrousel-story':'de lancering van mijn eerste groepsprogramma', 'stories-voor-leads':'aanmeldingen voor de wachtlijst van mijn groep',
      'lead-magnet-story-week':'mijn gratis rust-check voor zorgprofessionals', 'offer-builder':'een groepsprogramma van 8 weken voor zorgprofessionals',
      'checkout-page':'de salespagina voor mijn groepsprogramma', 'email-funnel-writer':'een welkomstmail voor zorgprofessionals op mijn lijst',
      'masterclass-schrijver':'een masterclass over rust nemen zonder schuldgevoel', 'webinar-script-builder':'een webinar van 45 minuten voor teamleiders in de zorg',
      'dm-sales-coach':'een verpleegkundige die vroeg of ze het traject kan betalen', 'client-result-carrousel':'het resultaat van een cliënt die weer met plezier haar diensten draait',
      'onder-de-radar-pitch':'twee plekken in mijn traject voor het voorjaar', 'jaardoel':'mijn doel voor volgend jaar met groep en 1-op-1',
      'perfecte-week-planner':'hoeveel cliënten ik aankan zonder zelf weer op te branden', 'sprint-doel':'een sprint naar tien aanmeldingen voor mijn groep' } } };

  Object.assign(sanne.profiel, { kernbelofte:'Zorgprofessionals op het randje kiezen weer voor zichzelf, zonder schuldgevoel.',
    positionering:'Geen quick fix en geen zweverige coach: ik werk vanuit twaalf jaar zorgervaring en mijn eigen herstel.',
    pijlers:['Rust zonder schuld','Grenzen op de afdeling','Terug naar jezelf','Achter de schermen van herstel'] });
  sanne.geheugen = { bijgewerkt:dagen(8), kern:{
      '01':'Twaalf jaar verpleegkundige, burn-out in 2021. In haar herstel ontdekte ze dat rust geen luxe is maar onderhoud. Energie: rustig, warm, eerlijk over haar eigen val. Rafelrandje: huilt makkelijk en zegt dat gewoon.',
      '02':'Spreekt haar cliënten aan met "je". Korte zinnen, veel witregels, geen zorgjargon (dus niet "cliëntgericht" of "interventie"). Geen emoji behalve af en toe een hartje. Nooit: zweverig, belerend, "je moet".' },
    stem:[ { id:uid(), bron:'Voice memo (uitgeschreven)', tekst:'Weet je wat het is? Je leert in de zorg om voor iedereen te zorgen, behalve voor jezelf. En dan sta je na je dienst in de auto en denk je: ik kan niet meer. Dat moment ken ik. Daar begin ik.' },
      { id:uid(), bron:'Post', tekst:'Rust nemen is geen luxe.\nHet is onderhoud.\nNiemand noemt het egoïstisch als je je auto laat nakijken.' } ] };
  Object.assign(sanne.courses['01'], { status:'klaar', notitie:'Je origin story staat. Gebruik de story-reeks deze maand één keer volledig, en kijk hoe het voelt om gezien te worden.' });
  sanne.courses['01'].bestanden = [
    { id:uid(), naam:'Raw Ingredients-overzicht.pdf', soort:'opgediend', notitie:'Je bouwstenen. Lees hem hardop.', op:dagen(12), grootte:2.4e6, downloads:1 },
    { id:uid(), naam:'Werkblad: jouw keerpunten.pdf', soort:'klaargezet', notitie:'', op:dagen(20), grootte:.4e6, downloads:1 } ];
  sanne.courses['01'].uploads = [{ id:uid(), naam:'foto-opleiding-2011.jpg', op:dagen(18), grootte:1.8e6 }];
  sanne.platformen = ['instagram'];
  if (typeof Astronomy !== 'undefined') { try { const h = { datum:'1988-03-14', tijd:'07:40', tijdOnbekend:false, plaats:'Breda, Nederland', tz:'Europe/Amsterdam' }; h.chart = hdChart(h);
    sanne.werkplek = { ...sanne.werkplek, hd:h, energietype:h.chart.type, autoriteit:h.chart.autoriteit, profiel:h.chart.profiel }; } catch (e) {} }
  Object.assign(sanne.shoot, { datum:'2026-10-24', locatie:'Bossen bij Ulvenhout', notitie:'Neem drie outfits mee in aardetinten, en iets uit je praktijk dat je vasthoudt als je met cliënten werkt.' });
  Object.assign(sanne.courses['02'], { status:'bezig', notitie:'Neem vóór onze call drie voice memo\'s op waarin je uitlegt wat je doet, alsof je het aan een vriend(in) of collega vertelt. Upload ze hieronder.' });
  sanne.courses['02'].bestanden = [{ id:uid(), naam:'Werkblad: woorden wel & nooit.pdf', soort:'klaargezet', notitie:'Vul dit in vóór de call.', op:dagen(3), grootte:.3e6, downloads:0 },
    { id:uid(), naam:'Moodboard Flavor Profile', soort:'klaargezet', notitie:'Jouw vibe in beeld. Bewerk gerust mee.', op:dagen(2), grootte:0, downloads:0, canva:'https://www.canva.com/' }];
  sanne.courses['02'].uploads = [{ id:uid(), naam:'voicememo-1.m4a', op:dagen(1), grootte:3.1e6 }];
  sanne.documenten.forEach(x => { if (x.tekenen && !['Beeldrechten & licentie','Modelrelease'].includes(x.type)) { x.status='getekend'; x.getekendOp=dagen(24); } });
  sanne.checklist = { voorstel:true, aanbetaling:true, kickoff:true, profiel:true };
  sanne.aanbiedingen = [{ id:uid(), titel:'Een website die voelt als jij', tekst:'Je groepsprogramma verdient een thuis. Ik bouw je website op je verhaal, je rust en je eigen beelden uit de shoot. Als klant van Studio Crave krijg je voorrang in mijn planning.', knop:'Vertel me meer', trigger:'login', actief:true, status:'nieuw' }];

  const noor = maakKlant({ naam:'Noor Bakker', bedrijf:'Noor Bakker Consultancy', email:'noor@voorbeeld.nl', pakket:'identity', extras:[] });
  noor.uitgenodigd = true; noor.start = dagen(45); noor.welkom = 'Noor, je bent halverwege en het smaakt naar meer. Plating is waar het zichtbaar wordt.';
  noor.intake = { klaar:true, stap:6, velden:{ vakgebied:'strategie en storytelling voor scale-ups', klantwoord:'founders', aanbodwoord:'opdracht', wat:'Ik maak de strategie en het verhaal voor scale-ups zonder marketingteam.', sinds:'Langer dan 5 jaar', kanaal:'LinkedIn', doelgroep:'Founders van scale-ups zonder marketingteam', pijn:'Ze weten niet hoe ze hun expertise verkopen', resultaat:'Een verhaal dat investeerders en klanten in één keer snappen', toon:'scherp, slim, nuchter', nooit:'hijgerig' } };
  noor.profiel = profielUitIntake(noor, vl); noor.intake = { velden:{}, klaar:false, stap:0 };
  [['01','Verhaal en merkbasis.pdf'],['02','Craveable Identity — brandbook.pdf']].forEach(([c, naam], i) => { noor.courses[c].status='klaar'; noor.courses[c].klaarOp = dagen(30-i*20); noor.courses[c].bestanden=[{ id:uid(), naam, soort:'opgediend', notitie:'', op:dagen(30-i*20), grootte:1.2e6, downloads:1 }]; });
  noor.courses['02'].bestanden[0].onderdeel = 'brandbook';
  noor.courses['02'].bestanden.push(...[['moodboard','Moodboard','https://www.pinterest.com/'],['logo','Logo-set (licht en donker)',''],['kleuren','Kleuren en lettertypen',''],['visuals','Beeldstijl en brand visuals','https://www.canva.com/']].map(([o, naam, canva], i) => ({ id:uid(), naam, soort:'opgediend', notitie:'', onderdeel:o, op:dagen(26-i*4), grootte:canva ? 0 : 2.1e6, downloads:1, canva })));
  noor.identiteit = { feedback:{ logo:{ status:'akkoord', tekst:'', op:dagen(16) }, kleuren:{ status:'akkoord', tekst:'', op:dagen(12) } } };
  noor.courses['02'].bestanden.push({ id:uid(), onderdeel:'brandbook', naam:'Je Brand Kit in Canva', soort:'opgediend', notitie:'Logo, kleuren en lettertypen, klaar voor gebruik.', op:dagen(10), grootte:0, downloads:1, canva:'https://www.canva.com/' });
  noor.documenten.forEach(x => { if (x.tekenen) { x.status='getekend'; x.getekendOp=dagen(45); } });
  noor.checklist = { voorstel:true, aanbetaling:true, kickoff:true, profiel:true, aanlevering:true, checkin:true };

  noor.welkom = 'Noor, je Craveable Identity is klaar. Je dessert staat klaar: in je Signature Dish vind je alles wat we samen maakten, en die blijft van jou. Kom hier terug wanneer je iets zoekt of verder wilt schrijven.';
  Object.assign(noor.profiel, { kernbelofte:'Founders vertellen hun verhaal in één keer goed, aan klanten én investeerders.', positionering:'Geen marketingbureau en geen pitchcoach: ik bouw het verhaal onder je strategie.', pijlers:['Verhaal voor strategie','Founder als merk','Helder pitchen'] });
  noor.geheugen = { bijgewerkt:dagen(6), kern:{ '02':'Toon: scherp, nuchter en helder. Kleuren inkt en koper, lettertypen Playfair Display en Inter.' }, stem:[{ id:uid(), bron:'Post', tekst:'Founders hebben geen marketingprobleem. Ze hebben een verhaalprobleem.' }] };
  noor.merk = { open:true, boodschap:'Dit is je merk, Noor. Scherp, nuchter en helder, precies zoals jij praat. Gebruik het, en kom terug wanneer je twijfelt.',
    kleuren:[{ naam:'Inkt', hex:'#1C2230' },{ naam:'Koper', hex:'#B87333' },{ naam:'Zand', hex:'#E9E2D6' },{ naam:'Wit', hex:'#FFFFFF' }],
    fonts:[{ naam:'Playfair Display', rol:'Koppen' },{ naam:'Inter', rol:'Tekst' }],
    templates:[{ naam:'LinkedIn-carrousel', url:'https://www.canva.com' },{ naam:'Pitchdeck', url:'https://www.canva.com' }],
    bestanden:[{ id:uid(), naam:'Logo — primair.svg', soort:'logo', op:dagen(4), grootte:.05e6, canva:'https://www.canva.com/' },{ id:uid(), naam:'Logo — beeldmerk.png', soort:'logo', op:dagen(4), grootte:.2e6 },
      { id:uid(), naam:'Brand shoot — selectie.zip', soort:'beeld', op:dagen(3), grootte:84e6 },{ id:uid(), naam:'Merkboek Noor Bakker.pdf', soort:'overig', op:dagen(2), grootte:6e6 },{ id:uid(), naam:'Signature Dish — eindpresentatie.pdf', soort:'overig', op:dagen(2), grootte:3.2e6 }] };
  noor.platformen = ['linkedin','email'];
  noor.eigenTools = [{ id:'eigen-demo1', naam:'Investor update', doel:'Van mijn aantekeningen een korte maandelijkse update voor investeerders maken, zakelijk maar met mijn verhaal erin.', wanneer:'Aan het einde van elke maand', invoer:'Mijn aantekeningen van de maand', uitvoer:'E-mail of nieuwsbrief', uitvoerAnders:'', course:'', voorbeeld:'', nietDoen:'Geen marketingtaal, geen uitroeptekens', kanalen:['email'], voorbeeldvraag:'mijn update van september', op:new Date(Date.now()-5*864e5).toISOString() }];
  noor.toegangTot = new Date(Date.now() + 18 * 864e5).toISOString().slice(0, 10);
  noor.thema = { ...JSON.parse(JSON.stringify(THEMA_STD)), actief:true, kleuren:{ donker:'#1C2230', primair:'#1C2230', accent:'#B87333', licht:'#F4EFE6' }, koppen:'Playfair Display', tekst:'Inter' };
  noor.werkplek = { focus:14, minuten:840, energietype:'Projector', autoriteit:'Splenisch' };

  const eva = maakKlant({ naam:'Eva Smit', bedrijf:'Eva Smit Loopbaancoaching', email:'eva@voorbeeld.nl', pakket:'zelf' });
  eva.uitgenodigd = true; eva.start = dagen(6);
  eva.welkom = 'Eva, welkom in je eigen keuken. Alle courses staan voor je open. Werk in je eigen tempo, gebruik de tools en vraag je sous-chef als je vastloopt. En wil je dat ik iets voor je maak? Dan weet je me te vinden.';
  eva.todos[0].klaar = true; eva.platformen = ['instagram','linkedin'];
  eva.quiz = { antwoorden:['C','C','C','A','C','D','C'], scores:{A:1,B:0,C:5,D:1}, uitslag:'C', op:dagen(5) };

  const mila = maakKlant({ naam:'Mila de Vries', bedrijf:'Mila Loopbaancoaching', email:'mila@voorbeeld.nl', pakket:'audit' });
  mila.uitgenodigd = true; mila.start = dagen(5); mila.platformen = ['instagram','linkedin'];
  mila.quiz = { antwoorden:['C','B','C','D','C','C','A'], scores:{A:1,B:1,C:4,D:1}, uitslag:'C', op:dagen(4) };
  mila.intake = { klaar:true, stap:7, velden:{ verhaal:'Ik werkte vijftien jaar in HR en zag hoeveel mensen vastzitten in werk dat niet meer past. Twee jaar geleden ben ik voor mezelf begonnen.',
    trots:'Dat mensen na een paar gesprekken weer durven te kiezen.', rafels:'Ik ben ongeduldig en ik zeg soms te snel wat ik denk.', wat:'Ik help mensen van 35 tot 50 die vastzitten in hun loopbaan weer richting te vinden.',
    sinds:'1 tot 3 jaar', kanaal:'Netwerk en mond-tot-mond', platformen:'Instagram, LinkedIn', vakgebied:'loopbaancoaching', klantwoord:'klanten', aanbodwoord:'traject',
    doelgroep:'Professionals tussen 35 en 50 die vastzitten in hun werk', pijn:'Ze weten dat het anders moet, maar niet wat ze dan wél willen', resultaat:'Een heldere keuze en de moed om die te maken',
    toon:'direct, warm, nuchter', nooit:'zweverig', bewonder:'Mensen die eerlijk zijn over twijfel', gevoel:'Dat ze eindelijk hardop mogen twijfelen', kleuren:'Olijfgroen en zand',
    aanbod:'Loopbaantraject van 6 sessies, € 950', meer:'Een groepsprogramma', succes:'Als ik elke maand drie nieuwe klanten heb zonder te jagen', instagram:'@milaloopbaan', website:'milaloopbaan.nl' } };
  mila.profiel = profielUitIntake(mila, vl);
  mila.courses['01'].status = 'open'; mila.courses['02'].status = 'open'; mila.courses['04'].status = 'open';
  mila.audit = { status:'concept', courses:{ '01':{ score:'4', zie:'Je HR-verleden is goud: je hebt van binnenuit gezien waar mensen vastlopen. Alleen vertel je het nu als cv, niet als verhaal.', actie:'Schrijf het moment op waarop je zelf besloot te stoppen, en deel dat.' }, '02':{}, '04':{} }, top3:['','',''], advies:'', adviesTekst:'' };

  const lotte = maakKlant({ naam:'Lotte Jansen', bedrijf:'Studio Lotte', email:'lotte@voorbeeld.nl', pakket:'templates' });
  lotte.uitgenodigd = true; lotte.start = dagen(2);

  const activiteit = [
    { id:uid(), klant:eva.id, type:'aanvraag', tekst:'vroeg een design-opdracht aan', op:dagen(.1), gelezen:false },
    { id:uid(), klant:noor.id, type:'skill', tekst:'gebruikte Caption Writer', op:dagen(.2), gelezen:false },
    { id:uid(), klant:sanne.id, type:'upload', tekst:'uploadde voicememo-1.m4a bij Flavor Profile', op:dagen(1), gelezen:false },
    { id:uid(), klant:lotte.id, type:'login', tekst:'logde voor het eerst in', op:dagen(1.5), gelezen:false },
    { id:uid(), klant:sanne.id, type:'download', tekst:'downloadde Raw Ingredients-overzicht.pdf', op:dagen(11), gelezen:true }
  ];
  const skills = {};
  SKILLS.forEach(s => { skills[s.id] = { kennis:[...(s.kennis||[])], status: s.concept ? 'concept' : 'live', wat:s.wat, vb:s.vb, instructie: SKILL_TEKST[s.id] || 'Nog te schrijven. Beschrijf hier stap voor stap wat deze tool doet, welke vragen hij stelt en hoe de output eruitziet.', versie:1, historie:[] }; });
  return { platform:JSON.parse(JSON.stringify(STANDAARD_PLATFORMKENNIS)), courseTeksten:{}, vragenlijst:vl, kennis:STANDAARD_KENNIS.map(x => ({ id:uid(), ...x })),
    aanvragen:[{ id:uid(), klant:eva.id, soort:'design', titel:'Design-opdracht', toelichting:'Ik zoek een set Instagram-templates die bij mijn nieuwe positionering passen.', periode:'Voor de zomer', op:dagen(.1), status:'nieuw' }],
    portaal:{ fotoJasmijn:null, logoLicht:null, logoDonker:null, welkomKop:PORTAAL.welkomKop, quotes:[...PORTAAL.quotes] }, klanten:[sanne, noor, lotte, eva, mila], activiteit, skills };
}

function laad() { try { const r = localStorage.getItem(KEY); if (r) { const d = JSON.parse(r); if (!d.vragenlijst) d.vragenlijst = JSON.parse(JSON.stringify(STANDAARD_VRAGENLIJST)); if (!d.courseTeksten) d.courseTeksten = {}; if (!d.platform) d.platform = JSON.parse(JSON.stringify(STANDAARD_PLATFORMKENNIS)); return d; } } catch (e) {} return demoData(); }
function bewaar() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); }
  catch (e) { toast('Opslaan in de demo lukt niet meer, waarschijnlijk is een afbeelding te groot. In de live versie gaat dit naar je beveiligde opslag.'); }
}
let data = laad();
const klant = id => data.klanten.find(k => k.id === id);
function log(k, type, tekst) { data.activiteit.unshift({ id:uid(), klant:k.id, type, tekst, op:nu(), gelezen:false }); }
function voortgang(k) { const c = Object.values(k.courses); return { klaar:c.filter(x => x.status==='klaar').length, totaal:c.length }; }
function huidige(k) {
  if (voortgang(k).klaar === voortgang(k).totaal) return 'Afgerond';
  const e = Object.entries(k.courses).find(([, c]) => c.status==='bezig') || Object.entries(k.courses).find(([, c]) => c.status==='open');
  if (!e && !k.quiz) return 'Quiz';
  if (!e && !k.intake.klaar) return 'Vragenlijst';
  if (e) return (/^\d/.test(COURSES[e[0]].nr) ? COURSES[e[0]].nr+' ' : '') + COURSES[e[0]].naam;
  return voortgang(k).klaar === voortgang(k).totaal ? 'Afgerond' : 'Wacht op vrijgave';
}
function checkItems(k) {
  const basis = CHECKLIST.map(f => ({ ...f, items: f.items.filter(i => !i.alleen || i.alleen(k)).map(i => ({ ...i, klaar: i.auto ? !!i.auto(k) || !!k.checklist[i.id] : !!k.checklist[i.id] })) }));
  // Per bijgeboekte extra een eigen blok (de brand shoot heeft zijn eigen blok al)
  const extra = (k.extras || []).filter(e => EXTRA_INHOUD[e] && e !== 'Brand shoot').map(e => ({ fase:'Bijgeboekt: ' + e, items: inhoudVan(e).map((t, i) => { const id = 'x-' + e.replace(/\W+/g, '') + i; return { id, t, klaar: !!k.checklist[id] }; }) }));
  return basis.concat(extra);
}
function openChecks(k) { return checkItems(k).reduce((n, f) => n + f.items.filter(i => !i.klaar).length, 0); }
function vul(tpl, p) {
  const kort = s => { s = (s||'').trim(); if (/^[A-Z][a-z]/.test(s)) s = s[0].toLowerCase() + s.slice(1); return s.length > 60 ? s.slice(0, 58).replace(/\s+\S*$/, '') + '…' : s; };
  return tpl.replace(/\{(\w+)\}/g, (_, key) => kort(p[key]) || { doelgroep:'je ideale klant', pijn:'waar ze nu vastloopt', resultaat:'het resultaat dat je levert', toon:'als jij', nooit:'iemand anders' }[key] || '');
}
function aanbodVoorKlant(k) {
  return k.aanbiedingen.find(a => a.actief && a.status==='nieuw' && !ui.getoond.includes(a.id) &&
    (a.trigger==='login' || (a.trigger.startsWith('na-') && k.courses[a.trigger.slice(3)]?.status==='klaar')));
}
