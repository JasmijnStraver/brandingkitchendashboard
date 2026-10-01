/* =====================================================================
   CRAVEABLE IDENTITY — een eigen kopje in de gang waar de identiteit wordt opgeleverd
   7-Course: Positioning Cut (na je positionering, vóór shoot en templates in Plating)
   Craveable Identity: Flavor Profile.  Branded Templates: Plating (de merkbasis onder je templates)
   ===================================================================== */
const IDENT_STAPPEN = [
  { id:'moodboard', naam:'Moodboard en richting', uitleg:'De sfeer en richting van je identiteit, als basis voor alles.' },
  { id:'logo', naam:'Logo-set', uitleg:'Hoofdlogo, variant en beeldmerk, in licht en donker.', feedback:true },
  { id:'kleuren', naam:'Kleuren en lettertypen', uitleg:'Je palet met alle codes, en de lettertypen voor koppen, tekst en accenten.', feedback:true },
  { id:'visuals', naam:'Beeldstijl en brand visuals', uitleg:'Hoe je beelden eruitzien, plus grafische elementen, profielbeelden en headers.' },
  { id:'brandbook', naam:'Brandbook en Brand Kit', uitleg:'Alles bij elkaar, en klaar in Canva om zelf mee te werken.' } ];
function heeftIdentiteit(k) { return ['dwy','identity','templates'].includes(k?.pakket) || heeftExtra(k, 'Craveable Identity'); }
function identCourse(k) { if (!heeftIdentiteit(k)) return null; const v = { dwy:'04', identity:'02', templates:'05' }[k.pakket]; if (v && k.courses[v]) return v;
  return k.courses['04'] ? '04' : Object.keys(k.courses).pop(); }
function identTitel(k) { return k.pakket === 'templates' ? 'Je merkbasis: logo, kleuren en brandbook' : 'Craveable Identity'; }
function identStappen(k) { return k.pakket === 'templates' ? IDENT_STAPPEN.filter(s => s.id !== 'visuals') : IDENT_STAPPEN; }

