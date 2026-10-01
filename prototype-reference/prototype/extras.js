/* =====================================================================
   UITBREIDINGEN — sous-chef (chat), jouw merk, werkplek, samenwerken,
   to-do's, aanvragen en kennisbank
   ===================================================================== */
const md = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/^#{1,3}\s*(.+)$/gm, '<strong>$1</strong>');

/* ---------- KLANT: sous-chef ---------- */
function chatKnop(k) {
  return `<button class="chatfab" data-a="chat-open" aria-label="Open je sous-chef">Vraag je sous-chef</button>
  ${ui.chatOpen ? chatPaneel(k) : ''}`;
}
function chatPaneel(k) {
  const suggesties = ['Waar was ik gebleven?', 'Wat is mijn kernbelofte ook alweer?', 'Schrijf een caption over waar mijn klant nu tegenaan loopt', 'Hoe werkt de werkplek?'];
  return `<aside class="chat" role="dialog" aria-label="Je sous-chef">
    <header>${fotoVak('avatarChat', '', 'chatavatar')}<div style="flex:1"><strong>Je sous-chef</strong><span>Studio Crave, staat klaar voor jou</span></div>
      ${spraakKan().luisteren && spraakKan().spreken ? `<button class="chatgesprek ${ui.gesprek ? 'aan' : ''}" data-a="chat-gesprek" aria-pressed="${!!ui.gesprek}" title="In gesprek: praten en luisteren">${ui.gesprek ? 'Gesprek stoppen' : 'In gesprek'}</button>` : ''}
      <button class="linkbtn" data-a="chat-dicht">Sluiten</button></header>
    ${ui.gesprek ? `<p class="gesprekbalk">${ui.luistert ? 'Ik luister…' : ui.spreekt ? 'Ik praat… tik om te onderbreken' : ui.chatBezig ? 'Even nadenken…' : 'Klaar'}<span>Je hoort nu een voorleesstem van je apparaat. Live kan dit de stem van Jasmijn zijn.</span></p>` : ''}
    <div class="chatlog" id="chatlog">
      ${!k.chat.length ? `<div class="msg ai">Hoi ${esc(voornaam(k))}, welkom bij de sous-chef van Studio Crave. Vraag me alles over je traject, je merk, je documenten of hoe het portaal werkt. Of vraag me iets te schrijven: ik gebruik jouw tools, in jouw taal.</div>` : ''}
      ${k.chat.map((m, i) => `<div class="msg ${m.rol==='user'?'me':'ai'}">${m.rol==='user' ? esc(m.tekst) : md(m.tekst)}${m.rol!=='user' && spraakKan().spreken ? `<button class="voorlees" data-a="chat-voorlees" data-i="${i}" aria-label="Voorlezen">Voorlezen</button>` : ''}</div>`).join('')}
      ${ui.chatBezig ? `<div class="msg ai" id="chat-stream">${ui.chatStream ? md(ui.chatStream) : '<span class="denkt">Even nadenken…</span>'}</div>` : ''}
    </div>
    ${!k.chat.length ? `<div class="chatsug">${suggesties.map(s => `<button data-a="chat-sug" data-v="${esc(s)}">${esc(s)}</button>`).join('')}</div>` : ''}
    <div class="chatin"><textarea id="chat-input" rows="2" placeholder="${ui.luistert ? 'Ik luister, praat maar…' : 'Typ of spreek je vraag in…'}" ${ui.chatBezig ? 'disabled' : ''}></textarea>
      ${spraakKan().luisteren ? `<button class="micknop ${ui.luistert ? 'aan' : ''}" data-a="chat-mic" aria-pressed="${!!ui.luistert}" aria-label="${ui.luistert ? 'Stoppen met inspreken' : 'Inspreken'}" title="Inspreken"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>` : ''}
      <button class="btn" data-a="chat-stuur" ${ui.chatBezig ? 'disabled' : ''}>Stuur</button></div>
    ${(() => { const r = chatRuimte(k); const bijna = r.dag <= 3 || r.maand <= 15; return `<p class="chatteller ${bijna ? 'bijna' : ''}">Nog ${r.dag} vra${r.dag === 1 ? 'ag' : 'gen'} vandaag en ${r.maand} deze maand</p>`; })()}
    <p class="chatnote">Jasmijn kan je gesprekken inzien. Voor vragen is ze altijd bereikbaar via app of <a href="mailto:${esc(contact().mail)}">${esc(contact().mail)}</a>.</p>
  </aside>`;
}
function chatContext(k) {
  const tools = [...new Set([...Object.values(k.courses).filter(c => c.status!=='dicht').flatMap(c => c.skills), ...(merkOpen(k) ? SKILLS.filter(s => s.course==='finale').map(s => s.id) : [])])].filter(sid => data.skills[sid]?.status==='live' && toolZichtbaar(k, sid));
  const traject = Object.entries(k.courses).map(([c, x]) => `- ${COURSES[c].naam}: ${STATUS[x.status]}${x.notitie ? `. Notitie van Jasmijn: ${x.notitie}` : ''}${x.bestanden.length ? `. Bestanden: ${x.bestanden.map(b => b.naam).join(', ')}` : ''}${x.uploads.length ? `. Door klant aangeleverd: ${x.uploads.map(u => u.naam).join(', ')}` : ''}`).join('\n');
  const et = k.werkplek?.energietype;
  return `Je bent de sous-chef in het persoonlijke klantportaal van Studio Crave, het bedrijf van Jasmijn Straver. Jasmijn werkt volgens haar eigen methode, The Branding Kitchen™. Noem het bedrijf altijd Studio Crave, en The Branding Kitchen™ de methode. Je praat met ${k.naam}.

HOE JE PRAAT
- Nederlands, warm en direct, kort waar het kan. Spreek haar aan met "je". Gebruik haar eigen woorden voor haar klanten en haar aanbod.
- Verzin geen feiten over Jasmijn, prijzen, planning of beschikbaarheid die hieronder niet staan. Voor boeken of aanvragen: verwijs naar de pagina Samenwerken. Voor grote strategische keuzes: raad aan het met Jasmijn te bespreken.
- Vraagt ze je iets te schrijven of te maken (caption, hooks, carrousel, mail, aanbod, planning...)? Roep dan eerst gebruik_tool aan met de passende tool en volg die instructie. Stel geen vragen die het merkgeheugen hieronder al beantwoordt.
- Ze kan alleen de tools gebruiken die hieronder staan. Zit iets in een course die nog dicht is, zeg dan dat Jasmijn die vrijgeeft.

KENNISBANK VAN JASMIJN
${data.kennis.map(x => `## ${x.titel}\n${x.tekst}`).join('\n\n')}

DE KLANT
Pakket: ${PAKKETTEN[k.pakket].naam}${PAKKETTEN[k.pakket].zelf ? ' (Be Your Own Chef: ze werkt zelfstandig, Jasmijn maakt geen deliverables tenzij ze iets boekt)' : ''}. Inbegrepen: ${(PAKKETTEN[k.pakket].inbegrepen||[]).join(', ') || 'niets extra'}. Bijgeboekt: ${k.extras.join(', ') || 'niets'}.
Quiz: ${k.quiz ? ARCHETYPES[k.quiz.uitslag].naam : 'nog niet gedaan'}. Vragenlijst: ${k.intake.klaar ? 'ingevuld' : 'nog niet af'}.
Traject:
${traject}
Documenten: ${k.documenten.map(d => `${d.titel} (${d.status==='getekend' ? 'akkoord' : d.status==='te-tekenen' ? 'wacht op haar akkoord' : 'ter info'})`).join(', ') || 'geen'}
To-do's: ${(k.todos||[]).map(t => `${t.klaar ? '[x]' : '[ ]'} ${t.t}`).join('; ') || 'geen'}
Signature Dish (het dessert na de zeven gangen, haar merkpagina met alle stukken): ${merkOpen(k) ? 'open' : 'nog niet open'}${k.merk?.kleuren?.length ? `. Kleuren: ${k.merk.kleuren.map(x => x.naam+' '+x.hex).join(', ')}` : ''}${k.merk?.fonts?.length ? `. Fonts: ${k.merk.fonts.map(x => x.naam+' ('+x.rol+')').join(', ')}` : ''}
Brand shoot (onderdeel van Positioning Cut en Plating): ${k.shoot ? `${k.shoot?.datum ? 'gepland op '+k.shoot.datum : 'nog geen datum'}${k.shoot?.selectie ? ', selectiegalerij staat klaar' : ''}${k.shoot?.selectieKlaar ? ', selectie gemaakt' : ''}${k.shoot?.final ? ', bewerkte foto\'s staan klaar om te downloaden (in Plating en in de Signature Dish)' : ''}` : 'niet afgenomen'}
Kanalen waarop ze actief is: ${(k.platformen||[]).map(d => KENNISDOMEINEN[d].titel).join(', ') || 'nog niet gekozen'}. Schrijf voor die kanalen.
Contact met Jasmijn: altijd bereikbaar via app of mail (${contact().mail}${contact().app ? ', app ' + contact().app : ''}). Noem dit als ze iets persoonlijks of dringends heeft, of als je iets niet weet.
Toegang tot het portaal: ${toegangTot(k) ? datum(toegangTot(k)) : 'doorlopend'} (${toegangStatus(k)}). Daarna verlengen voor ${verlengPrijs(k)}; Signature Dish en documenten blijven altijd van haar.
${k.pakket === 'audit' && k.audit?.status === 'gedeeld' ? `Brand Audit gedeeld: scores ${['01','02','04'].map(c => COURSES[c].naam + ' ' + (k.audit.courses[c]?.score || '?') + '/5').join(', ')}; top 3: ${k.audit.top3.filter(Boolean).join('; ')}; advies: ${k.audit.advies}${k.audit.video ? '; er is een toelichtingsvideo van Jasmijn op haar welkomstscherm' : ''}.\n` : ''}Human Design (als lens, niet als wet): ${hdSamenvatting(k)}
90-dagenplan: ${k.plan90 ? (() => { const r = planReken(k.plan90); return `doel ${euro(k.plan90.doel)} vanaf ${k.plan90.start}; aanbod ${k.plan90.aanbod.map(a => a.naam+' '+euro(a.prijs)+' '+a.aandeel+'%').join(', ')}; nodig: ${r.totKlanten} klanten, ${r.gesprekken} gesprekken, ${r.leads} leads; ${k.plan90.uren} uur per week`; })() : 'nog niet ingevuld'}

MERKGEHEUGEN
${merkContext(k)}

ANTWOORDEN UIT DE VRAGENLIJST
${klantContext(k).vragenlijst.map(x => `- ${x.vraag} ${x.antwoord}`).join('\n') || 'nog geen'}

TOOLS DIE ZE KAN GEBRUIKEN (id: naam, wat)
${tools.map(sid => `${sid}: ${SKILLS.find(s => s.id===sid).naam}, ${data.skills[sid].wat}`).join('\n') || 'nog geen'}${k.werkplek?.hd?.chart || k.werkplek?.energietype ? '\nhuman-design-werkstijl: Human Design Werkstijl, vertaalt haar chart naar werkregels voor schrijven en business (alleen als ze erom vraagt)' : ''}${(k.eigenTools || []).map(t => `\n${t.id}: ${t.naam} (haar eigen tool), ${t.doel.split(/[.\n]/)[0]}`).join('')}`;
}
async function stuurChat(k, tekst) {
  if (ui.rol === 'klant' && !ui.preview) { const r = chatRuimte(k);
    if (!r.maand || !r.dag) { k.chat.push({ rol:'assistant', tekst: !r.maand ? `Je hebt deze maand al je ${r.l.maand} vragen gesteld. Volgende maand kun je weer verder. Voor vragen ben ik altijd bereikbaar: app of mail naar ${contact().mail}.` : `Je hebt vandaag al je ${r.l.dag} vragen gesteld. Morgen staat je sous-chef weer voor je klaar. Voor vragen ben ik altijd bereikbaar: app of mail naar ${contact().mail}.`, op:nu(), limiet:true });
      ui.gesprek = false; bewaar(); render(); scrollChat(); return; } }
  k.chat.push({ rol:'user', tekst, op:nu() }); ui.chatBezig = true; ui.chatStream = ''; render(); scrollChat();
  const sample = await getSample();
  if (!sample) {
    k.chat.push({ rol:'assistant', tekst:'Ik werk in de gepubliceerde versie van het portaal (en straks live via de server). Hier in het voorbeeldvenster kan ik je nog niet antwoorden.', op:nu() });
    ui.chatBezig = false; bewaar(); render(); scrollChat(); return;
  }
  const hist = k.chat.slice(-14).map(m => ({ role:m.rol, content:m.tekst }));
  while (hist.length && hist[0].role !== 'user') hist.shift();
  hist[0] = { role:'user', content: chatContext(k) + '\n\n---\nDe klant vraagt:\n' + hist[0].content };
  const tools = [{ name:'gebruik_tool', description:'Laad de instructies van een van de schrijftools (skills) van de klant, zodat je die kunt volgen. Gebruik dit altijd als ze iets geschreven of gemaakt wil hebben.',
    inputSchema:{ type:'object', properties:{ tool_id:{ type:'string', description:'Het id van de tool, uit de lijst TOOLS' } }, required:['tool_id'] },
    execute: ({ tool_id }) => { const eigen = (k.eigenTools || []).find(t => t.id === tool_id);
      if (eigen) { if (!ui.preview) log(k, 'skill', `gebruikte haar eigen tool ${eigen.naam} via de sous-chef`); return { tool:eigen.naam, instructie:eigenInstructie(eigen, k), actuele_kennis:platformContext(tool_id, k) || 'geen' }; }
      const sd = data.skills[tool_id]; const s = SKILLS.find(x => x.id===tool_id);
      const open = Object.values(k.courses).some(c => c.status!=='dicht' && c.skills.includes(tool_id)) || (SKILLS.find(x => x.id===tool_id)?.course === 'finale' && merkOpen(k)) || (tool_id === 'human-design-werkstijl' && (k.werkplek?.hd?.chart || k.werkplek?.energietype));
      if (tool_id === 'human-design-werkstijl' && open) { if (!ui.preview) log(k, 'skill', 'gebruikte Human Design Werkstijl via de sous-chef'); return { tool:'Human Design Werkstijl', instructie:SKILL_TEKST['human-design-werkstijl'] || '', chart:hdSamenvatting(k) }; }
      if (!sd || !s || sd.status!=='live' || !open) throw new Error('Deze tool is niet beschikbaar voor deze klant.');
      if (!ui.preview) log(k, 'skill', `gebruikte ${s.naam} via de sous-chef`);
      if (!toolZichtbaar(k, tool_id)) throw new Error('Deze tool hoort bij een kanaal dat ze niet gebruikt.');
      return { tool:s.naam, instructie:sd.instructie, actuele_kennis:platformContext(tool_id, k) || 'geen' }; } }];
  try {
    const r = await sample(hist, { modelTier:'default', tools, cache:false, onText: ({ text }) => { ui.chatStream = text; const el = document.getElementById('chat-stream'); if (el) { el.innerHTML = md(text); scrollChat(); } } });
    k.chat.push({ rol:'assistant', tekst:r.text || ui.chatStream, op:nu() });
    if (!ui.preview && !ui.chatGelogd) { log(k, 'chat', 'stelde vragen aan de sous-chef'); ui.chatGelogd = true; }
  } catch (e) {
    k.chat.push({ rol:'assistant', tekst:(e?.text ? e.text + '\n\n' : '') + (e?.code==='rate_limited' ? 'Even te veel vragen achter elkaar. Probeer het zo opnieuw.' : e?.code==='not_granted' ? 'Zonder toestemming kan ik hier niet antwoorden.' : 'Dat lukte even niet. Probeer het opnieuw.'), op:nu() });
  } finally { k.chat = k.chat.slice(-60); ui.chatBezig = false; ui.chatStream = ''; bewaar(); render(); scrollChat(); document.getElementById('chat-input')?.focus();
    if (ui.gesprek) { const laatste = [...k.chat].reverse().find(m => m.rol === 'assistant'); if (laatste) spreek(laatste.tekst, () => { if (ui.gesprek && ui.chatOpen) luister(true); }); } }
}
function scrollChat() { const l = document.getElementById('chatlog'); if (l) l.scrollTop = l.scrollHeight; }

/* ---------- KLANT: Signature Dish (het dessert, met de merkpagina) ---------- */
function kMerk(k) {
  const m = k.merk || {}; const p = k.profiel || {}; const g = k.geheugen || {};
  const stukken = Object.entries(k.courses).flatMap(([c, x]) => x.bestanden.filter(b => b.soort==='opgediend').map(b => ({ ...b, c })));
  const groep = s => (m.bestanden || []).filter(b => b.soort === s);
  const bestand = b => `<div class="file"><div><strong>${esc(b.naam)}</strong><span>${datum(b.op)}${b.grootte ? ' &nbsp;|&nbsp; '+grootte(b.grootte) : ''}</span></div><div class="fileact">${linkKnop(b)}${b.grootte || !b.canva ? `<button class="btn ghost sm" data-a="merk-dl" data-id="${b.id}">Download</button>` : ''}</div></div>`;
  const planTools = SKILLS.filter(s => s.course === 'finale' && data.skills[s.id]?.status === 'live' && toolZichtbaar(k, s.id));
  return `<section class="chead dessertkopbalk"><div class="chead-in dessertgrid"><span class="cn dessertrond">${monoIcoon()}</span><div>${actiefThema()?.logo ? `<img src="${actiefThema().logo}" alt="" class="klantlogo">` : ''}<p class="hello">Dessert</p><h1>Jouw Signature Dish</h1>
    <p style="max-width:40rem">${esc(k.bedrijf || k.naam)}${m.boodschap ? '. ' + esc(m.boodschap) : ''}</p></div>
    ${fotoVak('fotoDessert', 'Jasmijn Straver, lachend met een garde', 'kopfoto')}</div></section>
  <div class="wrap">
    <div class="cgrid" style="margin-bottom:2.5rem">
      <div class="block" style="margin:0"><h2>Wat ik je serveer</h2><ul class="doeslist">${courseTekst(k, 'finale', 'jasmijn').map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="block" style="margin:0"><h2>Wat jij ermee kunt</h2><p>${esc(courseTekst(k, 'finale', 'jij'))}</p></div>
    </div>
    ${plan90Blok(k)}
    <div class="cgrid">
      <div>
        <div class="block"><h2>Waar je merk voor staat</h2><div class="plate"><dl>
          ${[['Belofte',p.kernbelofte],['Voor wie',p.doelgroep],['Wat je niet bent',p.positionering],['Waar je over praat',(p.pijlers||[]).join(', ')]].filter(x => x[1]).map(([l,v]) => `<div class="qa"><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join('') || '<p class="muted small">Wordt gevuld tijdens je traject.</p>'}
        </dl></div></div>
        <div class="block"><h2>Zo klink je</h2>
          ${p.toon ? `<p><strong style="font-weight:600">Wél:</strong> ${esc(p.toon)}${p.nooit ? ` &nbsp;|&nbsp; <strong style="font-weight:600">Nooit:</strong> ${esc(p.nooit)}` : ''}</p>` : ''}
          ${g.kern?.['02'] ? `<p class="muted" style="margin-top:.6rem">${esc(g.kern['02'])}</p>` : ''}
          ${(g.stem||[]).map(x => `<blockquote class="stemq">${esc(x.tekst)}<cite>${esc(x.bron)}</cite></blockquote>`).join('')}
        </div>
        ${(m.kleuren||[]).length ? `<div class="block"><h2>Kleuren</h2><div class="swatches">${m.kleuren.map(x => `<button class="swatch" data-a="kopieer" data-v="${esc(x.hex)}"><span style="background:${/^#[0-9a-f]{3,8}$/i.test(x.hex) ? x.hex : '#ccc'}"></span><strong>${esc(x.naam)}</strong><em>${esc(x.hex)}</em></button>`).join('')}</div><p class="small muted" style="margin-top:.5rem">Tik op een kleur om de code te kopiëren.</p></div>` : ''}
        ${(m.fonts||[]).length ? `<div class="block"><h2>Typografie</h2>${m.fonts.map(x => `<div class="file"><div><strong style="font-size:1.2rem">${esc(x.naam)}</strong><span>${esc(x.rol)}</span></div></div>`).join('')}</div>` : ''}
      </div>
      <div>
        ${k.shoot?.final ? `<div class="block"><h2>Je brand shoot</h2><div class="file"><div><strong>Bewerkte foto's</strong><span>${k.shoot.datum ? datum(k.shoot.datum) : ''}</span></div><div class="fileact"><a class="btn sm" href="${esc(k.shoot.final)}" target="_blank" rel="noopener" data-a="pix-open" data-v="final">Downloaden${isPixieset(k.shoot.final) ? ' in Pixieset' : ''}</a></div></div></div>` : ''}
        ${groep('logo').length ? `<div class="block"><h2>Logo's</h2>${groep('logo').map(bestand).join('')}</div>` : ''}
        ${groep('beeld').length ? `<div class="block"><h2>Beelden</h2>${groep('beeld').map(bestand).join('')}</div>` : ''}
        ${(m.templates||[]).length ? `<div class="block"><h2>Templates</h2>${m.templates.map(t => `<div class="file"><div><strong>${esc(t.naam)}</strong></div>${t.url ? `<a class="btn sm" href="${esc(t.url)}" target="_blank" rel="noopener" data-a="canva-open" data-id="tpl:${esc(t.naam)}">${linkLabel(t.url)}</a>` : ''}</div>`).join('')}</div>` : ''}
        ${groep('overig').length ? `<div class="block"><h2>Merkboek & overig</h2>${groep('overig').map(bestand).join('')}</div>` : ''}
        <div class="block"><h2>Alle stukken uit je menu</h2>${stukken.map(b => `<div class="file"><div><strong>${esc(b.naam)}</strong><span>${COURSES[b.c].naam}</span></div><div class="fileact">${linkKnop(b)}${b.grootte || !b.canva ? `<button class="btn ghost sm" data-a="dl" data-id="${b.id}">Download</button>` : ''}</div></div>`).join('') || '<p class="muted small">Nog niets opgediend.</p>'}</div>
        ${planTools.length ? `<div class="block"><h2 style="font-size:1.4rem">Planningstools</h2><div class="tools">${planTools.map(s => `<button class="tool" data-a="skill" data-id="${s.id}">${laatsteUpdate(k, s.id) ? `<span class="vers">Wekelijks bijgewerkt</span>` : ''}<strong>${esc(s.naam)}</strong><span>${esc(data.skills[s.id].wat)}</span></button>`).join('')}</div></div>` : ''}
        <div class="block"><h2>Verder bouwen</h2><p class="small muted" style="margin-bottom:.8rem">Je tools en je sous-chef blijven beschikbaar. Ze kennen je merk.</p><p class="usp" style="margin-bottom:1rem"><span class="vers">Wekelijks bijgewerkt</span>${USP_WEKELIJKS}</p>
          <div class="actions"><button class="btn" data-a="chat-sug" data-v="Wat kan ik deze maand het beste doen met mijn merk?">Vraag je sous-chef</button><button class="btn ghost" data-a="cv" data-v="samen">Samenwerken met Studio Crave</button></div></div>
      </div>
    </div></div>`;
}

/* ---------- KLANT: werkplek ---------- */
function kWerkplek(k) {
  const w = k.werkplek; const et = ENERGIETYPES[w.energietype]; const f = ui.focus;
  const rest = f ? (f.pauze ?? Math.max(0, Math.round((f.eind - Date.now())/1000))) : 0;
  const mmss = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const openC = Object.entries(k.courses).filter(([, c]) => c.status!=='dicht');
  return `<div class="wrap">
    <div class="paginakop"><div><p class="hello">Studio Crave</p><h1 style="font-size:clamp(2.4rem,6vw,3.6rem);font-weight:500">Jouw workflow</h1>
    <p class="muted" style="margin:.3rem 0 0">Hoe jij werkt, op jouw manier: focus, ritme, ideeën en energie. Zet je telefoon weg, kies één ding, en ga.</p></div>
    ${fotoVak('fotoWerkplek', 'Jasmijn Straver met een rode peper', 'kopfoto')}</div>
    <div class="cgrid">
      <div class="focuskaart">
        <h2>Focusblok</h2>
        ${f ? `${f.tip ? `<div class="cheftip"><span class="kicker">Chef's tip</span><p>${esc(f.tip)}</p></div>` : `<p class="small" style="color:var(--gold)">${esc(f.taak || (f.duur === 1 ? 'Even inchecken bij jezelf' : 'Werken aan je merk'))}</p>`}
          <div class="klok" id="focus-tijd" aria-live="polite">${mmss(rest)}</div>
          <div class="actions" style="justify-content:center">${f.pauze != null ? '<button class="btn gold" data-a="focus-verder">Verder</button>' : '<button class="btn gold" data-a="focus-pauze">Pauze</button>'}<button class="btn ghost" data-a="focus-stop" style="color:var(--creme);border-color:rgba(245,240,235,.3)">Stoppen</button></div>`
        : `<div class="stack">
          <label class="field">Waar werk je aan?<input id="fb-taak" placeholder="Bijv. mijn origin story afmaken"></label>
          <label class="field">Bij<select id="fb-course"><option value="">Algemeen</option>${openC.map(([c]) => `<option value="${c}">${COURSES[c].naam}</option>`).join('')}</select></label>
          <div class="keuze" role="radiogroup" aria-label="Duur">${[[1,'1 min chef\'s tip'],[25,'25 min'],[50,'50 min'],[90,'90 min'],['zelf','Zelf']].map(([m,l]) => `<label><input type="radio" name="fb-duur" value="${m}" ${m===25?'checked':''} data-c="fb-duur"><span>${l}</span></label>`).join('')}</div>
          <label class="field fbzelf" ${ui.fbZelf ? '' : 'hidden'}>Aantal minuten<input type="number" id="fb-min" min="1" max="180" value="${ui.fbMin || 40}" inputmode="numeric"></label>
          <label class="check small" style="justify-content:center;color:rgba(245,240,235,.8)"><input type="checkbox" id="fb-tip" ${ui.fbTip !== false ? 'checked' : ''}> Halverwege 1 minuut chef's tip: even inchecken bij jezelf</label>
          <button class="btn gold big" data-a="focus-start">Start focusblok</button></div>`}
        <p class="small" style="margin-top:1.5rem;color:rgba(245,240,235,.65)">${w.focus} focusblok${w.focus===1?'':'ken'} afgerond, samen ${Math.round(w.minuten/60*10)/10} uur. Aan het eind hoor je een zacht signaal.</p>
      </div>
      <div>
        ${hdKort(k)}
      </div>
    </div>
    ${workflowBlok(k)}
    ${eigenToolsBlok(k)}
    ${hdDetail(k)}</div>`;
}
let focusTimer = null;
function tikFocus() {
  clearInterval(focusTimer);
  focusTimer = setInterval(() => {
    const f = ui.focus; if (!f || f.pauze != null) return;
    const rest = Math.max(0, Math.round((f.eind - Date.now())/1000));
    // Halverwege: 1 minuut chef's tip
    if (f.tipOp && Date.now() >= f.tipOp && !f.tip) { f.tip = chefsTip(klant(ui.sessie)); f.tipTot = Date.now() + 60000; f.tipOp = null; zachtSignaal(); if (ui.cv==='werkplek') render(); }
    if (f.tipTot && Date.now() >= f.tipTot) { f.tip = ''; f.tipTot = null; if (ui.cv==='werkplek') render(); }
    const el = document.getElementById('focus-tijd'); if (el) el.textContent = `${String(Math.floor(rest/60)).padStart(2,'0')}:${String(rest%60).padStart(2,'0')}`;
    document.title = `${Math.ceil(rest/60)} min — focus`;
    if (rest <= 0) { clearInterval(focusTimer); document.title = 'Studio Crave — Klantportaal';
      const k = klant(ui.sessie); if (k) { k.werkplek.focus++; k.werkplek.minuten += f.duur; bewaar(); }
      const was = f.duur; ui.focus = null; alarm(); if (ui.cv==='werkplek') render(); if (was > 1) { feestje(); toast('Focusblok klaar. Sta even op, drink wat water.'); } else toast('Ingecheckt. Door met frisse aandacht.'); }
  }, 1000);
}
function zachtSignaal() {
  try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 880;
    g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(.15, ctx.currentTime+.03); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+1.4);
    o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime+1.5); } catch (e) {}
}
function alarm() {
  try { const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, .35, .7].forEach((t, i) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = [660, 880, 1320][i];
      g.gain.setValueAtTime(0, ctx.currentTime+t); g.gain.linearRampToValueAtTime(.25, ctx.currentTime+t+.03); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+t+1.2);
      o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+1.3); });
  } catch (e) {}
}

