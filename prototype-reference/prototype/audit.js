/* =====================================================================
   BRAND AUDIT — acties, en hoe de klant haar audit ziet
   ===================================================================== */
function scoreStippen(n) { return `<span class="stippen" aria-label="${n} van 5">${[1,2,3,4,5].map(i => `<i class="${i <= n ? 'aan' : ''}"></i>`).join('')}</span>`; }
function auditBlok(k, c) {
  if (k.pakket !== 'audit') return ''; const a = k.audit;
  if (!a || a.status !== 'gedeeld') return k.intake.klaar && k.quiz ? `<div class="auditblok wacht"><p class="kicker">Jouw audit</p><p>Ik ben je audit aan het maken, op basis van je quiz en je vragenlijst. Je ziet hem hier zodra hij klaar is.</p></div>` : '';
  const x = a.courses[c] || {};
  return `<div class="auditblok"><div class="auditkop"><p class="kicker">Jouw audit</p>${x.score ? scoreStippen(+x.score) : ''}</div>
    ${x.zie ? `<p>${esc(x.zie)}</p>` : ''}${x.actie ? `<p class="auditactie"><strong>Je eerste stap:</strong> ${esc(x.actie)}</p>` : ''}</div>`;
}
function auditSamenvatting(k) {
  if (k.pakket !== 'audit' || k.audit?.status !== 'gedeeld') return ''; const a = k.audit;
  return `<div class="auditsamen"><div><p class="kicker">Jouw Brand Audit is klaar</p><h2>Wat ik proef</h2>
      <div class="auditscores">${['01','02','04'].map(c => `<button data-a="course" data-id="${c}"><span>${COURSES[c].naam}</span>${scoreStippen(+(a.courses[c]?.score || 0))}</button>`).join('')}</div>
    ${a.video ? `<a class="auditvideo" href="${esc(a.video)}" target="_blank" rel="noopener" data-a="audit-video"><span class="play" aria-hidden="true"></span><span><strong>Bekijk mijn toelichting</strong><em>Ik loop je audit met je door, in een korte video</em></span></a>` : ''}</div>
    <div>${a.top3.filter(Boolean).length ? `<p class="sectlabel">Je top 3</p><ol class="auditlijst">${a.top3.filter(Boolean).map(t => `<li>${esc(t)}</li>`).join('')}</ol>` : ''}
      ${a.advies ? `<p class="sectlabel">Mijn advies</p><p><strong>${esc(a.advies)}</strong>${a.adviesTekst ? `. ${esc(a.adviesTekst)}` : ''}</p>
      <div class="actions" style="margin-top:.8rem"><button class="btn" data-a="cv" data-v="samen">Bekijk de mogelijkheden</button></div>` : ''}</div></div>`;
}
async function auditConcept(k) {
  ui.auditFout = ''; const sample = await getSample();
  if (!sample) { ui.auditFout = 'Een eerste versie laten maken werkt in de gepubliceerde versie van het portaal (en straks live via je server). Je kunt de audit wel zelf invullen.'; render(); return; }
  ui.auditBezig = true; render();
  const a = k.quiz && ARCHETYPES[k.quiz.uitslag];
  const prompt = `Je helpt Jasmijn Straver (Studio Crave, methode The Branding Kitchen™) een Brand Audit te schrijven voor ${k.naam}. De audit beslaat drie gangen: 01 Raw Ingredients (haar verhaal, energie, expertise), 02 Flavor Profile (tone of voice, merkgevoel) en 04 Positioning Cut (doelgroep, probleem, resultaat, aanbod).

Schrijf in Jasmijns stem: warm, direct, confronterend maar warm, in de je-vorm tegen de klant. Nooit "ik help". Baseer je ALLEEN op de informatie hieronder; verzin geen feiten. Geef per gang een score van 1 tot 5 (hoe sterk en helder het nu is), 2 tot 3 zinnen "wat ik zie", en één concrete eerste stap. Kies daarna haar top 3 acties en een advies uit: ${AUDIT_ADVIES.join(', ')}.

Geef ALLEEN JSON: {"courses":{"01":{"score":0,"zie":"","actie":""},"02":{...},"04":{...}},"top3":["","",""],"advies":"","adviesTekst":""}

QUIZ: ${a ? `${a.naam} (${a.sub}). Blinde vlek: ${a.blind}` : 'niet gedaan'}
VRAGENLIJST:
${klantContext(k).vragenlijst.map(x => `- ${x.vraag} ${x.antwoord}`).join('\n')}`;
  try {
    const r = await sample.json(prompt, { modelTier:'default' }); const t = auditVan(k);
    ['01','02','04'].forEach(c => { const x = r?.courses?.[c]; if (x) t.courses[c] = { score: Math.min(5, Math.max(1, Math.round(+x.score || 3))), zie: String(x.zie || ''), actie: String(x.actie || '') }; });
    if (Array.isArray(r?.top3)) t.top3 = [0,1,2].map(i => String(r.top3[i] || ''));
    if (AUDIT_ADVIES.includes(r?.advies)) t.advies = r.advies; if (r?.adviesTekst) t.adviesTekst = String(r.adviesTekst);
    toast('Eerste versie klaar. Lees hem na en maak hem van jou.');
  } catch (e) { ui.auditFout = e?.code === 'rate_limited' ? 'Even te veel verzoeken. Probeer het zo opnieuw.' : 'Het lukte niet. Probeer het opnieuw, of vul het zelf in.'; }
  finally { ui.auditBezig = false; bewaar(); render(); }
}
document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (!c || !c.startsWith('audit')) return; const k = klant(ui.actief); if (!k) return; const a = auditVan(k);
  if (c === 'audit') { a.courses[el.dataset.course] = { ...(a.courses[el.dataset.course] || {}), [el.dataset.f]: el.value }; }
  if (c === 'audit-top') a.top3[+el.dataset.i] = el.value;
  if (c === 'audit-veld') { if (el.dataset.f === 'video') { const u = schoneUrl(el.value); if (el.value.trim() && !u) { toast('Plak de volledige link, beginnend met https://'); return; } a.video = u; toast(u ? 'Videolink opgeslagen.' : 'Videolink verwijderd.'); } else a[el.dataset.f] = el.value; }
  bewaar(); if (el.tagName === 'SELECT') render();
});
document.addEventListener('click', e => { const el = e.target.closest('[data-a="audit-video"]'); if (!el) return; const k = klant(ui.sessie); if (k && ui.rol === 'klant' && !ui.preview) { log(k, 'audit', 'bekeek je video bij haar Brand Audit'); bewaar(); } });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.actief); if (!k) return;
  switch (el.dataset.a) {
    case 'audit-concept': auditConcept(k); return;
    case 'audit-deel': { const a = auditVan(k);
      if (!['01','02','04'].every(c => a.courses[c]?.score && a.courses[c]?.zie)) { toast('Geef eerst elke gang een score en wat je ziet.'); return; }
      a.status = 'gedeeld'; a.gedeeldOp = nu(); ['01','02','04'].forEach(c => { if (k.courses[c]) k.courses[c].status = 'klaar'; });
      bewaar(); render(); toast(`Gedeeld. ${voornaam(k)} ziet haar audit nu in haar portaal.`); return; }
    case 'audit-terug': auditVan(k).status = 'concept'; bewaar(); render(); return;
  }
});
