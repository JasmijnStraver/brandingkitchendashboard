/* =====================================================================
   HUMAN DESIGN — invoer, bodygraph en vertaling naar business
   ===================================================================== */
const HD_PLAATSEN = [
  ['Europe/Amsterdam', ['nederland','amsterdam','rotterdam','den haag','utrecht','eindhoven','breda','tilburg','groningen','almere','nijmegen','arnhem','haarlem','enschede','zwolle','leiden','maastricht','dordrecht','den bosch','\'s-hertogenbosch','amersfoort','apeldoorn','leeuwarden','delft','alkmaar','venlo','deventer','roosendaal','bergen op zoom','oosterhout','etten-leur']],
  ['Europe/Brussels', ['belgië','belgie','brussel','antwerpen','gent','brugge','leuven','hasselt','mechelen','luik','charleroi']],
  ['America/Paramaribo', ['suriname','paramaribo']], ['America/Curacao', ['curaçao','curacao','willemstad']], ['America/Aruba', ['aruba','oranjestad']],
  ['Europe/Berlin', ['duitsland','berlijn','berlin','keulen','köln','düsseldorf','hamburg','münchen','munchen']], ['Europe/London', ['engeland','verenigd koninkrijk','londen','london','manchester']],
  ['Europe/Paris', ['frankrijk','parijs','paris','lyon','marseille']], ['Europe/Madrid', ['spanje','madrid','barcelona','valencia']], ['Europe/Rome', ['italië','italie','rome','milaan']],
  ['Africa/Casablanca', ['marokko','casablanca','rabat','tanger','nador','marrakech']], ['Europe/Istanbul', ['turkije','istanbul','ankara','izmir']],
  ['Asia/Jakarta', ['indonesië','indonesie','jakarta','bandung','surabaya']], ['America/New_York', ['new york','boston','miami']], ['America/Los_Angeles', ['los angeles','san francisco']],
  ['America/Toronto', ['toronto','montreal','ottawa']], ['Australia/Sydney', ['sydney']], ['Africa/Johannesburg', ['zuid-afrika','johannesburg','kaapstad']] ];
function hdTzVoorPlaats(plaats) { const p = (plaats || '').toLowerCase(); const hit = HD_PLAATSEN.find(([, woorden]) => woorden.some(w => p.includes(w))); return hit ? hit[0] : ''; }
function hdTijdzones() { try { return Intl.supportedValuesOf('timeZone'); } catch (e) { return HD_PLAATSEN.map(x => x[0]); } }
const hdKlaar = () => typeof Astronomy !== 'undefined';

