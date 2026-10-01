/* =====================================================================
   ACTIES & RENDER
   ===================================================================== */
ui.actief = data.klanten[0]?.id; ui.quote = Math.floor(Math.random() * 10);

function render() {
  pasThemaToe();
  const fav = beeld('monogramDonker') || beeld('monogram'); if (fav) { let l = document.querySelector('link[rel=icon]'); if (!l) { l = document.createElement('link'); l.rel = 'icon'; document.head.appendChild(l); } if (l.href !== fav) l.href = fav; }
  document.getElementById('app').innerHTML = demobalk() + (ui.rol==='admin' ? keuken() : (ui.sessie && klant(ui.sessie) ? portaal(klant(ui.sessie)) : inlog()));
  document.getElementById('layer').innerHTML = ui.modal ? modal() : '';
}
function demobalk() {
  return `<div class="demobar"><span><strong>Voorbeeldomgeving.</strong> Alles wat je doet blijft bewaard in deze browser.</span>
    <span style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap">Bekijk als
    <span class="seg" role="group" aria-label="Bekijk als"><button data-a="rol" data-v="admin" aria-pressed="${ui.rol==='admin'}">Jasmijn</button><button data-a="rol" data-v="klant" aria-pressed="${ui.rol==='klant'}">Klant</button></span>
    <button class="linkbtn" data-a="reset">Demo herstellen</button></span></div>`;
}
let toastTimer;
function toast(t) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role','status'); el.textContent = t;
  document.body.appendChild(el); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 3600);
}
function feestje() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = document.createElement('div'); box.className = 'confetti';
  const kleuren = ['#C9A060','#C8001A','#F5F0EB','#6B1A2A'];
  for (let i = 0; i < 90; i++) { const c = document.createElement('i');
    c.style.left = Math.random()*100+'%'; c.style.background = kleuren[i%4]; c.style.animationDelay = Math.random()*.5+'s';
    c.style.setProperty('--dx', (Math.random()*200-100)+'px'); c.style.setProperty('--r', (Math.random()*720)+'deg'); box.appendChild(c); }
  document.body.appendChild(box); setTimeout(() => box.remove(), 3200);
}

