/* =====================================================================
   JOUW KEUKEN — beheerkant (alleen zichtbaar voor Jasmijn)
   ===================================================================== */
const ui = { rol:'admin', av:'overzicht', actief:null, tab:'checklist', openCourse:null, skillSel:'caption-writer',
  sessie:null, cv:'home', course:null, quizStap:0, quizAntw:[], modal:null, getoond:[], loginFout:'', preview:false };

function logo(opDonker, klasse='') {
  const src = opDonker ? beeld('logoLicht') : beeld('logoDonker');
  return src ? `<img class="logoimg ${klasse}" src="${src}" alt="Studio Crave">` : `<span class="wordmark sc"><b>Studio Crave</b><small>The Branding Kitchen<span class="tm">™</span></small></span>`;
}
const ongelezen = () => data.activiteit.filter(a => !a.gelezen).length;

function nieuweView(sleutel) { const f = sleutel !== ui._view ? 'fade' : ''; ui._view = sleutel; return f; }
function keuken() {
  return `<div class="mtop"><a href="#" class="logolink" data-a="naar-start" aria-label="Naar je overzicht">${logo(true)}</a><button class="linkbtn" data-a="nav-toggle" aria-expanded="${!!ui.navOpen}">${ui.navOpen ? 'Sluiten' : 'Menu'}${!ui.navOpen && (ongelezen() + data.aanvragen.filter(a => a.status==='nieuw').length) ? ` <span class="count">${ongelezen() + data.aanvragen.filter(a => a.status==='nieuw').length}</span>` : ''}</button></div>
  ${ui.navOpen ? '<div class="navbg" data-a="nav-dicht"></div>' : ''}
  <div class="admin">
    <aside class="side ${ui.navOpen ? 'open' : ''}">
      <div><a href="#" class="logolink" data-a="naar-start" aria-label="Naar je overzicht">${logo(true)}</a><span class="sub">Jouw keuken</span></div>
      <nav class="nav" aria-label="Keuken">
        <button data-a="av" data-v="overzicht" aria-current="${ui.av==='overzicht'}">Alle klanten</button>
        <button data-a="av" data-v="meldingen" aria-current="${ui.av==='meldingen'}">Meldingen ${ongelezen() ? `<span class="count">${ongelezen()}</span>` : ''}</button>
        <button data-a="av" data-v="aanvragen" aria-current="${ui.av==='aanvragen'}">Aanvragen ${data.aanvragen.filter(a => a.status==='nieuw').length ? `<span class="count">${data.aanvragen.filter(a => a.status==='nieuw').length}</span>` : ''}</button>
        <button data-a="av" data-v="aanbod" aria-current="${ui.av==='aanbod'}">Aanbod & prijzen</button>
        <button data-a="av" data-v="menuteksten" aria-current="${ui.av==='menuteksten'}">Menu-teksten</button>
        <button data-a="av" data-v="vragenlijst" aria-current="${ui.av==='vragenlijst'}">Quiz & vragenlijst</button>
        <button data-a="av" data-v="kennis" aria-current="${ui.av==='kennis'}">Kennisbank</button>
        <button data-a="av" data-v="skills" aria-current="${ui.av==='skills'}">Skills & agents</button>
        <button data-a="av" data-v="platform" aria-current="${ui.av==='platform'}">Actuele kennis ${Object.values(data.platform).some(platformOud) ? '<span class="count">!</span>' : ''}</button>
        <button data-a="av" data-v="instellingen" aria-current="${ui.av==='instellingen'}">Portaal & huisstijl</button>
        <div class="lbl">Klanten <button data-a="nieuw">Nieuwe klant</button></div>
        ${data.klanten.map(k => `<button class="cn" data-a="kies" data-id="${k.id}" aria-current="${ui.av==='klant'&&ui.actief===k.id}">
          <span>${esc(k.naam)}<small>${PAKKETTEN[k.pakket].kort}${k.extras.length ? ' + '+k.extras.length+' bijgeboekt' : ''}</small></span></button>`).join('')}
      </nav>
    </aside>
    <main class="main ${nieuweView('a'+ui.av+ui.actief+ui.tab+ui.skillSel)}">${
      ui.av==='overzicht' ? overzicht() : ui.av==='meldingen' ? meldingen() : ui.av==='skills' ? skillsBeheer() : ui.av==='vragenlijst' ? vragenlijstBeheer() : ui.av==='aanvragen' ? aanvragenBeheer() : ui.av==='menuteksten' ? menuTekstenBeheer() : ui.av==='aanbod' ? aanbodBeheer() : ui.av==='platform' ? platformBeheer() : ui.av==='kennis' ? kennisBeheer() :
      ui.av==='instellingen' ? instellingen() : klant(ui.actief) ? klantBeheer(klant(ui.actief)) : overzicht()}</main>
  </div>`;
}

function begroeting() { const h = new Date().getHours(); return h < 12 ? 'Goedemorgen' : h < 18 ? 'Goedemiddag' : 'Goedenavond'; }

function overzicht() {
  const actief = data.klanten.filter(k => voortgang(k).klaar < voortgang(k).totaal).length;
  const interesse = data.klanten.flatMap(k => k.aanbiedingen.filter(a => a.status==='interesse').map(a => ({ k, a })));
  const teTekenen = data.klanten.flatMap(k => k.documenten.filter(d => d.status==='te-tekenen').map(d => ({ k, d })));
  return `<div class="pagehead"><div class="begroet">${fotoVak('avatarKeuken', '', 'keukenavatar')}<div><h1>${begroeting()}, Jasmijn</h1>
    <p>${actief} klant${actief===1?'':'en'} aan tafel, ${ongelezen()} nieuwe melding${ongelezen()===1?'':'en'}.</p></div></div>
    <div class="actions"><button class="btn" data-a="nieuw">Nieuwe klant</button></div></div>
  <div class="tablewrap"><table>
    <thead><tr><th>Klant</th><th>Afgenomen</th><th>Nu bij</th><th>Voortgang</th><th>Nog te doen</th><th>Laatste activiteit</th></tr></thead>
    <tbody>${data.klanten.map(k => { const v = voortgang(k); const la = data.activiteit.find(a => a.klant===k.id); const td = k.documenten.filter(d => d.status==='te-tekenen').length; return `<tr data-a="kies" data-id="${k.id}" tabindex="0">
      <td data-l="Klant"><span class="nm">${esc(k.naam)}</span><span class="muted small">${esc(k.bedrijf)}</span></td>
      <td data-l="Afgenomen"><span class="chip" style="border-color:var(--burgundy)">${PAKKETTEN[k.pakket].naam}</span><br>${(PAKKETTEN[k.pakket].inbegrepen||[]).map(e => `<span class="chip incl">incl. ${esc(e.replace(' (maatwerk)',''))}</span>`).join('')}${k.extras.map(e => `<span class="chip">${esc(e)}</span>`).join('')}</td>
      <td data-l="Nu bij">${esc(huidige(k))}</td>
      <td data-l="Voortgang">${v.klaar} van ${v.totaal}<div class="bar"><i style="width:${v.klaar/v.totaal*100}%"></i></div></td>
      <td data-l="Nog te doen">${openChecks(k)} checklist-punten${td ? `<br><span class="pill actie">${td} te tekenen</span>` : ''}</td>
      <td data-l="Laatste activiteit" class="small">${la ? `${esc(la.tekst)}<br><span class="muted">${tijd(la.op)}</span>` : '<span class="muted">Nog niets</span>'}</td></tr>`; }).join('')}</tbody>
  </table></div>
  <div class="split" style="margin-top:1.5rem">
    <div class="panel"><h2>Wat er gebeurde</h2>${feed(data.activiteit.slice(0, 7), true)}
      <button class="btn ghost sm" data-a="av" data-v="meldingen" style="margin-top:.8rem">Alle meldingen</button></div>
    <div class="panel"><h2>Aandacht nodig</h2><div class="rows">
      ${data.aanvragen.filter(a => a.status==='nieuw').map(a => { const k = klant(a.klant); return `<div class="row"><div class="t"><strong>${esc(voornaam(k||{naam:'?'}))}: ${esc(a.titel)}</strong><span>Nieuwe aanvraag</span></div><button class="btn sm" data-a="av" data-v="aanvragen">Bekijk</button></div>`; }).join('')}
      ${interesse.map(({k,a}) => `<div class="row"><div class="t"><strong>${esc(voornaam(k))} wil meer weten</strong><span>${esc(a.titel)}</span></div><button class="btn sm" data-a="kies" data-id="${k.id}" data-tab="aanbiedingen">Bekijk</button></div>`).join('')}
      ${data.klanten.filter(k => ['bijna','verlopen'].includes(toegangStatus(k))).map(k => `<div class="row"><div class="t"><strong>Toegang ${esc(voornaam(k))} ${toegangStatus(k) === 'verlopen' ? 'is verlopen' : 'loopt af op ' + datum(toegangTot(k))}</strong><span>Moment voor een persoonlijk bericht over verlengen</span></div><button class="btn sm" data-a="kies" data-id="${k.id}" data-tab="gegevens">Bekijk</button></div>`).join('')}
      ${data.klanten.filter(k => k.shoot?.selectieKlaar && !k.shoot.final).map(k => `<div class="row"><div class="t"><strong>${esc(voornaam(k))} heeft haar selectie gemaakt</strong><span>Tijd om te bewerken</span></div><button class="btn sm" data-a="kies" data-id="${k.id}" data-tab="menu">Bekijk</button></div>`).join('')}
      ${(() => { const oud = Object.values(data.platform).filter(platformOud); return oud.length ? `<div class="row"><div class="t"><strong>Actuele kennis: ${oud.length} onderwerp${oud.length===1?'':'en'} toe aan een update</strong><span>${oud.map(x => esc(x.titel)).join(', ')}</span></div><button class="btn sm" data-a="av" data-v="platform">Bekijk</button></div>` : ''; })()}
      ${teTekenen.map(({k,d}) => `<div class="row"><div class="t"><strong>${esc(d.titel)}</strong><span>Wacht op ${esc(voornaam(k))}</span></div><span class="pill actie">Te tekenen</span></div>`).join('')}
      ${!interesse.length && !teTekenen.length && !data.aanvragen.some(a => a.status==='nieuw') && !Object.values(data.platform).some(platformOud) ? '<p class="muted">Alles loopt. Geniet ervan.</p>' : ''}
    </div></div>
  </div>`;
}

function feed(items, metNaam) {
  if (!items.length) return '<p class="muted">Nog geen activiteit.</p>';
  return `<ul class="feed">${items.map(a => { const k = klant(a.klant); return `<li class="${a.gelezen?'':'nieuw'}"><span class="dot"></span><div>${metNaam && k ? `<strong style="font-weight:600">${esc(voornaam(k))}</strong> ` : ''}${esc(a.tekst)}<time>${tijd(a.op)}</time></div></li>`; }).join('')}</ul>`;
}