function hdKort(k) {
  const w = k.werkplek; const hd = w.hd?.chart; const et = ENERGIETYPES[w.energietype];
  if (hd) {
    const [p1, p2] = hd.profiel.split('/');
    return `<div class="block hdkort"><h2>Jouw Human Design</h2>
      <div class="hdkern">
        ${[['Type', hd.type],['Strategie', hd.strategie],['Autoriteit', hd.autoriteit],['Profiel', `${hd.profiel} ${HD_PROFIELLIJNEN[p1].naam} / ${HD_PROFIELLIJNEN[p2].naam}`],['Definitie', hd.definitie],['Incarnatiekruis', `${hd.kruis.hoek} (${hd.kruis.gates})`]]
          .map(([l,v]) => `<div><span>${l}</span><strong>${esc(v)}</strong></div>`).join('')}
      </div>
      <p class="small muted" style="margin-top:.8rem">Geboren ${datum(w.hd.datum)}${w.hd.tijdOnbekend ? ' (tijd onbekend)' : ', '+esc(w.hd.tijd)}${w.hd.plaats ? ', '+esc(w.hd.plaats) : ''}. Een lens, geen wet: neem mee wat klopt.</p>
      <div class="actions" style="margin-top:.8rem"><a class="btn sm" href="#hdchart">Bekijk je chart</a><button class="btn ghost sm" data-a="hd-opnieuw">Gegevens aanpassen</button></div></div>`;
  }
  if (w.energietype && !ui.hdForm) {
    const p = w.profiel ? w.profiel.split('/') : null;
    return `<div class="block hdkort"><h2>Jouw Human Design</h2>
      <div class="hdkern">
        ${[['Type', w.energietype],['Strategie', HD_STRATEGIE[w.energietype] || ''],['Autoriteit', w.autoriteit || 'nog niet ingevuld'],['Profiel', p ? `${w.profiel} ${HD_PROFIELLIJNEN[p[0]].naam} / ${HD_PROFIELLIJNEN[p[1]].naam}` : 'nog niet ingevuld']]
          .map(([l,v]) => `<div><span>${l}</span><strong>${esc(v)}</strong></div>`).join('')}
      </div>
      <p class="small muted" style="margin-top:.8rem">Handmatig ingevuld. Voeg je geboortegegevens toe voor je volledige chart: bodygraph, poorten, kanalen, definitie en incarnatiekruis.</p>
      <div class="actions" style="margin-top:.8rem"><a class="btn sm" href="#hdchart">Wat betekent dit?</a><button class="btn ghost sm" data-a="hd-formulier">Geboortegegevens invullen</button></div></div>`;
  }
  const tzStandaard = w.hd?.tz || 'Europe/Amsterdam';
  return `<div class="block"><h2>Jouw Human Design</h2>
    <p class="small muted" style="margin-bottom:1rem">Human Design als lens op je werkritme: hoe je het best werkt, content maakt, verkoopt en beslist. Vul je geboortegegevens in, dan maak ik je chart: type, autoriteit, profiel (bijvoorbeeld 6/2 of 1/4), definitie en je incarnatiekruis.</p>
    <div class="stack">
      <div class="grid2"><label class="field">Geboortedatum<input type="date" id="hd-datum" value="${esc(w.hd?.datum || '')}" max="${new Date().toISOString().slice(0,10)}"></label>
        <label class="field">Geboortetijd<input type="time" id="hd-tijd" value="${esc(w.hd?.tijd || '')}"></label></div>
      <label class="check small"><input type="checkbox" id="hd-onbekend" ${w.hd?.tijdOnbekend ? 'checked' : ''}> Ik weet mijn geboortetijd niet precies</label>
      <label class="field">Geboorteplaats<input id="hd-plaats" value="${esc(w.hd?.plaats || '')}" placeholder="Bijv. Breda, Nederland" data-c="hd-plaats"></label>
      <label class="field">Tijdzone van je geboorteplaats<select id="hd-tz">${hdTijdzones().map(z => `<option ${z===tzStandaard?'selected':''}>${z}</option>`).join('')}</select></label>
      <div class="actions"><button class="btn" data-a="hd-maak" ${hdKlaar() ? '' : 'disabled'}>Maak mijn chart</button>${(w.hd || w.energietype) ? '<button class="btn ghost" data-a="hd-annuleer">Annuleren</button>' : ''}</div>
      ${hdKlaar() ? '' : '<p class="small err">De rekenmodule laadt niet. Controleer je internetverbinding en ververs de pagina.</p>'}
      <p class="small muted">Je geboortetijd staat op je geboorteakte, of vraag het een ouder. Hoe preciezer, hoe betrouwbaarder je profiel en je Maan-poorten. Je gegevens blijven in je eigen portaal en je kunt ze altijd verwijderen.</p>
    </div>
    <details class="hdhand"><summary>Ken je je type al? Vul het handmatig in</summary>
      <div class="grid2" style="margin-top:.8rem"><label class="field">Type<select id="hdh-type"><option value="">Kies je type</option>${Object.keys(ENERGIETYPES).map(t => `<option ${w.energietype===t?'selected':''}>${t}</option>`).join('')}</select></label>
      <label class="field">Autoriteit<select id="hdh-aut"><option value="">Kies je autoriteit</option>${Object.keys(AUTORITEITEN).map(t => `<option ${w.autoriteit===t?'selected':''}>${t}</option>`).join('')}</select></label>
      <label class="field">Profiel<select id="hdh-prof"><option value="">Kies je profiel</option>${['1/3','1/4','2/4','2/5','3/5','3/6','4/6','4/1','5/1','5/2','6/2','6/3'].map(t => `<option ${w.profiel===t?'selected':''}>${t}</option>`).join('')}</select></label></div>
      <div class="actions" style="margin-top:.8rem"><button class="btn" data-a="hd-hand-opslaan">Opslaan en bekijken</button></div>
    </details></div>`;
}