/* ---------- Claude in het portaal (via de 'sample'-capability van een gepubliceerde pagina) ---------- */
async function getSample() { if (!window.claude?.use) return null; try { return await window.claude.use('sample'); } catch (e) { return null; } }
function taalBasis(k) {
  const tools = [...new Set(Object.values(k.courses).flatMap(x => x.skills))].filter(sid => data.skills[sid]?.status === 'live');
  return { courses: Object.fromEntries([...Object.keys(k.courses), 'finale'].map(c => [c, { jasmijn: courseTekst(k, c, 'jasmijn'), jij: courseTekst(k, c, 'jij'), aanleveren: courseTekst(k, c, 'aanleveren') }])),
           tools: Object.fromEntries(tools.map(sid => [sid, toolVb(k, sid)])) };
}
function klantContext(k) {
  const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const antwoorden = vragenlijstVoor(k).flatMap(d => d.vragen.map(q => ({ vraag:q.l, antwoord:k.intake.velden[q.id] }))).filter(x => x.antwoord);
  return { naam:k.naam, bedrijf:k.bedrijf, pakket:PAKKETTEN[k.pakket].naam, archetype: a ? `${a.naam}: ${a.sub}` : 'onbekend', persoonlijkeLaag:k.profiel, vragenlijst:antwoorden };
}
async function vertaalDashboard(k) {
  ui.taalFout = '';
  const sample = await getSample();
  if (!sample) { ui.taalFout = 'Vertalen met Claude werkt in de gepubliceerde versie van het portaal (en straks live via je server). Je kunt het wel zelf schrijven.'; render(); return; }
  ui.taalBezig = true; render();
  const bron = taalBasis(k);
  bron.courses = Object.fromEntries(Object.entries(bron.courses).map(([c, x]) => [c, { course: COURSES[c].naam, ...x }]));
  bron.tools = Object.fromEntries(Object.entries(bron.tools).map(([sid, vb]) => [sid, { tool: SKILLS.find(x => x.id===sid).naam, wat: data.skills[sid].wat, voorbeeld: vb }]));
  const prompt = `Je bent de copywriter van Studio Crave, het bedrijf van Jasmijn Straver, dat werkt volgens haar methode The Branding Kitchen™. Herschrijf de teksten van het persoonlijke klantdashboard zodat ze aansluiten bij de business en de wereld van deze klant.

Regels:
- Nederlands. Jasmijn spreekt de klant aan met "je" en "jij". Jasmijns stem: warm, direct, confronterend maar warm. Nooit "ik help", geen hustle-taal, geen vage bureautaal.
- Verander nooit WAT Jasmijn doet of levert, alleen HOE het klinkt voor deze klant: gebruik haar vakgebied, haar eigen woorden voor haar klanten en haar aanbod, en herkenbare situaties uit haar wereld.
- Houd de lengte ongeveer gelijk aan het origineel. "jasmijn" blijft een lijst met evenveel punten.
- Verzin geen feiten die niet in de klantinformatie staan.
- "tools": per tool één korte voorbeeldvraag in de ik-vorm van de klant, zonder "Bijv.", maximaal 12 woorden, specifiek voor haar business.

Geef ALLEEN JSON terug, in precies deze vorm:
{"courses":{"<course-id>":{"jasmijn":["..."],"jij":"...","aanleveren":"..."}},"tools":{"<tool-id>":"..."}}
Gebruik exact dezelfde course-id's en tool-id's als in de originele teksten.

KLANT:
${JSON.stringify(klantContext(k), null, 1)}

ORIGINELE TEKSTEN:
${JSON.stringify(bron, null, 1)}`;
  try {
    const r = await sample.json(prompt, { modelTier:'default' });
    const basis = taalBasis(k); const str = x => typeof x === 'string' && x.trim() ? x.trim() : null;
    k.taal.concept = {
      courses: Object.fromEntries(Object.keys(basis.courses).map(c => { const x = r?.courses?.[c] || {};
        return [c, { jasmijn: Array.isArray(x.jasmijn) && x.jasmijn.filter(str).length ? x.jasmijn.filter(str).map(y => y.trim()) : basis.courses[c].jasmijn,
                     jij: str(x.jij) || basis.courses[c].jij, aanleveren: str(x.aanleveren) || basis.courses[c].aanleveren }]; })),
      tools: Object.fromEntries(Object.keys(basis.tools).map(sid => [sid, (str(r?.tools?.[sid]) || basis.tools[sid]).replace(/^Bijv\.\s*/i, '')]))
    };
    toast('Concept klaar. Lees het na en pas aan waar je wilt.');
  } catch (e) {
    ui.taalFout = e?.code === 'rate_limited' ? 'Even te veel verzoeken achter elkaar. Probeer het zo opnieuw.' : e?.code === 'not_granted' ? 'Je gaf geen toestemming om Claude te gebruiken op deze pagina.' : 'Het vertalen lukte niet. Probeer het opnieuw, of schrijf het zelf.';
  } finally { ui.taalBezig = false; bewaar(); render(); }
}
async function stelGeheugenVoor(k) {
  ui.gehFout = ''; const sample = await getSample();
  if (!sample) { ui.gehFout = 'Voorstellen met Claude werkt in de gepubliceerde versie van het portaal (en straks live via je server). Je kunt de kaart wel zelf invullen.'; render(); return; }
  ui.gehBezig = true; render();
  const deliverables = Object.entries(k.courses).flatMap(([c, x]) => x.bestanden.filter(b => b.soort==='opgediend').map(b => `${COURSES[c].naam}: ${b.naam}${b.notitie ? ' ('+b.notitie+')' : ''}`));
  const prompt = `Je helpt Jasmijn Straver (Studio Crave, methode The Branding Kitchen™) het merkgeheugen van een klant bij te werken. Dit merkgeheugen gaat mee naar alle schrijftools van de klant.

Maak een voorstel voor de Brand Foundation-kaart en de kerninhoud per course, op basis van ALLEEN de informatie hieronder. Verzin niets; laat een veld weg als er te weinig informatie is.
- Schrijf in de taal en de wereld van de klant, niet in culinaire termen.
- kernbelofte: één zin. doelgroep: één zin. pijn en resultaat: één of twee zinnen. positionering: wat dit merk níet is, één of twee zinnen.
- pijlers: maximaal 4 korte namen. toon: 3 tot 5 kernwoorden. nooit: 1 tot 3 dingen.
- kern: per course-id alleen als er echt inhoud voor is; kort en feitelijk, zodat een schrijftool het direct kan gebruiken.

Geef ALLEEN JSON terug: {"kernbelofte":"","doelgroep":"","pijn":"","resultaat":"","positionering":"","pijlers":[""],"toon":"","nooit":"","kern":{"<course-id>":""}}
Course-id's in dit traject: ${Object.keys(k.courses).map(c => c+' = '+COURSES[c].naam).join(', ')}

KLANT:
${JSON.stringify(klantContext(k), null, 1)}

WAT ER NU IN HET MERKGEHEUGEN STAAT:
${merkContext(k)}

JASMIJNS DELIVERABLES TOT NU TOE (alleen titels in deze demo):
${deliverables.join('\n') || 'nog geen'}`;
  try {
    const r = await sample.json(prompt, { modelTier:'default' });
    if (!r || typeof r !== 'object') throw new Error('leeg');
    ui.voorstel = { id:k.id, data:r }; toast('Voorstel klaar. Lees het na voordat je het overneemt.');
  } catch (e) {
    ui.gehFout = e?.code === 'rate_limited' ? 'Even te veel verzoeken achter elkaar. Probeer het zo opnieuw.' : e?.code === 'not_granted' ? 'Je gaf geen toestemming om Claude te gebruiken op deze pagina.' : 'Het voorstel lukte niet. Probeer het opnieuw.';
  } finally { ui.gehBezig = false; render(); }
}
async function draaiSkill(k, s, input) {
  if (ui.rol === 'klant' && !ui.preview) { const r = chatRuimte(k); if (r.g.toolsDag >= r.l.toolsDag) { ui.modal.resultaat = `Je hebt vandaag al ${r.l.toolsDag} keer een tool gebruikt. Morgen kun je weer verder.`; render(); return; } }
  const sd = toolData(s.id); const p = k.profiel || {}; const w = woordenVan(k); const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const sample = await getSample();
  if (!sample) {
    ui.modal.resultaat = `In de live versie schrijft de tool hier je tekst, en bewaart hij die bij je stukken.\n\nDit gaat mee naar de tool:\n• ${s.naam}, versie ${sd.versie}\n• Jouw vraag: ${input}\n\nEn jouw merkgeheugen:\n${merkContext(k)}${platformContext(s.id, k) ? '\n\nEn de actuele kennis:\n' + platformContext(s.id, k) : ''}`;
    render(); return; }
  ui.modal.bezig = true; ui.modal.resultaat = ''; render();
  const prompt = `${sd.instructie}

---
${merkContext(k)}${platformContext(s.id, k) ? '\n\n' + platformContext(s.id, k) : ''}

De klant vraagt via haar portaal:
${input}

Lever direct het resultaat, in haar taal en toon. Stel alleen een vraag terug als het echt niet anders kan.`;
  try {
    await sample(prompt, { modelTier:'default', onText: ({ text }) => { if (ui.modal) ui.modal.resultaat = text; const el = document.getElementById('skill-out'); if (el) { el.hidden = false; el.textContent = text; } } });
    if (!ui.preview) log(k, 'skill', 'gebruikte ' + s.naam); bewaar();
  } catch (e) {
    if (ui.modal) ui.modal.resultaat = (e?.text ? e.text + '\n\n' : '') + (e?.code === 'rate_limited' ? 'Even te veel verzoeken. Probeer het zo opnieuw.' : e?.code === 'not_granted' ? 'Zonder toestemming kan de tool hier niet schrijven.' : 'Het lukte even niet. Probeer het opnieuw.');
  } finally { if (ui.modal) ui.modal.bezig = false; render(); }
}