function meldingen() {
  return `<div class="pagehead"><div><h1>Meldingen</h1><p>Alles wat je klanten doen: tekenen, downloaden, uploaden, tools gebruiken.</p></div>
    <div class="actions"><button class="btn ghost" data-a="gelezen">Alles gelezen</button></div></div>
    <div class="panel">${feed(data.activiteit, true)}</div>`;
}

/* ---------- Per klant ---------- */
function klantBeheer(k) {
  const v = voortgang(k);
  const tabs = [['dossier','Dossier'],['checklist','Checklist'], ...(k.pakket === 'audit' ? [['audit','Brand Audit']] : []),['menu','Menu & bestanden'],['profiel','Quiz & vragenlijst'],['todos','To-do\'s'],['geheugen','Merkgeheugen'],['taal','Taal'],['merk','Signature Dish'],['documenten','Documenten'],['aanbiedingen','Aanbiedingen'],['eigen','Eigen tools'],['chat','Chat'],['activiteit','Activiteit'],['gegevens','Gegevens']];
  return `<div class="pagehead"><div><h1>${esc(k.naam)}</h1>
      <p>${esc(k.bedrijf)} &nbsp;|&nbsp; ${PAKKETTEN[k.pakket].naam}${PAKKETTEN[k.pakket].inbegrepen ? ' (incl. brand shoot, templates en Craveable Identity)' : ''}${k.extras.length ? ' + '+k.extras.map(esc).join(', ') : ''} &nbsp;|&nbsp; ${v.klaar} van ${v.totaal} courses afgerond &nbsp;|&nbsp; nu bij: ${esc(huidige(k))}</p></div>
      <div class="actions">
        <button class="btn ghost" data-a="uitnodigen">${k.uitgenodigd ? 'Uitnodiging opnieuw sturen' : 'Uitnodiging versturen'}</button>
        <button class="btn" data-a="preview" data-id="${k.id}">Bekijk als ${esc(voornaam(k))}</button>
      </div></div>
    <div class="tabs" role="tablist">${tabs.map(([id,l]) => `<button role="tab" data-a="tab" data-v="${id}" aria-selected="${ui.tab===id}">${l}${id==='aanbiedingen'&&k.aanbiedingen.some(a=>a.status==='interesse') ? ' <span class="count">!</span>' : ''}</button>`).join('')}</div>
    ${{ dossier:tabDossier, audit:tabAudit, checklist:tabChecklist, menu:tabMenu, profiel:tabProfiel, geheugen:tabGeheugen, taal:tabTaal, todos:tabTodos, merk:tabMerk, chat:tabChat, eigen:tabEigenTools, documenten:tabDocs, aanbiedingen:tabAanbod, activiteit:tabActiviteit, gegevens:tabGegevens }[ui.tab](k)}`;
}

function tabChecklist(k) {
  return `<div class="split"><div>${checkItems(k).map(f => `<div class="checkfase"><h3>${f.fase}<span>${f.items.filter(i=>i.klaar).length} van ${f.items.length}</span></h3>
    ${f.items.map(i => `<label class="checkitem ${i.klaar?'done':''}"><input type="checkbox" data-c="check" data-id="${i.id}" ${i.klaar?'checked':''} ${i.auto&&i.auto(k)?'disabled':''}><span>${i.t}${i.auto ? '<span class="auto">automatisch</span>' : ''}</span></label>`).join('')}
  </div>`).join('')}</div>
  <div class="panel"><h2>Hoe dit werkt</h2><p class="small muted">Dit is je vaste werklijst per klant. Punten met "automatisch" vinken zichzelf af zodra je klant iets doet: tekenen, quiz, intake, uploaden. De rest vink je zelf af.</p>
  <p class="small muted" style="margin-top:.8rem">De lijst zelf pas je aan in de configuratie (CHECKLIST), en in de live versie in een eigen tabel.</p></div></div>`;
}

function tabMenu(k) {
  return Object.entries(k.courses).map(([id, c]) => { const def = COURSES[id]; const open = ui.openCourse === id; const skills = SKILLS.filter(s => s.course === id); return `<div class="acc">
    <button data-a="acc" data-id="${id}" aria-expanded="${open}"><span class="anr">${def.nr}</span><span><span class="anm">${def.naam}</span><span class="asb">${k.shoot && (id==='04'||id==='05') ? `<span class="shoottag">${id==='04' ? 'Brand shoot: voorbereiding' : 'Brand shoot: shoot en foto\'s'}</span> ` : ''}${c.bestanden.length} bestand${c.bestanden.length===1?'':'en'} klaargezet, ${c.uploads.length} upload${c.uploads.length===1?'':'s'} van ${esc(voornaam(k))}</span></span><span class="pill ${c.status}">${STATUS[c.status]}</span></button>
    ${open ? `<div class="acc-body">${jouwWerkBlok(id)}<div class="split">
      <div>${identAdmin(k, id)}${k.shoot && id==='04' ? shootPrepBeheer(k, k.shoot) : ''}${k.shoot && id==='05' ? shootBeheer(k, k.shoot) : ''}
        <div class="grid2"><label class="field">Status<select data-c="status" data-course="${id}">${Object.entries(STATUS).map(([v,l]) => `<option value="${v}" ${c.status===v?'selected':''}>${l}</option>`).join('')}</select></label></div>
        <label class="field" style="margin-top:.9rem">Persoonlijke notitie (ziet ${esc(voornaam(k))} bovenaan deze course)<textarea data-c="notitie" data-course="${id}">${esc(c.notitie)}</textarea></label>
        <p class="sectlabel">Tools die ${esc(voornaam(k))} hier krijgt</p>
        <div class="skillset">${skills.map(s => `<label class="skillchip"><input type="checkbox" data-c="skill" data-course="${id}" value="${s.id}" ${c.skills.includes(s.id)?'checked':''} ${data.skills[s.id].status==='concept'?'disabled':''}>${esc(s.naam)}${data.skills[s.id].status==='concept'?' (concept)':''}</label>`).join('') || '<span class="muted small">Geen tools voor deze course.</span>'}</div>
        <p class="sectlabel">Klaargezet en opgediend</p>
        <div class="rows">${c.bestanden.map(b => `<div class="row"><div class="t"><strong>${esc(b.naam)}</strong><span>${b.soort==='opgediend'?'Opgediend':'Klaargezet'} op ${datum(b.op)} &nbsp;|&nbsp; ${b.downloads ? 'gedownload' : 'nog niet gedownload'}${b.canva ? ' &nbsp;|&nbsp; link: ' + linkLabel(b.canva).toLowerCase() : ''}</span>
          <input class="canvain" type="url" data-c="canva" data-course="${id}" data-id="${b.id}" value="${esc(b.canva)}" placeholder="Link (optioneel): Canva, Loom, Google Docs, Pinterest, Notion" aria-label="Link voor ${esc(b.naam)}"></div><button class="btn ghost sm" data-a="bestand-weg" data-course="${id}" data-id="${b.id}">Verwijderen</button></div>`).join('') || '<p class="muted small">Nog niets.</p>'}</div>
        <p class="sectlabel">Aangeleverd door ${esc(voornaam(k))}</p>
        <div class="rows">${c.uploads.map(u => `<div class="row"><div class="t"><strong>${esc(u.naam)}</strong><span>${datum(u.op)} &nbsp;|&nbsp; ${grootte(u.grootte)}</span></div></div>`).join('') || '<p class="muted small">Nog niets aangeleverd.</p>'}</div>
      </div>
      <div class="panel" style="background:var(--surface-2)"><h2 style="font-size:1.25rem">Bestand plaatsen</h2><div class="stack">
        <label class="field">Bestand<input type="file" id="f-file"></label>
        <label class="field">Naam (optioneel)<input id="f-naam" placeholder="Anders de bestandsnaam"></label>
        <label class="field">Soort<select id="f-soort"><option value="klaargezet">Klaargezet (werkblad, template)</option><option value="opgediend">Opgediend (jouw deliverable)</option></select></label>
        <label class="field">Link (optioneel): Canva, Loom, Google Docs, Pinterest, Notion<input id="f-canva" type="url" placeholder="https://..."></label>
        <label class="field">Notitie (optioneel)<input id="f-notitie"></label>
        ${identCourse(k) === id ? `<label class="field">Onderdeel van ${identTitel(k)} (optioneel)<select id="f-onderdeel"><option value="">Geen</option>${identStappen(k).map(s => `<option value="${s.id}">${s.naam}</option>`).join('')}</select></label>` : ''}
        <button class="btn" data-a="bestand-add" data-course="${id}">Plaatsen bij ${esc(voornaam(k))}</button>
        <p class="hint">Verschijnt direct in haar portaal. Plak een link naar Canva, een Loom-uitleg, een Google Doc, een Pinterest-moodboard of een Notion-pagina: de knop past zich vanzelf aan ("Openen in Canva", "Bekijk video", "Bekijk moodboard"). Alleen een link, zonder bestand, kan ook. Je krijgt een melding als ze downloadt of opent.</p>
      </div></div>
    </div></div>` : ''}</div>`; }).join('');
}