/* ---------- KLANT: samenwerken ---------- */
function kSamen(k) {
  const mijn = data.aanvragen.filter(a => a.klant===k.id);
  return `<div class="wrap">
    <p class="hello">Studio Crave</p><h1 style="font-size:clamp(2.4rem,6vw,3.6rem);font-weight:500">Samenwerken met Jasmijn</h1>
    <div class="samenkop">${fotoVak('fotoSamen', 'Jasmijn Straver in de keuken', 'samenfoto')}<div>
    <p class="muted" style="margin:.3rem 0 1rem;max-width:40rem">Wil je dat ik iets voor je maak, of samen verder aan tafel? Vraag het hier aan. Ik neem persoonlijk contact met je op.</p>
    ${contactRegel(false)}
    <p class="quote" style="color:var(--ink);border-color:var(--gold)">We koken samen aan je business.<cite style="color:var(--burgundy)">Jasmijn Straver, Studio Crave</cite></p></div></div>
    <h2 class="h2" style="margin-top:2rem">Wat je al hebt</h2>
    <div class="alheb">${alHebKaarten(k)}</div>
    <h2 class="h2" style="margin-top:2.5rem">Meer uit je merk halen</h2>
    <p class="muted small" style="margin:-.3rem 0 1rem">Klik op "Wat zit erin" voor alle details.</p>
    <div class="tools">${BOEKEN.map(boekItem).filter(b => b.toon(k) && !b.verborgen && !heeftAanbod(k, b)).map(b => aanbodKaart(b, k)).join('')}</div>
    ${mijn.length ? `<h2 class="h2" style="margin-top:2.5rem">Jouw aanvragen</h2>${mijn.map(a => `<div class="file"><div><strong>${esc(a.titel)}</strong><span>${datum(a.op)}${a.periode ? ' &nbsp;|&nbsp; '+esc(a.periode) : ''}</span></div><span class="pill ${a.status==='afgerond'?'klaar':a.status==='behandeling'?'bezig':'open'}">${AANVRAAG_STATUS[a.status]}</span></div>`).join('')}` : ''}
  </div>`;
}