const val = id => document.getElementById(id)?.value.trim() ?? '';
function inloggen(k, echt) {
  ui.sessie = k.id; ui.cv = 'home'; ui.loginFout = ''; ui.chatOpen = false; ui.chatGelogd = false; ui.getoond = []; ui.modal = null; ui.preview = !echt; ui.quote++;
  if (echt) { k.laatsteLogin = nu(); log(k, 'login', 'logde in'); bewaar(); }
  window.scrollTo(0, 0); render(); setTimeout(checkAanbod, 700);
}
function checkAanbod() {
  const k = klant(ui.sessie); if (!k || ui.rol!=='klant' || ui.modal || !['home','menu'].includes(ui.cv)) return;
  const a = aanbodVoorKlant(k); if (a) { ui.getoond.push(a.id); ui.modal = { type:'aanbod', id:a.id }; render(); }
}
function vindBestand(k, id) { for (const [cid, c] of Object.entries(k.courses)) { const b = c.bestanden.find(x => x.id===id); if (b) return b; } }
function leesAfbeelding(file, cb) {
  if (file.size > 1.6e6) { toast('Dit bestand is te groot voor de demo (max. ca. 1,5 MB). Live is dit geen probleem.'); return; }
  const r = new FileReader(); r.onload = () => cb(r.result); r.readAsDataURL(file);
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a; if (a === 'sluit-bg' && e.target !== el) return;
  const k = ui.rol==='admin' ? klant(ui.actief) : klant(ui.sessie);

  switch (a) {
    /* algemeen */
    case 'rol': ui.rol = el.dataset.v; ui.modal = null; if (ui.rol==='klant' && ui.preview) ui.sessie = null; break;
    case 'reset': if (!confirm('Alle demo-wijzigingen terugzetten?')) return; data = demoData(); bewaar();
      Object.assign(ui, { av:'overzicht', actief:data.klanten[0].id, sessie:null, modal:null, tab:'checklist' }); break;
    case 'sluit': case 'sluit-bg': ui.modal = null; break;

    /* keuken */
    case 'av': ui.av = el.dataset.v; if (ui.av==='meldingen') { render(); data.activiteit.forEach(x => x.gelezen = true); bewaar(); return; } break;
    case 'gelezen': data.activiteit.forEach(x => x.gelezen = true); bewaar(); break;
    case 'kies': ui.av = 'klant'; ui.actief = el.dataset.id; ui.tab = el.dataset.tab || (klant(el.dataset.id)?.pakket === 'audit' ? 'audit' : 'dossier'); ui.openCourse = null;
      data.activiteit.filter(x => x.klant===ui.actief).forEach(x => x.gelezen = true); bewaar(); window.scrollTo(0,0); break;
    case 'tab': ui.tab = el.dataset.v; break;
    case 'acc': ui.openCourse = ui.openCourse===el.dataset.id ? null : el.dataset.id; break;
    case 'nieuw': ui.modal = { type:'nieuw' }; break;
    case 'nieuw-save': {
      const naam = val('n-naam'), email = val('n-email').toLowerCase();
      if (!naam || !/^\S+@\S+\.\S+$/.test(email)) { ui.modal.fout = 'Vul een naam en een geldig e-mailadres in.'; break; }
      if (data.klanten.some(x => x.email===email)) { ui.modal.fout = 'Dit e-mailadres hoort al bij een klant.'; break; }
      const extras = [...document.querySelectorAll('.n-extra:checked')].map(x => x.value);
      const nk = maakKlant({ naam, bedrijf:val('n-bedrijf'), email, pakket:val('n-pakket'), extras });
      data.klanten.push(nk); bewaar(); Object.assign(ui, { av:'klant', actief:nk.id, tab:'checklist', modal:null });
      nk.uitgenodigd = true; ui.modal = { type:'mail', soort:'welkom', id:nk.id }; bewaar();
      toast(`${naam} staat klaar, en de welkomstmail is verstuurd naar ${email}.`); break; }
    case 'uitnodigen': k.uitgenodigd = true; bewaar(); ui.modal = { type:'mail', soort:'welkom', id:k.id }; toast(`Welkomstmail opnieuw verstuurd naar ${k.email}.`); break;
    case 'preview': ui.rol = 'klant'; inloggen(klant(el.dataset.id), false); return;
    case 'bestand-add': {
      const f = document.getElementById('f-file').files[0]; const ruw = val('f-canva'); const canva = schoneUrl(ruw);
      if (ruw && !canva) { toast('Die link klopt niet. Plak de volledige link, beginnend met https://'); return; }
      const naam = val('f-naam') || f?.name || (canva ? (isCanva(canva) ? 'Ontwerp in Canva' : linkLabel(canva).replace(/^(Openen in|Bekijk) /, '').replace(/^./, x => x.toUpperCase())) : '');
      if (!naam) { toast('Kies een bestand, plak een link of geef een naam op.'); return; }
      k.courses[el.dataset.course].bestanden.push({ id:uid(), naam, soort:val('f-soort'), notitie:val('f-notitie'), onderdeel:document.getElementById('f-onderdeel')?.value || '', op:nu(), grootte:f?.size || 0, downloads:0, canva });
      bewaar(); toast(`Geplaatst. ${voornaam(k)} ziet het nu in ${COURSES[el.dataset.course].naam}.`); break; }
    case 'bestand-weg': { const c = k.courses[el.dataset.course]; c.bestanden = c.bestanden.filter(b => b.id!==el.dataset.id); bewaar(); break; }
    case 'profiel-save': ['doelgroep','pijn','resultaat','toon','nooit'].forEach(f => k.profiel[f] = val('p-'+f)); k.profiel.archetype = k.quiz?.uitslag || '';
      bewaar(); toast('Persoonlijke laag opgeslagen. Alle tools gebruiken dit vanaf nu.'); break;
    case 'doc-add': {
      const f = document.getElementById('d-file').files[0]; const titel = val('d-titel') || f?.name.replace(/\.pdf$/i, '');
      if (!titel) { toast('Geef het document een titel.'); return; }
      const teken = document.getElementById('d-teken').checked;
      k.documenten.push({ id:uid(), titel, type:val('d-type'), tekenen:teken, status:teken?'te-tekenen':'info', getekendOp:null });
      bewaar(); toast(`Document klaargezet bij ${voornaam(k)}.`); break; }
    case 'doc-weg': k.documenten = k.documenten.filter(d => d.id!==el.dataset.id); bewaar(); break;
    case 'sug-add': { const s = suggesties(k).filter(x => !k.aanbiedingen.some(y => y.titel===x.titel))[+el.dataset.i];
      k.aanbiedingen.push({ id:uid(), ...s, actief:true, status:'nieuw' }); bewaar(); toast('Aanbieding klaargezet.'); break; }
    case 'aanbod-add': { const titel = val('o-titel'), tekst = val('o-tekst'); if (!titel || !tekst) { toast('Vul een titel en tekst in.'); return; }
      k.aanbiedingen.push({ id:uid(), titel, tekst, knop:val('o-knop') || 'Vertel me meer', trigger:val('o-trigger'), actief:true, status:'nieuw' }); bewaar(); toast('Aanbieding klaargezet.'); break; }
    case 'aanbod-weg': k.aanbiedingen = k.aanbiedingen.filter(x => x.id!==el.dataset.id); bewaar(); break;
    case 'gegevens-save': { const email = val('g-email').toLowerCase(); if (!/^\S+@\S+\.\S+$/.test(email)) { toast('Vul een geldig e-mailadres in.'); return; }
      Object.assign(k, { naam:val('g-naam') || k.naam, bedrijf:val('g-bedrijf'), email, welkom:val('g-welkom') || STANDAARD_WELKOM, extras:[...document.querySelectorAll('.g-extra:checked')].map(x => x.value) });
      if (heeftExtra(k, 'Brand shoot') && !k.shoot) {
        k.shoot = nieuweShoot();
        SHOOT_DOCS.filter(d => !k.documenten.some(x => x.type === d.type)).forEach(d => k.documenten.push({ id:uid(), ...d, status:'te-tekenen', getekendOp:null }));
        toast('Brand shoot toegevoegd: de voorbereiding staat in Positioning Cut, de shoot en de foto\'s in Plating. Beeldrechten en modelrelease staan klaar.'); }
      bewaar(); toast('Opgeslagen.'); break; }
    case 'klant-wis': if (!confirm(`Alle gegevens van ${k.naam} definitief wissen?`)) return;
      data.klanten = data.klanten.filter(x => x.id!==k.id); data.activiteit = data.activiteit.filter(x => x.klant!==k.id); bewaar();
      Object.assign(ui, { av:'overzicht', actief:data.klanten[0]?.id }); toast('Alle gegevens zijn gewist.'); break;
    case 'skill-sel': ui.skillSel = el.dataset.id; break;
    case 'skill-save': { const d = data.skills[ui.skillSel];
      d.historie.push({ versie:d.versie, instructie:d.instructie, wat:d.wat, vb:d.vb, op:nu() });
      Object.assign(d, { versie:d.versie+1, status:val('s-status'), wat:val('s-wat'), vb:val('s-vb'), kennis:[...document.querySelectorAll('.s-kennis:checked')].map(x => x.value), instructie:document.getElementById('s-instr').value });
      bewaar(); toast(`Versie ${d.versie} staat live.`); break; }
    case 'skill-terug': { const d = data.skills[ui.skillSel]; const h = d.historie[+el.dataset.i];
      d.historie.push({ versie:d.versie, instructie:d.instructie, wat:d.wat, vb:d.vb, op:nu() });
      Object.assign(d, { versie:d.versie+1, instructie:h.instructie, wat:h.wat, vb:h.vb }); bewaar(); toast(`Versie ${h.versie} teruggezet als versie ${d.versie}.`); break; }
    case 'img-weg': data.portaal[el.dataset.key] = null; bewaar(); break;
    case 'portaal-save': data.portaal.welkomKop = val('w-kop') || PORTAAL.welkomKop; data.portaal.contactMail = val('w-mail') || CONTACT_STANDAARD.mail; data.portaal.contactApp = val('w-app');
      data.portaal.quotes = document.getElementById('w-quotes').value.split('\n').map(s => s.trim()).filter(Boolean); bewaar(); toast('Opgeslagen.'); break;

    /* klant */
    case 'login': { const x = data.klanten.find(y => y.email===val('l-email').toLowerCase());
      if (!x) { ui.loginFout = 'Dit e-mailadres kennen we niet. Check het adres of vraag Jasmijn om een uitnodiging.'; break; } inloggen(x, true); return; }
    case 'login-demo': inloggen(klant(el.dataset.id), true); return;
    case 'logout': if (ui.preview) { ui.rol = 'admin'; } ui.sessie = null; ui.preview = false; break;
    case 'cv': if (el.dataset.v === 'werkplek' && k && !toegangOpen(k)) { ui.modal = { type:'verleng' }; render(); return; } ui.cv = el.dataset.v; if (ui.cv==='quiz' && !k.quiz) { ui.quizStap = 0; ui.quizAntw = []; } if (ui.cv==='quiz' && k.quiz) ui.quizStap = 'uitslag';
      window.scrollTo(0,0); render(); setTimeout(checkAanbod, 500); return;
    case 'quiz': ui.quizAntw[ui.quizStap] = el.dataset.v;
      if (ui.quizStap < QUIZ.length-1) { ui.quizStap++; break; }
      { const tel = { A:0, B:0, C:0, D:0 }; ui.quizAntw.forEach(x => tel[x]++); const uitslag = Object.entries(tel).sort((x,y) => y[1]-x[1])[0][0];
        k.quiz = { antwoorden:[...ui.quizAntw], scores:tel, uitslag, op:nu() }; k.profiel.archetype = uitslag; log(k, 'quiz', 'deed de quiz: '+ARCHETYPES[uitslag].naam); bewaar();
        ui.quizStap = 'uitslag'; render(); feestje(); return; }
    case 'quiz-opnieuw': ui.quizStap = 0; ui.quizAntw = []; ui.cv = 'quiz'; ui.opnieuw = true; break;
    case 'quiz-terug': ui.quizStap = Math.max(0, ui.quizStap-1); break;
    case 'intake-verder': case 'intake-terug': case 'intake-later': {
      const vl = vragenlijstVoor(k); const i = Math.min(k.intake.stap, vl.length-1);
      vl[i].vragen.forEach(q => { k.intake.velden[q.id] = q.t==='keuze' ? (document.querySelector(`input[name="in-${q.id}"]:checked`)?.value || '') : q.t==='meerkeuze' ? [...document.querySelectorAll(`input[name="in-${q.id}"]:checked`)].map(x => x.value).join(', ') : val('in-'+q.id);
        if (q.tool === 'platformen') k.platformen = kanalenUit(k.intake.velden[q.id]); });
      if (a==='intake-later') { k.intake.stap = i; bewaar(); ui.cv = 'home'; toast('Opgeslagen. Je kunt later verder waar je was.'); break; }
      if (a==='intake-terug') { k.intake.stap = i-1; bewaar(); break; }
      if (i < vl.length-1) { k.intake.stap = i+1; bewaar(); window.scrollTo(0,0); break; }
      k.intake.klaar = true; k.profiel = profielUitIntake(k); const eerste = Object.keys(k.courses)[0];
      if (k.courses[eerste].status==='dicht') k.courses[eerste].status = 'open';
      if (!ui.preview) log(k, 'intake', 'vulde de vragenlijst in'); bewaar(); ui.cv = 'menu'; render(); feestje();
      toast('Vragenlijst klaar. Je eerste course staat open, en al je tools kennen je nu.'); return; }
    /* vragenlijst beheren */
    case 'vl-deel': data.vragenlijst.push({ id:uid(), titel:'Nieuw deel', intro:'', vragen:[{ id:uid(), l:'Nieuwe vraag', t:'text' }] }); bewaar(); break;
    case 'vl-deel-weg': { const d = data.vragenlijst[+el.dataset.d]; if (data.vragenlijst.length < 2) { toast('De vragenlijst heeft minstens één deel nodig.'); return; }
      if (!confirm(`Deel "${d.titel}" met ${d.vragen.length} vragen verwijderen?`)) return; data.vragenlijst.splice(+el.dataset.d, 1); bewaar(); break; }
    case 'vl-deel-op': { const vl = data.vragenlijst, i = +el.dataset.d; [vl[i-1], vl[i]] = [vl[i], vl[i-1]]; bewaar(); break; }
    case 'vl-vraag': data.vragenlijst[+el.dataset.d].vragen.push({ id:uid(), l:'Nieuwe vraag', t:'text' }); bewaar(); break;
    case 'vl-vraag-weg': { const v = data.vragenlijst[+el.dataset.d].vragen; if (!confirm('Deze vraag verwijderen?')) return; v.splice(+el.dataset.q, 1); bewaar(); break; }
    case 'vl-vraag-op': { const v = data.vragenlijst[+el.dataset.d].vragen, i = +el.dataset.q; [v[i-1], v[i]] = [v[i], v[i-1]]; bewaar(); break; }
    case 'vl-standaard': if (!confirm('De startversie van de vragenlijst terugzetten? Je eigen aanpassingen gaan verloren.')) return;
      data.vragenlijst = JSON.parse(JSON.stringify(STANDAARD_VRAGENLIJST)); bewaar(); toast('Startversie teruggezet.'); break;
    case 'vl-voorbeeld': { const t = data.klanten.find(x => !x.intake.klaar) || data.klanten[0]; ui.rol = 'klant'; inloggen(t, false); ui.cv = 'intake'; render(); return; }
    case 'taal-woorden': ['vakgebied','klantwoord','aanbodwoord'].forEach(f => k.profiel[f] = val('w-'+f)); bewaar(); toast(`Opgeslagen. ${voornaam(k)} ziet haar eigen woorden nu in haar dashboard.`); break;
    case 'taal-genereer': vertaalDashboard(k); return;
    case 'taal-handmatig': k.taal.concept = JSON.parse(JSON.stringify(k.taal.live || taalBasis(k))); ui.taalFout = ''; bewaar(); break;
    case 'taal-live': k.taal.live = k.taal.concept; k.taal.concept = null; k.taal.liveOp = nu(); bewaar(); toast(`Live. ${voornaam(k)} ziet haar dashboard nu in haar eigen taal.`); break;
    case 'taal-weg': if (!confirm('Dit concept weggooien?')) return; k.taal.concept = null; bewaar(); break;
    case 'taal-standaard': if (!confirm(`Terug naar de standaardteksten voor ${voornaam(k)}?`)) return; k.taal.live = null; bewaar(); break;
    case 'geh-save': { const p = k.profiel;
      ['kernbelofte','doelgroep','pijn','resultaat','positionering','toon','nooit'].forEach(f => p[f] = val('f-'+f));
      p.pijlers = document.getElementById('f-pijlers').value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 4);
      k.geheugen.bijgewerkt = nu(); bewaar(); toast('Opgeslagen. Alle tools van ' + voornaam(k) + ' gebruiken dit nu.'); break; }
    case 'stem-add': { const tekst = val('st-tekst'); if (!tekst) { toast('Plak eerst een tekst.'); return; }
      k.geheugen.stem.push({ id:uid(), bron:val('st-bron'), tekst: tekst.slice(0, 1500) }); k.geheugen.bijgewerkt = nu(); bewaar(); toast('Stemvoorbeeld toegevoegd.'); break; }
    case 'stem-weg': k.geheugen.stem = k.geheugen.stem.filter(x => x.id !== el.dataset.id); bewaar(); break;
    case 'geh-voorstel': stelGeheugenVoor(k); return;
    case 'geh-weg': ui.voorstel = null; break;
    case 'geh-overnemen': { const v = ui.voorstel.data; const p = k.profiel;
      ['kernbelofte','doelgroep','pijn','resultaat','positionering','toon','nooit'].forEach(f => { const el2 = document.getElementById('v-'+f); if (el2 && el2.value.trim()) p[f] = el2.value.trim(); });
      const pl = document.getElementById('v-pijlers'); if (pl) p.pijlers = pl.value.split('\n').map(x => x.trim()).filter(Boolean).slice(0, 4);
      Object.keys(v.kern || {}).forEach(c => { const el2 = document.getElementById('vk-'+c); if (el2 && el2.value.trim()) k.geheugen.kern[c] = el2.value.trim(); });
      k.geheugen.bijgewerkt = nu(); ui.voorstel = null; bewaar(); toast('Overgenomen in het merkgeheugen.'); break; }
    case 'profiel-vul': k.profiel = profielUitIntake(k); bewaar(); toast('Persoonlijke laag opnieuw gevuld uit de vragenlijst.'); break;
    case 'course': ui.course = el.dataset.id; ui.cv = 'course'; window.scrollTo(0,0); break;
    case 'dl': { const b = vindBestand(k, el.dataset.id); b.downloads = (b.downloads||0)+1; if (!ui.preview) log(k, 'download', 'downloadde '+b.naam); bewaar();
      toast('In de live versie start nu de download.'); return; }
    case 'doc-dl': { const d = k.documenten.find(x => x.id===el.dataset.id); if (!ui.preview) log(k, 'download', 'downloadde '+d.titel); bewaar(); toast('In de live versie start nu de download.'); return; }
    case 'doc-open': ui.modal = { type:'doc', id:el.dataset.id }; break;
    case 'teken': { if (!document.getElementById('akkoord').checked) { toast('Vink eerst aan dat je het document hebt gelezen.'); return; }
      const d = k.documenten.find(x => x.id===el.dataset.id); Object.assign(d, { status:'getekend', getekendOp:nu() });
      if (!ui.preview) log(k, 'getekend', 'gaf akkoord op '+d.titel); bewaar(); ui.modal = null; toast('Akkoord gegeven. Dank je wel.'); break; }
    case 'skill': ui.modal = toegangOpen(k) || ui.rol === 'admin' ? { type:'skill', id:el.dataset.id } : { type:'verleng' }; break;
    case 'genereer': { const s = toolDef(el.dataset.id); const input = val('s-input');
      if (!input) { toast('Vertel eerst waar je mee aan de slag wilt.'); return; }
      ui.modal.input = input; draaiSkill(k, s, input); return; }
    case 'aanbod-ja': { const x = k.aanbiedingen.find(y => y.id===el.dataset.id); x.status = 'interesse'; if (!ui.preview) log(k, 'aanbod', 'wil meer weten over: '+x.titel); bewaar(); ui.modal = null; toast('Fijn! Jasmijn neemt persoonlijk contact met je op.'); break; }
    case 'aanbod-nee': ui.modal = null; break;
    default: return;
  }
  render();
});