function tabProfiel(k) {
  const a = k.quiz && ARCHETYPES[k.quiz.uitslag]; const p = k.profiel;
  return `<div class="split"><div>
    ${a ? `<div class="archcard"><p style="margin:0;color:var(--gold);font-size:.8rem">Quizuitslag, ${datum(k.quiz.op)} &nbsp;|&nbsp; ${Object.keys(ARCHETYPES).map(l => ARCHETYPES[l].kort+' '+(k.quiz.scores?.[l] ?? 0)).join(', ')}</p><h3>${a.naam}</h3><p>${a.sub}</p>
        <p style="margin-top:.8rem"><strong style="color:var(--gold);font-weight:600">Blinde vlek.</strong> ${esc(a.blind)}</p>
        <p style="margin-top:.6rem"><strong style="color:var(--gold);font-weight:600">Meeste smaak toe te voegen in Course ${a.start}, ${COURSES[a.start].naam}.</strong>${k.courses[a.start] ? '' : ' Deze course zit niet in haar pakket: kans voor een upgrade.'}</p></div>
      <div class="panel" style="margin-top:1.25rem"><h2>Quizantwoorden</h2><dl>${QUIZ.map((q,i) => `<div class="qa"><dt>${COURSES[q.course].naam}: ${q.v}</dt><dd><strong style="color:var(--gold)">${k.quiz.antwoorden[i]}</strong> ${esc(optTekst(q, k.quiz.antwoorden[i]))}</dd></div>`).join('')}</dl></div>`
      : '<div class="panel"><h2>Nog geen quiz</h2><p class="muted small">Zodra '+esc(voornaam(k))+' de quiz doet, zie je hier haar uitslag en krijg je een melding.</p></div>'}
    ${k.werkplek?.hd?.chart || k.werkplek?.energietype ? `<div class="panel"><h2>Human Design</h2><p class="small">${esc(hdSamenvatting(k))}</p>${k.werkplek?.hd?.chart ? `<div style="max-width:180px;margin-top:.8rem">${hdBodygraph(k.werkplek.hd.chart)}</div>` : ''}</div>` : ''}
    <div class="panel"><h2>Vragenlijst ${k.intake.klaar ? '<span class="pill klaar" style="vertical-align:middle">Ingevuld</span>' : k.intake.stap ? `<span class="pill bezig" style="vertical-align:middle">Bij deel ${Math.min(k.intake.stap, data.vragenlijst.length-1)+1}</span>` : '<span class="pill dicht" style="vertical-align:middle">Nog niet gestart</span>'}</h2></div>
    ${vragenlijstVoor(k).map(d => `<div class="panel"><h2>${esc(d.titel)}</h2><dl>${d.vragen.map(q => `<div class="qa"><dt>${esc(q.l)}${q.tool ? ` <span class="auto">voedt de tools</span>` : ''}</dt><dd>${esc(k.intake.velden[q.id]) || '<span class="muted">Nog niet ingevuld</span>'}</dd></div>`).join('')}</dl></div>`).join('')}
  </div>
  <div class="panel" style="position:sticky;top:1rem"><h2>Wat de tools ermee doen</h2>
    <p class="small muted">De antwoorden die "voeden de tools" komen in het merkgeheugen van ${esc(voornaam(k))}. Daar vul je aan met haar Brand Foundation, stemvoorbeelden en de kern uit je deliverables.</p>
    <div class="actions" style="margin-top:1rem"><button class="btn" data-a="tab" data-v="geheugen">Naar het merkgeheugen</button></div></div></div></div>`;
}

function tabDocs(k) {
  return `<div class="split">
    <div class="panel"><h2>Documenten</h2><div class="rows">
      ${k.documenten.map(d => `<div class="row"><div class="t"><strong>${esc(d.titel)}</strong><span>${esc(d.type)}</span></div>
        ${d.status==='getekend' ? `<span class="pill klaar">Akkoord ${datum(d.getekendOp)}</span>` : d.status==='te-tekenen' ? `<span class="pill actie">Wacht op akkoord</span>` : `<span class="pill dicht">Ter info</span>`}
        <button class="btn ghost sm" data-a="doc-weg" data-id="${d.id}">Verwijderen</button></div>`).join('') || '<p class="muted">Nog geen documenten.</p>'}
    </div></div>
    <div class="panel"><h2>Document plaatsen</h2><div class="stack">
      <label class="field">Bestand (PDF uit je huisstijltemplate)<input type="file" id="d-file" accept="application/pdf"></label>
      <label class="field">Titel<input id="d-titel" placeholder="Bijv. Voorstel 7-Course"></label>
      <label class="field">Soort<select id="d-type">${DOC_TYPES.map(t => `<option>${t}</option>`).join('')}</select></label>
      <label class="check"><input type="checkbox" id="d-teken" checked> ${esc(voornaam(k))} moet akkoord geven</label>
      <button class="btn" data-a="doc-add">Document klaarzetten</button>
      <p class="hint">Voor contracten koppelen we in de live versie een e-signdienst. Voor lichtere stukken volstaat akkoord met datum, tijd en account.</p>
    </div></div></div>`;
}

function tabAanbod(k) {
  const triggers = [['login','Bij inloggen'], ...Object.keys(k.courses).map(c => ['na-'+c, 'Na afronding van '+(/^\d/.test(COURSES[c].nr)?COURSES[c].nr+' ':'')+COURSES[c].naam])];
  const sug = suggesties(k).filter(s => !k.aanbiedingen.some(a => a.titel === s.titel));
  const stLabel = { nieuw:'<span class="pill open">Nog niet gezien</span>', interesse:'<span class="pill actie">Wil meer weten</span>', weggeklikt:'<span class="pill dicht">Niet nu</span>' };
  return `<div class="split"><div>
    <div class="panel"><h2>Aanbiedingen voor ${esc(voornaam(k))}</h2><div class="rows">
      ${k.aanbiedingen.map(a => `<div class="row"><div class="t"><strong>${esc(a.titel)}</strong><span>${triggers.find(t=>t[0]===a.trigger)?.[1] || ''}</span></div>${stLabel[a.status]}
        <label class="check small"><input type="checkbox" data-c="aanbod-actief" data-id="${a.id}" ${a.actief?'checked':''}> Actief</label>
        <button class="btn ghost sm" data-a="aanbod-weg" data-id="${a.id}">Verwijderen</button></div>`).join('') || '<p class="muted">Nog geen aanbiedingen.</p>'}
    </div></div>
    ${sug.length ? `<div class="panel"><h2>Suggesties voor ${esc(voornaam(k))}</h2><p class="small muted" style="margin-bottom:.6rem">Op basis van wat ze heeft afgenomen, en wat nog niet.</p><div class="rows">
      ${sug.map((s,i) => `<div class="row"><div class="t"><strong>${esc(s.titel)}</strong><span>${esc(s.tekst)}</span></div><button class="btn sm" data-a="sug-add" data-i="${i}">Klaarzetten</button></div>`).join('')}</div></div>` : ''}
  </div>
  <div class="panel"><h2>Eigen aanbieding</h2><div class="stack">
    <label class="field">Titel<input id="o-titel"></label>
    <label class="field">Tekst<textarea id="o-tekst"></textarea></label>
    <label class="field">Knoptekst<input id="o-knop" value="Vertel me meer"></label>
    <label class="field">Wanneer tonen<select id="o-trigger">${triggers.map(([v,l]) => `<option value="${v}">${l}</option>`).join('')}</select></label>
    <button class="btn" data-a="aanbod-add">Aanbieding klaarzetten</button>
    <p class="hint">Verschijnt als pop-up in het portaal van ${esc(voornaam(k))}, één keer per bezoek. Klikt ze op de knop, dan krijg jij een melding.</p>
  </div></div></div>`;
}

function tabActiviteit(k) { return `<div class="panel">${feed(data.activiteit.filter(a => a.klant===k.id), false)}</div>`; }

function tabGegevens(k) {
  return `<div class="split">
    <div class="panel"><h2>Welkomstboodschap</h2>
      <label class="field">Dit leest ${esc(voornaam(k))} op haar welkomstscherm<textarea id="g-welkom" style="min-height:9rem">${esc(k.welkom)}</textarea></label>
      <h2 style="margin-top:1.5rem">Kanalen</h2><p class="small muted" style="margin-bottom:.5rem">Ze ziet alleen de tools voor deze kanalen. Ze kan dit zelf ook aanpassen.</p><div class="stack">${KANALEN.map(d => `<label class="check"><input type="checkbox" data-c="kanaal" value="${d}" ${(k.platformen||[]).includes(d)?'checked':''}> ${KENNISDOMEINEN[d].titel}</label>`).join('')}</div>
      <h2 style="margin-top:1.5rem">Bijgeboekt</h2><div class="stack">${EXTRAS.map(e => inbegrepen(k.pakket, e) ? `<label class="check muted"><input type="checkbox" checked disabled> ${esc(e)} <span class="auto">inbegrepen in de 7-Course</span></label>` : `<label class="check"><input type="checkbox" class="g-extra" value="${esc(e)}" ${k.extras.includes(e)?'checked':''}> ${esc(e)}</label>`).join('')}</div>
      <div style="margin-top:1.2rem"><button class="btn" data-a="gegevens-save">Wijzigingen opslaan</button></div></div>
    <div class="panel"><h2>Gegevens</h2><div class="stack">
      <label class="field">Naam<input id="g-naam" value="${esc(k.naam)}"></label>
      <label class="field">Bedrijf<input id="g-bedrijf" value="${esc(k.bedrijf)}"></label>
      <label class="field">E-mail (inlognaam)<input id="g-email" type="email" value="${esc(k.email)}"></label>
      <p class="small muted">Pakket: ${PAKKETTEN[k.pakket].naam} (${PAKKETTEN[k.pakket].prijs}) &nbsp;|&nbsp; gestart ${datum(k.start)}</p>
      <h2 style="margin-top:1.5rem">Toegang</h2>
      <p class="small">${toegangTot(k) ? `Toegang tot <strong>${datum(toegangTot(k))}</strong>` : 'Doorlopend (abonnement)'} &nbsp; ${{ actief:'<span class="pill klaar">Actief</span>', bijna:'<span class="pill bezig">Loopt binnenkort af</span>', verlopen:'<span class="pill actie">Verlopen</span>', verlengd:'<span class="pill klaar">Verlengd</span>' }[toegangStatus(k)]}</p>
      <p class="small muted">Standaard: ${k.pakket === 'audit' ? '4 weken vanaf de start (Brand Audit)' : `de looptijd van het traject plus ${TOEGANG.naMaanden} maanden`}. Daarna verlengen voor ${verlengPrijs(k)}. De Signature Dish en documenten blijven altijd zichtbaar.</p>
      <p class="small">Verlengen kost voor ${esc(voornaam(k))} <strong>${verlengPrijs(k)}</strong>${k.pakket === 'dwy' ? ' (7-Course-tarief)' : ''}.</p>
      ${(() => { const maand = new Date().toISOString().slice(0,7); const berichten = (k.chat||[]).filter(m => m.rol === 'user' && (m.op||'').startsWith(maand)).length;
        const tools = data.activiteit.filter(x => x.klant === k.id && x.type === 'skill' && x.op.startsWith(maand)).length; const kost = berichten * KOSTEN.perBericht + tools * KOSTEN.perTool;
        return `<p class="small" style="margin-top:.6rem">Gebruik deze maand: ${berichten} vragen aan de sous-chef, ${tools} keer een tool. Geschatte kosten: <strong>€${kost.toFixed(2).replace('.', ',')}</strong>.</p>`; })()}
      <p class="small" style="margin-top:.6rem">Limiet sous-chef: ${limietVan(k).dag} vragen per dag, ${limietVan(k).maand} per maand${k.limiet ? ' (aangepast voor ' + esc(voornaam(k)) + ')' : ' (standaard)'}.</p>
      <div class="grid2" style="margin-top:.4rem"><label class="field">Eigen limiet per dag<input type="number" min="1" data-c="klantlimiet" data-f="dag" value="${k.limiet?.dag || ''}" placeholder="${limietVan().dag}"></label>
        <label class="field">Eigen limiet per maand<input type="number" min="1" data-c="klantlimiet" data-f="maand" value="${k.limiet?.maand || ''}" placeholder="${limietVan().maand}"></label></div>
      <div class="grid2" style="margin-top:.6rem"><label class="field">Andere einddatum<input type="date" data-c="toegang" value="${k.toegangTot || ''}"></label>
      <label class="check" style="align-self:end"><input type="checkbox" data-c="verlengd" ${k.verlengd ? 'checked' : ''}> Verlengd (abonnement loopt)</label></div>
    </div>
    <h2 style="margin-top:1.8rem">Privacy</h2>
    <p class="small muted">Klant vraagt om verwijdering, of het traject is lang afgerond? Hiermee wis je alle gegevens, bestanden en activiteit van deze klant.</p>
    <button class="btn ghost sm" data-a="klant-wis" style="margin-top:.8rem;border-color:var(--pepper)">Alle gegevens van ${esc(voornaam(k))} wissen</button></div>
  </div>`;
}

