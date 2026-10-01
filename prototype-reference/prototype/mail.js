/* =====================================================================
   WELKOMSTMAIL EN WACHTWOORD — voorbeeld in het portaal.
   Live verstuurt Supabase deze mails (zie email-uitnodiging.html en email-wachtwoord.html).
   ===================================================================== */
function mailHtml({ soort, voornaam: vn, knopUrl = '#', vergetenUrl = '#', logo, mono }) {
  const c = contact(); const welkom = soort === 'welkom';
  const f = "font-family:'Be Vietnam Pro',Helvetica,Arial,sans-serif";
  const kop = welkom ? 'Ready to create some cravings?' : 'Een nieuw wachtwoord';
  const tekst = welkom
    ? `Hoi ${esc(vn)},<br><br>Wat fijn dat je aan tafel schuift. Je persoonlijke portaal staat voor je klaar: het dashboard van jouw business, waar we samen aan je merk bouwen, volgens The Branding Kitchen™.<br><br>Maak eerst je wachtwoord aan. Daarna begin je met een korte quiz en een vragenlijst, zodat alles vanaf dag één over jou gaat.`
    : `Hoi ${esc(vn)},<br><br>Je vroeg om een nieuw wachtwoord voor je portaal bij Studio Crave. Klik op de knop om er een te kiezen. Heb jij dit niet gevraagd? Dan kun je deze mail negeren; er verandert niets.`;
  return `<!DOCTYPE html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${kop}</title></head>
<body style="margin:0;padding:0;background:#F5F0EB">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0EB;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden">
  <tr><td style="background:#3D1419;padding:28px 32px" align="center">${logo ? `<img src="${logo}" alt="Studio Crave" height="44" style="display:block;height:44px;width:auto;border:0">` : `<span style="color:#F5F0EB;${f};font-weight:800;letter-spacing:2px;font-size:20px">STUDIO CRAVE</span>`}</td></tr>
  <tr><td style="padding:36px 36px 8px">
    <h1 style="margin:0 0 20px;font-family:'Times New Roman',Times,serif;font-weight:400;font-size:34px;line-height:1.1;color:#3D1419">${kop}</h1>
    <p style="margin:0 0 28px;${f};font-size:15px;line-height:1.65;color:#3D1419">${tekst}</p>
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:#6B1A2A;border-radius:3px">
      <a href="${knopUrl}" style="display:inline-block;padding:14px 26px;${f};font-size:15px;font-weight:600;color:#F5F0EB;text-decoration:none">${welkom ? 'Maak je wachtwoord aan' : 'Kies een nieuw wachtwoord'}</a></td></tr></table>
    ${welkom ? `<p style="margin:22px 0 0;${f};font-size:13px;color:#7a5a5f"><strong style="color:#3D1419">Wachtwoord vergeten?</strong><br><a href="${vergetenUrl}" style="color:#6B1A2A">Vraag hier een nieuw wachtwoord aan</a></p>` : ''}
    <p style="margin:26px 0 0;${f};font-size:13px;line-height:1.6;color:#7a5a5f">Voor vragen ben ik altijd bereikbaar: app of mail naar <a href="mailto:${esc(c.mail)}" style="color:#6B1A2A">${esc(c.mail)}</a>.</p>
    <p style="margin:18px 0 32px;font-family:'Times New Roman',Times,serif;font-style:italic;font-size:18px;color:#C9A060">Jasmijn Straver, Studio Crave</p>
  </td></tr>
  <tr><td style="background:#3D1419;padding:20px" align="center">${mono ? `<img src="${mono}" alt="" height="32" style="display:block;height:32px;width:auto;border:0">` : ''}
    <p style="margin:8px 0 0;${f};font-size:11px;color:#b9a3a6">© ${new Date().getFullYear()} Studio Crave</p></td></tr>
</table></td></tr></table></body></html>`;
}
function mailModal(m) {
  const k = klant(m.id); const html = mailHtml({ soort:m.soort, voornaam:voornaam(k), logo:beeld('logoLicht'), mono:beeld('monogram') });
  return `<div class="overlay" data-a="sluit-bg"><div class="modal mailmodal fade" role="dialog" aria-modal="true" aria-labelledby="mt">
    <h2 id="mt">${m.soort === 'welkom' ? 'Welkomstmail' : 'Mail voor een nieuw wachtwoord'}</h2>
    <p class="small muted">Aan: <strong>${esc(k.email)}</strong>. Onderwerp: <strong>${m.soort === 'welkom' ? `Welkom aan tafel, ${esc(voornaam(k))}` : 'Je nieuwe wachtwoord voor Studio Crave'}</strong></p>
    <p class="small muted">In deze voorbeeldomgeving wordt niets echt verstuurd. Live verstuurt Supabase deze mail automatisch.</p>
    <iframe class="mailvoorbeeld" title="Voorbeeld van de mail" srcdoc="${esc(html)}"></iframe>
    <div class="foot"><button class="btn ghost" data-a="sluit">Sluiten</button><button class="btn" data-a="mail-knop" data-id="${k.id}">Klik op de knop in de mail</button></div></div></div>`;
}
function wachtwoordScherm() {
  const k = klant(ui.wwKlant);
  if (ui.inlogScherm === 'vergeten') return `<div class="login" ${beeld('inlogBeeld') ? `style="background-image:linear-gradient(rgba(40,12,16,.35),rgba(40,12,16,.55)),url(${beeld('inlogBeeld')})"` : ''}><div class="logincard fade">
    <div class="loginkop">${logo(false)}<h1>Wachtwoord vergeten?</h1><p>Geen probleem. Vul je e-mailadres in, dan stuur ik je een link om een nieuw wachtwoord te kiezen.</p></div>
    <div class="stack"><label class="field">E-mailadres<input id="ww-email" type="email" autocomplete="email"></label>${ui.loginFout ? `<p class="err">${ui.loginFout}</p>` : ''}
    <button class="btn" data-a="ww-stuur">Stuur mij een link</button><button class="linkbtn" data-a="ww-terug" style="color:var(--midnight)">Terug naar inloggen</button></div></div></div>`;
  return `<div class="login" ${beeld('inlogBeeld') ? `style="background-image:linear-gradient(rgba(40,12,16,.35),rgba(40,12,16,.55)),url(${beeld('inlogBeeld')})"` : ''}><div class="logincard fade">
    <div class="loginkop">${logo(false)}<h1>${k?.uitgenodigd && !k?.wachtwoordGezet ? `Welkom, ${esc(voornaam(k))}` : 'Nieuw wachtwoord'}</h1><p>Kies een wachtwoord van minstens 8 tekens. Daarna ga je direct naar je portaal.</p></div>
    <div class="stack"><label class="field">Wachtwoord<input id="ww-1" type="password" autocomplete="new-password"></label>
      <label class="field">Nog een keer<input id="ww-2" type="password" autocomplete="new-password"></label>${ui.loginFout ? `<p class="err">${ui.loginFout}</p>` : ''}
      <button class="btn" data-a="ww-opslaan">Opslaan en naar mijn portaal</button></div></div></div>`;
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  switch (el.dataset.a) {
    case 'mail-knop': ui.modal = null; ui.rol = 'klant'; ui.sessie = null; ui.wwKlant = el.dataset.id; ui.inlogScherm = 'nieuw'; ui.loginFout = ''; render(); return;
    case 'ww-vergeten': ui.inlogScherm = 'vergeten'; ui.loginFout = ''; render(); return;
    case 'ww-terug': ui.inlogScherm = null; ui.loginFout = ''; render(); return;
    case 'ww-stuur': { const k = data.klanten.find(x => x.email === val('ww-email').toLowerCase());
      if (!/^\S+@\S+\.\S+$/.test(val('ww-email'))) { ui.loginFout = 'Vul een geldig e-mailadres in.'; render(); return; }
      ui.inlogScherm = null; ui.loginFout = '';
      if (k) { ui.modal = { type:'mail', soort:'wachtwoord', id:k.id }; render(); } else { render(); }
      toast('Als dit adres bij ons bekend is, staat er nu een mail in je inbox.'); return; }
    case 'ww-opslaan': { const a = document.getElementById('ww-1').value, b = document.getElementById('ww-2').value;
      if (a.length < 8) { ui.loginFout = 'Kies minstens 8 tekens.'; render(); return; } if (a !== b) { ui.loginFout = 'De twee wachtwoorden zijn niet gelijk.'; render(); return; }
      const k = klant(ui.wwKlant); ui.inlogScherm = null; ui.loginFout = ''; if (k) { k.wachtwoordGezet = true; bewaar(); inloggen(k, true); toast('Je wachtwoord is opgeslagen. Welkom!'); } return; }
  }
});
