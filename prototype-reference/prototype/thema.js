/* =====================================================================
   EIGEN STIJL VAN DE KLANT — kleuren, lettertypen, foto's en logo
   Inloggen en jouw keuken blijven altijd Studio Crave.
   ===================================================================== */
const THEMA_ROLLEN = [
  ['donker','Donker','Bovenbalk, banner en donkere vlakken'],
  ['primair','Hoofdkleur','Knoppen en accenten op licht'],
  ['accent','Accent','Highlights, iconen en knoppen op donker'],
  ['licht','Licht','Achtergrond en tekst op donker'] ];

// Mijn stijl gaat open na Plating (course 05), of aan het einde van het traject; jij kunt het eerder openzetten
function stijlOpen(k) { if (!k) return false; if (k.stijlOpen) return true; if (k.courses?.['05']) return k.courses['05'].status === 'klaar' || merkOpen(k); return merkOpen(k); }
function stijlSlotTekst(k) { return k.courses?.['05'] ? 'Na Plating (course 05) staan je kleuren, lettertypen en beelden vast. Dan zet je hier je portaal in je eigen stijl.' : 'Aan het einde van je traject zet je hier je portaal in je eigen stijl.'; }
function themaVan(k) { if (!k) return null; if (!k.thema) k.thema = JSON.parse(JSON.stringify(THEMA_STD)); return k.thema; }
function actiefThema() { if (ui.rol !== 'klant' || !ui.sessie) return null; const k = klant(ui.sessie); return k?.thema?.actief ? k.thema : null; }
function klantFoto(key) { const t = actiefThema(); return t && KLANT_FOTOS.includes(key) && t.fotos?.[key] ? t : null; }

// Kleurhulpjes voor leesbaarheid
function hexRgb(h) { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function lum(h) { const c = hexRgb(h); if (!c) return 0; const [r, g, b] = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126*r + .7152*g + .0722*b; }
function contrast(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); }
function themaWaarschuwingen(t) {
  const c = t.kleuren, w = [];
  if (contrast(c.licht, c.donker) < 7) w.push('Licht en donker liggen dicht bij elkaar: tekst op de donkere vlakken wordt minder goed leesbaar.');
  if (contrast(c.accent, c.donker) < 3) w.push('Je accentkleur valt weg op de donkere kleur.');
  if (contrast('#FFFFFF', c.primair) < 4.5 && contrast(c.licht, c.primair) < 4.5) w.push('Tekst op knoppen in je hoofdkleur is lastig te lezen. Kies een donkerdere hoofdkleur.');
  if (lum(c.licht) < .6) w.push('Kies een lichtere achtergrondkleur, zodat lange teksten prettig lezen.');
  return w;
}
function kleurenUitMerk(k) {
  const lijst = (k.merk?.kleuren || []).map(x => x.hex).filter(h => hexRgb(h)); if (lijst.length < 2) return null;
  const opLicht = [...lijst].sort((a, b) => lum(a) - lum(b)); const donker = opLicht[0], licht = opLicht[opLicht.length - 1];
  const verzadiging = h => { const [r, g, b] = hexRgb(h); return Math.max(r, g, b) - Math.min(r, g, b); };
  const midden = lijst.filter(h => h !== donker && h !== licht); const accent = [...(midden.length ? midden : [licht])].sort((a, b) => verzadiging(b) - verzadiging(a))[0];
  return { donker, primair: contrast('#FFFFFF', accent) >= 4.5 ? accent : donker, accent, licht };
}
function laadFont(naam) {
  if (['Times New Roman','Be Vietnam Pro'].includes(naam)) return; const id = 'font-' + naam.replace(/\s+/g, '-');
  if (document.getElementById(id)) return; const l = document.createElement('link'); l.id = id; l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(naam).replace(/%20/g, '+')}:wght@400;500;600&display=swap`; document.head.appendChild(l);
}
const THEMA_VARS = ['--midnight','--burgundy','--gold','--creme','--bg','--ink','--muted','--line','--surface-2','--side','--deep','--display','--body'];
function pasThemaToe() {
  const r = document.documentElement.style; THEMA_VARS.forEach(v => r.removeProperty(v)); const t = actiefThema(); if (!t) return;
  const c = t.kleuren; const ink = lum(c.donker) < .08 ? c.donker : '#231F20';
  const set = { '--midnight':c.donker, '--burgundy':c.primair, '--gold':c.accent, '--creme':c.licht, '--bg':c.licht, '--ink':ink,
    '--muted':`color-mix(in srgb, ${ink} 64%, transparent)`, '--line':`color-mix(in srgb, ${ink} 14%, transparent)`,
    '--surface-2':`color-mix(in srgb, ${c.licht} 55%, #ffffff)`, '--side':c.donker, '--deep':c.donker };
  if (t.koppen && t.koppen !== 'Times New Roman') { laadFont(t.koppen); set['--display'] = `"${t.koppen}", "Times New Roman", serif`; }
  if (t.tekst && t.tekst !== 'Be Vietnam Pro') { laadFont(t.tekst); set['--body'] = `"${t.tekst}", "Helvetica Neue", Arial, sans-serif`; }
  Object.entries(set).forEach(([k, v]) => r.setProperty(k, v));
}