/* ---------- Skills-bibliotheek ---------- */
function skillsBeheer() {
  const s = SKILLS.find(x => x.id === ui.skillSel) || SKILLS[0]; const d = data.skills[s.id];
  const gebruik = data.klanten.filter(k => Object.values(k.courses).some(c => c.skills.includes(s.id))).length;
  return `<div class="pagehead"><div><h1>Skills & agents</h1><p>Je bibliotheek. Pas een instructie aan en elke klant werkt direct met de nieuwe versie.</p></div></div>
  <div class="split skillsplit" style="grid-template-columns:260px 1fr">
    <div class="skilllist">${Object.entries(COURSES).map(([cid, c]) => { const lijst = SKILLS.filter(x => x.course===cid); return lijst.length ? `<h4>${/^\d/.test(c.nr)?c.nr+' ':''}${c.naam}</h4>${lijst.map(x => `<button data-a="skill-sel" data-id="${x.id}" aria-current="${x.id===s.id}"><span>${esc(x.naam)}</span>${data.skills[x.id].status==='concept'?'<span class="pill concept">concept</span>':`<span class="muted small">v${data.skills[x.id].versie}</span>`}</button>`).join('')}` : ''; }).join('')}</div>
    <div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2 style="font-size:2rem">${esc(s.naam)}</h2><span class="small muted">Versie ${d.versie} &nbsp;|&nbsp; bij ${gebruik} klant${gebruik===1?'':'en'} actief</span></div>
      <div class="stack">
        <div class="grid2"><label class="field">Status<select id="s-status"><option value="live" ${d.status==='live'?'selected':''}>Live: klanten kunnen hem gebruiken</option><option value="concept" ${d.status==='concept'?'selected':''}>Concept: alleen voor jou</option></select></label>
        <label class="field">Hoort bij<input value="${COURSES[s.course].naam}" disabled></label></div>
        <div class="field">Gebruikt actuele kennis over (kanalen bepalen ook bij welke klanten de tool zichtbaar is)<div class="skillset" style="margin-top:.3rem">${Object.entries(KENNISDOMEINEN).map(([d,x]) => `<label class="skillchip"><input type="checkbox" class="s-kennis" value="${d}" ${kennisVan(s.id).includes(d)?'checked':''}>${x.titel}</label>`).join('')}</div></div>
        <label class="field">Wat de klant ziet (één regel)<input id="s-wat" value="${esc(d.wat)}"></label>
        <label class="field">Voorbeeldvraag. Gebruik {doelgroep}, {pijn}, {resultaat}, {toon} of {nooit}: die worden per klant ingevuld<input id="s-vb" value="${esc(d.vb)}"></label>
        <label class="field">Instructie (je SKILL.md)<textarea id="s-instr" class="code">${esc(d.instructie)}</textarea></label>
        <div class="actions"><button class="btn" data-a="skill-save">Opslaan als versie ${d.versie+1}</button></div>
        ${d.historie.length ? `<p class="sectlabel">Eerdere versies</p><div class="rows">${d.historie.slice().reverse().map((h,i) => `<div class="row"><div class="t"><strong>Versie ${h.versie}</strong><span>${tijd(h.op)}</span></div><button class="btn ghost sm" data-a="skill-terug" data-i="${d.historie.length-1-i}">Terugzetten</button></div>`).join('')}</div>` : ''}
        <p class="hint">In de live versie staat deze tekst alleen op de server. Klanten zien hem nooit, ze zien alleen het resultaat.</p>
      </div></div>
  </div>`;
}

/* ---------- Portaal & huisstijl ---------- */
function instellingen() {
  const p = data.portaal;
  const slot = (key, titel, uitleg, donker, cover) => `<div class="imgslot"><div class="prev ${donker?'dark':''} ${cover?'cover':''} ${FOTO_VAKKEN[key]?.rond ? 'rondprev' : ''}">${FOTO_VAKKEN[key] && !FOTO_VAKKEN[key].vrij ? fotoVak(key, '') : (FOTO_VAKKEN[key] ? `<img src="${beeld(key)}" alt="" style="${fotoStijl(key)}">` : beeld(key) ? `<img src="${beeld(key)}" alt="">` : 'Nog leeg')}</div>
    <div style="flex:1"><strong style="font-weight:500">${titel}</strong>${!p[key] && LOGO_STANDAARD[key] ? ` <span class="pill klaar">${/^(banner|foto|avatar)/.test(key) ? 'Jouw foto' : 'Officieel logo'}</span>` : ''}<p class="small muted">${uitleg}</p>
    <label class="field" style="margin-top:.4rem"><input type="file" accept="image/*" data-c="img" data-key="${key}"></label>
    <div class="actions" style="margin-top:.4rem">${FOTO_VAKKEN[key] && (fotoBron(key) || beeld(key)) ? `<button class="btn sm" data-a="us-open" data-key="${key}">Uitsnede aanpassen</button>` : ''}${p[key] ? `<button class="linkbtn" data-a="img-weg" data-key="${key}">Verwijderen</button>` : ''}</div></div></div>`;
  return `<div class="pagehead"><div><h1>Portaal & huisstijl</h1><p>Wat elke klant ziet bij het inloggen.</p></div></div>
  <div class="split"><div class="panel"><h2>Beeld</h2>
    ${slot('banner','Banner','Brede balk bovenaan het welkomstscherm, met de welkomstzin erover. Liggend beeld, bijvoorbeeld 2400 × 1000 px. Het onderste deel loopt over in je donkere huisstijlkleur. Nu: jij met de rode pepers, uit je shoot.',false,true)}
    ${slot('fotoJasmijn','Foto van jou','Klein en rond, naast je quote op het welkomstscherm.',false,true)}
    ${slot('fotoSamen','Foto op Samenwerken','Staand, naast je aanbod op de pagina Samenwerken.',false,true)}
    ${slot('fotoWerkplek','Foto bij Workflow','Staand, naast de titel van Workflow.',false,true)}
    ${slot('fotoDessert','Foto bij de Signature Dish','Staand, in de kop van het dessert.',false,true)}
    ${slot('avatarChat','Foto bij de sous-chef','Klein en rond, bovenin de chat.',false,true)}
    ${slot('avatarKeuken','Foto in jouw keuken','Klein en rond, naast je begroeting in je overzicht.',false,true)}
    <p class="sectlabel">Je officiële logo's</p>
    ${slot('logoLicht','Studio Crave-logo, licht','Voor donkere achtergronden: bovenbalk, footer en jouw keuken.',true)}
    ${slot('logoDonker','Studio Crave-logo, donker','Voor lichte achtergronden: het inlogscherm.',false)}
    ${slot('monogram','Monogram (SC), wit','Het enige beeld in de footer van elk portaal.',true)}
    ${slot('monogramDonker','Monogram (SC), bordeaux','Icoontje in de browsertab en op lichte achtergronden.',false)}
    ${slot('inlogBeeld','Beeld op het inlogscherm','Achter het inlogvenster. Nu: je SC-monogram in reliëf.',false,true)}
    <p class="hint">In deze demo blijven afbeeldingen tot ca. 1,5 MB bewaard. Live gaan ze naar je opslag.</p></div>
  <div class="panel"><h2>Limieten en marge</h2>
    <p class="small muted" style="margin-bottom:1rem">Per klant: hoeveel vragen aan de sous-chef en hoeveel keer een tool. Zo weet je vooraf wat een klant je maximaal kost.</p>
    <div class="grid2"><label class="field">Vragen per dag<input type="number" min="1" data-c="limiet" data-f="dag" value="${limietVan().dag}"></label>
      <label class="field">Vragen per maand<input type="number" min="1" data-c="limiet" data-f="maand" value="${limietVan().maand}"></label>
      <label class="field">Tools per dag<input type="number" min="1" data-c="limiet" data-f="toolsDag" value="${limietVan().toolsDag}"></label></div>
    ${(() => { const l = limietVan(); const max = l.maand * KOSTEN.perTool, gem = l.maand * .5 * KOSTEN.perBericht;
      const rij = (prijs, label) => { const p = +prijs.replace(/[^0-9]/g, ''); return `<div class="row"><div class="t"><strong>${label}: ${prijs}</strong><span>Marge bij gemiddeld gebruik ± €${(p - gem).toFixed(0)}, en als ze het maximum volledig benut met tools ± €${(p - max).toFixed(0)}</span></div></div>`; };
      return `<div class="rows" style="margin-top:.8rem">${rij(TOEGANG.prijzen.dwy, '7-Course')}${rij(TOEGANG.prijzen.standaard, 'Overige klanten')}</div>
        <p class="hint">Schatting per klant per maand: gemiddeld gebruikt een klant de helft van haar vragen (± €${gem.toFixed(2).replace('.', ',')}), maximaal ± €${max.toFixed(2).replace('.', ',')}. Betaalkosten en je vaste kosten (Supabase) komen er nog af. Pas de schatting aan zodra je je eerste echte rekening ziet.</p>`; })()}
  </div>
  <div class="panel"><h2>Welkom</h2><div class="stack">
    <label class="field">Mailadres voor vragen<input id="w-mail" type="email" value="${esc(contact().mail)}"></label>
    <label class="field">Telefoonnummer voor appen (optioneel, voor een WhatsApp-knop)<input id="w-app" type="tel" value="${esc(contact().app)}" placeholder="06 12345678"></label>
    <label class="field">Grote welkomstzin<input id="w-kop" value="${esc(p.welkomKop)}"></label>
    <label class="field">Quotes (één per regel, er wordt er steeds één getoond)<textarea id="w-quotes" style="min-height:9rem">${esc(p.quotes.join('\n'))}</textarea></label>
    <button class="btn" data-a="portaal-save">Opslaan</button></div></div></div>`;
}

