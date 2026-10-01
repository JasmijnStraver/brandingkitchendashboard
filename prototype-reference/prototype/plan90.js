/* =====================================================================
   JE VOLGENDE 90 DAGEN — omzet terugrekenen, capaciteit checken,
   drie maanden met focus, ritme per kanaal en actuele tips met bronnen
   ===================================================================== */
const PLAN_FASEN = [
  { naam:'Maand 1: Serveren', kort:'Zichtbaar worden in je nieuwe merk', aandeel:.25,
    doen:['Profiel en bio aanpassen aan je positionering','Een vast contentritme neerzetten met je nieuwe formats en beelden','Je weggever of lijst-opbouw live zetten, zodat mensen kunnen blijven'],
    tools:['linkedin-profiel','caption-writer','short-video-script','lead-magnet-story-week'] },
  { naam:'Maand 2: Verbinden', kort:'Van volgers naar gesprekken', aandeel:.35,
    doen:['Wekelijks mailen aan je lijst, persoonlijk en met een vraag','Elke week inhoudelijk reageren bij mensen uit je doelgroep','Gesprekken voeren: uitnodigen, niet pushen'],
    tools:['email-funnel-writer','funnel-hook-generator','dm-sales-coach','authority-carrousel'] },
  { naam:'Maand 3: Verkopen', kort:'Je aanbod serveren', aandeel:.40,
    doen:['Je aanbod helder presenteren, met een duidelijke deadline of instap','Klantresultaten delen (met toestemming)','Na elk gesprek opvolgen, en na 90 dagen evalueren'],
    tools:['offer-builder','checkout-page','client-result-carrousel','onder-de-radar-pitch'] } ];
const PLAN_RITME = { instagram:'2 Reels en 3 posts per week', linkedin:'3 tot 5 posts per week', email:'1 nieuwsbrief per week',
  facebook:'2 tot 3 posts per week, liefst in gesprek met je doelgroep', tiktok:'3 korte video\'s per week', youtube:'1 video per week of per twee weken', pinterest:'5 tot 10 pins per week' };
const PLAN_HD = { 'Generator':'Kies voor elke fase alleen wat je een echte ja geeft. Plan lange, diepe werkblokken.',
  'Manifesting Generator':'Werk in korte sprints en mag schakelen, maar maak af wat je start en laat mensen weten wat je gaat doen.',
  'Projector':'Minder is meer: plan rust in en werk met uitnodigingen. Mik op minder, maar diepere gesprekken.',
  'Manifestor':'Kondig je plannen aan voordat je start: dat opent deuren. Werk in pieken met rust ertussen.',
  'Reflector':'Neem de eerste maand de tijd om te voelen wat klopt voordat je vol gas geeft.' };

function planStandaard(k) {
  return { doel:9000, aanbod:[{ naam:(k.profiel?.aanbodwoord ? k.profiel.aanbodwoord[0].toUpperCase() + k.profiel.aanbodwoord.slice(1) : 'Je aanbod'), prijs:1200, aandeel:100 }],
    convGesprek:30, convLead:10, uren:24, uurPerKlant:2, start: new Date().toISOString().slice(0,10) };
}
function planVan(k) { if (!k.plan90) k.plan90 = planStandaard(k); return k.plan90; }
function planReken(p) {
  const rijen = p.aanbod.filter(a => +a.prijs > 0 && +a.aandeel > 0);
  const klanten = rijen.map(a => ({ ...a, nodig: Math.ceil((p.doel * a.aandeel / 100) / a.prijs) }));
  const totKlanten = klanten.reduce((s, a) => s + a.nodig, 0);
  const gesprekken = Math.ceil(totKlanten / Math.max(.01, p.convGesprek / 100));
  const leads = Math.ceil(gesprekken / Math.max(.01, p.convLead / 100));
  const capaciteit = Math.floor((p.uren * .8) / Math.max(.25, p.uurPerKlant));
  const somAandeel = p.aanbod.reduce((s, a) => s + (+a.aandeel || 0), 0);
  return { klanten, totKlanten, gesprekken, leads, capaciteit, somAandeel,
    perWeek:{ leads: Math.ceil(leads / 13), gesprekken: Math.ceil(gesprekken / 13) } };
}
const euro = n => '€' + Math.round(n).toLocaleString('nl-NL');

