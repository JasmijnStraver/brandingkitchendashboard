/* =====================================================================
   KLANTPORTAAL — wat je klant ziet na inloggen
   ===================================================================== */
function inlog() {
  if (ui.inlogScherm) return wachtwoordScherm();
  return `<div class="login" ${beeld('inlogBeeld') ? `style="background-image:linear-gradient(rgba(40,12,16,.35),rgba(40,12,16,.55)),url(${beeld('inlogBeeld')})"` : ''}><div class="logincard fade">
    <div class="loginkop">${logo(false)}
      <h1>Welkom</h1>
      <p>Log in op je persoonlijke portaal. Het dashboard van jouw business. Hier bouwen we samen aan je merk, volgens The Branding Kitchen™.</p></div>
    <div class="stack">
      <label class="field">E-mailadres<input id="l-email" type="email" autocomplete="email"></label>
      <label class="field">Wachtwoord<input id="l-ww" type="password" autocomplete="current-password"></label>
      ${ui.loginFout ? `<p class="err">${ui.loginFout}</p>` : ''}
      <button class="btn" data-a="login">Inloggen</button>
      <button class="linkbtn wwvergeten" data-a="ww-vergeten">Wachtwoord vergeten?</button>
    </div>
    <div class="demoacc"><span style="opacity:.7">Demo: kies een account, een wachtwoord is hier niet nodig</span>
      ${data.klanten.map(k => `<button data-a="login-demo" data-id="${k.id}">${esc(k.naam)} <span style="opacity:.6">${esc(PAKKETTEN[k.pakket].naam)}</span></button>`).join('')}
    </div></div></div>`;
}

function portaal(k) {
  const nav = [['home','Welkom'],['menu','Jouw menu'], ...(merkOpen(k) ? [['merk','Signature Dish']] : []), ['werkplek','Workflow'],['docs','Documenten'],['samen','Samenwerken'],['stijl','Mijn stijl']];
  const view = { home:kHome, quiz:kQuiz, intake:kIntake, menu:kMenu, course:kCourse, docs:kDocs, merk:kMerk, werkplek:kWerkplek, samen:kSamen, stijl:kStijl }[ui.cv] || kHome;
  return `<header class="ctop"><a href="#" class="logolink" data-a="naar-start" aria-label="Naar je startpagina">${logo(true)}</a>
    <nav class="cnav" aria-label="Portaal">${nav.map(([v,l]) => `<button data-a="cv" data-v="${v}" aria-current="${ui.cv===v || (v==='menu'&&ui.cv==='course')}">${l}</button>`).join('')}
    <button class="linkbtn" data-a="logout" style="color:var(--gold)">${ui.preview ? 'Terug naar je keuken' : 'Uitloggen'}</button></nav></header>
    <div class="${nieuweView('k'+ui.cv+ui.course+ui.quizStap+k.intake.stap)}">${view(k)}</div>
    ${['quiz','intake'].includes(ui.cv) ? '' : voet()}
    ${['quiz','intake'].includes(ui.cv) ? '' : chatKnop(k)}
    ${cbar(k)}`;
}
const ICON = {
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  menu:'<path d="M5 4h14M5 9h14M5 14h9M5 19h6"/>',
  werkplek:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  merk:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
  meer:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
};
function cbar(k) {
  const items = [['home','Welkom'],['menu','Menu'],['chat','Sous-chef'], merkOpen(k) ? ['merk','Dessert'] : ['werkplek','Workflow'], ['meer','Meer']];
  const actief = v => v==='menu' ? ['menu','course'].includes(ui.cv) : v==='meer' ? ['docs','samen','stijl', merkOpen(k) ? 'werkplek' : ''].includes(ui.cv) : ui.cv===v;
  return `<div class="cbar-spacer"></div><nav class="cbar" aria-label="Portaal">${items.map(([v,l]) => `<button data-a="${v==='meer' ? 'meer-open' : v==='chat' ? 'chat-open' : 'cv'}" data-v="${v}" aria-current="${v==='chat' ? !!ui.chatOpen : actief(v)}">${v === 'merk' ? monoIcoon('cbarmono') : `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[v]}</svg>`}<span>${l}</span></button>`).join('')}</nav>
  ${ui.meerOpen ? `<div class="overlay sheetbg" data-a="meer-dicht"><div class="sheet" role="dialog" aria-label="Meer">
    ${merkOpen(k) ? `<button data-a="cv" data-v="werkplek">Workflow</button>` : ''}
    <button data-a="cv" data-v="docs">Documenten</button><button data-a="cv" data-v="samen">Samenwerken met Studio Crave</button><button data-a="cv" data-v="stijl">Mijn stijl</button>
    <button data-a="logout">${ui.preview ? 'Terug naar je keuken' : 'Uitloggen'}</button></div></div>` : ''}`;
}