function identBlok(k, id, fileRow) {
  if (identCourse(k) !== id) return ''; const c = k.courses[id]; const fb = k.identiteit?.feedback || {};
  const stukken = s => (c.bestanden || []).filter(b => b.onderdeel === s.id && b.soort === 'opgediend');
  const eerstOpen = identStappen(k).find(s => !stukken(s).length);
  return `<div class="block identblok" id="identiteit"><h2 class="shootkop">${identTitel(k)}</h2>
    <p class="muted" style="margin-bottom:1rem">${id === '04' ? 'Nu je positionering scherp is, geef ik je merk een gezicht. Klaar vóór Plating, zodat je shoot en templates erop voortbouwen.' : id === '05' ? 'De basis onder je templates: je logo, je kleuren en lettertypen, en je brandbook.' : 'Je gevoel en je verhaal, vertaald naar een identiteit die je overal herkent.'}</p>
    <div class="identstappen">${identStappen(k).map((s, i) => { const st = stukken(s); const f = fb[s.id];
      return `<div class="identstap ${st.length ? 'klaar' : s === eerstOpen ? 'nu' : ''}"><span class="pn">${i + 1}${st.length ? ' ✓' : ''}</span><h3>${s.naam}</h3><p class="small muted">${s.uitleg}</p>
        ${st.map(fileRow).join('')}
        ${st.length && s.feedback ? (f ? `<p class="pill ${f.status === 'akkoord' ? 'klaar' : 'bezig'}" style="margin-top:.5rem">${f.status === 'akkoord' ? 'Je gaf akkoord' : 'Je feedback is verstuurd'}</p>` :
          `<div class="actions" style="margin-top:.6rem"><button class="btn sm" data-a="ident-akkoord" data-v="${s.id}">Akkoord</button><button class="btn ghost sm" data-a="ident-feedback" data-v="${s.id}">Feedback geven</button></div>`) : ''}
      </div>`; }).join('')}</div>
    <p class="small" style="margin-top:1rem">Lever je huidige logo, beelden en inspiratie aan bij <strong>Aanleveren</strong> in deze gang. Je nieuwe kleuren, lettertypen en logo verschijnen ook in je Signature Dish.</p></div>`;
}
function identFeedbackModal(m) {
  const s = IDENT_STAPPEN.find(x => x.id === m.stap);
  return `<div class="overlay" data-a="sluit-bg"><div class="modal fade" role="dialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">Feedback op: ${s.naam}</h2>
    <p class="small muted">Wat voelt goed, en wat nog niet? Hoe specifieker, hoe beter ik het kan aanpassen.</p>
    <label class="field" style="margin-top:1rem">Jouw feedback<textarea id="if-tekst" style="min-height:8rem" placeholder="Bijv. het beeldmerk voelt goed, maar de kleur mag warmer"></textarea></label>
    <div class="foot"><button class="btn ghost" data-a="sluit">Annuleren</button><button class="btn" data-a="ident-feedback-stuur" data-v="${s.id}">Versturen</button></div></div></div>`;
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.sessie); if (!k) return;
  const zet = (status, tekst) => { k.identiteit = k.identiteit || { feedback:{} }; k.identiteit.feedback[el.dataset.v] = { status, tekst, op:nu() };
    const s = IDENT_STAPPEN.find(x => x.id === el.dataset.v); if (!ui.preview) log(k, 'feedback', status === 'akkoord' ? `gaf akkoord op ${s.naam.toLowerCase()}` : `gaf feedback op ${s.naam.toLowerCase()}: ${tekst}`); bewaar(); };
  switch (el.dataset.a) {
    case 'ident-akkoord': zet('akkoord', ''); render(); feestje(); toast('Dank je! Ik ga verder met de volgende stap.'); return;
    case 'ident-feedback': ui.modal = { type:'identfeedback', stap:el.dataset.v }; render(); return;
    case 'ident-feedback-stuur': { const t = val('if-tekst'); if (!t) { toast('Schrijf kort wat je wilt aanpassen.'); return; } zet('feedback', t); ui.modal = null; render(); toast('Verstuurd. Ik pas het aan en zet de nieuwe versie hier neer.'); return; }
  }
});
// Jij: feedback weer openzetten als je een nieuwe versie plaatst
document.addEventListener('click', e => { const el = e.target.closest('[data-a="ident-heropen"]'); if (!el) return; const k = klant(ui.actief); if (!k?.identiteit?.feedback) return;
  delete k.identiteit.feedback[el.dataset.v]; bewaar(); render(); toast('Ze kan opnieuw akkoord of feedback geven.'); });
function identAdmin(k, id) {
  if (identCourse(k) !== id) return ''; const fb = k.identiteit?.feedback || {}; const c = k.courses[id];
  return `<div class="shootadmin"><h3>${identTitel(k)}: oplevering</h3>
    <p class="small muted">Plaats je stukken hieronder als <strong>Opgediend</strong> en kies bij "Onderdeel" waar het bij hoort. Dan verschijnen ze bij de juiste stap, en kan ${esc(voornaam(k))} bij logo en kleuren akkoord geven of feedback sturen. Vul ook de kleuren, lettertypen en het logo in bij haar Signature Dish.</p>
    <ul class="doeslist">${identStappen(k).map(s => { const n = (c.bestanden || []).filter(b => b.onderdeel === s.id).length; const f = fb[s.id];
      return `<li><strong>${s.naam}</strong>: ${n ? `${n} stuk${n === 1 ? '' : 'ken'} geplaatst` : '<span class="muted">nog niets</span>'}${f ? ` &nbsp;<span class="pill ${f.status === 'akkoord' ? 'klaar' : 'actie'}">${f.status === 'akkoord' ? 'Akkoord' : 'Feedback'}</span>${f.tekst ? `<br><em class="small">"${esc(f.tekst)}"</em>` : ''} <button class="linkbtn small" data-a="ident-heropen" data-v="${s.id}">Nieuwe versie geplaatst</button>` : ''}</li>`; }).join('')}</ul></div>`;
}
