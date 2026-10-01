// =====================================================================
// Edge Function: run-skill
// De klant stuurt { skill_id, input }. Deze functie:
//  1. controleert wie ze is en of ze deze tool mag gebruiken
//  2. haalt de nieuwste versie van jouw instructie op (klant ziet die nooit)
//  3. voegt haar persoonlijke laag toe (quiz, intake, jouw aanscherpingen)
//  4. vraagt Claude om het resultaat en bewaart het bij haar stukken
// Deploy: supabase functions deploy run-skill
// Secret: supabase secrets set ANTHROPIC_API_KEY=...
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const MAX_PER_DAG = 30; // eerlijk gebruik per klant, pas aan naar wens
const MODEL = "claude-sonnet-5";
const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("PORTAAL_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
};
const archetypes: Record<string, string> = {
  A: "The Classic: tijdloos, vertrouwd, bewezen. Blinde vlek: onzichtbaar worden zonder scherpe hoek",
  B: "The Signature: één methode, onkopieerbaar. Blinde vlek: te smal, te weinig verhaal rond het product",
  C: "Chef's Special: verandert, verrast, persoonlijk. Blinde vlek: diffuus overkomen zonder vaste lijn",
  D: "The Fusion: twee werelden op één bord. Blinde vlek: te complex klinken",
};
const antwoord = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // 1. Wie is dit? (met de login van de klant, dus RLS blijft gelden)
  const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: { user } } = await asUser.auth.getUser();
  if (!user) return antwoord({ fout: "Niet ingelogd" }, 401);
  const { data: klant } = await asUser.from("clients").select("id, naam, bedrijf, profiel, geheugen, platformen, werkplek").eq("user_id", user.id).single();
  if (!klant) return antwoord({ fout: "Geen klantaccount gevonden" }, 403);
  const { data: toegang } = await asUser.rpc("heeft_toegang");
  if (!toegang) return antwoord({ fout: "Je toegang is verlopen. Verleng om je tools te blijven gebruiken." }, 402);

  const { skill_id, input } = await req.json();
  if (!skill_id || !input || String(input).length > 4000) return antwoord({ fout: "Ongeldige vraag" }, 400);

  // 2. Mag ze deze tool gebruiken? (aangevinkt in een course die open is)
  const { data: course } = await asUser.from("client_courses").select("course")
    .contains("skills", [skill_id]).neq("status", "dicht").limit(1).maybeSingle();
  if (!course) return antwoord({ fout: "Deze tool is nog niet voor je vrijgegeven" }, 403);

  // Vanaf hier de server-sleutel: nodig om jouw instructie te lezen
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Limiet: standaard uit je instellingen, of een eigen limiet voor deze klant
  const { data: inst } = await admin.from("portal_settings").select("limieten").eq("id", 1).single();
  const { data: kl } = await admin.from("clients").select("limiet").eq("id", klant.id).single();
  const maxPerDag = kl?.limiet?.toolsDag ?? inst?.limieten?.toolsDag ?? MAX_PER_DAG;
  const vandaag = new Date(); vandaag.setUTCHours(0, 0, 0, 0);
  const { count } = await admin.from("skill_runs").select("id", { count: "exact", head: true })
    .eq("client_id", klant.id).gte("created_at", vandaag.toISOString());
  if ((count ?? 0) >= maxPerDag) return antwoord({ fout: "Je daglimiet is bereikt, morgen kun je weer verder" }, 429);

  // Eigen tool van de klant? Dan komt de instructie uit client_tools, alleen voor haarzelf.
  let eigenInstructie = ""; let eigenKennis: string[] = [];
  if (String(skill_id).startsWith("eigen-")) {
    const { data: et } = await admin.from("client_tools").select("*").eq("id", String(skill_id).slice(6)).eq("client_id", klant.id).single();
    if (!et) return antwoord({ fout: "Deze tool bestaat niet (meer)." }, 404);
    eigenInstructie = `# ${et.naam}\nJe bent een persoonlijke schrijftool van ${klant.bedrijf ?? klant.naam}.\n\n## Wat je doet\n${et.doel}\n\n## Wanneer\n${et.wanneer ?? ""}\n\n## Wat ze je geeft\n${et.invoer ?? "Een onderwerp of vraag."}\n\n## Wat je teruggeeft\n${et.uitvoer ?? ""}\n${et.voorbeeld ? "\n## Voorbeeld\n" + et.voorbeeld : ""}${et.niet_doen ? "\n## Doe nooit\n" + et.niet_doen : ""}\n\n## Altijd\nSchrijf in de toon en stijl uit het merkgeheugen.`;
    eigenKennis = et.kanalen ?? [];
  }
  let skill = { naam: "Eigen tool", status: "live", huidige_versie: 0, kennis: eigenKennis };
  let versie = { instructie: eigenInstructie };
  if (!eigenInstructie) {
    const { data: s } = await admin.from("skills").select("naam, status, huidige_versie, kennis").eq("id", skill_id).single();
    if (!s || s.status !== "live") return antwoord({ fout: "Deze tool is niet beschikbaar" }, 404);
    const { data: v } = await admin.from("skill_versions").select("instructie").eq("skill_id", skill_id).eq("versie", s.huidige_versie).single();
    skill = s; versie = v!;
  }

  // 3. Merkgeheugen: Brand Foundation, kerninhoud per course en stemvoorbeelden
  const p = klant.profiel ?? {};
  const g = klant.geheugen ?? {};
  const courseNamen: Record<string, string> = { "01": "Raw Ingredients", "02": "Flavor Profile", "03": "Signature Sauce", "04": "Positioning Cut", "05": "Plating", "06": "Pairing", "07": "The Experience", finale: "Signature Dish" };
  const r: string[] = [
    `BRAND FOUNDATION — ${klant.bedrijf ?? klant.naam}`,
    `Vakgebied: ${p.vakgebied ?? "onbekend"}. Ze noemt haar klanten "${p.klantwoord ?? "klanten"}" en haar aanbod "${p.aanbodwoord ?? "aanbod"}".`,
    `Doelgroep: ${p.doelgroep ?? "onbekend"}`,
    `Waar haar klant vastloopt: ${p.pijn ?? "onbekend"}`,
    `Resultaat dat ze levert: ${p.resultaat ?? "onbekend"}`,
  ];
  if (p.kernbelofte) r.push(`Kernbelofte: ${p.kernbelofte}`);
  if (p.positionering) r.push(`Positionering (wat dit NIET is): ${p.positionering}`);
  if (Array.isArray(p.pijlers) && p.pijlers.length) r.push(`Content-pijlers: ${p.pijlers.join(", ")}`);
  r.push(`Toon: ${p.toon ?? "onbekend"} — nooit: ${p.nooit ?? "onbekend"}`);
  if (archetypes[p.archetype]) r.push(`Smaakprofiel: ${archetypes[p.archetype]}`);
  // Human Design in de tone of voice (door het portaal vastgelegd bij het maken van de chart)
  const hdt = klant.werkplek?.hdInToon !== false ? klant.werkplek?.hdToon : null;
  if (hdt?.regels?.length) { r.push("", `TONE OF VOICE VANUIT HUMAN DESIGN (${hdt.label}). Een lens: de toon en stemvoorbeelden van het merk blijven leidend.`); hdt.regels.forEach((x: string) => r.push("- " + x)); }
  const kern = Object.entries(g.kern ?? {}).filter(([, t]) => String(t ?? "").trim());
  if (kern.length) { r.push("", "KERNINHOUD UIT HAAR TRAJECT"); kern.forEach(([c, t]) => r.push(`${courseNamen[c] ?? c}: ${String(t).trim()}`)); }
  const stem = Array.isArray(g.stem) ? g.stem : [];
  if (stem.length) { r.push("", "STEMVOORBEELDEN (zo klinkt ze echt: neem ritme en woordkeus over, kopieer niet letterlijk)"); stem.forEach((x: { bron: string; tekst: string }) => r.push(`— ${x.bron}: "${x.tekst}"`)); }
  // Actuele kennis: de onderwerpen van deze tool; bij kanalen alleen die zij gebruikt
  const kanalen = ["instagram", "linkedin", "email"];
  const mijn: string[] = klant.platformen ?? [];
  const domeinen = (skill.kennis ?? []).filter((d: string) => !kanalen.includes(d) || !mijn.length || mijn.includes(d));
  if (domeinen.length) {
    const { data: kennis } = await admin.from("platform_knowledge").select("titel, live, bijgewerkt").in("platform", domeinen);
    for (const x of kennis ?? []) if (x.live?.trim()) r.push("", `ACTUELE KENNIS ${x.titel.toUpperCase()} (bijgewerkt ${x.bijgewerkt}; actueler dan je eigen kennis, bij verschil wint dit):`, x.live.trim());
  }
  const laag = r.join("\n");

  // 4. Claude
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: `${versie!.instructie}\n\n${laag}\n\nSchrijf in de taal en toon van de klant. Het portaal toont je antwoord direct aan haar.`,
      messages: [{ role: "user", content: String(input) }],
    }),
  });
  if (!res.ok) return antwoord({ fout: "De tool is even niet bereikbaar, probeer het zo opnieuw" }, 502);
  const out = await res.json();
  const tekst = (out.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n");

  await admin.from("skill_runs").insert({
    client_id: klant.id, skill_id, versie: skill.huidige_versie, input: String(input), output: tekst,
    tokens_in: out.usage?.input_tokens, tokens_out: out.usage?.output_tokens,
  });

  return antwoord({ tekst });
});