document.addEventListener('keydown', e => {
  if (e.key==='Escape' && ui.modal) { ui.modal = null; render(); }
  if (e.key==='Enter' && e.target.matches('tr[data-a]')) e.target.click();
});

document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (!c) return;
  const k = ui.rol==='admin' ? klant(ui.actief) : klant(ui.sessie);
  if (c==='status') { k.courses[el.dataset.course].status = el.value; if (el.value === 'klaar') k.courses[el.dataset.course].klaarOp = nu(); bewaar(); render(); toast(`${voornaam(k)} ziet de nieuwe status direct.`); }
  if (c==='notitie') { k.courses[el.dataset.course].notitie = el.value.trim(); bewaar(); toast('Notitie opgeslagen.'); }
  if (c==='skill') { const cc = k.courses[el.dataset.course]; cc.skills = el.checked ? [...new Set([...cc.skills, el.value])] : cc.skills.filter(x => x!==el.value); bewaar(); }
  if (c==='kern') { k.geheugen.kern[el.dataset.course] = el.value.trim(); k.geheugen.bijgewerkt = nu(); bewaar(); render(); toast('Kerninhoud bewaard.'); return; }
  if (c==='taal') { const t = k.taal.concept; if (!t) return;
    if (el.dataset.tool) { t.tools[el.dataset.tool] = el.value.trim(); }
    else { const x = t.courses[el.dataset.course] = t.courses[el.dataset.course] || {}; x[el.dataset.f] = el.dataset.f === 'jasmijn' ? el.value.split('\n').map(y => y.trim()).filter(Boolean) : el.value.trim(); }
    bewaar(); return; }
  if (c==='vl') { const d = data.vragenlijst[+el.dataset.d]; const f = el.dataset.f;
    if (el.dataset.q === undefined) d[f] = el.value; else { const q = d.vragen[+el.dataset.q];
      if (f==='opties') q.opties = el.value.split(';').map(x => x.trim()).filter(Boolean);
      else if (f==='tool') { if (el.value) data.vragenlijst.forEach(dd => dd.vragen.forEach(qq => { if (qq!==q && qq.tool===el.value) qq.tool = ''; })); q.tool = el.value; }
      else { q[f] = el.value; if (f==='t' && ['keuze','meerkeuze'].includes(el.value) && !q.opties) q.opties = ['Optie 1','Optie 2']; } }
    bewaar(); if (['t','tool'].includes(f)) render(); return; }
  if (c==='check') { k.checklist[el.dataset.id] = el.checked; bewaar(); render(); }
  if (c==='aanbod-actief') { k.aanbiedingen.find(x => x.id===el.dataset.id).actief = el.checked; bewaar(); }
  if (c==='img') { const f = el.files[0]; const key = el.dataset.key; if (f) leesAfbeelding(f, url => { const im = new Image(); im.onload = () => {
      data.portaal[key] = url; data.portaal.aspect = { ...(data.portaal.aspect || {}), [key]: im.naturalWidth / im.naturalHeight };
      if (data.portaal.uitsnede) delete data.portaal.uitsnede[key]; bewaar(); render(); toast(FOTO_VAKKEN[key] ? 'Geplaatst. Pas eventueel de uitsnede aan.' : 'Afbeelding geplaatst.'); }; im.src = url; }); }
  if (c==='upload') { [...el.files].forEach(f => { k.courses[el.dataset.course].uploads.push({ id:uid(), naam:f.name, op:nu(), grootte:f.size });
      if (!ui.preview) log(k, 'upload', `uploadde ${f.name} bij ${COURSES[el.dataset.course].naam}`); });
    bewaar(); render(); toast('Ontvangen. Jasmijn krijgt een seintje.'); }
});

document.addEventListener('dragover', e => { if (e.target.closest('.drop')) e.preventDefault(); });
document.addEventListener('drop', e => {
  const d = e.target.closest('.drop'); if (!d) return; e.preventDefault();
  const input = d.querySelector('input[type=file]'); const k = klant(ui.sessie);
  [...e.dataTransfer.files].forEach(f => { k.courses[input.dataset.course].uploads.push({ id:uid(), naam:f.name, op:nu(), grootte:f.size });
    if (!ui.preview) log(k, 'upload', `uploadde ${f.name} bij ${COURSES[input.dataset.course].naam}`); });
  bewaar(); render(); toast('Ontvangen. Jasmijn krijgt een seintje.');
});


