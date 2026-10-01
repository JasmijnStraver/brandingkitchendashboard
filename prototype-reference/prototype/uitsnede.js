/* =====================================================================
   FOTO-UITSNEDE — zelf bepalen welk deel van een foto zichtbaar is
   ===================================================================== */
// Welke foto's je kunt uitsnijden, in welke vorm ze getoond worden, en de standaardbron
const FOTO_VAKKEN = {
  banner:      { naam:'Banner', ratio:2.6, vrij:true },
  fotoJasmijn: { naam:'Foto bij je quote', ratio:1, rond:true, bron:'bronVloer', std:{ x:.51, y:.29, z:1.9 } },
  fotoSamen:   { naam:'Foto op Samenwerken', ratio:.75, bron:'bronVloer', std:{ x:.5, y:.5, z:1 } },
  fotoWerkplek:{ naam:'Foto op de Werkplek', ratio:.8, bron:'bronPeper', std:{ x:.38, y:.4, z:1.5 } },
  fotoDessert: { naam:'Foto bij de Signature Dish', ratio:.8, bron:'bronGarde', std:{ x:.47, y:.47, z:1.5 } },
  avatarChat:  { naam:'Foto bij de sous-chef', ratio:1, rond:true, bron:'bronPeper', std:{ x:.33, y:.29, z:2.4 } },
  avatarKeuken:{ naam:'Foto in jouw keuken', ratio:1, rond:true, bron:'bronGarde', std:{ x:.475, y:.45, z:3.2 } } };
const BRON_ASPECT = { bronVloer:2/3, bronPeper:2/3, bronGarde:2/3 };

function fotoBron(key) { const kt = klantFoto(key); if (kt) return kt.fotos[key]; const v = FOTO_VAKKEN[key]; return data.portaal?.[key] || (v?.bron ? LOGO_STANDAARD[v.bron] : LOGO_STANDAARD[key]) || ''; }
function fotoAspect(key) { const kt = klantFoto(key); if (kt) return kt.aspect?.[key] || null; const v = FOTO_VAKKEN[key]; return data.portaal?.aspect?.[key] || (!data.portaal?.[key] && v?.bron ? BRON_ASPECT[v.bron] : null); }
function uitsnede(key) { const kt = klantFoto(key); if (kt) return kt.uitsnede?.[key] || { x:.5, y:.5, z:1 }; const v = FOTO_VAKKEN[key]; return data.portaal?.uitsnede?.[key] || (!data.portaal?.[key] && v?.std) || (v?.vrij ? { x:1, y:.3, z:1 } : { x:.5, y:.5, z:1 }); }

// Stijl voor de foto binnen een vak met vaste verhouding: brandpunt (x,y) zo veel mogelijk in het midden, z = inzoomen
function fotoStijl(key, u = uitsnede(key), aspect) {
  const v = FOTO_VAKKEN[key]; const I = aspect !== undefined ? aspect : fotoAspect(key);
  if (v?.vrij || !I) return `object-fit:cover;object-position:${(u.x*100).toFixed(1)}% ${(u.y*100).toFixed(1)}%;transform:scale(${u.z});transform-origin:${(u.x*100).toFixed(1)}% ${(u.y*100).toFixed(1)}%`;
  const A = v.ratio; let W, H; if (I > A) { H = 100*u.z; W = (I/A)*100*u.z; } else { W = 100*u.z; H = (A/I)*100*u.z; }
  const L = Math.min(0, Math.max(100 - W, 50 - u.x*W)), T = Math.min(0, Math.max(100 - H, 50 - u.y*H));
  return `position:absolute;max-width:none;width:${W.toFixed(2)}%;height:${H.toFixed(2)}%;left:${L.toFixed(2)}%;top:${T.toFixed(2)}%;object-fit:fill`;
}
// Een foto in zijn vak, klaar om in de pagina te zetten
function fotoVak(key, alt, cls = '') {
  const src = fotoBron(key); if (!src) return '';
  const v = FOTO_VAKKEN[key];
  return `<span class="fotovak ${v.rond ? 'rond' : ''} ${cls}" style="aspect-ratio:${v.ratio}"><img src="${src}" alt="${esc(alt)}" style="${fotoStijl(key)}" draggable="false"></span>`;
}