/* ---------- KLANT: to-do's (op het welkomstscherm) ---------- */
function kTodos(k) {
  if (!(k.todos||[]).length) return '';
  const af = k.todos.filter(t => t.klaar).length;
  return `<div class="block" style="margin-top:2.5rem"><h2 class="h2">Jouw to-do's <span class="small muted" style="font-family:var(--body);font-weight:400">${af} van ${k.todos.length}</span></h2>
    <div class="todos">${k.todos.map(t => `<label class="checkitem ${t.klaar?'done':''}"><input type="checkbox" data-c="todo" data-id="${t.id}" ${t.klaar?'checked':''}><span>${esc(t.t)}${t.c ? ` <button class="linkbtn small" data-a="course" data-id="${t.c}">${COURSES[t.c].naam}</button>` : ''}</span></label>`).join('')}</div></div>`;
}

/* ---------- ADMIN: aanvragen & kennisbank ---------- */
function aanvragenBeheer() {
  return `<div class="pagehead"><div><h1>Aanvragen</h1><p>Boekingen en aanvragen voor trajecten, shoots en design-opdrachten, vanuit de portalen van je klanten.</p></div></div>
  <div class="panel"><div class="rows">${data.aanvragen.map(a => { const k = klant(a.klant); return `<div class="row"><div class="t"><strong>${esc(a.titel)} — ${esc(k?.naam || 'onbekend')}</strong><span>${datum(a.op)}${a.periode ? ' &nbsp;|&nbsp; '+esc(a.periode) : ''}${a.toelichting ? '<br>'+esc(a.toelichting) : ''}</span></div>
    <select data-c="aanvraag" data-id="${a.id}" aria-label="Status">${Object.entries(AANVRAAG_STATUS).map(([v,l]) => `<option value="${v}" ${a.status===v?'selected':''}>${l}</option>`).join('')}</select>
    ${k ? `<button class="btn ghost sm" data-a="kies" data-id="${k.id}">Naar ${esc(voornaam(k))}</button>` : ''}</div>`; }).join('') || '<p class="muted">Nog geen aanvragen.</p>'}</div></div>
  <p class="hint">Prijzen en omschrijvingen van wat klanten kunnen boeken pas je aan in de configuratie (BOEKEN). De prijs van Be Your Own Chef staat nog op "prijs in te vullen". Extra's gaan in overleg.</p>`;
}
function kennisBeheer() {
  return `<div class="pagehead"><div><h1>Kennisbank</h1><p>Jouw brein voor de sous-chef: hoe Studio Crave werkt, wat je maakt, je methode The Branding Kitchen™ en hoe het portaal werkt. De chat van élke klant put hieruit.</p></div>
    <div class="actions"><button class="btn" data-a="kennis-add">Onderwerp toevoegen</button></div></div>
  <div class="split"><div>${data.kennis.map(x => `<div class="panel"><div class="stack">
      <label class="field">Onderwerp<input data-c="kennis" data-id="${x.id}" data-f="titel" value="${esc(x.titel)}"></label>
      <label class="field">Wat de sous-chef hierover weet<textarea data-c="kennis" data-id="${x.id}" data-f="tekst" style="min-height:8rem">${esc(x.tekst)}</textarea></label>
      <div><button class="btn ghost sm" data-a="kennis-weg" data-id="${x.id}">Verwijderen</button></div></div></div>`).join('')}</div>
    <div class="panel" style="position:sticky;top:1rem"><h2>Wat de sous-chef nog meer weet</h2>
      <p class="small muted">Per klant ook: haar traject en jouw notities, bestanden, documenten, to-do's, quiz, vragenlijst, merkgeheugen, de pagina Jouw merk en haar energietype. En hij kan al haar vrijgegeven tools gebruiken.</p>
      <p class="small muted" style="margin-top:.7rem">Schrijf hier wat klanten vaak vragen. Wat niet in de kennisbank staat, verzint hij niet: hij verwijst dan naar jou of naar de pagina Samenwerken.</p></div></div>`;
}

