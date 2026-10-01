import type { CourseId } from "./courses";
import { COURSES } from "./courses";
import type { ArchetypeId } from "./archetypes";
import { ARCHETYPES } from "./archetypes";

// Brand Foundation-profiel: wat alle skills over een klant weten.
// Komt uit client.profiel (jsonb) in Supabase, gevuld via profielUitIntake of handmatig in de keuken.
export interface Profiel {
  archetype?: ArchetypeId | "";
  vakgebied?: string;
  klantwoord?: string;
  aanbodwoord?: string;
  doelgroep?: string;
  pijn?: string;
  resultaat?: string;
  toon?: string;
  nooit?: string;
  gevoel?: string;
  kleurwens?: string;
  behouden?: string;
  kernbelofte?: string;
  positionering?: string;
  pijlers?: string[];
}

export interface Geheugen {
  stem: { id: string; bron: string; tekst: string }[];
  kern: Partial<Record<CourseId, string>>;
  bijgewerkt: string | null;
}

export function woordenVan(profiel: Profiel | null | undefined) {
  const p = profiel || {};
  return { klanten: p.klantwoord || "klanten", aanbod: p.aanbodwoord || "aanbod", vakgebied: p.vakgebied || "jouw vak" };
}

// Exacte 1:1-vertaling van de BRAND FOUNDATION-tekst die run-skill (supabase/functions/run-skill)
// in de systeemprompt van elke skill meegeeft. Hier gebruikt voor een live preview in de keuken.
export function merkContext(naam: string, profiel: Profiel | null | undefined, geheugen: Geheugen | null | undefined): string {
  const p = profiel || {};
  const g = geheugen || { stem: [], kern: {}, bijgewerkt: null };
  const r: string[] = [
    `BRAND FOUNDATION — ${naam}`,
    `Vakgebied: ${p.vakgebied || "onbekend"}. Ze noemt haar klanten "${p.klantwoord || "klanten"}" en haar aanbod "${p.aanbodwoord || "aanbod"}".`,
    `Doelgroep: ${p.doelgroep || "onbekend"}`,
    `Waar haar klant vastloopt: ${p.pijn || "onbekend"}`,
    `Resultaat dat ze levert: ${p.resultaat || "onbekend"}`,
  ];
  if (p.kernbelofte) r.push(`Kernbelofte: ${p.kernbelofte}`);
  if (p.positionering) r.push(`Positionering (wat dit NIET is): ${p.positionering}`);
  if (p.pijlers?.length) r.push(`Content-pijlers: ${p.pijlers.join(", ")}`);
  r.push(`Toon: ${p.toon || "onbekend"} — nooit: ${p.nooit || "onbekend"}`);
  if (p.archetype && ARCHETYPES[p.archetype]) {
    const a = ARCHETYPES[p.archetype];
    r.push(`Smaakprofiel: ${a.naam} (${a.sub}). Blinde vlek: ${a.blind}`);
  }
  const kern = Object.entries(g.kern || {}).filter(([, t]) => (t || "").trim());
  if (kern.length) {
    r.push("", "KERNINHOUD UIT HAAR TRAJECT");
    kern.forEach(([c, t]) => r.push(`${COURSES[c as CourseId]?.naam || c}: ${(t || "").trim()}`));
  }
  if (g.stem?.length) {
    r.push("", "STEMVOORBEELDEN (zo klinkt ze echt: neem ritme en woordkeus over, kopieer niet letterlijk)");
    g.stem.forEach((x) => r.push(`— ${x.bron}: "${x.tekst.trim()}"`));
  }
  return r.join("\n");
}