/* ---------- De editor in Portaal & huisstijl ---------- */
function uitsnedeModal(m) {
  const v = FOTO_VAKKEN[m.key]; const src = m.src || fotoBron(m.key);
  return `<div class="overlay" data-a="sluit-bg"><div class="modal uitsnedemodal fade" role="dialog" aria-modal="true" aria-labelledby="mt">
    <h2 id="mt">Uitsnede: ${esc(v.naam)}</h2>
    <p class="small muted">Sleep de foto om te kiezen wat er in beeld staat, en zoom in of uit. Wat je hier ziet, zien je klanten.</p>
    <div class="uitsnedevak ${v.rond ? 'rond' : ''} ${v.vrij ? 'breed' : ''}" style="aspect-ratio:${v.ratio}" id="us-vak" tabindex="0" aria-label="Sleep of gebruik de pijltjestoetsen om de uitsnede te verschuiven">
      <img src="${src}" alt="" id="us-img" style="${fotoStijl(m.key, m.u, m.I)}" draggable="false"></div>
    <label class="field" style="margin-top:1rem">Zoom<input type="range" id="us-zoom" min="1" max="${v.vrij ? 2 : 5}" step="0.01" value="${m.u.z}"></label>
    ${v.vrij ? '<p class="hint">Op mobiel is de banner hoger en smaller: daar zie je vooral het midden en de rechterkant.</p>' : ''}
    <div class="foot"><button class="btn ghost" data-a="us-reset">Terug naar standaard</button><button class="btn ghost" data-a="sluit">Annuleren</button><button class="btn" data-a="us-opslaan">Uitsnede opslaan</button></div>
  </div></div>`;
}
function usToepassen() { const img = document.getElementById('us-img'); if (img && ui.modal?.type === 'uitsnede') img.setAttribute('style', fotoStijl(ui.modal.key, ui.modal.u, ui.modal.I)); }
function usVerschuif(dxFrac, dyFrac) { const u = ui.modal.u; u.x = Math.min(1, Math.max(0, u.x + dxFrac)); u.y = Math.min(1, Math.max(0, u.y + dyFrac)); usToepassen(); }

let usSleep = null;
document.addEventListener('pointerdown', e => { const vak = e.target.closest('#us-vak'); if (!vak) return; e.preventDefault(); vak.setPointerCapture(e.pointerId); usSleep = { x:e.clientX, y:e.clientY }; vak.classList.add('sleept'); });
document.addEventListener('pointermove', e => {
  if (!usSleep || ui.modal?.type !== 'uitsnede') return; const img = document.getElementById('us-img'); const vak = document.getElementById('us-vak'); if (!img || !vak) return;
  const r = img.getBoundingClientRect(), b = vak.getBoundingClientRect(); const vrij = FOTO_VAKKEN[ui.modal.key].vrij;
  const dx = e.clientX - usSleep.x, dy = e.clientY - usSleep.y; usSleep = { x:e.clientX, y:e.clientY };
  usVerschuif(-dx / (vrij ? b.width : r.width), -dy / (vrij ? b.height : r.height));
});
document.addEventListener('pointerup', () => { if (!usSleep) return; usSleep = null; document.getElementById('us-vak')?.classList.remove('sleept'); });
document.addEventListener('keydown', e => { if (e.target.id !== 'us-vak') return; const s = e.shiftKey ? .05 : .01;
  const k = { ArrowLeft:[s,0], ArrowRight:[-s,0], ArrowUp:[0,s], ArrowDown:[0,-s] }[e.key]; if (k) { e.preventDefault(); usVerschuif(k[0], k[1]); } });
document.addEventListener('input', e => { if (e.target.id !== 'us-zoom' || ui.modal?.type !== 'uitsnede') return; ui.modal.u.z = +e.target.value; usToepassen(); });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  switch (el.dataset.a) {
    case 'us-open': { const key = el.dataset.key;
      if (el.dataset.eigenaar === 'klant') { const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); const t = themaVan(k);
        ui.modal = { type:'uitsnede', key, eigenaar:'klant', src:t.fotos[key], I:t.aspect?.[key], u:{ ...(t.uitsnede?.[key] || { x:.5, y:.5, z:1 }) } }; }
      else ui.modal = { type:'uitsnede', key, u:{ ...uitsnede(key) } };
      render(); document.getElementById('us-vak')?.focus(); return; }
    case 'us-reset': { const k = ui.modal.key; const v = FOTO_VAKKEN[k]; ui.modal.u = ui.modal.eigenaar === 'klant' ? { x:.5, y:.5, z:1 } : { ...((!data.portaal[k] && v.std) || (v.vrij ? { x:1, y:.3, z:1 } : { x:.5, y:.5, z:1 })) };
      usToepassen(); const z = document.getElementById('us-zoom'); if (z) z.value = ui.modal.u.z; return; }
    case 'us-opslaan': if (ui.modal.eigenaar === 'klant') { const k = ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); themaVan(k).uitsnede[ui.modal.key] = { ...ui.modal.u }; }
      else data.portaal.uitsnede = { ...(data.portaal.uitsnede || {}), [ui.modal.key]: { ...ui.modal.u } }; bewaar(); ui.modal = null; render(); toast('Uitsnede opgeslagen. Staat direct zo in elk portaal.'); return;
  }
});

// Pas renderen als alle onderdelen geladen zijn
render();
