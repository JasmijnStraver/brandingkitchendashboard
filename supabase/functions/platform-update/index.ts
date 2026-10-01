// =====================================================================
// Edge Function: platform-update
// Draait dagelijks (Supabase Cron), onderzoekt elk onderwerp één keer per week.
// Per onderwerp (Instagram, LinkedIn, e-mail, verkoop, website, live, merk en markt)
// doet hij webonderzoek naar wat nu werkt en zet een VOORSTEL klaar.
// Jij keurt goed in je keuken. Staat "automatisch doorvoeren" aan, dan gaat een
// voorstel na 2 dagen vanzelf live. Zo klopt de belofte van wekelijkse updates altijd.
// Deploy: supabase functions deploy platform-update
// Plan:   Supabase > Integrations > Cron, elke dag om 06:00
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const MODEL = "claude-sonnet-5";

Deno.serve(async (req) => {
  // Alleen de cron-job (met de service-sleutel) mag dit starten
  if (req.headers.get("Authorization") !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response("Niet toegestaan", { status: 401 });
  }
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: platforms } = await db.from("platform_knowledge").select("platform, titel, live, concept, concept_bronnen, concept_op, bijgewerkt");
  const { data: inst } = await db.from("portal_settings").select("kennis_auto").eq("id", 1).single();
  const vandaag = new Date().toISOString().slice(0, 10);
  const dagenGeleden = (d?: string | null) => d ? (Date.now() - new Date(d).getTime()) / 864e5 : Infinity;

  for (const p of platforms ?? []) {
    // 1. Automatisch doorvoeren: voorstel ouder dan 2 dagen en niet door jou behandeld
    if (inst?.kennis_auto && p.concept && dagenGeleden(p.concept_op) >= 2) {
      await db.from("platform_knowledge").update({ live: p.concept, bronnen: p.concept_bronnen ?? [], bijgewerkt: vandaag, concept: null, concept_bronnen: null, concept_op: null }).eq("platform", p.platform);
      p.live = p.concept; p.bijgewerkt = vandaag; p.concept = null;
    }
    // 2. Eén keer per week nieuw onderzoek
    if (p.concept || dagenGeleden(p.bijgewerkt) < 7) continue;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }],
        system: `Je werkt voor Studio Crave (Jasmijn Straver). Onderzoek wat er op dit moment (${vandaag}) werkt op ${p.titel} voor ondernemers als coaches, consultants en freelancers: hoe de verspreiding werkt, welke signalen zwaar wegen, welke formats en gewoontes werken, en wat afgestraft wordt. Gebruik bij voorkeur officiële bronnen van het platform en onafhankelijk onderzoek met data; wees voorzichtig met losse claims. Beloof nooit viraal gaan.`,
        messages: [{ role: "user", content:
`Dit is de huidige platformkennis:
${p.live || "(nog leeg)"}

Schrijf een bijgewerkte versie: maximaal 12 korte punten in het Nederlands, elk een concrete richtlijn waar een schrijftool direct mee kan werken. Markeer wat nieuw of veranderd is met "(nieuw)". Geef daarna onder de kop BRONNEN de gebruikte bronnen, één per regel.` }],
      }),
    });
    if (!res.ok) continue;
    const out = await res.json();
    const tekst = (out.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n");
    const [punten, bronnenDeel = ""] = tekst.split(/\n\s*BRONNEN\s*:?\s*\n/i);
    await db.from("platform_knowledge").update({
      concept: punten.trim(),
      concept_bronnen: bronnenDeel.split("\n").map((r) => r.replace(/^[-*•]\s*/, "").trim()).filter(Boolean),
      concept_op: new Date().toISOString(),
    }).eq("platform", p.platform);
  }
  return new Response(JSON.stringify({ klaar: true }), { headers: { "Content-Type": "application/json" } });
});