function hdDetail(k) {
  const w = k.werkplek; const hd = w.hd?.chart;
  if (!hd && w.energietype) { const et = ENERGIETYPES[w.energietype]; const p = w.profiel ? w.profiel.split('/') : null; const t = hdToon(k);
    return `<div class="block hddetail" id="hdchart"><h2 style="font-size:2rem">Je design, vertaald naar je business</h2><div class="hdgrid hdhandgrid">
      ${et ? `<div class="etkaart" style="margin-top:0"><h3>${esc(w.energietype)}</h3><p class="muted">${et.kort}</p>
        <dl>${[['Zo werk je het best',et.werk],['Zo maak je content',et.content],['Zo verkoop je',et.verkopen],['Let op',et.valkuil],...(w.autoriteit ? [[`Zo beslis je (${w.autoriteit})`, AUTORITEITEN[w.autoriteit]]] : []),['Je strategie', HD_STRATEGIE[w.energietype]]].map(([l,v]) => `<div class="qa"><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>` : ''}
      <div>${p ? `<div class="etkaart" style="margin-top:0"><h3>Profiel ${w.profiel}</h3><p class="muted">${HD_PROFIELLIJNEN[p[0]].naam} / ${HD_PROFIELLIJNEN[p[1]].naam}. De eerste lijn is je bewuste kant, de tweede je onbewuste.</p>
          <dl><div class="qa"><dt>Lijn ${p[0]}, ${HD_PROFIELLIJNEN[p[0]].naam} (bewust)</dt><dd>${HD_PROFIELLIJNEN[p[0]].business}</dd></div><div class="qa"><dt>Lijn ${p[1]}, ${HD_PROFIELLIJNEN[p[1]].naam} (onbewust)</dt><dd>${HD_PROFIELLIJNEN[p[1]].business}</dd></div></dl></div>` : ''}
        ${t && k.werkplek?.hdInToon !== false ? `<div class="etkaart"><h3>Zo schrijf je vanuit je design</h3><p class="muted">Je tools en je sous-chef nemen dit automatisch mee, naast je eigen toon.</p><ul class="doeslist" style="margin-top:.6rem">${t.regels.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        <div class="actions" style="margin-top:1rem"><button class="btn" data-a="chat-sug" data-v="Ik ben ${esc(w.energietype)}${w.autoriteit ? ' met '+esc(w.autoriteit)+' autoriteit' : ''}${w.profiel ? ', profiel '+w.profiel : ''}. Vertaal dit naar concrete werkregels voor mijn week, mijn content en mijn verkoop.">Vertaal naar mijn werkweek</button><button class="btn ghost" data-a="hd-hand-wis">Wissen</button></div></div>
    </div></div>`; }
  if (!hd) return '';
  const et = ENERGIETYPES[hd.type]; const [p1, p2] = hd.profiel.split('/');
  const rij = (pl) => { const open = ui.hdPlaneet === pl; const P = hd.persoonlijkheid[pl], D = hd.design[pl];
    return `<tr class="hdrij ${open ? 'open' : ''}" data-a="hd-planeet" data-v="${pl}" tabindex="0" role="button" aria-expanded="${open}"><td>${pl} <span class="hdpijl" aria-hidden="true">${open ? '−' : '+'}</span></td><td class="hdp">${P.gate}.${P.line}</td><td class="hdd">${D.gate}.${D.line}</td></tr>
    ${open ? `<tr class="hdinfo"><td colspan="3"><p class="hdplaneet">${HD_PLANEET_BETEKENIS[pl]}</p>${hdUitleg(pl, P, true)}${hdUitleg(pl, D, false)}
      <button class="btn sm" data-a="chat-sug" data-v="Wat betekent mijn ${pl} in poort ${P.gate}.${P.line} (bewust) en in poort ${D.gate}.${D.line} (onbewust) voor mijn business, mijn content en hoe ik werk?">Vraag je sous-chef wat dit voor jouw business betekent</button></td></tr>` : ''}`; };
  return `<div class="block hddetail" id="hdchart"><h2 style="font-size:2rem">Je chart, vertaald naar je business</h2>
    <div class="hdgrid">
      <div class="hdgraph">${hdBodygraph(hd)}
        <p class="hdlegenda"><span class="li"><i class="lp"></i>Bewust (persoonlijkheid)</span><span class="li"><i class="ld"></i>Onbewust (design)</span><span class="li"><i class="lb"></i>Beide</span></p></div>
      <div>
        ${et ? `<div class="etkaart" style="margin-top:0"><h3>${esc(hd.type)}</h3><p class="muted">${et.kort}</p>
          <dl>${[['Zo werk je het best',et.werk],['Zo maak je content',et.content],['Zo verkoop je',et.verkopen],['Let op',et.valkuil],[`Zo beslis je (${hd.autoriteit})`, AUTORITEITEN[hd.autoriteit]],['Je strategie', hd.strategie]].map(([l,v]) => `<div class="qa"><dt>${l}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>` : ''}
        <div class="etkaart"><h3>Profiel ${hd.profiel}</h3><p class="muted">${HD_PROFIELLIJNEN[p1].naam} / ${HD_PROFIELLIJNEN[p2].naam}. De eerste lijn is je bewuste kant, de tweede je onbewuste.</p>
          <dl><div class="qa"><dt>Lijn ${p1}, ${HD_PROFIELLIJNEN[p1].naam} (bewust)</dt><dd>${HD_PROFIELLIJNEN[p1].business}</dd></div>
          <div class="qa"><dt>Lijn ${p2}, ${HD_PROFIELLIJNEN[p2].naam} (onbewust)</dt><dd>${HD_PROFIELLIJNEN[p2].business}</dd></div></dl></div>
        ${(() => { const t = hdToon(k); return t && k.werkplek?.hdInToon !== false ? `<div class="etkaart"><h3>Zo schrijf je vanuit je design</h3><p class="muted">Je tools en je sous-chef nemen dit automatisch mee, naast je eigen toon.</p><ul class="doeslist" style="margin-top:.6rem">${t.regels.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''; })()}
        <div class="actions" style="margin-top:1rem">
          <button class="btn" data-a="chat-sug" data-v="Gebruik de Human Design Werkstijl-tool. Vertaal mijn chart (${esc(hd.type)}, ${esc(hd.autoriteit)} autoriteit, profiel ${hd.profiel}, ${esc(hd.definitie)}) naar concrete werkregels voor mijn week, mijn content en mijn verkoop.">Vertaal naar mijn werkweek</button>
          <button class="btn ghost" data-a="hd-wis">Geboortegegevens verwijderen</button></div>
      </div>
    </div>
    <div class="hdonder">
      <div><h3>Gedefinieerde centra</h3><p>${Object.keys(HD_CENTRA).map(c => `<span class="chip ${hd.gedefinieerd.includes(c)?'aan':''}">${HD_CENTRA[c].naam}</span>`).join('')}</p>
        <h3 style="margin-top:1rem">Kanalen</h3><p>${hd.kanalen.map(x => `<span class="chip aan">${x.a}-${x.b} ${esc(x.naam)}</span>`).join('') || '<span class="muted small">Geen kanalen</span>'}</p></div>
      <div><h3>Planeten en poorten</h3><p class="small muted" style="margin:-.2rem 0 .6rem">Tik op een planeet voor uitleg. Het getal is poort.lijn.</p><div class="tablewrap hdtabel"><table><thead><tr><th>Planeet</th><th>Bewust</th><th>Onbewust</th></tr></thead><tbody>${HD_PLANETEN.map(rij).join('')}</tbody></table></div></div>
    </div></div>`;
}


// Wat de planeten en poorten betekenen (voor de uitleg bij de chart)
const HD_PLANEET_BETEKENIS = {
  Zon:'Je kern en levenskracht: wat je uitstraalt en waar je energie van nature naartoe gaat. Samen met de Aarde het grootste deel van je design.',
  Aarde:'Je aarding: wat je in balans en met beide benen op de grond houdt.',
  Noordknoop:'De omgeving en het thema waar je naartoe groeit, vooral in de tweede helft van je leven.',
  Zuidknoop:'De omgeving en het thema van de eerste helft van je leven: waar je vandaan komt.',
  Maan:'Wat je drijft: de motor achter je keuzes.',
  Mercurius:'Communicatie: wat je te vertellen hebt, en hoe je het zegt.',
  Venus:'Je waarden: wat je goed en belangrijk vindt, en waar je voor staat.',
  Mars:'Waar je nog groeit: onbesuisde energie die door ervaring rijpt.',
  Jupiter:'Je eigen wetten: waar voorspoed en bescherming liggen als je trouw bent aan jouw manier.',
  Saturnus:'Discipline: waar het schuurt als je niet trouw bent aan je eigen regels.',
  Uranus:'Waar je onconventioneel en vernieuwend bent.',
  Neptunus:'Waar een sluier ligt: intuïtie, spiritualiteit, en soms illusie.',
  Pluto:'Transformatie: waar je diepste waarheid aan het licht komt.' };
const HD_POORTNAMEN = {1:'Zelfexpressie',2:'Richting van het zelf',3:'Ordening',4:'Formuleren',5:'Vaste ritmes',6:'Wrijving',7:'De rol van het zelf',8:'Bijdrage',9:'Focus',10:'Gedrag van het zelf',
  11:'Ideeën',12:'Voorzichtigheid',13:'De luisteraar',14:'Vermogen',15:'Extremen',16:'Vaardigheden',17:'Meningen',18:'Correctie',19:'Verlangen',20:'Het nu',
  21:'De jager (controle)',22:'Openheid',23:'Assimilatie',24:'Rationalisatie',25:'De geest van het zelf',26:'De egoïst',27:'Zorgen voor',28:'De speler',29:'Ja zeggen',30:'Gevoelens',
  31:'Leiden',32:'Continuïteit',33:'Privacy',34:'Kracht',35:'Verandering',36:'Crisis',37:'Vriendschap',38:'De vechter',39:'De provocateur',40:'Alleenzijn',
  41:'Samentrekking',42:'Groei',43:'Inzicht',44:'Alertheid',45:'De verzamelaar',46:'Vastberadenheid van het zelf',47:'Realisatie',48:'Diepte',49:'Principes',50:'Waarden',
  51:'Schok',52:'Stilte',53:'Beginnen',54:'Ambitie',55:'Geest',56:'Stimulatie',57:'Intuïtieve helderheid',58:'Vitaliteit',59:'Seksualiteit en verbinding',60:'Acceptatie',
  61:'Mysterie',62:'Details',63:'Twijfel',64:'Verwarring'};
function hdUitleg(pl, x, bewust) {
  return `<div class="hduitleg"><p class="kicker">${bewust ? 'Bewust (persoonlijkheid)' : 'Onbewust (design)'}</p>
    <p><strong>${pl} in poort ${x.gate}, ${HD_POORTNAMEN[x.gate]}</strong>, lijn ${x.line} (${HD_PROFIELLIJNEN[x.line].naam}).</p>
    <p class="muted small">${bewust ? 'Dit herken je van jezelf.' : 'Dit leeft in je lijf en zien anderen vaak eerder dan jij.'} Het thema van poort ${x.gate}, ${HD_POORTNAMEN[x.gate].toLowerCase()}, kleurt hier ${pl === 'Zon' || pl === 'Aarde' ? 'je kern' : 'dit deel van je'}.</p></div>`;
}

// Bodygraph als SVG
const HD_POS = { hoofd:[150,30], ajna:[150,108], keel:[150,170], g:[150,248], hart:[208,270], sacraal:[150,345], milt:[52,318], zonnevlecht:[248,318], wortel:[150,418] };
function hdVorm(c, x, y, s, gevuld) {
  const f = gevuld ? 'var(--gold)' : 'var(--surface)'; const st = gevuld ? 'var(--gold)' : 'var(--line)';
  const a = `fill="${f}" stroke="${st}" stroke-width="1.5"`;
  switch (c) {
    case 'hoofd': return `<polygon points="${x},${y-s} ${x+s},${y+s*.8} ${x-s},${y+s*.8}" ${a}/>`;
    case 'ajna': return `<polygon points="${x-s},${y-s*.8} ${x+s},${y-s*.8} ${x},${y+s}" ${a}/>`;
    case 'g': return `<polygon points="${x},${y-s*1.1} ${x+s*1.1},${y} ${x},${y+s*1.1} ${x-s*1.1},${y}" ${a}/>`;
    case 'hart': return `<polygon points="${x},${y-s*.7} ${x+s*.8},${y+s*.6} ${x-s*.8},${y+s*.6}" ${a}/>`;
    case 'milt': return `<polygon points="${x-s*.8},${y-s} ${x+s},${y} ${x-s*.8},${y+s}" ${a}/>`;
    case 'zonnevlecht': return `<polygon points="${x+s*.8},${y-s} ${x-s},${y} ${x+s*.8},${y+s}" ${a}/>`;
    default: return `<rect x="${x-s}" y="${y-s}" width="${s*2}" height="${s*2}" rx="3" ${a}/>`;
  }
}
function hdBodygraph(hd) {
  const P = new Set(Object.values(hd.persoonlijkheid).map(x => x.gate)); const D = new Set(Object.values(hd.design).map(x => x.gate));
  const cVan = g => Object.keys(HD_CENTRA).find(c => HD_CENTRA[c].gates.includes(g));
  const paren = {};
  const lijnen = HD_KANALEN.map(([a, b]) => { const c1 = cVan(a), c2 = cVan(b); const sleutel = [c1,c2].sort().join('-'); const n = paren[sleutel] = (paren[sleutel] ?? -1) + 1;
    const [x1,y1] = HD_POS[c1], [x2,y2] = HD_POS[c2]; const len = Math.hypot(x2-x1, y2-y1) || 1; const off = (n - 1) * 7; const ox = -(y2-y1)/len*off, oy = (x2-x1)/len*off;
    const aan = (P.has(a)||D.has(a)) && (P.has(b)||D.has(b));
    const bron = [a,b].map(g => P.has(g) && D.has(g) ? 'b' : P.has(g) ? 'p' : D.has(g) ? 'd' : '').join('');
    const kleur = !aan ? 'var(--line)' : /^(p|b)(p|b)$/.test(bron) && !bron.includes('d') ? 'var(--ink)' : /^(d|b)(d|b)$/.test(bron) && !bron.includes('p') ? 'var(--pepper)' : 'var(--gold)';
    return `<line x1="${x1+ox}" y1="${y1+oy}" x2="${x2+ox}" y2="${y2+oy}" stroke="${kleur}" stroke-width="${aan ? 4 : 2}" stroke-linecap="round"><title>${a}-${b}</title></line>`; }).join('');
  const centra = Object.keys(HD_POS).map(c => { const [x,y] = HD_POS[c]; const s = c==='hart' ? 16 : c==='keel' || c==='wortel' || c==='sacraal' ? 22 : 24;
    return `${hdVorm(c, x, y, s, hd.gedefinieerd.includes(c))}<title>${HD_CENTRA[c].naam}</title>`; }).join('');
  return `<svg viewBox="0 0 300 460" role="img" aria-label="Bodygraph: ${esc(hd.type)}, gedefinieerd: ${hd.gedefinieerd.map(c => HD_CENTRA[c].naam).join(', ')}">${lijnen}${centra}</svg>`;
}

function hdSamenvatting(k) {
  const hd = k.werkplek?.hd?.chart; const w = k.werkplek || {};
  if (!hd) return w.energietype ? `${w.energietype}${w.autoriteit ? ', autoriteit '+w.autoriteit : ''}${w.profiel ? ', profiel '+w.profiel : ''} (handmatig ingevuld)` : 'niet ingevuld';
  const [p1, p2] = hd.profiel.split('/');
  return `${hd.type} (strategie: ${hd.strategie}), autoriteit ${hd.autoriteit}, profiel ${hd.profiel} (${HD_PROFIELLIJNEN[p1].naam} / ${HD_PROFIELLIJNEN[p2].naam}), ${hd.definitie}, ${hd.kruis.hoek} kruis ${hd.kruis.gates}. Gedefinieerde centra: ${hd.gedefinieerd.map(c => HD_CENTRA[c].naam).join(', ') || 'geen'}. Kanalen: ${hd.kanalen.map(x => x.a+'-'+x.b+' '+x.naam).join(', ') || 'geen'}.${k.werkplek.hd.tijdOnbekend ? ' Let op: geboortetijd onbekend, profiel en Maan kunnen afwijken.' : ''}`;
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return; const k = klant(ui.sessie); if (!k) return;
  switch (el.dataset.a) {
    case 'hd-maak': {
      const datum = val('hd-datum'), onbekend = document.getElementById('hd-onbekend').checked, tijd = onbekend ? '12:00' : val('hd-tijd'), tz = val('hd-tz'), plaats = val('hd-plaats');
      if (!datum) { toast('Vul je geboortedatum in.'); return; }
      if (!onbekend && !tijd) { toast('Vul je geboortetijd in, of vink aan dat je die niet weet.'); return; }
      try {
        const chart = hdChart({ datum, tijd, tz });
        k.werkplek.hd = { datum, tijd, tijdOnbekend:onbekend, plaats, tz, chart };
        Object.assign(k.werkplek, { energietype:chart.type, autoriteit:chart.autoriteit, profiel:chart.profiel }); k.werkplek.hdToon = hdToon(k); ui.hdForm = false;
        if (!ui.preview) log(k, 'hd', `maakte haar Human Design-chart: ${chart.type}, ${chart.profiel}`);
        bewaar(); render(); feestje(); toast(`Je bent ${chart.type}, profiel ${chart.profiel}.`);
        setTimeout(() => document.getElementById('hdchart')?.scrollIntoView({ behavior:'smooth' }), 300);
      } catch (err) { toast('Het berekenen lukte niet. Controleer je gegevens.'); }
      return; }
    case 'hd-planeet': ui.hdPlaneet = ui.hdPlaneet === el.dataset.v ? null : el.dataset.v; render(); return;
    case 'hd-opnieuw': k.werkplek.hd.chart = null; ui.hdForm = true; render(); return;
    case 'hd-formulier': ui.hdForm = true; render(); return;
    case 'hd-hand-opslaan': { const type = val('hdh-type'); if (!type) { toast('Kies eerst je type.'); return; }
      Object.assign(k.werkplek, { energietype:type, autoriteit:val('hdh-aut'), profiel:val('hdh-prof') }); k.werkplek.hdToon = hdToon(k); ui.hdForm = false;
      if (!ui.preview) log(k, 'hd', `vulde haar Human Design handmatig in: ${type}`); bewaar(); render(); toast('Opgeslagen.');
      setTimeout(() => document.getElementById('hdchart')?.scrollIntoView({ behavior:'smooth' }), 250); return; }
    case 'hd-hand-wis': if (!confirm('Je handmatig ingevulde Human Design wissen?')) return; Object.assign(k.werkplek, { energietype:'', autoriteit:'', profiel:'', hdToon:null }); bewaar(); render(); return;
    case 'hd-annuleer': { ui.hdForm = false; if (k.werkplek.hd && !k.werkplek.hd.chart) { const h = k.werkplek.hd; try { h.chart = hdChart(h); } catch (e) {} } render(); return; }
    case 'hd-wis': if (!confirm('Je geboortegegevens en je chart verwijderen?')) return;
      k.werkplek.hd = null; bewaar(); render(); toast('Verwijderd.'); return;
  }
});
document.addEventListener('input', e => {
  if (e.target.id !== 'hd-plaats') return; const tz = hdTzVoorPlaats(e.target.value); const sel = document.getElementById('hd-tz');
  if (tz && sel && [...sel.options].some(o => o.value === tz)) sel.value = tz;
});
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tr.hdrij')) { e.preventDefault(); e.target.click(); } });