function plan90Blok(k) {
  const p = planVan(k); const r = planReken(p); const kan = (k.platformen || []).length ? k.platformen : ['instagram','email'];
  const et = k.werkplek?.energietype; const tips = ['markt', ...kan].map(d => data.platform[d]).filter(x => x?.tekst?.trim());
  const bronnen = [...new Set(tips.flatMap(x => x.bronnen || []))];
  const toolKnop = sid => { const s = SKILLS.find(x => x.id === sid); return s && data.skills[sid]?.status === 'live' && toolZichtbaar(k, sid) ? `<button class="chip toolchip" data-a="skill" data-id="${sid}">${esc(s.naam)}</button>` : ''; };
  const eind = new Date(new Date(p.start).getTime() + 90 * 864e5);
  return `<div class="block plan90" id="plan90"><h2>Je volgende 90 dagen</h2>
    <p class="muted small" style="margin-bottom:1.2rem">Van ${datum(p.start)} tot ${datum(eind.toISOString())}. Vul je doel in: de rest rekent zichzelf uit. De percentages zijn aannames om mee te beginnen; pas ze aan naar wat jij ziet.</p>
    <div class="planinvoer">
      <label class="field">Omzetdoel voor deze 90 dagen (€)<input type="number" min="0" step="100" data-c="plan" data-f="doel" value="${p.doel}"></label>
      <label class="field">Start<input type="date" data-c="plan" data-f="start" value="${p.start}"></label>
      <label class="field">Van gesprek naar klant (%)<input type="number" min="1" max="100" data-c="plan" data-f="convGesprek" value="${p.convGesprek}"></label>
      <label class="field">Van lead naar gesprek (%)<input type="number" min="1" max="100" data-c="plan" data-f="convLead" value="${p.convLead}"></label>
      <label class="field">Uren per week voor klanten en je business<input type="number" min="1" max="80" data-c="plan" data-f="uren" value="${p.uren}"></label>
      <label class="field">Uren per klant per week<input type="number" min="0.25" step="0.25" data-c="plan" data-f="uurPerKlant" value="${p.uurPerKlant}"></label>
    </div>
    <p class="sectlabel">Je aanbod</p>
    <div class="planaanbod">${p.aanbod.map((a, i) => `<div class="aanbodrij">
      <label class="field">Naam<input data-c="plan-aanbod" data-i="${i}" data-f="naam" value="${esc(a.naam)}"></label>
      <label class="field">Prijs (€)<input type="number" min="0" step="10" data-c="plan-aanbod" data-i="${i}" data-f="prijs" value="${a.prijs}"></label>
      <label class="field">Deel van je omzet (%)<input type="number" min="0" max="100" data-c="plan-aanbod" data-i="${i}" data-f="aandeel" value="${a.aandeel}"></label>
      ${p.aanbod.length > 1 ? `<button class="linkbtn small" data-a="plan-weg" data-i="${i}">Weghalen</button>` : '<span></span>'}</div>`).join('')}
      ${p.aanbod.length < 4 ? '<button class="btn ghost sm" data-a="plan-erbij">Aanbod toevoegen</button>' : ''}
      ${r.somAandeel !== 100 ? `<p class="stijlwaarschuwing" style="margin-top:.6rem">De delen tellen op tot ${r.somAandeel}%. Maak er samen 100% van.</p>` : ''}</div>

    <div class="planuitkomst">
      <div><span>Klanten nodig</span><strong>${r.totKlanten}</strong><em>${r.klanten.map(a => `${a.nodig} × ${esc(a.naam)}`).join(', ')}</em></div>
      <div><span>Gesprekken nodig</span><strong>${r.gesprekken}</strong><em>ongeveer ${r.perWeek.gesprekken} per week</em></div>
      <div><span>Leads nodig</span><strong>${r.leads}</strong><em>ongeveer ${r.perWeek.leads} per week</em></div>
      <div class="${r.totKlanten > r.capaciteit ? 'krap' : ''}"><span>Ruimte voor klanten</span><strong>${r.capaciteit}</strong><em>${r.totKlanten > r.capaciteit ? 'Minder dan je nodig hebt: verhoog je prijs, of kies een groepsaanbod.' : 'tegelijk, met 20% ruimte voor content en rust'}</em></div>
    </div>

    <div class="planfasen">${PLAN_FASEN.map((f, i) => `<div class="planfase">
      <p class="kicker">Dag ${i*30+1} tot ${(i+1)*30}</p><h3>${f.naam}</h3><p class="muted small">${f.kort}</p>
      <p class="small"><strong>${euro(p.doel * f.aandeel)}</strong> omzet, ${Math.ceil(r.leads * f.aandeel)} leads, ${Math.ceil(r.gesprekken * f.aandeel)} gesprekken</p>
      <ul class="doeslist">${f.doen.map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="plantools">${f.tools.map(toolKnop).join('')}</div></div>`).join('')}</div>

    <div class="cgrid" style="margin-top:1.5rem">
      <div><p class="sectlabel">Je ritme per kanaal</p><ul class="doeslist">${kan.map(d => `<li><strong style="font-weight:600">${KENNISDOMEINEN[d]?.titel || d}:</strong> ${PLAN_RITME[d] || 'ritme volgt na de eerste wekelijkse update'}</li>`).join('')}</ul>
        <p class="hint">Richtlijn uit de actuele kennis. Kwaliteit en volhouden gaan voor volume.</p>
        ${et && PLAN_HD[et] ? `<p class="sectlabel">Vanuit je design (${esc(et)})</p><p class="small">${PLAN_HD[et]}</p>` : ''}</div>
      <div><p class="sectlabel">Slimme tips, wekelijks bijgewerkt</p>
        ${tips.length ? `<ul class="doeslist plantips">${tips.flatMap(x => x.tekst.split('\n').filter(l => l.trim()).slice(0, 3).map(l => `<li>${esc(l.replace(/^-\s*/, ''))} <span class="muted">(${esc(x.titel)})</span></li>`)).join('')}</ul>
          <details class="bronnen"><summary>Bronnen</summary><ul>${bronnen.map(b => `<li>${esc(b)}</li>`).join('')}</ul></details>` : '<p class="small muted">Tips verschijnen na de eerste wekelijkse update.</p>'}</div>
    </div>
    <div class="actions" style="margin-top:1.5rem"><button class="btn" data-a="chat-sug" data-v="Maak met Sprint-Doel en Perfecte Week mijn 90-dagenplan week voor week. Doel: ${euro(p.doel)} in 90 dagen vanaf ${p.start}. Aanbod: ${p.aanbod.map(a => a.naam + ' à ' + euro(a.prijs) + ' (' + a.aandeel + '%)').join(', ')}. Ik heb ${r.totKlanten} klanten, ${r.gesprekken} gesprekken en ${r.leads} leads nodig. Ik heb ${p.uren} uur per week.">Maak er een week-voor-week plan van</button></div>
  </div>`;
}
document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (c !== 'plan' && c !== 'plan-aanbod') return;
  const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); if (!k) return; const p = planVan(k);
  const v = el.type === 'number' ? Math.max(0, +el.value || 0) : el.value;
  if (c === 'plan') p[el.dataset.f] = v; else p.aanbod[+el.dataset.i][el.dataset.f] = v;
  bewaar(); const y = window.scrollY; render(); window.scrollTo(0, y);
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); if (!k) return;
  if (el.dataset.a === 'plan-erbij') { planVan(k).aanbod.push({ naam:'Nieuw aanbod', prijs:500, aandeel:0 }); bewaar(); const y = window.scrollY; render(); window.scrollTo(0, y); }
  if (el.dataset.a === 'plan-weg') { planVan(k).aanbod.splice(+el.dataset.i, 1); bewaar(); const y = window.scrollY; render(); window.scrollTo(0, y); }
});