/* ---------- De editor: voor de klant (Mijn stijl) en voor jou (tabblad Signature Dish) ---------- */
function themaDuim(t, key) {
  const v = FOTO_VAKKEN[key]; const src = t.fotos?.[key]; if (!src) return '<div class="duimleeg">Nog geen eigen foto</div>';
  const u = t.uitsnede?.[key] || { x:.5, y:.5, z:1 };
  return `<span class="fotovak ${v.rond ? 'rond' : ''}" style="aspect-ratio:${v.ratio}"><img src="${src}" alt="" style="${fotoStijl(key, u, t.aspect?.[key])}"></span>`;
}
function stijlEditor(k, voorJasmijn) {
  const t = themaVan(k); const vn = esc(voornaam(k)); const w = themaWaarschuwingen(t); const uitMerk = kleurenUitMerk(k);
  const namen = { banner:'Banner op je welkomstscherm', fotoWerkplek:'Foto in je Workflow', fotoDessert:'Foto in je Signature Dish' };
  return `<div class="stijleditor">
    <div class="panel stijlaan"><label class="schakel"><input type="checkbox" data-c="thema-aan" ${t.actief ? 'checked' : ''}><span></span>
      <strong>${voorJasmijn ? `Portaal van ${vn} in haar eigen stijl` : 'Mijn eigen stijl gebruiken'}</strong></label>
      ${voorJasmijn ? `<p class="small" style="margin-top:.6rem">Mijn stijl voor ${vn}: ${stijlOpen(k) ? '<span class="pill klaar">Open</span>' : '<span class="pill dicht">Nog dicht, gaat open na Plating of aan het einde</span>'}</p>
        <label class="check small" style="margin-top:.4rem"><input type="checkbox" data-c="stijl-open" ${k.stijlOpen ? 'checked' : ''}> Nu al openzetten voor ${vn}</label>` : ''}
      <p class="small muted" style="margin-top:.5rem">${voorJasmijn ? `Staat dit aan, dan ziet ${vn} na het inloggen haar eigen kleuren, lettertypen en foto's. Het inlogscherm blijft Studio Crave.` : 'Na het inloggen zie je dan je eigen kleuren, lettertypen en foto\'s. Het inlogscherm blijft van Studio Crave.'}</p></div>

    <div class="panel"><h2>Kleuren</h2>
      ${uitMerk ? `<button class="btn ghost sm" data-a="thema-merk" style="margin-bottom:1rem">Kleuren overnemen uit ${voorJasmijn ? 'haar' : 'mijn'} Signature Dish</button>` : ''}
      <div class="kleurrij">${THEMA_ROLLEN.map(([r, l, uitleg]) => `<label class="kleurkeus"><input type="color" data-c="thema-kleur" data-rol="${r}" value="${t.kleuren[r]}"><span><strong>${l}</strong><em>${uitleg}</em><code>${t.kleuren[r].toUpperCase()}</code></span></label>`).join('')}</div>
      ${w.length ? `<div class="stijlwaarschuwing">${w.map(x => `<p>${esc(x)}</p>`).join('')}</div>` : '<p class="small muted" style="margin-top:.8rem">Goed leesbaar.</p>'}
    </div>

    <div class="panel"><h2>Lettertypen</h2><div class="grid2">
      <label class="field">Koppen<select data-c="thema-font" data-rol="koppen">${THEMA_FONTS.koppen.map(f => `<option ${t.koppen===f?'selected':''}>${f}</option>`).join('')}</select></label>
      <label class="field">Lange teksten<select data-c="thema-font" data-rol="tekst">${THEMA_FONTS.tekst.map(f => `<option ${t.tekst===f?'selected':''}>${f}</option>`).join('')}</select></label></div></div>

    <div class="panel"><h2>${voorJasmijn ? 'Haar' : 'Jouw'} logo</h2>
      <div class="imgslot"><div class="prev">${t.logo ? `<img src="${t.logo}" alt="">` : 'Nog leeg'}</div><div style="flex:1">
        <p class="small muted">Staat op het welkomstscherm en in de Signature Dish. Het Studio Crave-logo linksboven blijft staan: dat brengt je altijd terug naar je start.</p>
        <label class="field" style="margin-top:.4rem"><input type="file" accept="image/*" data-c="thema-logo"></label>
        ${t.logo ? '<button class="linkbtn" data-a="thema-logo-weg">Verwijderen</button>' : ''}</div></div></div>

    <div class="panel"><h2>${voorJasmijn ? 'Haar' : 'Jouw'} branding foto's</h2>
      <p class="small muted" style="margin-bottom:.6rem">Zolang hier niets staat, zie je de foto's van Studio Crave.</p>
      ${KLANT_FOTOS.map(key => `<div class="imgslot"><div class="prev cover ${FOTO_VAKKEN[key].vrij ? 'breedprev' : ''}">${themaDuim(t, key)}</div><div style="flex:1">
        <strong style="font-weight:500">${namen[key]}</strong>
        <label class="field" style="margin-top:.4rem"><input type="file" accept="image/*" data-c="thema-foto" data-key="${key}"></label>
        ${t.fotos?.[key] ? `<div class="actions" style="margin-top:.4rem"><button class="btn sm" data-a="us-open" data-key="${key}" data-eigenaar="klant">Uitsnede aanpassen</button><button class="linkbtn" data-a="thema-foto-weg" data-key="${key}">Verwijderen</button></div>` : ''}</div></div>`).join('')}
    </div>
    <div class="actions"><button class="btn ghost" data-a="thema-reset">Alles terug naar de Studio Crave-stijl</button></div>
  </div>`;
}
function kStijl(k) {
  if (!stijlOpen(k)) return `<div class="wrap" style="max-width:52rem"><div class="paginakop"><div><p class="hello">Jouw portaal</p><h1 style="font-size:clamp(2.4rem,6vw,3.6rem);font-weight:500">Mijn stijl</h1></div></div>
    <div class="stijlslot"><span class="slotrond" aria-hidden="true">${monoIcoon()}</span><div><h2>Nog even geduld</h2>
      <p>${stijlSlotTekst(k)} Je kleuren, lettertypen, logo en je eigen branding foto's: alles in jouw smaak.</p>
      <p class="muted small" style="margin-top:.6rem">Tot die tijd werk je in de stijl van Studio Crave. Zo proeven we eerst samen wat bij je past, voordat je het vastlegt.</p></div></div></div>`;
  return `<div class="wrap" style="max-width:52rem"><div class="paginakop"><div><p class="hello">Jouw portaal</p><h1 style="font-size:clamp(2.4rem,6vw,3.6rem);font-weight:500">Mijn stijl</h1>
    <p class="muted" style="margin:.3rem 0 0">Maak dit dashboard van jou: in je eigen kleuren, lettertypen en met je eigen branding foto's.</p></div></div>
    ${stijlEditor(k, false)}</div>`;
}

document.addEventListener('change', e => { if (e.target.dataset.c !== 'stijl-open') return; const k = klant(ui.actief); if (!k) return; k.stijlOpen = e.target.checked; bewaar(); render(); toast(e.target.checked ? 'Mijn stijl staat open voor ' + voornaam(k) + '.' : 'Mijn stijl volgt weer de standaard.'); });
document.addEventListener('change', e => {
  const el = e.target; const c = el.dataset.c; if (!c || !c.startsWith('thema-')) return;
  const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); if (!k) return; const t = themaVan(k);
  if (c === 'thema-aan') { t.actief = el.checked; if (ui.rol === 'klant' && !ui.preview) log(k, 'stijl', el.checked ? 'zette haar eigen stijl aan' : 'ging terug naar de Studio Crave-stijl'); }
  if (c === 'thema-kleur') t.kleuren[el.dataset.rol] = el.value;
  if (c === 'thema-font') t[el.dataset.rol] = el.value;
  if (c === 'thema-logo' && el.files[0]) { leesAfbeelding(el.files[0], url => { t.logo = url; bewaar(); render(); toast('Logo geplaatst.'); }); return; }
  if (c === 'thema-foto' && el.files[0]) { const key = el.dataset.key; leesAfbeelding(el.files[0], url => { const im = new Image(); im.onload = () => {
      t.fotos[key] = url; t.aspect[key] = im.naturalWidth / im.naturalHeight; delete t.uitsnede[key];
      if (ui.rol === 'klant' && !ui.preview) log(k, 'stijl', 'uploadde een eigen branding foto');
      bewaar(); render(); toast('Geplaatst. Pas eventueel de uitsnede aan.'); }; im.src = url; }); return; }
  bewaar(); render();
});
document.addEventListener('input', e => { const el = e.target; if (el.dataset.c !== 'thema-kleur') return; const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); if (!k) return;
  themaVan(k).kleuren[el.dataset.rol] = el.value; const code = el.parentElement.querySelector('code'); if (code) code.textContent = el.value.toUpperCase(); pasThemaToe(); });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); if (!k) return;
  switch (el.dataset.a) {
    case 'thema-merk': { const kl = kleurenUitMerk(k); if (kl) { Object.assign(themaVan(k).kleuren, kl); const f = k.merk?.fonts || [];
        const kop = f.find(x => /kop/i.test(x.rol))?.naam, tekst = f.find(x => /tekst/i.test(x.rol))?.naam;
        if (kop && THEMA_FONTS.koppen.includes(kop)) themaVan(k).koppen = kop; if (tekst && THEMA_FONTS.tekst.includes(tekst)) themaVan(k).tekst = tekst;
        bewaar(); render(); toast('Kleuren en lettertypen overgenomen.'); } return; }
    case 'thema-logo-weg': themaVan(k).logo = ''; bewaar(); render(); return;
    case 'thema-foto-weg': { const t = themaVan(k); delete t.fotos[el.dataset.key]; delete t.aspect[el.dataset.key]; delete t.uitsnede[el.dataset.key]; bewaar(); render(); return; }
    case 'thema-reset': if (!confirm('Alles terugzetten naar de Studio Crave-stijl? Je eigen foto\'s en logo worden verwijderd.')) return;
      k.thema = JSON.parse(JSON.stringify(THEMA_STD)); bewaar(); render(); toast('Terug naar de Studio Crave-stijl.'); return;
  }
});