/* ---------- Quiz & vragenlijst beheren ---------- */
function vragenlijstBeheer() {
  const vl = data.vragenlijst; const n = vl.reduce((x, d) => x + d.vragen.length, 0);
  const gebruikt = Object.keys(TOOL_VELDEN).filter(t => vl.some(d => d.vragen.some(q => q.tool === t)));
  return `<div class="pagehead"><div><h1>Quiz & vragenlijst</h1><p>Bij het inloggen doet je klant eerst de quiz (wie is ze als merk), daarna deze vragenlijst (wie is ze als persoon en business). ${vl.length} delen, ${n} vragen.</p></div>
    <div class="actions"><button class="btn ghost" data-a="vl-standaard">Startversie terugzetten</button><button class="btn" data-a="vl-deel">Deel toevoegen</button></div></div>
  <div class="split"><div>
    ${vl.map((d, di) => `<div class="vldeel"><div class="vlkop"><span class="anr">${di+1}</span>
        <label class="field" style="flex:1">Titel van dit deel<input data-c="vl" data-d="${di}" data-f="titel" value="${esc(d.titel)}"></label>${d.voorwaarde && VL_VOORWAARDEN[d.voorwaarde] ? `<p class="small muted" style="flex-basis:100%;margin:.2rem 0 0">Alleen zichtbaar voor ${VL_VOORWAARDEN[d.voorwaarde].label}.</p>` : ''}
        <span class="vlknop"><button class="btn ghost sm" data-a="vl-deel-op" data-d="${di}" ${di?'':'disabled'} aria-label="Deel omhoog">Omhoog</button><button class="btn ghost sm" data-a="vl-deel-weg" data-d="${di}">Verwijderen</button></span></div>
      <label class="field">Intro (optioneel)<input data-c="vl" data-d="${di}" data-f="intro" value="${esc(d.intro)}"></label>
      ${d.vragen.map((q, qi) => `<div class="vlvraag">
        <label class="field">Vraag ${qi+1}<input data-c="vl" data-d="${di}" data-q="${qi}" data-f="l" value="${esc(q.l)}"></label>
        <div class="grid2">
          <label class="field">Soort antwoord<select data-c="vl" data-d="${di}" data-q="${qi}" data-f="t"><option value="text" ${q.t==='text'?'selected':''}>Kort</option><option value="area" ${q.t==='area'?'selected':''}>Lang</option><option value="keuze" ${q.t==='keuze'?'selected':''}>Keuze uit opties</option><option value="meerkeuze" ${q.t==='meerkeuze'?'selected':''}>Meerdere opties</option></select></label>
          <label class="field">Voedt de tools als<select data-c="vl" data-d="${di}" data-q="${qi}" data-f="tool"><option value="">Niet gekoppeld</option>${Object.entries(TOOL_VELDEN).map(([v,l]) => `<option value="${v}" ${q.tool===v?'selected':''}>${l}</option>`).join('')}</select></label>
        </div>
        ${['keuze','meerkeuze'].includes(q.t) ? `<label class="field">Opties, gescheiden door een puntkomma<input data-c="vl" data-d="${di}" data-q="${qi}" data-f="opties" value="${esc((q.opties||[]).join('; '))}"></label>`
          : `<label class="field">Voorbeeld in het invulveld (optioneel)<input data-c="vl" data-d="${di}" data-q="${qi}" data-f="vb" value="${esc(q.vb)}"></label>`}
        <div class="vlknop"><button class="btn ghost sm" data-a="vl-vraag-op" data-d="${di}" data-q="${qi}" ${qi?'':'disabled'}>Omhoog</button><button class="btn ghost sm" data-a="vl-vraag-weg" data-d="${di}" data-q="${qi}">Verwijderen</button></div>
      </div>`).join('')}
      <button class="btn ghost sm" data-a="vl-vraag" data-d="${di}">Vraag toevoegen</button>
    </div>`).join('')}
  </div>
  <div style="position:sticky;top:1rem">
    <div class="panel"><h2>Zo werkt het</h2>
      <p class="small muted">Wijzigingen worden direct bewaard en gelden voor iedereen die de vragenlijst nog invult. Antwoorden die al gegeven zijn blijven staan.</p>
      <p class="small muted" style="margin-top:.7rem">Maak het persoonlijk met <strong>{voornaam}</strong>, <strong>{archetype}</strong> (de quizuitslag) en <strong>{woorden}</strong> (de drie toonwoorden van dat archetype). Weet het portaal nog geen archetype, dan valt die zin vanzelf weg.</p>
      <p class="small muted" style="margin-top:.7rem">Met "Voedt de tools als" bepaal je welk antwoord in de persoonlijke laag komt. Gekoppeld nu: ${gebruikt.map(t => TOOL_VELDEN[t]).join(', ') || 'niets'}.</p>
      <div class="actions" style="margin-top:1rem"><button class="btn sm" data-a="vl-voorbeeld">Bekijk als nieuwe klant</button></div></div>
    <div class="panel"><h2>De quiz</h2>
      <p class="small muted">Jouw archetype-quiz: ${QUIZ.length} gangen, vier uitslagen (${Object.values(ARCHETYPES).map(a => a.naam).join(', ')}). De teksten staan in de configuratie; wil je ook de quiz hier kunnen bewerken, dan bouwen we dat op dezelfde manier.</p></div>
  </div></div>`;
}

/* ---------- Taal van de klant ---------- */
function tabTaal(k) {
  const t = k.taal || {}; const c = t.concept; const vn = esc(voornaam(k)); const p = k.profiel || {};
  const tools = [...new Set(Object.values(k.courses).flatMap(x => x.skills))].filter(sid => data.skills[sid]?.status === 'live');
  const status = c ? '<span class="pill bezig">Concept, nog niet zichtbaar</span>' : t.live ? `<span class="pill klaar">Live sinds ${datum(t.liveOp)}</span>` : '<span class="pill dicht">Standaardteksten</span>';
  return `<div class="split"><div>
    <div class="panel"><h2>De woorden van ${vn}</h2>
      <p class="small muted" style="margin-bottom:1rem">Deze drie woorden vullen direct de standaardteksten in haar dashboard. Ze komen uit de vragenlijst; hier scherp je ze aan.</p>
      <div class="grid2">
        <label class="field">Vakgebied<input id="w-vakgebied" value="${esc(p.vakgebied)}" placeholder="jouw vak"></label>
        <label class="field">Zo noemt ze haar klanten<input id="w-klantwoord" value="${esc(p.klantwoord)}" placeholder="klanten"></label>
        <label class="field">Zo noemt ze haar aanbod<input id="w-aanbodwoord" value="${esc(p.aanbodwoord)}" placeholder="aanbod"></label>
      </div>
      <div style="margin-top:1rem"><button class="btn" data-a="taal-woorden">Woorden opslaan</button></div></div>

    <div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2>Haar dashboard in haar taal</h2>${status}</div>
      <p class="small muted">Per course herschrijft Claude wat jij doet, wat zij ermee kan en wat ze aanlevert, en per tool het voorbeeld, in de wereld van ${vn}'s business. Jouw inhoud en jouw stem blijven staan. Pas aan wat je wilt, en pas na jouw akkoord ziet ${vn} het.</p>
      ${!c ? `<div class="actions" style="margin-top:1rem">
          <button class="btn" data-a="taal-genereer" ${ui.taalBezig ? 'disabled' : ''}>${ui.taalBezig ? 'Claude is aan het vertalen…' : t.live ? 'Opnieuw laten vertalen' : 'Laat Claude vertalen'}</button>
          <button class="btn ghost" data-a="taal-handmatig">${t.live ? 'Live versie bewerken' : 'Zelf schrijven'}</button>
          ${t.live ? '<button class="btn ghost" data-a="taal-standaard">Terug naar standaardteksten</button>' : ''}</div>
        ${ui.taalFout ? `<p class="err" style="margin-top:.8rem">${esc(ui.taalFout)}</p>` : ''}
        ${!k.intake.klaar && !p.doelgroep ? `<p class="hint">Tip: het werkt het best als ${vn} de vragenlijst heeft ingevuld.</p>` : ''}` : ''}
    </div>

    ${c ? `${[...Object.keys(k.courses), 'finale'].map(cid => { const x = c.courses?.[cid] || {}; const d = COURSES[cid]; return `<div class="panel"><h2>${/^\d/.test(d.nr) ? d.nr+' ' : ''}${d.naam}</h2><div class="stack">
        <label class="field">Wat ik in deze course voor je doe (één per regel)<textarea data-c="taal" data-course="${cid}" data-f="jasmijn" style="min-height:6.5rem">${esc((x.jasmijn || courseTekst(k, cid, 'jasmijn')).join('\n'))}</textarea></label>
        <label class="field">Wat jij ermee kunt<textarea data-c="taal" data-course="${cid}" data-f="jij" style="min-height:4.5rem">${esc(x.jij ?? courseTekst(k, cid, 'jij'))}</textarea></label>
        <label class="field">Aanleveren<textarea data-c="taal" data-course="${cid}" data-f="aanleveren" style="min-height:3.5rem">${esc(x.aanleveren ?? courseTekst(k, cid, 'aanleveren'))}</textarea></label>
      </div></div>`; }).join('')}
      <div class="panel"><h2>Voorbeelden bij de tools</h2><div class="stack">${tools.map(sid => `<label class="field">${esc(SKILLS.find(x => x.id===sid).naam)}<input data-c="taal" data-tool="${sid}" value="${esc(c.tools?.[sid] ?? toolVb(k, sid))}"></label>`).join('') || '<p class="muted small">Nog geen tools vrijgegeven.</p>'}</div></div>
      <div class="panel" style="position:sticky;bottom:1rem;z-index:5;box-shadow:0 -6px 20px rgba(61,20,25,.12)"><div class="actions">
        <button class="btn" data-a="taal-live">Goedkeuren en tonen aan ${vn}</button>
        <button class="btn ghost" data-a="taal-weg">Concept weggooien</button>
        <button class="btn ghost" data-a="preview" data-id="${k.id}">Bekijk als ${vn}</button></div></div>` : ''}
  </div>
  <div class="panel" style="position:sticky;top:1rem"><h2>Waarom dit</h2>
    <p class="small muted">Een burn-outcoach voor verpleegkundigen en een strateeg voor scale-up founders lezen hetzelfde menu heel anders. Dezelfde course, dezelfde methode, maar in de woorden van hún wereld. Zo voelt het dashboard alsof het voor haar gemaakt is.</p>
    <p class="small muted" style="margin-top:.7rem">Wat er meegaat naar Claude: haar vragenlijst, quizuitslag en persoonlijke laag, plus jouw standaardteksten. Wat Claude nooit doet: jouw aanbod of methode veranderen.</p>
  </div></div>`;
}