/* ---------- ADMIN: tabs per klant ---------- */
function tabTodos(k) {
  const open = Object.keys(k.courses);
  return `<div class="split"><div class="panel"><h2>To-do's van ${esc(voornaam(k))}</h2>
    <div class="todos">${(k.todos||[]).map(t => `<div class="checkitem ${t.klaar?'done':''}" style="justify-content:space-between"><label style="display:flex;gap:.6rem;cursor:pointer"><input type="checkbox" data-c="todo" data-id="${t.id}" ${t.klaar?'checked':''}><span>${esc(t.t)}${t.c ? ` <span class="chip">${COURSES[t.c].naam}</span>` : ''}</span></label><button class="linkbtn small" data-a="todo-weg" data-id="${t.id}">Verwijderen</button></div>`).join('') || '<p class="muted small">Nog geen to-do\'s.</p>'}</div>
    <div class="stack" style="margin-top:1.2rem">
      <label class="field">Nieuwe to-do<input id="td-t" placeholder="Bijv. neem drie voice memo's op"></label>
      <label class="field">Bij course (optioneel)<select id="td-c"><option value="">Geen</option>${open.map(c => `<option value="${c}">${COURSES[c].naam}</option>`).join('')}</select></label>
      <div class="actions"><button class="btn" data-a="todo-add">Toevoegen</button><button class="btn ghost" data-a="todo-standaard">Standaard to-do's toevoegen</button></div></div></div>
  <div class="panel"><h2>Hoe dit werkt</h2><p class="small muted">${esc(voornaam(k))} ziet haar to-do's op haar welkomstscherm en vinkt ze zelf af. Jij krijgt daar een melding van. Zeker bij zelfstudie geeft dit richting: een persoonlijk pad door het menu.</p></div></div>`;
}
function tabMerk(k) {
  const m = k.merk; const vn = esc(voornaam(k));
  return `<div class="split"><div>
    <h2 class="section-t">Haar portaal in haar stijl</h2>${stijlEditor(k, true)}
    <h2 class="section-t" style="margin-top:2rem">Signature Dish: inhoud</h2>
    <div class="panel"><h2>Signature Dish (dessert)</h2>
      <label class="check"><input type="checkbox" data-c="merk-open" ${m.open?'checked':''}> Nu al open voor ${vn} <span class="muted small">(gaat vanzelf open als alle gangen zijn geserveerd)</span></label>
      <p class="small" style="margin-top:.6rem">Status: ${merkOpen(k) ? '<span class="pill klaar">Open</span>' : '<span class="pill dicht">Nog dicht</span>'}</p>
      <label class="field" style="margin-top:1rem">Persoonlijke boodschap bovenaan<textarea id="mk-boodschap">${esc(m.boodschap)}</textarea></label>
      <div class="grid2" style="margin-top:.8rem">
        <label class="field">Kleuren (één per regel: naam #hex)<textarea id="mk-kleuren">${esc((m.kleuren||[]).map(x => x.naam+' '+x.hex).join('\n'))}</textarea></label>
        <label class="field">Fonts (één per regel: naam | rol)<textarea id="mk-fonts">${esc((m.fonts||[]).map(x => x.naam+' | '+x.rol).join('\n'))}</textarea></label></div>
      <label class="field" style="margin-top:.8rem">Templates (één per regel: naam | link)<textarea id="mk-templates">${esc((m.templates||[]).map(x => x.naam+' | '+x.url).join('\n'))}</textarea></label>
      <div style="margin-top:1rem"><button class="btn" data-a="merk-save">Opslaan</button></div></div>
    <div class="panel"><h2>Logo's, beelden en merkboek</h2>
      <div class="rows">${(m.bestanden||[]).map(b => `<div class="row"><div class="t"><strong>${esc(b.naam)}</strong><span>${{logo:'Logo',beeld:'Beeld',overig:'Merkboek of overig'}[b.soort]} &nbsp;|&nbsp; ${datum(b.op)}${b.canva ? ' &nbsp;|&nbsp; link: ' + linkLabel(b.canva).toLowerCase() : ''}</span>
      <input class="canvain" type="url" data-c="canva" data-scope="merk" data-id="${b.id}" value="${esc(b.canva)}" placeholder="Link (optioneel): Canva, Loom, Google Docs" aria-label="Link voor ${esc(b.naam)}"></div><button class="btn ghost sm" data-a="merk-weg" data-id="${b.id}">Verwijderen</button></div>`).join('') || '<p class="muted small">Nog niets geplaatst.</p>'}</div>
      <div class="stack" style="margin-top:1rem"><label class="field">Bestand (optioneel als je een link plaatst)<input type="file" id="mk-file" multiple></label>
        <label class="field">Naam (bij alleen een link)<input id="mk-naam" placeholder="Bijv. Logo in Canva"></label>
        <label class="field">Link (optioneel): Canva, Loom, Google Docs, Pinterest<input id="mk-canva" type="url" placeholder="https://..."></label>
        <label class="field">Soort<select id="mk-soort"><option value="logo">Logo</option><option value="beeld">Beeld</option><option value="overig">Merkboek of overig</option></select></label>
        <div><button class="btn ghost" data-a="merk-add">Plaatsen</button></div></div></div>
  </div>
  <div class="panel" style="position:sticky;top:1rem"><h2>Wat ${vn} in haar dessert ziet</h2>
    <p class="small muted">Haar belofte, doelgroep en pijlers, haar toon met stemvoorbeelden (uit het merkgeheugen), kleuren om te kopiëren, fonts, logo's, beelden, templates en alle stukken uit haar menu. Plus haar tools en de sous-chef, zodat ze na het traject zelfstandig verder bouwt.</p>
    <div class="actions" style="margin-top:1rem"><button class="btn sm" data-a="preview-merk" data-id="${k.id}">Bekijk als ${vn}</button></div></div></div>`;
}
function tabChat(k) {
  return `<div class="panel"><h2>Gesprekken met de sous-chef</h2><p class="small muted" style="margin-bottom:1rem">Zo zie je waar ${esc(voornaam(k))} mee worstelt en wat ze vraagt. Haar klantportaal vermeldt dat jij kunt meelezen.</p>
    <div class="chatlog" style="max-height:none">${k.chat.map(m => `<div class="msg ${m.rol==='user'?'me':'ai'}">${m.rol==='user' ? esc(m.tekst) : md(m.tekst)}</div>`).join('') || '<p class="muted small">Nog geen gesprekken.</p>'}</div></div>`;
}

