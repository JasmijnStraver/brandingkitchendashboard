/* =====================================================================
   EIGEN TOOLS — klanten bouwen hun eigen agent, naast jouw skills.
   Elke eigen tool kent automatisch haar merkgeheugen en de actuele kennis.
   ===================================================================== */
const EIGEN_MAX = 12;
const EIGEN_UITVOER = ['Caption of post','E-mail of nieuwsbrief','Script voor video','Lijst met ideeën','Bericht of DM','Tekst voor website of salespagina','Anders'];
function huidigeKlant() { return ui.rol === 'admin' ? klant(ui.actief) : klant(ui.sessie); }
function eigenTool(sid) { if (!String(sid).startsWith('eigen-')) return null; return (huidigeKlant()?.eigenTools || []).find(t => t.id === sid) || null; }
function eigenInstructie(t, k = huidigeKlant()) {
  return `# ${t.naam}
Je bent een persoonlijke schrijftool van ${k?.bedrijf || k?.naam || 'de klant'}, zelf gebouwd in het klantportaal van Studio Crave.

## Wat je doet
${t.doel}
${t.wanneer ? `\n## Wanneer ze je gebruikt\n${t.wanneer}\n` : ''}
## Wat ze je geeft
${t.invoer || 'Een onderwerp of vraag.'} Stel alleen een vraag terug als er echt iets essentieels ontbreekt; ga anders uit van wat je weet.

## Wat je teruggeeft
${t.uitvoer === 'Anders' ? (t.uitvoerAnders || 'Een tekst die past bij de vraag.') : t.uitvoer}. Lever het direct bruikbaar op.
${t.voorbeeld ? `\n## Zo moet het ongeveer voelen (voorbeeld van de klant)\n${t.voorbeeld}\n` : ''}${t.nietDoen ? `\n## Doe nooit\n${t.nietDoen}\n` : ''}
## Altijd
Schrijf in de toon, woorden en stijl uit het merkgeheugen hieronder. Gebruik de meegegeven actuele kennis van haar kanalen. Blijf binnen wat de klant vroeg.`;
}
// Maak eigen tools zichtbaar voor de bestaande toolfuncties (modal, draaien, sous-chef)
function toolDef(sid) { const t = eigenTool(sid); return t ? { id:t.id, naam:t.naam, course:t.course || '', eigen:true } : SKILLS.find(x => x.id === sid); }
function toolData(sid) { const t = eigenTool(sid); return t ? { wat:t.doel.split(/[.\n]/)[0], vb:t.voorbeeldvraag || t.invoer || 'waar ik nu mee bezig ben', instructie:eigenInstructie(t), versie:1, status:'live', kennis:t.kanalen || [] } : data.skills[sid]; }

function eigenKaart(t) { return `<button class="tool eigen" data-a="skill" data-id="${t.id}"><span class="vers">Jouw eigen tool</span><strong>${esc(t.naam)}</strong><span>${esc(toolData(t.id).wat)}</span></button>`; }
function bouwKaart(course) { return `<button class="tool bouw" data-a="eigen-nieuw" ${course ? `data-course="${course}"` : ''}><strong>Bouw je eigen tool</strong><span>Een agent die precies doet wat jij nodig hebt, in jouw toon.</span></button>`; }
function eigenToolsBlok(k) {
  const lijst = k.eigenTools || [];
  return `<div class="block eigenblok"><h2>Jouw eigen tools</h2>
    <p class="muted small" style="margin:-.3rem 0 1rem">Bouw naast mijn tools je eigen agents: voor dat ene terugkerende klusje, precies zoals jij het wilt. Ze kennen je merk al: je toon, je doelgroep, je stem en de actuele kennis gaan vanzelf mee.</p>
    <div class="tools">${lijst.map(t => `<div class="eigenitem">${eigenKaart(t)}<div class="eigenacties"><button class="linkbtn small" data-a="eigen-bewerk" data-id="${t.id}">Aanpassen</button><button class="linkbtn small" data-a="eigen-weg" data-id="${t.id}">Verwijderen</button></div></div>`).join('')}
    ${lijst.length < EIGEN_MAX ? bouwKaart('') : ''}</div>
    ${lijst.length >= EIGEN_MAX ? `<p class="hint">Je hebt het maximum van ${EIGEN_MAX} eigen tools bereikt. Verwijder er een om een nieuwe te bouwen.</p>` : ''}</div>`;
}
function eigenModal(m) {
  const k = klant(ui.sessie) || huidigeKlant(); const t = m.t; const open = Object.entries(k.courses).filter(([, c]) => c.status !== 'dicht');
  return `<div class="overlay" data-a="sluit-bg"><div class="modal eigenmodal fade" role="dialog" aria-modal="true" aria-labelledby="mt">
    <h2 id="mt">${m.id ? 'Je tool aanpassen' : 'Bouw je eigen tool'}</h2>
    <p class="small muted">Je tool kent je merk al: je toon, je doelgroep, je stemvoorbeelden en de actuele kennis van je kanalen gaan automatisch mee. Jij vertelt alleen wat hij moet doen.</p>
    <div class="stack" style="margin-top:1rem">
      <label class="field">Naam van je tool<input id="et-naam" value="${esc(t.naam)}" placeholder="Bijv. Mijn wekelijkse nieuwsbrief"></label>
      <label class="field">Wat moet hij voor je doen?<textarea id="et-doel" placeholder="Bijv. Van een paar steekwoorden een persoonlijke nieuwsbrief maken, met één verhaal, één les en een vraag aan mijn lezers.">${esc(t.doel)}</textarea></label>
      <div class="actions"><button class="btn ghost sm" data-a="eigen-meedenken" ${ui.eigenBezig ? 'disabled' : ''}>${ui.eigenBezig ? 'De sous-chef denkt mee…' : 'Laat de sous-chef de rest invullen'}</button></div>
      ${ui.eigenFout ? `<p class="err">${esc(ui.eigenFout)}</p>` : ''}
      <label class="field">Wanneer gebruik je hem?<input id="et-wanneer" value="${esc(t.wanneer)}" placeholder="Bijv. elke donderdag, voor mijn nieuwsbrief van vrijdag"></label>
      <label class="field">Wat geef je hem mee?<input id="et-invoer" value="${esc(t.invoer)}" placeholder="Bijv. het onderwerp en een moment uit mijn week"></label>
      <div class="grid2"><label class="field">Wat krijg je terug?<select id="et-uitvoer">${EIGEN_UITVOER.map(x => `<option ${t.uitvoer === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>
        <label class="field">Bij welke course hoort hij? (optioneel)<select id="et-course"><option value="">Nergens specifiek</option>${open.map(([c]) => `<option value="${c}" ${t.course === c ? 'selected' : ''}>${COURSES[c].naam}</option>`).join('')}</select></label></div>
      <label class="field">Anders, namelijk (als je "Anders" koos)<input id="et-uitvoerAnders" value="${esc(t.uitvoerAnders)}"></label>
      <label class="field">Een voorbeeld van hoe het eruit moet zien (optioneel)<textarea id="et-voorbeeld" placeholder="Plak een tekst die je zelf ooit schreef en goed vond">${esc(t.voorbeeld)}</textarea></label>
      <label class="field">Wat moet hij nooit doen?<input id="et-nietDoen" value="${esc(t.nietDoen)}" placeholder="Bijv. geen emoji's, geen Engelse woorden, nooit 'ik help'"></label>
      <div><p class="sectlabel" style="margin-top:0">Voor welke kanalen? (optioneel)</p><div class="kanalen" style="margin:0">${KANALEN.map(d => `<label class="kanaal"><input type="checkbox" class="et-kanaal" value="${d}" ${(t.kanalen || []).includes(d) ? 'checked' : ''}><span>${KENNISDOMEINEN[d].titel}</span></label>`).join('')}</div></div>
    </div>
    <div class="foot"><button class="btn ghost" data-a="sluit">Annuleren</button><button class="btn" data-a="eigen-opslaan">${m.id ? 'Opslaan' : 'Tool bouwen'}</button></div></div></div>`;
}
function leesEigenForm() {
  return { naam:val('et-naam'), doel:val('et-doel'), wanneer:val('et-wanneer'), invoer:val('et-invoer'), uitvoer:val('et-uitvoer'), uitvoerAnders:val('et-uitvoerAnders'),
    course:val('et-course'), voorbeeld:val('et-voorbeeld'), nietDoen:val('et-nietDoen'), kanalen:[...document.querySelectorAll('.et-kanaal:checked')].map(x => x.value) };
}
async function eigenMeedenken(k) {
  ui.eigenFout = ''; const f = leesEigenForm(); ui.modal.t = { ...ui.modal.t, ...f };
  if (!f.doel && !f.naam) { ui.eigenFout = 'Vertel eerst in een paar woorden wat je tool moet doen.'; render(); return; }
  const sample = await getSample();
  if (!sample) { ui.eigenFout = 'Meedenken werkt in de gepubliceerde versie van het portaal. Je kunt de velden wel zelf invullen.'; render(); return; }
  ui.eigenBezig = true; render();
  try {
    const r = await sample.json(`Een klant bouwt in haar portaal een eigen schrijftool. Vul de velden in, kort en concreet, in het Nederlands, passend bij haar merk. Verzin niets over haar dat hieronder niet staat.
Naam: ${f.naam || '(nog geen)'}\nWat hij moet doen: ${f.doel || '(nog niet ingevuld)'}
Kies uitvoer uit: ${EIGEN_UITVOER.join(', ')}.
Geef ALLEEN JSON: {"naam":"","doel":"","wanneer":"","invoer":"","uitvoer":"","nietDoen":"","voorbeeldvraag":""}

MERK VAN DE KLANT:
${merkContext(k)}`, { modelTier:'default' });
    const t = ui.modal.t; ['naam','doel','wanneer','invoer','nietDoen','voorbeeldvraag'].forEach(x => { if (r?.[x] && !t[x]) t[x] = String(r[x]); });
    if (EIGEN_UITVOER.includes(r?.uitvoer)) t.uitvoer = r.uitvoer;
  } catch (e) { ui.eigenFout = 'Het meedenken lukte even niet. Probeer het opnieuw.'; }
  finally { ui.eigenBezig = false; render(); }
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.sessie); if (!k) return;
  switch (el.dataset.a) {
    case 'eigen-nieuw': if (!toegangOpen(k)) { ui.modal = { type:'verleng' }; render(); return; }
      if ((k.eigenTools || []).length >= EIGEN_MAX) { toast(`Je hebt al ${EIGEN_MAX} eigen tools.`); return; }
      ui.eigenFout = ''; ui.modal = { type:'eigen', t:{ naam:'', doel:'', wanneer:'', invoer:'', uitvoer:EIGEN_UITVOER[0], uitvoerAnders:'', course:el.dataset.course || '', voorbeeld:'', nietDoen:'', kanalen:[] } }; render(); return;
    case 'eigen-bewerk': { const t = (k.eigenTools || []).find(x => x.id === el.dataset.id); if (!t) return; ui.eigenFout = ''; ui.modal = { type:'eigen', id:t.id, t:{ ...t } }; render(); return; }
    case 'eigen-weg': if (!confirm('Deze tool verwijderen?')) return; k.eigenTools = (k.eigenTools || []).filter(x => x.id !== el.dataset.id); bewaar(); render(); return;
    case 'eigen-meedenken': eigenMeedenken(k); return;
    case 'eigen-opslaan': { const f = leesEigenForm(); if (!f.naam || !f.doel) { ui.eigenFout = 'Geef je tool een naam en vertel wat hij moet doen.'; ui.modal.t = { ...ui.modal.t, ...f }; render(); return; }
      k.eigenTools = k.eigenTools || [];
      if (ui.modal.id) Object.assign(k.eigenTools.find(x => x.id === ui.modal.id), f, { voorbeeldvraag: ui.modal.t.voorbeeldvraag || '' });
      else { k.eigenTools.push({ id:'eigen-' + uid(), ...f, voorbeeldvraag: ui.modal.t.voorbeeldvraag || '', op:nu() }); if (!ui.preview) log(k, 'skill', `bouwde een eigen tool: ${f.naam}`); }
      bewaar(); ui.modal = null; render(); toast('Je tool staat klaar. Hij kent je merk al.'); return; }
  }
});

/* ---------- Voor jou in je keuken ---------- */
function tabEigenTools(k) {
  const lijst = k.eigenTools || [];
  return `<div class="panel"><h2>Eigen tools van ${esc(voornaam(k))}</h2>
    <p class="small muted" style="margin-bottom:1rem">Agents die ${esc(voornaam(k))} zelf bouwde, naast jouw skills. Handig om te zien wat ze nodig heeft: een tool die vaak terugkomt bij klanten, kan een nieuwe skill voor je bibliotheek worden.</p>
    <div class="rows">${lijst.map(t => `<div class="row"><div class="t"><strong>${esc(t.naam)}</strong><span>${esc(t.doel)}${t.course ? ' &nbsp;|&nbsp; ' + COURSES[t.course]?.naam : ''} &nbsp;|&nbsp; gebouwd ${datum(t.op)}</span>
      <details class="inhoud"><summary>Bekijk de instructie</summary><pre class="ctx" style="max-height:18rem">${esc(eigenInstructie(t, k))}</pre></details></div></div>`).join('') || '<p class="muted small">Nog geen eigen tools.</p>'}</div></div>`;
}