/* ---------- Merkgeheugen ---------- */
function tabGeheugen(k) {
  const p = k.profiel || {}; const g = k.geheugen || { stem:[], kern:{} }; const vn = esc(voornaam(k));
  const v = ui.voorstel && ui.voorstel.id === k.id ? ui.voorstel.data : null;
  const woorden = merkContext(k).split(/\s+/).length;
  const kaartVelden = [['kernbelofte','Kernbelofte (één zin)','area'],['doelgroep','Doelgroep','text'],['pijn','Waar haar klant vastloopt','area'],['resultaat','Resultaat dat ze levert','area'],
    ['positionering','Positionering: wat dit níet is','area'],['pijlers','Content-pijlers (één per regel, max. 4)','area'],['toon','Toon (3 tot 5 woorden)','text'],['nooit','Klinkt nooit','text']];
  const waarde = f => f === 'pijlers' ? (p.pijlers || []).join('\n') : (p[f] || '');
  return `<div class="split"><div>
    ${v ? `<div class="panel voorstel"><h2>Voorstel van Claude</h2><p class="small muted" style="margin-bottom:1rem">Gebaseerd op de vragenlijst, de quiz, wat er al in het geheugen staat en je aantekeningen. Pas aan en neem over, of gooi weg.</p><div class="stack">
        ${kaartVelden.map(([f,l]) => v[f] ? `<label class="field">${l}<textarea id="v-${f}" style="min-height:3.4rem">${esc(Array.isArray(v[f]) ? v[f].join('\n') : v[f])}</textarea></label>` : '').join('')}
        ${Object.entries(v.kern || {}).filter(([c]) => k.courses[c]).map(([c,t]) => `<label class="field">Kerninhoud ${COURSES[c].naam}<textarea id="vk-${c}" style="min-height:4rem">${esc(t)}</textarea></label>`).join('')}
      </div><div class="actions" style="margin-top:1rem"><button class="btn" data-a="geh-overnemen">Voorstel overnemen</button><button class="btn ghost" data-a="geh-weg">Weggooien</button></div></div>` : ''}

    <div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2>Brand Foundation-kaart</h2>
      <span class="actions"><button class="btn ghost sm" data-a="profiel-vul">Opnieuw uit vragenlijst</button><button class="btn sm" data-a="geh-voorstel" ${ui.gehBezig ? 'disabled' : ''}>${ui.gehBezig ? 'Claude denkt mee…' : 'Laat Claude voorstellen'}</button></span></div>
      ${ui.gehFout ? `<p class="err" style="margin-bottom:.8rem">${esc(ui.gehFout)}</p>` : ''}
      <div class="stack">${kaartVelden.map(([f,l,t]) => `<label class="field">${l}${t==='area' ? `<textarea id="f-${f}" style="min-height:3.4rem">${esc(waarde(f))}</textarea>` : `<input id="f-${f}" value="${esc(waarde(f))}">`}</label>`).join('')}</div>
      <div style="margin-top:1rem"><button class="btn" data-a="geh-save">Kaart opslaan</button></div></div>

    ${(() => { const t = hdToon(k); return t ? `<div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2>Human Design in haar toon</h2><span class="small muted">${esc(t.label)}</span></div>
      <ul class="doeslist">${t.regels.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      <label class="check" style="margin-top:.8rem"><input type="checkbox" data-c="hd-toon" ${k.werkplek?.hdInToon !== false ? 'checked' : ''}> Meenemen in al haar schrijftools en de sous-chef</label>
      <p class="hint">Komt uit haar chart in Workflow. Haar eigen toon en stemvoorbeelden blijven leidend; dit kleurt hoe ze schrijft.</p></div>` : ''; })()}
    <div class="panel"><h2>Stemvoorbeelden</h2>
      <p class="small muted" style="margin-bottom:.8rem">Teksten die echt als ${vn} klinken. Dit is het krachtigste wat je een tool kunt meegeven: sterker dan drie woorden over haar toon. Drie tot vijf korte voorbeelden is genoeg.</p>
      <div class="rows">${(g.stem || []).map(x => `<div class="row"><div class="t"><strong>${esc(x.bron)}</strong><span style="white-space:pre-line">${esc(x.tekst)}</span></div><button class="btn ghost sm" data-a="stem-weg" data-id="${x.id}">Verwijderen</button></div>`).join('') || '<p class="muted small">Nog geen voorbeelden.</p>'}</div>
      <div class="stack" style="margin-top:1rem">
        <label class="field">Bron<select id="st-bron">${STEM_BRONNEN.map(b => `<option>${b}</option>`).join('')}</select></label>
        <label class="field">Tekst (plak een uitgeschreven voice memo, post of bericht)<textarea id="st-tekst" maxlength="1500"></textarea></label>
        <div><button class="btn ghost" data-a="stem-add">Voorbeeld toevoegen</button></div></div></div>

    <div class="panel"><h2>Kerninhoud per course</h2>
      <p class="small muted" style="margin-bottom:.8rem">De essentie uit jouw deliverables: wat een tool moet weten, niet het hele document. Wordt direct bewaard.</p>
      <div class="stack">${Object.keys(k.courses).map(c => { const docs = k.courses[c].bestanden.filter(b => b.soort==='opgediend').map(b => b.naam); return `<label class="field">${/^\d/.test(COURSES[c].nr) ? COURSES[c].nr+' ' : ''}${COURSES[c].naam}${docs.length ? ` <span class="muted" style="font-weight:400">uit: ${docs.map(esc).join(', ')}</span>` : ''}<textarea data-c="kern" data-course="${c}" placeholder="${esc(KERN_HINT[c])}" style="min-height:3.6rem">${esc(g.kern?.[c])}</textarea></label>`; }).join('')}</div></div>
  </div>
  <div style="position:sticky;top:1rem">
    <div class="panel"><h2>Zo ziet een tool ${vn}</h2>
      <p class="small muted" style="margin-bottom:.8rem">Dit gaat bij élke tool mee, bovenop jouw SKILL.md. ${g.bijgewerkt ? 'Laatst bijgewerkt '+datum(g.bijgewerkt)+'.' : ''} Ongeveer ${woorden} woorden.</p>
      <pre class="ctx">${esc(merkContext(k))}</pre></div>
  </div></div>`;
}

function shootBeheer(k, sh) {
  const status = sh.final ? `<span class="pill klaar">Bewerkte foto's staan klaar</span>` : sh.selectieKlaar ? `<span class="pill actie">Selectie binnen op ${datum(sh.selectieOp)}: tijd om te bewerken</span>` : sh.selectie ? `<span class="pill bezig">${esc(voornaam(k))} is aan het kiezen</span>` : `<span class="pill dicht">Nog geen galerij</span>`;
  return `<div class="shootadmin"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h3>Brand shoot: shoot en foto's</h3>${status}</div>
    <div class="grid2"><label class="field">Pixieset: galerij voor haar selectie<input type="url" id="sh-selectie" value="${esc(sh.selectie)}" placeholder="https://jouwnaam.pixieset.com/..."></label>
      <label class="field">Selectie graag vóór<input type="date" id="sh-deadline" value="${esc(sh.deadline)}"></label></div>
    <label class="field">Pixieset: galerij met de bewerkte foto's om te downloaden<input type="url" id="sh-final" value="${esc(sh.final)}" placeholder="https://jouwnaam.pixieset.com/..."></label>
    <div class="actions"><button class="btn" data-a="shoot-save">Shoot opslaan</button>${sh.selectieKlaar ? '<button class="btn ghost" data-a="selectie-reset">Selectie heropenen</button>' : ''}</div>
    <p class="hint">Zet in Pixieset bij de selectiegalerij favorieten aan, zodat ze met een hartje kiest. Zet bij de galerij met bewerkte foto's downloaden aan. ${esc(voornaam(k))} ziet alles direct in haar portaal, en jij krijgt een melding als ze kiest, klaar is of downloadt.</p></div>`;
}

function shootPrepBeheer(k, sh) {
  const vn = esc(voornaam(k));
  return `<div class="shootadmin"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h3>Brand shoot: voorbereiding</h3>
      ${sh.datum ? `<span class="pill klaar">Gepland op ${datum(sh.datum)}</span>` : '<span class="pill dicht">Nog geen datum</span>'}</div>
    <div class="grid2"><label class="field">Shootdatum<input type="date" id="sh-datum" value="${esc(sh.datum)}"></label><label class="field">Locatie<input id="sh-locatie" value="${esc(sh.locatie)}"></label></div>
    <label class="field">Voorbereiding voor ${vn} (outfits, wat ze meeneemt, hoe ze zich voorbereidt)<textarea id="sh-notitie">${esc(sh.notitie)}</textarea></label>
    <label class="check"><input type="checkbox" id="sh-shotlist" ${sh.shotlistKlaar ? 'checked' : ''}> Shotlist en regie zijn klaar</label>
    <div><p class="sectlabel" style="margin-top:.2rem">Aangeleverd door ${vn} voor de shoot</p>
      ${(sh.uploads||[]).map(u => `<div class="row" style="padding:.4rem 0"><div class="t"><strong>${esc(u.naam)}</strong><span>${datum(u.op)} &nbsp;|&nbsp; ${grootte(u.grootte)}</span></div></div>`).join('') || '<p class="muted small">Nog niets aangeleverd.</p>'}</div>
    <div class="actions"><button class="btn" data-a="shoot-save">Voorbereiding opslaan</button></div>
    <p class="hint">${vn} ziet dit als eigen kopje in Positioning Cut, met datum, jouw voorbereiding, de status van de beeldrechten en een plek om haar moodboard-favorieten en outfits aan te leveren. De shoot zelf en haar foto's staan in Plating.</p></div>`;
}

/* ---------- Menu-teksten: wat je per course doet, wat zij ermee kan, wat ze aanlevert ---------- */
function menuTekstenBeheer() {
  const velden = [['jasmijn','Wat ik in deze course voor je doe (één punt per regel)','area'],['jij','Wat jij ermee kunt','area'],['aanleveren','Wat je aanlevert','area']];
  const waarde = (c, f) => { const o = data.courseTeksten[c] || {}; const v = o[f] ?? COURSES[c][f]; return Array.isArray(v) ? v.join('\n') : (v || ''); };
  return `<div class="pagehead"><div><h1>Menu-teksten</h1><p>Wat klanten per course lezen. Klopt iets niet met wat je écht doet? Pas het hier aan: het staat direct bij iedereen.</p></div></div>
  <div class="split"><div>${Object.keys(COURSES).map(c => { const d = COURSES[c]; const open = ui.openTekst === c; const aangepast = !!Object.keys(data.courseTeksten[c] || {}).length;
    return `<div class="acc"><button data-a="tekst-acc" data-id="${c}" aria-expanded="${open}"><span class="anr">${c === 'finale' ? `<span class="monorond">${monoIcoon()}</span>` : d.nr}</span><span><span class="anm">${d.naam}</span><span class="asb">${esc(d.sub)}</span></span>${aangepast ? '<span class="pill bezig">Aangepast</span>' : '<span class="pill dicht">Startversie</span>'}</button>
    ${open ? `<div class="acc-body"><div class="stack">
      ${velden.map(([f,l]) => `<label class="field">${l}<textarea data-c="ct" data-course="${c}" data-f="${f}" style="min-height:${f==='jasmijn'?'6.5':'4'}rem">${esc(waarde(c, f))}</textarea></label>`).join('')}
      ${jouwWerkBlok(c)}
      <label class="field">Jouw eigen notities bij deze gang (alleen voor jou)<textarea data-c="ct" data-course="${c}" data-f="jouwWerk" style="min-height:3.4rem" placeholder="Bijv. wat je anders doet dan de standaard, of hoe lang het bij jou echt duurt">${esc(data.courseTeksten[c]?.jouwWerk || '')}</textarea></label>
      <p class="sectlabel">Bij klanten met een brand shoot</p>
      <p class="small muted" style="margin-top:-.4rem">Laat leeg als het hetzelfde is. Gevuld? Dan zien klanten met een shoot deze versie.</p>
      ${velden.map(([f,l]) => `<label class="field">${l}<textarea data-c="ct" data-course="${c}" data-f="${f}Shoot" style="min-height:${f==='jasmijn'?'6.5':'3.4'}rem">${esc(waarde(c, f+'Shoot'))}</textarea></label>`).join('')}
      ${aangepast ? `<div><button class="btn ghost sm" data-a="tekst-reset" data-id="${c}">Terug naar de startversie</button></div>` : ''}
    </div></div>` : ''}</div>`; }).join('')}</div>
  <div class="panel" style="position:sticky;top:1rem"><h2>Goed om te weten</h2>
    <p class="small muted">Gebruik {klanten}, {aanbod} en {vakgebied}: die worden per klant ingevuld met haar eigen woorden.</p>
    <p class="small muted" style="margin-top:.7rem">Heb je voor een klant het dashboard al laten vertalen naar haar taal (tabblad Taal)? Dan ziet zij haar vertaalde versie. Laat Claude opnieuw vertalen om je nieuwe teksten mee te nemen.</p>
    <p class="small muted" style="margin-top:.7rem">De brand shoot staat standaard in Positioning Cut (voorbereiding) en Plating (eerst de shoot, dan de templates met haar foto's).</p></div></div>`;
}

/* ---------- Platformkennis ---------- */
function platformBeheer() {
  return `<div class="pagehead"><div><h1>Actuele kennis</h1><p>Wat nu werkt, per onderwerp, elke week bijgewerkt. Elke tool krijgt de kennis van zijn onderwerpen mee, bovenop je SKILL.md en het merkgeheugen van de klant. Bij kanalen alleen voor de kanalen die zij gebruikt.</p></div></div>
  <div class="split"><div>${Object.entries(data.platform).map(([p, x]) => { const tools = SKILLS.filter(s => kennisVan(s.id).includes(p));
    return `<div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2>${esc(x.titel)}</h2>
      ${!x.bijgewerkt ? '<span class="pill actie">Nog niet ingevuld</span>' : platformOud(x) ? `<span class="pill actie">Bijgewerkt ${datum(x.bijgewerkt)}: tijd voor een update</span>` : `<span class="pill klaar">Bijgewerkt ${datum(x.bijgewerkt)}</span>`}</div>
      <div class="stack" style="margin-top:.8rem">
        <label class="field">Wat nu werkt (één punt per regel)<textarea id="pk-tekst-${p}" style="min-height:14rem">${esc(x.tekst)}</textarea></label>
        <label class="field">Bronnen (één per regel)<textarea id="pk-bronnen-${p}" style="min-height:4.5rem">${esc((x.bronnen||[]).join('\n'))}</textarea></label>
        <div class="actions"><button class="btn" data-a="pk-save" data-id="${p}">Opslaan als bijgewerkt vandaag</button></div>
        <p class="small muted">Gebruikt door: ${tools.map(s => esc(s.naam)).join(', ') || 'nog geen tools'}.</p></div></div>`; }).join('')}</div>
  <div class="panel" style="position:sticky;top:1rem"><h2>Altijd actueel</h2>
    <p class="small muted">Algoritmes veranderen, en niemand kan viraal gaan garanderen. Wat wel kan: je tools altijd laten werken met de nieuwste inzichten, en dat bijhouden zonder dat je het zelf hoeft uit te zoeken.</p>
    <p class="small muted" style="margin-top:.7rem"><strong>In de live versie</strong> doet een serverfunctie elke week webonderzoek per platform (officiële bronnen van het platform, onafhankelijk onderzoek) en zet een voorstel klaar met bronnen. Jij krijgt een melding, leest het na en keurt goed. Daarna werken alle tools van alle klanten met de nieuwe kennis.</p>
    <label class="check" style="margin-top:1rem"><input type="checkbox" data-c="pk-auto" ${data.platformAuto ? 'checked' : ''}> Voorstellen automatisch doorvoeren als ik ze niet binnen 2 dagen aanpas</label>
    <p class="small muted" style="margin-top:.5rem">Zo klopt je belofte van wekelijkse updates ook in drukke weken. Ouder dan 9 dagen? Dan zie je het onder Aandacht nodig.</p>
    <p class="sectlabel">Wat klanten zien</p><p class="small muted">Bij elke tool met actuele kennis: "Wekelijks bijgewerkt", met de datum van de laatste update. Boven hun tools: "${USP_WEKELIJKS}"</p></div></div>`;
}

/* ---------- Brand Audit maken ---------- */
function tabAudit(k) {
  const a = auditVan(k); const vn = esc(voornaam(k)); const arch = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const vraagVan = id => { for (const d of data.vragenlijst) { const q = d.vragen.find(x => x.id === id); if (q) return q.l; } return id; };
  const klaarVoor = !!k.quiz && k.intake.klaar;
  const stappen = [
    [!!k.quiz, `${vn} heeft de quiz gedaan`], [k.intake.klaar, `${vn} heeft de vragenlijst ingevuld`],
    [!!(k.intake.velden.instagram || k.intake.velden.website), `Bekijk haar online: ${[k.intake.velden.instagram, k.intake.velden.website].filter(Boolean).map(esc).join(' en ') || 'nog geen links'}`],
    [['01','02','04'].every(c => a.courses[c]?.score), 'Geef per gang een score (1 tot 5), wat je ziet en een eerste stap'],
    [a.top3.filter(Boolean).length === 3, 'Kies haar top 3 acties'], [!!a.advies, 'Kies je advies voor de volgende stap'], [!!a.video, 'Neem je video op in Loom en plak de link (optioneel, maar maakt het persoonlijk)'], [a.status === 'gedeeld', `Deel de audit met ${vn}`] ];
  return `<div class="split"><div>
    <div class="panel"><h2>Jouw input, in ± 40 minuten</h2><ol class="auditstappen">${stappen.map(([ok, t]) => `<li class="${ok ? 'klaar' : ''}"><span class="vink" aria-hidden="true">${ok ? '✓' : ''}</span>${t}</li>`).join('')}</ol>
      <p class="hint">Alles wat ${vn} al vertelde staat hiernaast per gang klaar. Claude kan een eerste versie maken; jij scherpt aan met je eigen blik. Pas na "Delen" ziet ${vn} het.</p>
      <div class="actions" style="margin-top:.8rem"><button class="btn" data-a="audit-concept" ${klaarVoor && !ui.auditBezig ? '' : 'disabled'}>${ui.auditBezig ? 'Claude denkt mee…' : 'Laat Claude een eerste versie maken'}</button></div>
      ${!klaarVoor ? `<p class="hint">Beschikbaar zodra ${vn} de quiz en de vragenlijst heeft afgerond.</p>` : ''}${ui.auditFout ? `<p class="err">${esc(ui.auditFout)}</p>` : ''}</div>

    ${['01','02','04'].map(c => { const x = a.courses[c] || {}; return `<div class="panel"><h2>${COURSES[c].nr} ${COURSES[c].naam}</h2>
      <div class="grid2"><label class="field">Score<select data-c="audit" data-course="${c}" data-f="score"><option value="">Kies</option>${[1,2,3,4,5].map(n => `<option value="${n}" ${+x.score===n?'selected':''}>${n} van 5</option>`).join('')}</select></label></div>
      <label class="field" style="margin-top:.8rem">Wat ik zie (2 tot 3 zinnen)<textarea data-c="audit" data-course="${c}" data-f="zie">${esc(x.zie)}</textarea></label>
      <label class="field" style="margin-top:.8rem">Je eerste stap<input data-c="audit" data-course="${c}" data-f="actie" value="${esc(x.actie)}"></label></div>`; }).join('')}

    <div class="panel"><h2>Top 3 en advies</h2><div class="stack">
      ${[0,1,2].map(i => `<label class="field">Actie ${i+1}<input data-c="audit-top" data-i="${i}" value="${esc(a.top3[i])}"></label>`).join('')}
      <label class="field">Mijn advies voor de volgende stap<select data-c="audit-veld" data-f="advies"><option value="">Kies</option>${AUDIT_ADVIES.map(x => `<option ${a.advies===x?'selected':''}>${x}</option>`).join('')}</select></label>
      <label class="field">Waarom (1 tot 2 zinnen)<textarea data-c="audit-veld" data-f="adviesTekst" style="min-height:4rem">${esc(a.adviesTekst)}</textarea></label>
      <label class="field">Videolink (Loom): jouw toelichting van 5 tot 10 minuten<input type="url" data-c="audit-veld" data-f="video" value="${esc(a.video || '')}" placeholder="https://www.loom.com/share/..."></label>
      <div class="actions">${a.status === 'gedeeld' ? `<span class="pill klaar">Gedeeld op ${datum(a.gedeeldOp)}</span><button class="btn ghost sm" data-a="audit-terug">Terug naar concept</button>` : `<button class="btn" data-a="audit-deel">Delen met ${vn}</button>`}<button class="btn ghost" data-a="preview" data-id="${k.id}">Bekijk als ${vn}</button></div>
    </div></div>
  </div>
  <div style="position:sticky;top:1rem">
    <div class="panel"><h2>Wat ${vn} vertelde</h2>
      ${arch ? `<div class="archcard" style="margin-bottom:1rem"><p style="margin:0;color:var(--gold);font-size:.8rem">Quiz</p><h3>${arch.naam}</h3><p><strong style="color:var(--gold)">Blinde vlek.</strong> ${esc(arch.blind)}</p></div>` : '<p class="muted small">Quiz nog niet gedaan.</p>'}
      ${['01','02','04'].map(c => `<p class="sectlabel">${COURSES[c].naam}</p><dl>${AUDIT_TEKST[c].bron.filter(id => k.intake.velden[id]).map(id => `<div class="qa"><dt>${esc(vraagVan(id))}</dt><dd>${esc(k.intake.velden[id])}</dd></div>`).join('') || '<p class="muted small">Nog geen antwoorden.</p>'}</dl>`).join('')}
    </div></div></div>`;
}

/* ---------- Wat jij oplevert (alleen voor jou) ---------- */
function jouwWerkBlok(c) {
  const w = jouwWerk(c); if (!w) return '';
  return `<div class="jouwwerk"><p class="kicker">Voor jou: wat je oplevert</p>
    <div class="jwgrid"><div><strong>Opleveren</strong><ul>${w.opleveren.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><strong>Wat je doet</strong><ul>${w.taken.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><strong>Tijd</strong><p>${esc(w.tijd)}</p><strong>Doorlooptijd</strong><p>${esc(w.doorloop)}</p>${w.vrij ? `<strong>Jouw notitie</strong><p>${esc(w.vrij)}</p>` : ''}</div></div></div>`;
}

/* ---------- Dossier: alles wat de klant over zichzelf vertelde, in één oogopslag ---------- */
function dossierTekst(k) {
  const r = []; const p = k.profiel || {}; const a = k.quiz && ARCHETYPES[k.quiz.uitslag]; const g = k.geheugen || {};
  r.push(`# ${k.naam}${k.bedrijf ? ' | ' + k.bedrijf : ''}`, `Pakket: ${PAKKETTEN[k.pakket].naam}. E-mail: ${k.email}. Kanalen: ${(k.platformen || []).map(d => KENNISDOMEINEN[d]?.titel).join(', ') || 'niet gekozen'}.`, '');
  r.push('## Quiz', a ? `${a.naam} (${a.sub}). Blinde vlek: ${a.blind}` : 'Nog niet gedaan.', '');
  r.push('## Vragenlijst'); vragenlijstVoor(k).forEach(d => { const rij = d.vragen.filter(q => k.intake.velden[q.id]); if (rij.length) { r.push(`### ${d.titel}`); rij.forEach(q => r.push(`- ${q.l}\n  ${k.intake.velden[q.id]}`)); } }); r.push('');
  r.push('## Brand Foundation'); [['Kernbelofte','kernbelofte'],['Doelgroep','doelgroep'],['Waar haar klanten vastlopen','pijn'],['Resultaat','resultaat'],['Positionering','positionering'],['Toon','toon'],['Klinkt nooit','nooit'],['Merkgevoel','gevoel'],['Kleurwensen','kleurwens']].forEach(([l, f]) => { if (p[f]) r.push(`- ${l}: ${p[f]}`); });
  if ((p.pijlers || []).length) r.push(`- Content-pijlers: ${p.pijlers.join(', ')}`); r.push('');
  if ((g.stem || []).length) { r.push('## Stemvoorbeelden'); g.stem.forEach(x => r.push(`> ${x}`)); r.push(''); }
  if (Object.keys(g.kern || {}).length) { r.push('## Kerninhoud per gang'); Object.entries(g.kern).forEach(([c, t]) => t && r.push(`- ${COURSES[c]?.naam || c}: ${t}`)); r.push(''); }
  r.push('## Human Design', hdSamenvatting(k), '');
  if (k.plan90) { const x = planReken(k.plan90); r.push('## 90-dagenplan', `Doel ${euro(k.plan90.doel)} vanaf ${k.plan90.start}. Aanbod: ${k.plan90.aanbod.map(a => a.naam + ' ' + euro(a.prijs)).join(', ')}. Nodig: ${x.totKlanten} klanten, ${x.gesprekken} gesprekken, ${x.leads} leads.`, ''); }
  const w = k.werkplek || {}; const ideeen = w.ideeen || []; if (ideeen.length) { r.push('## Ideeënvoorraad'); ideeen.forEach(x => r.push(`- ${x.t}`)); r.push(''); }
  if ((k.eigenTools || []).length) { r.push('## Eigen tools'); k.eigenTools.forEach(t => r.push(`- ${t.naam}: ${t.doel}`)); r.push(''); }
  const vragen = (k.chat || []).filter(m => m.rol === 'user'); if (vragen.length) { r.push('## Wat ze de sous-chef vroeg'); vragen.slice(-25).forEach(m => r.push(`- ${datum(m.op)}: ${m.tekst}`)); r.push(''); }
  const uploads = Object.entries(k.courses).flatMap(([c, x]) => (x.uploads || []).map(u => `${COURSES[c].naam}: ${u.naam}`)); if (uploads.length) { r.push('## Wat ze aanleverde'); uploads.forEach(x => r.push(`- ${x}`)); }
  return r.join('\n');
}
function tabDossier(k) {
  const vn = esc(voornaam(k)); const tekst = dossierTekst(k);
  return `<div class="split"><div>
    <div class="panel"><div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;align-items:baseline"><h2>Dossier van ${vn}</h2>
      <div class="actions"><button class="btn" data-a="dossier-kopieer">Kopieer alles</button></div></div>
      <p class="small muted" style="margin:.4rem 0 1rem">Alles wat ${vn} over zichzelf en haar business vertelde: quiz, vragenlijst, Brand Foundation, stem, Human Design, 90-dagenplan, ideeën, eigen tools en wat ze de sous-chef vroeg. Kopieer het en plak het in Claude, een document of je eigen notities om buiten het dashboard voor haar te werken.</p>
      <textarea id="dossier" class="dossiertekst" readonly>${esc(tekst)}</textarea></div>
  </div><div style="position:sticky;top:1rem">
    <div class="panel"><h2>In één oogopslag</h2>
      <dl>${[['Quiz', k.quiz ? ARCHETYPES[k.quiz.uitslag].naam : 'nog niet'],['Vragenlijst', k.intake.klaar ? 'ingevuld' : 'nog niet af'],['Belofte', k.profiel?.kernbelofte],['Doelgroep', k.profiel?.doelgroep],['Toon', k.profiel?.toon],['Human Design', k.werkplek?.energietype ? `${k.werkplek.energietype}${k.werkplek.profiel ? ', ' + k.werkplek.profiel : ''}` : ''],['Kanalen', (k.platformen || []).map(d => KENNISDOMEINEN[d]?.titel).join(', ')],['Vragen aan de sous-chef', (k.chat || []).filter(m => m.rol === 'user').length]].filter(([, v]) => v !== undefined && v !== '').map(([l, v]) => `<div class="qa"><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div></div></div>`;
}
document.addEventListener('click', e => { const el = e.target.closest('[data-a="dossier-kopieer"]'); if (!el) return; const t = document.getElementById('dossier'); if (!t) return;
  const klaar = () => toast('Gekopieerd. Plak het waar je wilt.'); if (navigator.clipboard?.writeText) navigator.clipboard.writeText(t.value).then(klaar, () => { t.select(); document.execCommand('copy'); klaar(); }); else { t.select(); document.execCommand('copy'); klaar(); } });

/* ---------- Aanbod & prijzen: wat klanten op Samenwerken zien ---------- */
function aanbodBeheer() {
  return `<div class="pagehead"><div><h1>Aanbod & prijzen</h1><p>Wat klanten zien op Samenwerken: titel, uitleg, prijs en wat erin zit. Wijzigingen staan direct bij iedereen.</p></div></div>
  <div class="panel"><h2>Je pakketten</h2><p class="small muted" style="margin-bottom:1rem">Prijs en wat erin zit. Klanten zien hun eigen pakket bovenaan Samenwerken, onder "Wat je al hebt".</p>
    ${Object.entries(PAKKETTEN).map(([p, x]) => `<details class="pakketedit"><summary><strong>${esc(x.naam)}</strong> <span class="muted small">${esc(pakketPrijs(p))}</span></summary>
      <div class="grid2" style="margin-top:.6rem"><label class="field">Prijs<input data-c="pakketprijs" data-p="${p}" value="${esc(pakketPrijs(p))}" placeholder="Bijv. €1.500, in overleg"></label></div>
      <label class="field" style="margin-top:.6rem">Wat zit erin (één punt per regel)${p === 'templates' || p === 'identity' ? ' <span class="muted">(gelijk aan de extra met dezelfde naam, tenzij je hier iets anders invult)</span>' : ''}<textarea data-c="pakketinhoud" data-p="${p}" style="min-height:7rem">${esc(pakketInhoud(p).join('\n'))}</textarea></label></details>`).join('')}</div>
  ${BOEKEN.map(b0 => { const b = boekItem(b0); const open = ui.openAanbod === b.id; return `<div class="acc"><button data-a="aanbod-acc" data-id="${b.id}" aria-expanded="${open}"><span class="anr">${b.uitgelicht ? '✦' : ''}</span><span><span class="anm">${esc(b.titel)}</span><span class="asb">${esc(b.id === 'dwy' || b.id === 'audit' ? pakketPrijs(b.id) : b.prijs || '')}</span></span>${b.verborgen ? '<span class="pill dicht">Verborgen</span>' : ''}</button>
    ${open ? `<div class="acc-body"><div class="split"><div class="stack">
      <label class="field">Titel<input data-c="aanbod" data-id="${b.id}" data-f="titel" value="${esc(b.titel)}"></label>
      <label class="field">Uitleg<textarea data-c="aanbod" data-id="${b.id}" data-f="tekst" style="min-height:4rem">${esc(b.tekst)}</textarea></label>
      ${b.id === 'dwy' || b.id === 'audit' ? '<p class="small muted">De prijs van dit pakket pas je bovenaan aan.</p>' : `<label class="field">Prijs (bijv. €295, in overleg, op aanvraag)<input data-c="aanbod" data-id="${b.id}" data-f="prijs" value="${esc(b.prijs || '')}"></label>`}
      <label class="field">Waarom kiezen voor deze optie (optioneel)<textarea data-c="aanbod" data-id="${b.id}" data-f="waarom" style="min-height:3rem">${esc(b.waarom || '')}</textarea></label>
      ${b.extra ? `<label class="field">Wat zit erin (één punt per regel, geldt voor alles onder "${esc(b.extra)}")<textarea data-c="inhoud" data-extra="${esc(b.extra)}" style="min-height:8rem">${esc(inhoudVan(b.extra).join('\n'))}</textarea></label>` : ''}
      <label class="check"><input type="checkbox" data-c="aanbod-verborgen" data-id="${b.id}" ${b.verborgen ? 'checked' : ''}> Verbergen voor klanten</label>
    </div><div><p class="sectlabel" style="margin-top:0">Zo ziet de klant het</p>${aanbodKaart(b, null)}</div></div></div>` : ''}</div>`; }).join('')}`;
}
