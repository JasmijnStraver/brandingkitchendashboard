/* =====================================================================
   WORKFLOW — weekfocus, ideeënvoorraad en energiecheck
   ===================================================================== */
function weekNr(d = new Date()) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const dag = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dag); const j = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() + '-' + String(Math.ceil(((t - j) / 864e5 + 1) / 7)).padStart(2, '0'); }
function wf(k) { const w = k.werkplek; w.week = w.week || {}; w.ideeen = w.ideeen || []; w.energie = w.energie || {}; return w; }
const ENERGIE_TIPS = { 1:'Lage batterij. Kies vandaag één klein ding, en laat de rest liggen.', 2:'Rustige dag: plan lichte taken, zoals ideeën verzamelen of reageren.', 3:'Gemiddelde energie: een goed moment voor één focusblok.', 4:'Goede energie: pak je belangrijkste taak van de week.', 5:'Volle batterij: ideaal om content te batchen of iets te maken waar je trots op wilt zijn.' };

function workflowBlok(k) {
  const w = wf(k); const wk = weekNr(); const focus = w.week[wk] || [{ t:'', klaar:false }, { t:'', klaar:false }, { t:'', klaar:false }];
  const vandaag = new Date().toISOString().slice(0, 10); const e = w.energie[vandaag];
  const laatste = [...Array(7)].map((_, i) => { const d = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10); return { d, v: w.energie[d] || 0 }; });
  return `<div class="wfgrid">
    <div class="block wfkaart"><h2>Je weekfocus</h2><p class="muted small">Week ${wk.split('-')[1]}. Drie dingen die deze week écht tellen. De rest mag wachten.</p>
      <ol class="weekfocus">${focus.map((f, i) => `<li><label class="check"><input type="checkbox" data-c="wf-klaar" data-i="${i}" ${f.klaar ? 'checked' : ''}></label><input class="wfin ${f.klaar ? 'klaar' : ''}" data-c="wf-focus" data-i="${i}" value="${esc(f.t)}" placeholder="${['Bijv. mijn nieuwsbrief schrijven','Bijv. drie posts inplannen','Bijv. twee kennismakingsgesprekken'][i]}"></li>`).join('')}</ol>
      ${focus.every(f => f.t && f.klaar) ? '<p class="small" style="color:var(--burgundy);margin-top:.6rem">Alle drie gedaan. Dat is een goede week.</p>' : ''}</div>

    <div class="block wfkaart"><h2>Energiecheck</h2><p class="muted small">Hoe is je batterij vandaag?</p>
      <div class="energie" role="radiogroup" aria-label="Energie vandaag">${[1,2,3,4,5].map(n => `<button class="${e === n ? 'aan' : ''}" data-a="wf-energie" data-v="${n}" role="radio" aria-checked="${e === n}" aria-label="${n} van 5">${n}</button>`).join('')}</div>
      ${e ? `<p class="small" style="margin-top:.6rem">${ENERGIE_TIPS[e]}${w.energietype === 'Projector' && e <= 3 ? ' Als Projector mag je dit extra serieus nemen.' : ''}</p>` : ''}
      <div class="energieweek" aria-label="Je energie de afgelopen 7 dagen">${laatste.map(x => `<span title="${datum(x.d)}: ${x.v || 'niet ingevuld'}" style="height:${x.v ? x.v * 20 : 4}%"></span>`).join('')}</div>
      <p class="hint">De afgelopen 7 dagen. Zie je een patroon? Plan je zware taken op je sterke dagen.</p></div>
  </div>
  <div class="block wfkaart"><h2>Je ideeënvoorraad</h2><p class="muted small">Een voorraadkast voor ideeën: vang ze meteen, ook als je er nu niks mee doet. Later maak je er met één klik iets van.</p>
    <div class="ideein"><input id="wf-idee" placeholder="Een idee, een zin, iets wat een klant zei…" maxlength="300"><button class="btn" data-a="wf-idee-erbij">Bewaren</button></div>
    <div class="ideeen">${w.ideeen.slice().reverse().map(x => `<div class="idee"><p>${esc(x.t)}</p><span class="small muted">${datum(x.op)}</span>
      <div class="actions"><button class="btn sm" data-a="chat-sug" data-v="Ik heb dit idee in mijn voorraad: &quot;${esc(x.t)}&quot;. Maak er een voorstel van voor een post of mail in mijn toon, en zeg welke tool het beste past.">Maak er iets van</button><button class="linkbtn small" data-a="wf-idee-weg" data-id="${x.id}">Weg</button></div></div>`).join('') || '<p class="muted small">Nog leeg. Tip: spreek een idee in via de sous-chef en bewaar het hier.</p>'}</div></div>`;
}
document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (!c || !c.startsWith('wf-')) return; const k = klant(ui.sessie); if (!k) return; const w = wf(k); const wk = weekNr();
  w.week[wk] = w.week[wk] || [{ t:'', klaar:false }, { t:'', klaar:false }, { t:'', klaar:false }];
  if (c === 'wf-focus') w.week[wk][+el.dataset.i].t = el.value;
  if (c === 'wf-klaar') { w.week[wk][+el.dataset.i].klaar = el.checked; if (el.checked && w.week[wk].every(f => f.t && f.klaar)) feestje(); }
  bewaar(); render();
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.sessie); if (!k) return; const w = wf(k);
  switch (el.dataset.a) {
    case 'wf-energie': w.energie[new Date().toISOString().slice(0, 10)] = +el.dataset.v; bewaar(); render(); return;
    case 'wf-idee-erbij': { const t = val('wf-idee'); if (!t) return; w.ideeen.push({ id:uid(), t, op:nu() }); w.ideeen = w.ideeen.slice(-60); bewaar(); render(); document.getElementById('wf-idee')?.focus(); return; }
    case 'wf-idee-weg': w.ideeen = w.ideeen.filter(x => x.id !== el.dataset.id); bewaar(); render(); return;
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'wf-idee') { e.preventDefault(); document.querySelector('[data-a="wf-idee-erbij"]')?.click(); } });