function kHome(k) {
  const p = data.portaal; const q = p.quotes[ui.quote % Math.max(1, p.quotes.length)] || '';
  const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const stap = !k.quiz ? 0 : !k.intake.klaar ? 1 : 2;
  const cta = [
    `<button class="btn gold big" data-a="cv" data-v="quiz">Start met de quiz</button><span class="note">Zeven vragen, twee minuten. Daarna volgt de vragenlijst over jou en je business.</span>`,
    `<button class="btn gold big" data-a="cv" data-v="intake">${k.intake.stap ? 'Verder met je vragenlijst' : 'Start je vragenlijst'}</button><span class="note">Over jou en je business. Hoe meer je vertelt, hoe persoonlijker alles wordt, ook je tools.</span>`,
    merkOpen(k) ? `<button class="btn gold big" data-a="cv" data-v="merk">Naar je Signature Dish</button><span class="note">Je dessert: je hele merk op één bord. Je tools en je sous-chef blijven beschikbaar.</span>` : `<button class="btn gold big" data-a="cv" data-v="menu">Open je menu</button><span class="note">Je bent nu bij: ${esc(huidige(k))}</span>`][stap];
  const nieuw = Object.entries(k.courses).flatMap(([c, x]) => x.bestanden.map(b => ({ ...b, c }))).sort((x,y) => y.op.localeCompare(x.op)).slice(0, 3);
  const teken = k.documenten.filter(d => d.status==='te-tekenen');
  return `<section class="hero heroband">
    <div class="banner">${actiefThema() && !actiefThema().fotos?.banner ? '<div class="bannerthema"></div>' : fotoBron('banner') ? `<img src="${fotoBron('banner')}" alt="" style="${fotoStijl('banner')}">` : beeld('inlogBeeld') ? `<img src="${beeld('inlogBeeld')}" alt="" class="bannerstandaard">` : `<div class="bannerleeg">Jouw banner komt hier: liggend beeld, bijvoorbeeld 2400 × 1000 px. Upload hem in Portaal & huisstijl.</div>`}
      <div class="bannertekst">${actiefThema()?.logo ? `<img src="${actiefThema().logo}" alt="${esc(k.bedrijf)}" class="klantlogo">` : ''}<p class="hello">Welkom bij Studio Crave, ${esc(voornaam(k))}</p><h1>${esc(p.welkomKop)}</h1></div></div>
    <div class="hero-in hero-onder">
      <div>${q ? `<figure class="quotefig">${fotoBron('fotoJasmijn') ? `<span class="fotoring">${fotoVak('fotoJasmijn', 'Jasmijn Straver')}</span>` : ''}<blockquote class="quote" style="margin:0">${esc(q)}<cite>Jasmijn Straver, Studio Crave</cite></blockquote></figure>` : ''}</div>
      <div><p class="welkomtxt" style="margin-top:0">${esc(k.welkom)}</p><div class="cta">${cta}</div></div>
    </div></section>
  <div class="wrap">
    <div class="path">
      ${(() => { const nV = vragenlijstVoor(k).length; const d = Math.min(k.intake.stap, nV-1);
        const kaarten = [
          ['01','De quiz','Welk gerecht ben jij? Zeven vragen, twee minuten.', !!k.quiz,
            k.quiz ? `<span class="small">${a.naam}</span> <button class="linkbtn" data-a="cv" data-v="quiz">Bekijk uitslag</button>` : `<button class="btn sm" data-a="cv" data-v="quiz">Start de quiz</button>`],
          ['02','De vragenlijst','Wie ben jij, wie is je klant, en waar staat je business.', k.intake.klaar,
            k.intake.klaar ? '<span class="small">Ingevuld, dank je wel</span>' : `<button class="btn sm" data-a="cv" data-v="intake">${k.intake.stap ? `Verder bij deel ${d+1} van ${nV}` : 'Start de vragenlijst'}</button>`],
          ['03','Je 7-course menu','Stap voor stap naar een merk dat je voelt.', voortgang(k).klaar===voortgang(k).totaal,
            `<button class="btn sm ${stap===2?'':'ghost'}" data-a="cv" data-v="menu">Open je menu</button>`]];
        return kaarten.map(([n,t,sb,klaar,actie],i) => `<div class="${i===stap?'nu':''}"><span class="pn">${n}</span><h3>${t}</h3><p>${sb}</p>
          <div class="st">${klaar ? '<span class="pill klaar">Klaar</span> ' : i===stap ? '<span class="pill bezig">Nu aan de beurt</span> ' : ''}${actie}</div></div>`).join(''); })()}
    </div>
    ${stijlOpen(k) && !k.thema?.actief && !k.stijlGezien ? `<div class="stijlnoot open" style="margin-top:2rem"><span class="slotrond klein" aria-hidden="true">${monoIcoon()}</span><p><strong>Nieuw voor jou:</strong> zet dit portaal in je eigen kleuren, lettertypen en met je eigen branding foto's.</p><button class="btn sm" data-a="cv" data-v="stijl">Naar Mijn stijl</button><button class="linkbtn small" data-a="stijl-later">Later</button></div>` : ''}
    ${auditSamenvatting(k)}
    ${toegangBalk(k)}
    ${kTodos(k)}
    <div class="two">
      <div><h2 class="h2">Nieuw van Jasmijn</h2>
        ${nieuw.map(b => `<div class="file"><div><strong>${esc(b.naam)}</strong><span>${COURSES[b.c].naam} &nbsp;|&nbsp; ${datum(b.op)}</span></div><button class="btn ghost sm" data-a="course" data-id="${b.c}">Bekijk</button></div>`).join('') || '<p class="muted">Zodra ik iets voor je klaarzet, zie je het hier.</p>'}</div>
      <div>${teken.length ? `<h2 class="h2">Wacht op jou</h2>${teken.map(d => `<div class="file"><div><strong>${esc(d.titel)}</strong><span>Lezen en akkoord geven</span></div><button class="btn sm" data-a="doc-open" data-id="${d.id}">Lezen</button></div>`).join('')}`
        : a ? `<h2 class="h2">Jouw smaak</h2><div class="archcard"><p style="margin:0;color:var(--gold);font-size:.8rem">${a.badge}</p><h3>${a.naam}</h3><p>${a.sub}</p><p style="margin-top:.5rem">Hier voegen we de meeste smaak toe: ${COURSES[a.start].naam}.</p><button class="btn gold sm" style="margin-top:1rem" data-a="cv" data-v="quiz">Bekijk je volledige uitslag</button></div>` : ''}</div>
    </div></div>`;
}

function kQuiz(k) {
  if (ui.quizStap === 'uitslag' && k.quiz) {
    const a = ARCHETYPES[k.quiz.uitslag]; const sc = k.quiz.scores || {};
    const st = k.courses[a.start]; const inMenu = !!st;
    return `<div class="focus" style="place-items:start center"><div class="focus-in result" style="max-width:46rem">
    <p class="kicker">${a.badge}</p><h1><em>${a.naam}</em></h1><p class="qsub">${a.sub}</p>
    <div class="words">${Object.keys(ARCHETYPES).map(l => `<span class="${l===k.quiz.uitslag?'top':''}">${ARCHETYPES[l].kort}: ${sc[l] ?? 0}</span>`).join('')}</div>
    <p class="rdesc">${esc(a.tekst)}</p>
    <div class="traits">${[['Hoe jouw merk eruitziet',a.looks],['Hoe jouw merk klinkt',a.sounds],['Wanneer jouw merk landt',a.works]].map(([t,x]) => `<div><h3>${t}</h3><p>${esc(x)}</p></div>`).join('')}</div>
    <div class="blind"><h3>Jouw blinde vlek</h3><p>${esc(a.blind)}</p></div>
    <div class="startcourse"><p class="kicker">Hier voegen we de meeste smaak toe</p><h3>Course ${a.start}, ${COURSES[a.start].naam}</h3><p>${esc(a.startTekst)}</p>
      ${inMenu ? `<p class="small" style="margin-top:.6rem;color:var(--gold)">Staat op jouw menu. Ik neem je uitslag mee in alles wat we daar doen.</p>` : `<p class="small" style="margin-top:.6rem;color:var(--gold)">Deze course zit in de 7-Course Brand Experience. Vraag me gerust wat dat voor jou betekent.</p>`}</div>
    <div class="navrow"><button class="linkbtn" data-a="quiz-opnieuw">Quiz opnieuw doen</button><button class="btn gold big" data-a="cv" data-v="${k.intake.klaar ? 'menu' : 'intake'}">${k.intake.klaar ? 'Naar je menu' : 'Door naar de vragenlijst'}</button></div></div></div>`; }
  const i = ui.quizStap; const q = QUIZ[i];
  return `<div class="focus"><div class="focus-in">
    <div class="stepper">${QUIZ.map((_, j) => `<i class="${j<=i?'on':''}"></i>`).join('')}</div>
    <p class="kicker">Gang ${i+1} van ${QUIZ.length}: ${COURSES[q.course].naam}</p><h1 style="margin-bottom:.5rem">${q.v}</h1><p class="qsub">${q.sub}</p>
    <div class="opts">${q.o.map(o => `<button data-a="quiz" data-v="${o.l}" class="${ui.quizAntw[i]===o.l?'sel':''}"><span class="ol">${o.l}</span><span><span class="ot">${esc(o.t)}</span><span class="om">${esc(o.m)}</span></span></button>`).join('')}</div>
    <div class="navrow">${i ? '<button class="linkbtn" data-a="quiz-terug">Vorige gang</button>' : '<button class="linkbtn" data-a="cv" data-v="home">Later</button>'}<span></span></div>
  </div></div>`;
}

function kIntake(k) {
  const vl = vragenlijstVoor(k); const i = Math.min(k.intake.stap, vl.length-1); const d = vl[i];
  const veld = q => { const v = k.intake.velden[q.id] ?? ''; const ph = esc(tekstMet(q.vb, k));
    if (q.t === 'meerkeuze') { const gekozen = v.split(',').map(x => x.trim()); return `<fieldset class="keuze"><legend>${esc(q.l)} <span style="opacity:.6">(meerdere mogelijk)</span></legend>${(q.opties||[]).map(o => `<label><input type="checkbox" name="in-${q.id}" value="${esc(o)}" ${gekozen.includes(o)?'checked':''}><span>${esc(o)}</span></label>`).join('')}</fieldset>`; }
    if (q.t === 'keuze') return `<fieldset class="keuze"><legend>${esc(q.l)}</legend>${(q.opties||[]).map(o => `<label><input type="radio" name="in-${q.id}" value="${esc(o)}" ${v===o?'checked':''}><span>${esc(o)}</span></label>`).join('')}</fieldset>`;
    return `<label class="field">${esc(q.l)}${q.t==='area' ? `<textarea id="in-${q.id}" placeholder="${ph}">${esc(v)}</textarea>` : `<input id="in-${q.id}" value="${esc(v)}" placeholder="${ph}">`}</label>`; };
  return `<div class="focus"><div class="focus-in">
    <div class="stepper">${vl.map((_, j) => `<i class="${j<=i?'on':''}"></i>`).join('')}</div>
    <p class="kicker">Vragenlijst, deel ${i+1} van ${vl.length}</p><h1>${esc(d.titel)}</h1>
    ${d.intro ? `<p class="intro">${esc(tekstMet(d.intro, k))}</p>` : ''}
    <div class="stack">${d.vragen.map(veld).join('')}</div>
    <div class="navrow">${i ? '<button class="linkbtn" data-a="intake-terug">Vorige</button>' : '<button class="linkbtn" data-a="intake-later">Opslaan en later verder</button>'}
      <button class="btn gold" data-a="intake-verder">${i === vl.length-1 ? 'Vragenlijst afronden' : 'Volgende'}</button></div>
    ${i ? '<p style="text-align:center;margin-top:1rem"><button class="linkbtn" data-a="intake-later">Opslaan en later verder</button></p>' : ''}
  </div></div>`;
}

function kMenu(k) {
  const v = voortgang(k);
  return `<div class="wrap"><div class="menucard">
    <header><p class="for">Studio Crave serveert, voor ${esc(k.naam)}</p><h1>${PAKKETTEN[k.pakket].naam}</h1><p>Volgens The Branding Kitchen™ &nbsp;|&nbsp; ${v.klaar} van ${v.totaal} gangen geserveerd</p></header>
    <ol class="journey">${Object.entries(k.courses).map(([id, c]) => { const d = COURSES[id]; return `<li class="${c.status} ${id==='finale'?'finale':''}">
      <button data-a="course" data-id="${id}" ${c.status==='dicht'?'disabled':''}><span class="node">${c.status==='klaar' ? '✓' : d.nr}</span>
      <span><span class="jn">${d.naam}</span><span class="js">${c.status==='dicht' ? (id==='05' && k.shoot?.datum ? 'Met je brand shoot op '+datum(k.shoot.datum)+(k.shoot.locatie ? ', '+esc(k.shoot.locatie) : '') : 'Wordt geserveerd zodra het tijd is') : d.sub}${c.status!=='dicht' && k.shoot && id==='04' ? ' <em class="shoottag">+ voorbereiding brand shoot</em>' : ''}${c.status!=='dicht' && k.shoot && id==='05' ? ' <em class="shoottag">+ brand shoot</em>' : ''}</span></span>
      <span class="jt">${c.status==='dicht' ? '' : STATUS[c.status]}</span></button></li>`; }).join('')}
    </ol>
    <div class="dessert"><p class="dessertkop">Dessert</p>
      <button class="dessertitem ${merkOpen(k) ? 'open' : ''}" data-a="cv" data-v="merk" ${merkOpen(k) ? '' : 'disabled'}><span class="node">${monoIcoon()}</span>
        <span><span class="jn">Signature Dish</span><span class="js">${merkOpen(k) ? 'Je hele merk op één bord. Blijft van jou.' : 'Wordt geserveerd na je laatste gang'}</span></span><span class="jt">${merkOpen(k) ? 'Open' : ''}</span></button></div>
  </div></div>`;
}

function kCourse(k) {
  const id = ui.course; const c = k.courses[id]; const d = COURSES[id]; const p = { ...k.profiel };
  const ids = Object.keys(k.courses); const idx = ids.indexOf(id);
  const vorige = ids.slice(0, idx).reverse().find(x => k.courses[x].status!=='dicht'); const volgende = ids.slice(idx+1).find(x => k.courses[x].status!=='dicht');
  const klaargezet = c.bestanden.filter(b => b.soort==='klaargezet'), opgediend = c.bestanden.filter(b => b.soort==='opgediend' && !(b.onderdeel && identCourse(k) === id));
  const alleTools = c.skills.map(sid => SKILLS.find(s => s.id===sid)).filter(s => s && data.skills[s.id].status==='live');
  const tools = alleTools.filter(s => toolZichtbaar(k, s.id)); const verborgen = alleTools.length - tools.length;
  const fileRow = b => `<div class="file"><div><strong>${esc(b.naam)}</strong><span>${b.notitie ? esc(b.notitie)+' &nbsp;|&nbsp; ' : ''}${datum(b.op)}${b.grootte ? ' &nbsp;|&nbsp; '+grootte(b.grootte) : ''}</span></div><div class="fileact">${linkKnop(b)}${b.grootte || !b.canva ? `<button class="btn ghost sm" data-a="dl" data-id="${b.id}">Download</button>` : ''}</div></div>`;
  return `<section class="chead"><div class="chead-in"><button class="back" data-a="cv" data-v="menu">Terug naar je menu</button>
    <span class="cn">${d.nr}</span><div><h1>${d.naam}</h1><p>${d.sub}</p></div></div></section>
  <div class="wrap">${id==='finale' ? bord(k) : ''}
    ${c.notitie ? `<div class="jnote"><b>Van Jasmijn</b>${esc(c.notitie)}</div>` : ''}
    ${auditBlok(k, id)}
    ${id === '05' ? `<div class="stijlnoot ${stijlOpen(k) ? 'open' : ''}"><span class="slotrond klein" aria-hidden="true">${monoIcoon()}</span><p>${stijlOpen(k) ? 'Je kleuren, lettertypen en beelden staan. Je kunt je portaal nu in je eigen stijl zetten.' : 'Na deze gang staan je kleuren, lettertypen en beelden vast. Dan gaat <strong>Mijn stijl</strong> open en zet je dit portaal in je eigen stijl.'}</p>${stijlOpen(k) ? '<button class="btn sm" data-a="cv" data-v="stijl">Naar Mijn stijl</button>' : ''}</div>` : ''}
    ${k.shoot && (id==='04' || id==='05') ? `${id==='04' ? `<p class="shootjump"><span class="shoottag">Met de voorbereiding van je brand shoot</span> <a class="linkbtn" href="#brandshoot">Direct naar je shoot</a></p>` : shootFlow(k, k.shoot)}` : ''}
    <div class="cgrid"><div>
      <div class="block"><h2>${PAKKETTEN[k.pakket].zelf ? 'Waar deze course over gaat' : 'Wat ik in deze course voor je doe'}</h2><ul class="doeslist">${courseTekst(k, id, 'jasmijn').map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="block"><h2>Wat jij ermee kunt</h2><p>${esc(courseTekst(k, id, 'jij'))}</p></div>
      ${alleTools.length || true ? `<div class="block"><h2>Verder op eigen kracht</h2><p class="muted small" style="margin:-.4rem 0 1rem">Deze tools kennen jouw merk al${p.toon ? ': ze klinken '+esc(p.toon) : ''}.</p>
        ${kanaalKiezer(k, verborgen)}
        ${tools.some(s => laatsteUpdate(k, s.id)) ? `<p class="usp"><span class="vers">Wekelijks bijgewerkt</span>${USP_WEKELIJKS}</p>` : ''}
        <div class="tools">${tools.map(s => `<button class="tool" data-a="skill" data-id="${s.id}">${laatsteUpdate(k, s.id) ? `<span class="vers">Wekelijks bijgewerkt</span>` : ''}<strong>${esc(s.naam)}</strong><span>${esc(data.skills[s.id].wat)}</span><em>Bijv. ${esc(toolVb(k, s.id))}</em></button>`).join('')}${(k.eigenTools || []).filter(t => t.course === id).map(eigenKaart).join('')}${(k.eigenTools || []).length < EIGEN_MAX ? bouwKaart(id) : ''}</div></div>` : ''}
    </div><div>
      <div class="block"><h2>Opgediend</h2>${opgediend.map(fileRow).join('') || (identCourse(k) === id ? '<p class="muted small">Je identiteit vind je hieronder, per stap. Andere deliverables verschijnen hier.</p>' : '<p class="muted small">Mijn deliverables voor deze course verschijnen hier.</p>')}</div>
      <div class="block"><h2>Klaargezet voor jou</h2>${klaargezet.map(fileRow).join('') || '<p class="muted small">Werkbladen en templates verschijnen hier.</p>'}</div>
      <div class="block"><h2>Aanleveren</h2><p class="small muted" style="margin-bottom:.8rem">${esc(courseTekst(k, id, 'aanleveren'))}</p>
        <div class="drop"><label for="up-${id}">Kies bestanden</label> <span class="small muted">of sleep ze hierheen</span><input type="file" multiple id="up-${id}" data-c="upload" data-course="${id}"></div>
        ${c.uploads.map(u => `<div class="file"><div><strong>${esc(u.naam)}</strong><span>${datum(u.op)} &nbsp;|&nbsp; ${grootte(u.grootte)}</span></div><span class="pill klaar">Ontvangen</span></div>`).join('')}</div>
    </div></div>
    ${identBlok(k, id, fileRow)}
    ${k.shoot && id==='04' ? shootPrep(k, k.shoot) : ''}
    ${PAKKETTEN[k.pakket].zelf ? `<div class="jnote" style="margin-top:2rem"><b>Liever dat ik dit voor je maak?</b>In het traject serveer ik deze gang voor je, met de hand gemaakt. <button class="linkbtn" data-a="cv" data-v="samen">Bekijk de mogelijkheden</button></div>
      ${c.status!=='klaar' ? `<div style="margin:1rem 0"><button class="btn gold" data-a="course-klaar" data-id="${id}">Deze course is klaar</button></div>` : ''}` : ''}
    <div class="pager">${vorige ? `<button class="btn ghost" data-a="course" data-id="${vorige}">${COURSES[vorige].naam}</button>` : '<span></span>'}${volgende ? `<button class="btn" data-a="course" data-id="${volgende}">${COURSES[volgende].naam}</button>` : ''}</div>
  </div>`;
}

function bord(k) {
  const p = k.profiel; const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const alles = Object.entries(k.courses).filter(([id]) => id!=='finale').flatMap(([id, c]) => c.bestanden.filter(b => b.soort==='opgediend').map(b => ({ ...b, id2:id })));
  return `<div class="block"><h2>Jouw merk op één bord</h2><div class="cgrid">
    <div class="plate"><dl>${[['Smaak', a ? a.naam : ''],['Je belofte', p.kernbelofte],['Voor wie', p.doelgroep],['Wat je oplost', p.pijn],['Waar ze uitkomt', p.resultaat],['Zo klink je', p.toon],['Zo nooit', p.nooit],['Waar je over praat', (p.pijlers||[]).join(', ')]]
      .map(([l,v]) => `<div class="qa"><dt>${l}</dt><dd>${esc(v) || '<span class="muted">Nog niet ingevuld</span>'}</dd></div>`).join('')}</dl></div>
    <div><h3 style="font-size:1.3rem;margin-bottom:.5rem">Alles wat ik opdiende</h3>${alles.map(b => `<div class="file"><div><strong>${esc(b.naam)}</strong><span>${COURSES[b.id2].naam}</span></div><div class="fileact">${linkKnop(b)}${b.grootte || !b.canva ? `<button class="btn ghost sm" data-a="dl" data-id="${b.id}">Download</button>` : ''}</div></div>`).join('') || '<p class="muted small">Nog leeg.</p>'}</div>
  </div></div>`;
}

function kDocs(k) {
  const teken = k.documenten.filter(d => d.status==='te-tekenen'), rest = k.documenten.filter(d => d.status!=='te-tekenen');
  return `<div class="wrap" style="max-width:48rem"><h1 style="font-size:clamp(2.4rem,6vw,3.6rem);font-weight:500;margin-bottom:1.5rem">Documenten</h1>
    ${teken.length ? `<h2 class="h2">Wacht op jouw akkoord</h2>${teken.map(d => `<div class="file"><div><strong>${esc(d.titel)}</strong><span>${esc(d.type)}</span></div><button class="btn sm" data-a="doc-open" data-id="${d.id}">Lezen en akkoord</button></div>`).join('')}<div style="height:2rem"></div>` : ''}
    <h2 class="h2">Alle documenten</h2>${rest.map(d => `<div class="file"><div><strong>${esc(d.titel)}</strong><span>${d.status==='getekend' ? 'Akkoord gegeven op '+datum(d.getekendOp) : 'Ter informatie'}</span></div><button class="btn ghost sm" data-a="doc-dl" data-id="${d.id}">Download</button></div>`).join('') || '<p class="muted">Nog niets.</p>'}
  </div>`;
}

/* ---------- Modals ---------- */
function modal() {
  const m = ui.modal; const k = klant(ui.sessie);
  const wrap = (inner, cls='') => `<div class="overlay" data-a="sluit-bg"><div class="modal ${cls} fade" role="dialog" aria-modal="true" aria-labelledby="mt">${inner}</div></div>`;
  if (m.type === 'nieuw') return wrap(`<h2 id="mt">Nieuwe klant</h2><p class="small muted">Menu, checklist en standaarddocumenten worden direct klaargezet.</p>
    <div class="stack" style="margin-top:1.2rem">
      <label class="field">Naam<input id="n-naam"></label><label class="field">Bedrijf<input id="n-bedrijf"></label>
      <label class="field">E-mail (wordt de inlognaam)<input id="n-email" type="email"></label>
      <label class="field">Pakket<select id="n-pakket">${Object.entries(PAKKETTEN).map(([v,p]) => `<option value="${v}">${p.naam} (${p.prijs})</option>`).join('')}</select></label>
      <div><p class="sectlabel" style="margin-top:0">Bijboeken</p><p class="small muted" style="margin:-.3rem 0 .5rem">De 7-Course bevat altijd een brand shoot en templates.</p>${EXTRAS.map(e => `<label class="check"><input type="checkbox" class="n-extra" value="${esc(e)}"> ${esc(e)}</label>`).join('')}</div>
      ${m.fout ? `<p class="err">${m.fout}</p>` : ''}</div>
    <div class="foot"><button class="btn ghost" data-a="sluit">Annuleren</button><button class="btn" data-a="nieuw-save">Klant aanmaken</button></div>`);
  if (m.type === 'doc') { const d = k.documenten.find(x => x.id === m.id); return wrap(`<h2 id="mt">${esc(d.titel)}</h2>
    <div class="result-box" style="min-height:9rem;border-left:0;border:1px solid var(--line);background:var(--surface)">Hier opent straks het volledige document in de TBK-huisstijl, zodat je het rustig kunt doorlezen.</div>
    <label class="check" style="margin-top:1rem"><input type="checkbox" id="akkoord"> Ik heb het document gelezen en ga akkoord</label>
    <div class="foot"><button class="btn ghost" data-a="sluit">Later</button><button class="btn" data-a="teken" data-id="${d.id}">Akkoord geven</button></div>`); }
  if (m.type === 'eigen') return eigenModal(m);
  if (m.type === 'skill') { const s = toolDef(m.id); const sd = toolData(s.id); const p = k.profiel; const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
    return wrap(`<h2 id="mt">${esc(s.naam)}</h2><p class="small muted">${esc(sd.wat)}. Deze tool kent jouw merk al:</p>${laatsteUpdate(k, s.id) ? `<p class="versregel"><span class="vers">Wekelijks bijgewerkt</span> Afgestemd op wat nu werkt (${actueleDomeinen(k, s.id).map(d => data.platform[d].titel).join(', ')}), laatst bijgewerkt op ${datum(laatsteUpdate(k, s.id))}.</p>` : ''}
    <div class="persona">${a ? `<span>${a.naam}</span>` : ''}${p.toon ? `<span>klinkt ${esc(p.toon)}</span>` : ''}${p.doelgroep ? `<span>voor ${esc(vul('{doelgroep}', p))}</span>` : ''}${p.nooit ? `<span>nooit ${esc(p.nooit)}</span>` : ''}${hdToon(k) && k.werkplek?.hdInToon !== false ? `<span>${esc(hdToon(k).label)}</span>` : ''}${!a && !p.toon ? '<span>Doe eerst de quiz en intake, dan wordt dit persoonlijk</span>' : ''}</div>
    <label class="field">Waar wil je mee aan de slag?<textarea id="s-input" placeholder="Bijv. ${esc(toolVb(k, s.id))}">${esc(m.input || '')}</textarea></label>
    <div class="result-box" id="skill-out" ${m.resultaat ? '' : 'hidden'}>${esc(m.resultaat || '')}</div>
    <div class="foot"><button class="btn ghost" data-a="sluit">Sluiten</button><button class="btn" data-a="genereer" data-id="${s.id}" ${m.bezig ? 'disabled' : ''}>${m.bezig ? 'Bezig…' : m.resultaat ? 'Nog een versie' : 'Maak het voor me'}</button></div>`); }
  if (m.type === 'aanvraag') { const b = boekItem(BOEKEN.find(x => x.id === m.id)); return wrap(`<h2 id="mt">${b.titel}</h2><p class="small muted">${b.tekst}${b.prijs ? ' &nbsp;|&nbsp; '+b.prijs : ''}</p>
    ${b.waarom ? `<p class="small" style="margin-top:.6rem">${b.waarom}</p>` : ''}
    <div class="stack" style="margin-top:1.2rem">${b.gang ? `<label class="field">Welke gang?<select id="aq-gang">${Object.keys(COURSES).filter(c => /^\d/.test(COURSES[c].nr) && !k.courses[c]).map(c => `<option value="${c}" ${m.gang===c?'selected':''}>${COURSES[c].nr} ${COURSES[c].naam}</option>`).join('')}</select></label>` : ''}<label class="field">Wat heb je in gedachten?<textarea id="aq-tekst" placeholder="Vertel kort wat je zoekt"></textarea></label>
    <label class="field">Wanneer zou je willen starten?<input id="aq-periode" placeholder="Bijv. na de zomer"></label></div>
    <div class="foot"><button class="btn ghost" data-a="sluit">Annuleren</button><button class="btn" data-a="aanvraag-stuur">${b.id==='dwy'||b.id==='audit' ? 'Boeking aanvragen' : 'Aanvraag versturen'}</button></div>`); }
  if (m.type === 'uitsnede') return uitsnedeModal(m);
  if (m.type === 'mail') return mailModal(m);
  if (m.type === 'identfeedback') return identFeedbackModal(m);
  if (m.type === 'verleng') return verlengModal();
  if (m.type === 'aanbod') { const a = k.aanbiedingen.find(x => x.id === m.id); return wrap(`<p class="for">Studio Crave, speciaal voor jou, ${esc(voornaam(k))}</p><h2 id="mt">${esc(a.titel)}</h2><p>${esc(a.tekst)}</p>
    <div class="foot" style="flex-direction:column;align-items:center;gap:.9rem"><button class="btn gold big" data-a="aanbod-ja" data-id="${a.id}">${esc(a.knop)}</button><button class="linkbtn" data-a="aanbod-nee" data-id="${a.id}">Nu even niet</button></div>`, 'offer'); }
  return '';
}

function shootFlow(k, sh) {
  const pixKnop = (u, soort, label) => `<a class="btn ${soort==='final' ? 'gold' : ''}" href="${esc(u)}" target="_blank" rel="noopener" data-a="pix-open" data-v="${soort}">${label}${isPixieset(u) ? ' in Pixieset' : ''}</a>`;
  const stap = (n, titel, staat, inhoud) => `<div class="shootstap ${staat}"><span class="pn">${n}</span><h3>${titel}</h3>${inhoud}</div>`;
  const s1 = sh.selectieKlaar ? 'klaar' : sh.selectie ? 'nu' : 'straks';
  const s2 = sh.final ? 'klaar' : sh.selectieKlaar ? 'nu' : 'straks';
  const tpl = (k.courses['05']?.bestanden || []).filter(b => b.soort === 'opgediend' && b.canva);
  const s3 = sh.final ? 'klaar' : 'straks';
  const s4 = tpl.length ? 'klaar' : sh.final ? 'nu' : 'straks';
  return `<div class="block shootflow" id="brandshoot"><h2 class="shootkop">Eerst je brand shoot, dan je templates</h2>
    ${sh.datum ? `<p class="shootwanneer"><span class="kicker">Jouw shoot</span> ${datum(sh.datum)}${sh.locatie ? ', '+esc(sh.locatie) : ''}</p>` : ''}
    <div class="shootstappen">
      ${stap('1','Kies je favorieten', s1, sh.selectie
        ? `<p>Open je galerij en markeer de foto's waarin je jezelf herkent.${sh.deadline && !sh.selectieKlaar ? ` Graag vóór ${datum(sh.deadline)}.` : ''}</p>
           <div class="actions">${pixKnop(sh.selectie, 'selectie', 'Open je galerij')}${sh.selectieKlaar ? `<span class="pill klaar">Doorgegeven op ${datum(sh.selectieOp)}</span>` : `<button class="btn ghost" data-a="selectie-klaar">Mijn selectie is klaar</button>`}</div>`
        : '<p class="muted">Na de shoot verschijnt hier je galerij.</p>')}
      ${stap('2','Ik bewerk je foto\'s', s2, `<p class="${s2==='straks'?'muted':''}">${sh.final ? 'Klaar, in de Studio Crave-stijl.' : sh.selectieKlaar ? 'Ik ben ermee bezig. Je vindt ze hier zodra ze klaar zijn.' : 'Zodra je je selectie hebt doorgegeven.'}</p>`)}
      ${stap('3','Download je foto\'s', s3, sh.final ? `<p>Je bewerkte foto's staan klaar.</p><div class="actions">${pixKnop(sh.final, 'final', 'Download je foto\'s')}</div>` : '<p class="muted">Hier verschijnen je bewerkte foto\'s.</p>')}
      ${stap('4','Je templates', s4, tpl.length ? `<p>Gebouwd met je eigen foto's.</p><div class="actions">${tpl.slice(0,2).map(b => linkKnop(b)).join('')}</div>` : `<p class="${s4==='straks'?'muted':''}">${sh.final ? 'Met je foto\'s bouw ik nu je templates.' : 'Met je foto\'s uit de shoot bouw ik daarna je templates.'}</p>`)}
    </div></div>`;
}

function shootPrep(k, sh) {
  const docs = k.documenten.filter(d => ['Beeldrechten & licentie','Modelrelease'].includes(d.type));
  const getekend = docs.length > 0 && docs.every(d => d.status === 'getekend');
  const punt = (klaar, tekst, extra='') => `<li class="${klaar ? 'klaar' : ''}"><span class="vink" aria-hidden="true">${klaar ? '✓' : ''}</span><span>${tekst}${extra}</span></li>`;
  return `<div class="block shootprep" id="brandshoot"><h2 class="shootkop">Brand shoot: de voorbereiding</h2>
    <p class="muted" style="margin-bottom:1rem">Nu je positionering scherp is, weet ik precies welk verhaal we in beeld brengen. Zo bereiden we je shoot samen voor.</p>
    ${sh.datum ? `<p class="shootwanneer"><span class="kicker">Jouw shoot</span> ${datum(sh.datum)}${sh.locatie ? ', '+esc(sh.locatie) : ''}</p>` : `<p class="shootwanneer"><span class="kicker">Jouw shoot</span> datum volgt</p>`}
    ${sh.notitie ? `<div class="jnote"><b>Zo bereid je je voor</b>${esc(sh.notitie)}</div>` : ''}
    <ul class="preplijst">
      ${punt(!!sh.datum, 'Datum en locatie vastgelegd')}
      ${punt((sh.uploads||[]).length > 0, 'Jouw moodboard-favorieten en outfits aangeleverd', ' <span class="muted small">(hieronder)</span>')}
      ${punt(!!sh.shotlistKlaar, 'Shotlist en regie, door Jasmijn')}
      ${punt(getekend, 'Beeldrechten en modelrelease getekend', getekend ? '' : ' <button class="linkbtn small" data-a="cv" data-v="docs">Naar je documenten</button>')}
    </ul>
    <div class="drop" style="margin-top:1.2rem"><label for="up-shoot">Lever aan voor je shoot</label> <span class="small muted">moodboard-favorieten, outfitfoto's, spullen die bij je verhaal horen</span><input type="file" multiple id="up-shoot" data-c="upload-shoot"></div>
    ${(sh.uploads||[]).map(u => `<div class="file"><div><strong>${esc(u.naam)}</strong><span>${datum(u.op)} &nbsp;|&nbsp; ${grootte(u.grootte)}</span></div><span class="pill klaar">Ontvangen</span></div>`).join('')}
  </div>`;
}

function kanaalKiezer(k, verborgen) {
  const kies = k.platformen || [];
  return `<div class="kanalen"><span class="kanaallabel">Jouw kanalen</span>
    ${KANALEN.map(d => `<label class="kanaal"><input type="checkbox" data-c="kanaal" value="${d}" ${kies.includes(d)?'checked':''}><span>${KENNISDOMEINEN[d].titel}</span></label>`).join('')}
    <span class="small muted">${!kies.length ? 'Kies je kanalen, dan zie je alleen de tools die je echt nodig hebt.' : verborgen ? `${verborgen} tool${verborgen===1?'':'s'} voor andere kanalen verborgen.` : ''}</span></div>`;
}

function voet() {
  const mono = beeld('monogram');
  return `<footer class="voet"><div class="voet-in voet-mono">${mono ? `<img src="${mono}" alt="Studio Crave" class="voetmono">` : `<span class="wordmark sc"><b>SC</b></span>`}
    ${contactRegel(true)}
    <p class="voetklein">© ${new Date().getFullYear()} Studio Crave</p></div></footer>`;
}

function toegangBalk(k) {
  const st = toegangStatus(k); if (st === 'actief' || st === 'verlengd') return '';
  const t = toegangTot(k);
  return `<div class="toegangbalk ${st}"><div><p class="kicker">${st === 'verlopen' ? 'Je toegang is verlopen' : 'Je toegang loopt tot ' + datum(t)}</p>
    <p>${st === 'verlopen' ? 'Je Signature Dish, je documenten en al je stukken blijven gewoon van jou.' : 'Daarna houd je je Signature Dish, documenten en stukken altijd.'} Wil je blijven werken met je tools, je sous-chef, je werkplek en de wekelijkse updates? Verleng dan voor ${verlengPrijs(k)}, maandelijks opzegbaar.</p></div>
    <button class="btn gold" data-a="verleng">Verleng voor ${verlengPrijs(k)}</button></div>`;
}
function verlengModal() { const k = klant(ui.sessie);
  return `<div class="overlay" data-a="sluit-bg"><div class="modal fade" role="dialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">Blijf verder bouwen</h2>
    <p class="small muted">Je Signature Dish, je documenten en al je stukken blijven altijd van jou. Met een verlenging houd je ook:</p>
    <ul class="doeslist" style="margin:.8rem 0"><li>al je tools, die elke week worden bijgewerkt met wat nu werkt</li><li>je sous-chef, die je merk kent</li><li>je werkplek met focusblokken en je Human Design</li><li>je 90-dagenplan en je to-do's</li></ul>
    <p><strong>${verlengPrijs(k)}</strong>, maandelijks opzegbaar.</p>
    ${contactRegel(false)}
    <div class="foot"><button class="btn ghost" data-a="sluit">Nu niet</button><button class="btn" data-a="verleng-ja">Ja, ik verleng</button></div></div></div>`;
}