/* ---------- ACTIES ---------- */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const a = el.dataset.a; const k = ui.rol==='admin' ? klant(ui.actief) : klant(ui.sessie);
  switch (a) {
    case 'canva-open': { if (ui.rol !== 'klant' || ui.preview) return; const id = el.dataset.id;
      const b = id.startsWith('tpl:') ? { naam:id.slice(4) } : (vindBestand(k, id) || k.merk.bestanden.find(x => x.id===id));
      if (b) { log(k, 'canva', 'opende ' + b.naam + (b.canva ? ' (' + linkLabel(b.canva).toLowerCase() + ')' : '')); bewaar(); } return; }
    case 'pix-open': { if (ui.rol !== 'klant' || ui.preview) return; log(k, 'shoot', el.dataset.v === 'final' ? 'opende haar bewerkte foto\'s in Pixieset' : 'opende haar selectiegalerij in Pixieset'); bewaar(); return; }
    case 'selectie-klaar': { const sh = k.shoot; sh.selectieKlaar = true; sh.selectieOp = nu();
      if (!ui.preview) log(k, 'shoot', 'heeft haar fotoselectie gemaakt'); bewaar(); render(); feestje(); toast('Dank je wel! Ik ga aan de slag met je foto\'s.'); return; }
    case 'selectie-reset': { const sh = k.shoot; sh.selectieKlaar = false; sh.selectieOp = null; bewaar(); render(); toast('Selectie heropend. Ze kan opnieuw kiezen.'); return; }
    case 'shoot-save': { const sh = k.shoot = k.shoot || nieuweShoot(); const heeft = id => !!document.getElementById(id);
      const links = { selectie: val('sh-selectie'), final: val('sh-final') };
      for (const [f, u] of Object.entries(links)) { if (u && !schoneUrl(u)) { toast('Die link klopt niet. Plak de volledige Pixieset-link, beginnend met https://'); return; } }
      const nieuwFinal = heeft('sh-final') && !sh.final && links.final;
      if (heeft('sh-datum')) Object.assign(sh, { datum:val('sh-datum'), locatie:val('sh-locatie'), notitie:val('sh-notitie'), shotlistKlaar:document.getElementById('sh-shotlist').checked });
      if (heeft('sh-selectie')) Object.assign(sh, { deadline:val('sh-deadline'), selectie:schoneUrl(links.selectie), final:schoneUrl(links.final) });
      if (nieuwFinal) sh.finalOp = nu();
      bewaar(); render(); toast(nieuwFinal ? 'Opgeslagen. Ze kan haar bewerkte foto\'s nu downloaden.' : 'Shoot opgeslagen. Staat direct in haar portaal.'); return; }
    case 'tekst-acc': ui.openTekst = ui.openTekst === el.dataset.id ? null : el.dataset.id; render(); return;
    case 'tekst-reset': if (!confirm('Terug naar de startversie van deze course?')) return; delete data.courseTeksten[el.dataset.id]; bewaar(); render(); toast('Startversie teruggezet.'); return;
    case 'pk-save': { const x = data.platform[el.dataset.id]; x.tekst = document.getElementById('pk-tekst-'+el.dataset.id).value.trim();
      x.bronnen = document.getElementById('pk-bronnen-'+el.dataset.id).value.split('\n').map(r => r.trim()).filter(Boolean);
      x.bijgewerkt = new Date().toISOString().slice(0,10); bewaar(); render(); toast(x.titel + ': bijgewerkt. Alle tools gebruiken dit vanaf nu.'); return; }
    case 'naar-start': e.preventDefault(); ui.meerOpen = false; ui.navOpen = false; ui.chatOpen = false; if (ui.rol === 'admin') { ui.av = 'overzicht'; } else { ui.cv = 'home'; } window.scrollTo(0, 0); render(); return;
    case 'verleng': ui.modal = { type:'verleng' }; render(); return;
    case 'verleng-ja': data.aanvragen.unshift({ id:uid(), klant:k.id, soort:'verlenging', titel:'Verlenging toegang ('+verlengPrijs(k)+')', toelichting:'', periode:'Per direct', op:nu(), status:'nieuw' });
      if (!ui.preview) log(k, 'aanvraag', 'wil haar toegang verlengen'); bewaar(); ui.modal = null; render(); toast('Fijn! In de live versie rond je hier direct af met iDEAL. Jasmijn zet je verlenging aan.'); return;
    case 'stijl-later': k.stijlGezien = true; bewaar(); render(); return;
    case 'aanbod-acc': ui.openAanbod = ui.openAanbod === el.dataset.id ? null : el.dataset.id; render(); return;
    case 'meer-open': ui.meerOpen = true; render(); return;
    case 'meer-dicht': if (e.target !== el) return; ui.meerOpen = false; render(); return;
    case 'nav-toggle': ui.navOpen = !ui.navOpen; render(); return;
    case 'nav-dicht': if (e.target !== el) return; ui.navOpen = false; render(); return;
    case 'chat-open': if (ui.rol === 'klant' && !toegangOpen(k)) { ui.modal = { type:'verleng' }; render(); return; } ui.chatOpen = true; render(); scrollChat(); document.getElementById('chat-input')?.focus(); return;
    case 'chat-dicht': ui.chatOpen = false; render(); return;
    case 'chat-sug': ui.chatOpen = true; if (!ui.chatBezig) stuurChat(k, el.dataset.v); else render(); return;
    case 'chat-stuur': { const t = val('chat-input'); if (!t || ui.chatBezig) return; stuurChat(k, t); return; }
    case 'kopieer': navigator.clipboard?.writeText(el.dataset.v).then(() => toast(el.dataset.v + ' gekopieerd.'), () => toast(el.dataset.v)); return;
    case 'merk-dl': { const b = k.merk.bestanden.find(x => x.id===el.dataset.id); if (!ui.preview) log(k, 'download', 'downloadde '+b.naam); bewaar(); toast('In de live versie start nu de download.'); return; }
    case 'focus-start': { const keuze = document.querySelector('input[name="fb-duur"]:checked')?.value || '25';
      const duur = keuze === 'zelf' ? Math.min(180, Math.max(1, Math.round(+val('fb-min') || 0))) : +keuze;
      if (!duur) { toast('Vul het aantal minuten in.'); return; }
      ui.fbMin = keuze === 'zelf' ? duur : ui.fbMin; ui.fbTip = document.getElementById('fb-tip').checked;
      ui.focus = { duur, eind: Date.now() + duur*60000, taak: val('fb-taak'), course: val('fb-course'),
        tip: duur === 1 ? chefsTip(k) : '', tipOp: duur >= 10 && ui.fbTip ? Date.now() + duur*30000 : null };
      render(); tikFocus(); return; }
    case 'focus-pauze': ui.focus.pauze = Math.max(0, Math.round((ui.focus.eind - Date.now())/1000)); render(); return;
    case 'focus-verder': ui.focus.eind = Date.now() + ui.focus.pauze*1000; delete ui.focus.pauze; render(); tikFocus(); return;
    case 'focus-stop': ui.focus = null; clearInterval(focusTimer); document.title = 'Studio Crave — Klantportaal'; render(); return;
    case 'aanvraag-open': ui.modal = { type:'aanvraag', id:el.dataset.v }; render(); return;
    case 'aanvraag-stuur': { const b = boekItem(BOEKEN.find(x => x.id===ui.modal.id));
      const gang = document.getElementById('aq-gang')?.value; data.aanvragen.unshift({ id:uid(), klant:k.id, soort:b.id, titel:b.titel + (gang ? ': ' + COURSES[gang].naam : ''), toelichting:val('aq-tekst'), periode:val('aq-periode'), op:nu(), status:'nieuw' });
      if (!ui.preview) log(k, 'aanvraag', (b.id==='dwy'||b.id==='audit' ? 'wil boeken: ' : 'vroeg aan: ') + b.titel); bewaar(); ui.modal = null; render(); toast('Verstuurd. Jasmijn neemt persoonlijk contact met je op.'); return; }
    case 'course-klaar': k.courses[el.dataset.id].status = 'klaar'; if (!ui.preview) log(k, 'course', 'rondde '+COURSES[el.dataset.id].naam+' af'); bewaar(); render(); feestje(); toast('Afgerond. Door naar de volgende gang.'); return;
    case 'preview-merk': ui.rol = 'klant'; inloggen(klant(el.dataset.id), false); ui.cv = 'merk'; render(); return;
    case 'todo-add': { const t = val('td-t'); if (!t) { toast('Typ eerst een to-do.'); return; } k.todos.push({ id:uid(), t, c:val('td-c'), klaar:false }); bewaar(); render(); return; }
    case 'todo-weg': k.todos = k.todos.filter(x => x.id!==el.dataset.id); bewaar(); render(); return;
    case 'todo-standaard': ZELF_TODOS.filter(x => !k.todos.some(y => y.t===x.t) && (!x.c || k.courses[x.c])).forEach(x => k.todos.push({ id:uid(), t:x.t, c:x.c, klaar:false })); bewaar(); render(); toast('Standaard to-do\'s toegevoegd.'); return;
    case 'merk-save': {
      k.merk.boodschap = val('mk-boodschap');
      k.merk.kleuren = document.getElementById('mk-kleuren').value.split('\n').map(r => r.trim()).filter(Boolean).map(r => { const m = r.match(/(#[0-9a-f]{3,8})\s*$/i); return { naam: m ? r.slice(0, m.index).trim() || m[1] : r, hex: m ? m[1] : '' }; });
      k.merk.fonts = document.getElementById('mk-fonts').value.split('\n').map(r => r.trim()).filter(Boolean).map(r => { const [n, rol=''] = r.split('|').map(x => x.trim()); return { naam:n, rol }; });
      k.merk.templates = document.getElementById('mk-templates').value.split('\n').map(r => r.trim()).filter(Boolean).map(r => { const [n, url=''] = r.split('|').map(x => x.trim()); return { naam:n, url }; });
      bewaar(); render(); toast('Opgeslagen. Staat direct in haar Signature Dish.'); return; }
    case 'merk-add': { const fs = [...document.getElementById('mk-file').files]; const ruw = val('mk-canva'); const canva = schoneUrl(ruw);
      if (ruw && !canva) { toast('Die link klopt niet. Plak de volledige link, beginnend met https://'); return; }
      if (!fs.length && !canva) { toast('Kies een bestand of plak een link.'); return; }
      if (fs.length) fs.forEach(f => k.merk.bestanden.push({ id:uid(), naam:f.name, soort:val('mk-soort'), op:nu(), grootte:f.size, canva }));
      else k.merk.bestanden.push({ id:uid(), naam: val('mk-naam') || 'Ontwerp in Canva', soort:val('mk-soort'), op:nu(), grootte:0, canva });
      bewaar(); render(); toast('Geplaatst. Staat direct in haar Signature Dish.'); return; }
    case 'merk-weg': k.merk.bestanden = k.merk.bestanden.filter(x => x.id!==el.dataset.id); bewaar(); render(); return;
    case 'kennis-add': data.kennis.push({ id:uid(), titel:'Nieuw onderwerp', tekst:'' }); bewaar(); render(); return;
    case 'kennis-weg': if (!confirm('Dit onderwerp verwijderen?')) return; data.kennis = data.kennis.filter(x => x.id!==el.dataset.id); bewaar(); render(); return;
  }
});
// Mobiel: menu's sluiten na navigeren
document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (!el) return;
  if (['cv','course','logout'].includes(el.dataset.a) && ui.meerOpen) { ui.meerOpen = false; render(); }
  if (['av','kies','nieuw','preview'].includes(el.dataset.a) && ui.navOpen) { ui.navOpen = false; render(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && (ui.meerOpen || ui.navOpen || ui.chatOpen)) { ui.meerOpen = ui.navOpen = ui.chatOpen = false; render(); }
  if (e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.querySelector('[data-a="chat-stuur"]')?.click(); }
});
document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (!c) return;
  const k = ui.rol==='admin' ? klant(ui.actief) : klant(ui.sessie);
  if (c==='todo') { const t = k.todos.find(x => x.id===el.dataset.id); t.klaar = el.checked; if (ui.rol==='klant' && el.checked && !ui.preview) log(k, 'todo', 'vinkte af: '+t.t); bewaar(); render(); if (ui.rol==='klant' && el.checked && k.todos.every(x => x.klaar)) feestje(); }
  if (c==='fb-duur') { ui.fbZelf = el.value === 'zelf'; const z = document.querySelector('.fbzelf'); if (z) z.hidden = !ui.fbZelf; if (ui.fbZelf) document.getElementById('fb-min')?.focus(); return; }
  if (c==='werkplek') { k.werkplek[el.dataset.f] = el.value; k.werkplek.hdToon = hdToon(k); bewaar(); render(); }
  if (c==='merk-open') { k.merk.open = el.checked; bewaar(); render(); }
  if (c==='aanvraag') { data.aanvragen.find(x => x.id===el.dataset.id).status = el.value; bewaar(); toast('Status bijgewerkt. Je klant ziet het in haar portaal.'); }
  if (c==='canva') { const u = schoneUrl(el.value); if (el.value.trim() && !u) { toast('Die link klopt niet. Plak de volledige link, beginnend met https://'); return; }
    const b = el.dataset.scope==='merk' ? k.merk.bestanden.find(x => x.id===el.dataset.id) : k.courses[el.dataset.course].bestanden.find(x => x.id===el.dataset.id);
    b.canva = u; bewaar(); toast(u ? 'Link bewaard. Ze opent het nu vanuit haar dashboard.' : 'Link verwijderd.'); }
  if (c==='upload-shoot') { [...el.files].forEach(f => { k.shoot.uploads.push({ id:uid(), naam:f.name, op:nu(), grootte:f.size });
      if (!ui.preview) log(k, 'upload', `uploadde ${f.name} voor de brand shoot`); }); bewaar(); render(); toast('Ontvangen. Jasmijn neemt het mee in de voorbereiding.'); }
  if (c==='ct') { const o = data.courseTeksten[el.dataset.course] = data.courseTeksten[el.dataset.course] || {}; const f = el.dataset.f;
    const v = f === 'jouwWerk' ? el.value.trim() : f.startsWith('jasmijn') ? el.value.split('\n').map(x => x.trim()).filter(Boolean) : el.value.trim();
    const standaard = COURSES[el.dataset.course][f]; const gelijk = JSON.stringify(v) === JSON.stringify(standaard ?? (Array.isArray(v) ? [] : ''));
    if (gelijk || (Array.isArray(v) ? !v.length : !v)) delete o[f]; else o[f] = v;
    if (!Object.keys(o).length) delete data.courseTeksten[el.dataset.course];
    bewaar(); toast('Bewaard. Klanten zien het direct.'); }
  if (c==='kanaal') { const set = new Set(k.platformen || []); el.checked ? set.add(el.value) : set.delete(el.value);
    k.platformen = KANALEN.filter(d => set.has(d)); if (ui.rol==='klant' && !ui.preview) log(k, 'kanalen', 'koos haar kanalen: ' + (k.platformen.map(d => KENNISDOMEINEN[d].titel).join(', ') || 'geen'));
    bewaar(); render(); }
  if (c==='hd-toon') { k.werkplek.hdInToon = el.checked; bewaar(); render(); toast(el.checked ? 'Haar Human Design kleurt nu mee in al haar tools.' : 'Human Design gaat niet meer mee in haar tools.'); return; }
  if (c==='limiet') { data.limieten = { ...(data.limieten || {}), [el.dataset.f]: Math.max(1, +el.value || 1) }; bewaar(); render(); toast('Limiet bijgewerkt voor al je klanten.'); return; }
  if (c==='klantlimiet') { const v = +el.value; k.limiet = { ...(k.limiet || {}) }; if (v > 0) k.limiet[el.dataset.f] = v; else delete k.limiet[el.dataset.f];
    if (!Object.keys(k.limiet).length) delete k.limiet; bewaar(); render(); toast('Limiet voor ' + voornaam(k) + ' bijgewerkt.'); return; }
  if (c==='toegang') { k.toegangTot = el.value || null; bewaar(); render(); toast('Einddatum bijgewerkt.'); return; }
  if (c==='verlengd') { k.verlengd = el.checked; bewaar(); render(); toast(el.checked ? 'Verlenging staat aan.' : 'Verlenging staat uit.'); return; }
  if (c==='aanbod') { data.aanbod = data.aanbod || {}; data.aanbod[el.dataset.id] = { ...(data.aanbod[el.dataset.id] || {}), [el.dataset.f]: el.value.trim() }; bewaar(); render(); toast('Bewaard. Klanten zien het direct.'); return; }
  if (c==='aanbod-verborgen') { data.aanbod = data.aanbod || {}; data.aanbod[el.dataset.id] = { ...(data.aanbod[el.dataset.id] || {}), verborgen: el.checked }; bewaar(); render(); return; }
  if (c==='inhoud') { data.inhoud = data.inhoud || {}; data.inhoud[el.dataset.extra] = el.value.split('\n').map(x => x.trim()).filter(Boolean); bewaar(); render(); toast('Inhoud bijgewerkt.'); return; }
  if (c==='pakketinhoud') { data.pakketInhoud = data.pakketInhoud || {}; data.pakketInhoud[el.dataset.p] = el.value.split('\n').map(x => x.trim()).filter(Boolean); bewaar(); render(); toast('Inhoud van het pakket bijgewerkt.'); return; }
  if (c==='pakketprijs') { data.pakketPrijzen = data.pakketPrijzen || {}; data.pakketPrijzen[el.dataset.p] = el.value.trim(); bewaar(); render(); toast('Prijs bijgewerkt.'); return; }
  if (c==='pk-auto') { data.platformAuto = el.checked; bewaar(); toast(el.checked ? 'Voorstellen gaan na 2 dagen automatisch live.' : 'Voorstellen wachten op jouw akkoord.'); }
  if (c==='kennis') { data.kennis.find(x => x.id===el.dataset.id)[el.dataset.f] = el.value; bewaar(); toast('Bewaard. De sous-chef weet het nu.'); }
});

/* ---------- Spraak: inspreken, voorlezen en in gesprek ---------- */
function spraakKan() { return { luisteren: !!(window.SpeechRecognition || window.webkitSpeechRecognition), spreken: 'speechSynthesis' in window }; }
let herkenning = null;
function luister(gesprek) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition; if (!SR) { toast('Inspreken werkt in deze browser niet. Probeer Chrome of Safari.'); return; }
  try { herkenning?.abort(); } catch (e) {}
  const r = new SR(); herkenning = r; r.lang = 'nl-NL'; r.interimResults = true; r.continuous = false;
  let tekst = ''; ui.luistert = true; render(); scrollChat();
  r.onresult = ev => { tekst = [...ev.results].map(x => x[0].transcript).join(' '); const inp = document.getElementById('chat-input'); if (inp) inp.value = tekst; };
  r.onerror = ev => { ui.luistert = false; if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') { ui.gesprek = false; toast('Geef je browser toegang tot je microfoon. Op deze voorbeeldpagina kan de microfoon ook geblokkeerd zijn.'); } else if (ev.error !== 'aborted' && ev.error !== 'no-speech') toast('Ik kon je niet goed verstaan. Probeer het nog eens.'); render(); };
  r.onend = () => { const wasLuisterend = ui.luistert; ui.luistert = false; const k = klant(ui.sessie);
    if (gesprek && tekst.trim() && k && !ui.chatBezig) { stuurChat(k, tekst.trim()); return; }
    if (gesprek && ui.gesprek && wasLuisterend && !tekst.trim()) { render(); return; }
    render(); const inp = document.getElementById('chat-input'); if (inp && tekst) { inp.value = tekst; inp.focus(); } };
  try { r.start(); } catch (e) { ui.luistert = false; render(); }
}
function spreek(tekst, klaar) {
  if (!('speechSynthesis' in window)) { klaar?.(); return; }
  const schoon = tekst.replace(/\*\*|#+ |`/g, '').replace(/\n+/g, '. ');
  const u = new SpeechSynthesisUtterance(schoon); u.lang = 'nl-NL';
  const stem = speechSynthesis.getVoices().find(v => /^nl/i.test(v.lang) && /female|vrouw|Claire|Ellen|Xander|Fenna/i.test(v.name)) || speechSynthesis.getVoices().find(v => /^nl/i.test(v.lang)); if (stem) u.voice = stem;
  u.rate = 1.02; u.onstart = () => { ui.spreekt = true; render(); }; u.onend = u.onerror = () => { ui.spreekt = false; render(); klaar?.(); };
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.sessie);
  switch (el.dataset.a) {
    case 'chat-mic': if (ui.luistert) { try { herkenning?.stop(); } catch (e2) {} return; } luister(false); return;
    case 'chat-voorlees': { const m = k?.chat[+el.dataset.i]; if (m) spreek(m.tekst); return; }
    case 'chat-gesprek': if (ui.gesprek) { ui.gesprek = false; ui.luistert = false; try { herkenning?.abort(); speechSynthesis.cancel(); } catch (e2) {} render(); return; }
      ui.gesprek = true; luister(true); return;
    case 'chat-dicht': ui.gesprek = false; try { herkenning?.abort(); speechSynthesis.cancel(); } catch (e2) {} return;
  }
  if (ui.spreekt && e.target.closest('.gesprekbalk')) { speechSynthesis.cancel(); }
});

function alHebKaarten(k) {
  const p = PAKKETTEN[k.pakket]; const t = toegangTot(k);
  const kaart = (titel, sub, lijst, extraKlasse = '') => `<div class="alhebkaart ${extraKlasse}"><div class="alhebkop"><span class="vinkrond" aria-hidden="true">✓</span><div><strong>${esc(titel)}</strong>${sub ? `<span>${sub}</span>` : ''}</div></div>
    ${lijst.length ? `<details class="inhoud"><summary>Wat zit erin</summary><ul>${lijst.map(x => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}</div>`;
  const pakket = kaart(p.naam, `Jouw pakket, sinds ${datum(k.start)}${t ? ` &nbsp;|&nbsp; toegang tot ${datum(t)}` : ''}${k.verlengd ? ' &nbsp;|&nbsp; verlengd' : ''}`, pakketInhoud(k.pakket), 'hoofd');
  const extras = (k.extras || []).map(e => kaart(e, 'Bijgeboekt', inhoudVan(e)));
  const shoot = k.shoot && !inbegrepen(k.pakket, 'Brand shoot') && !(k.extras || []).includes('Brand shoot') ? [kaart('Brand shoot', 'Bijgeboekt', inhoudVan('Brand shoot'))] : [];
  return [pakket, ...extras, ...shoot].join('');
}
