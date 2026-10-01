"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COURSES, type CourseId } from "@/lib/content/courses";
import type { SkillRow, SkillStatus } from "@/lib/supabase/types";

export default function SkillsBeheer({ skills }: { skills: SkillRow[] }) {
  const router = useRouter();
  const [actiefId, setActiefId] = useState<string | null>(skills[0]?.id ?? null);
  const [instructie, setInstructie] = useState("");
  const [geladenVoor, setGeladenVoor] = useState<string | null>(null);
  const [bezig, setBezig] = useState(false);
  const [melding, setMelding] = useState("");

  const actief = skills.find((s) => s.id === actiefId) ?? null;
  const [wat, setWat] = useState(actief?.wat ?? "");
  const [voorbeeld, setVoorbeeld] = useState(actief?.voorbeeld ?? "");
  const [status, setStatus] = useState<SkillStatus>(actief?.status ?? "concept");

  if (actief && geladenVoor !== actief.id) {
    setGeladenVoor(actief.id);
    setWat(actief.wat ?? "");
    setVoorbeeld(actief.voorbeeld ?? "");
    setStatus(actief.status);
    const supabase = createClient();
    supabase
      .from("skill_versions")
      .select("instructie")
      .eq("skill_id", actief.id)
      .eq("versie", actief.huidige_versie)
      .single()
      .then(({ data }) => setInstructie(data?.instructie ?? ""));
  }

  async function opslaan() {
    if (!actief) return;
    setBezig(true);
    setMelding("");
    const supabase = createClient();
    const nieuweVersie = actief.huidige_versie + 1;
    const { error: e1 } = await supabase.from("skill_versions").insert({ skill_id: actief.id, versie: nieuweVersie, instructie });
    const { error: e2 } = await supabase.from("skills").update({ huidige_versie: nieuweVersie, wat, voorbeeld, status }).eq("id", actief.id);
    setBezig(false);
    if (e1 || e2) {
      setMelding("Opslaan lukte niet.");
      return;
    }
    setMelding(`Versie ${nieuweVersie} staat live.`);
    router.refresh();
  }

  return (
    <div>
      <h1 className="wordmark text-4xl text-midnight mb-6">Skills beheer</h1>
      <div className="grid md:grid-cols-[260px_1fr] gap-8">
        <div className="grid gap-1 content-start">
          {(Object.keys(COURSES) as CourseId[]).map((cid) => {
            const inCourse = skills.filter((s) => s.course === cid);
            if (!inCourse.length) return null;
            return (
              <div key={cid} className="mb-3">
                <p className="small muted uppercase tracking-wide mb-1">{COURSES[cid].naam}</p>
                {inCourse.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiefId(s.id)}
                    className={`w-full text-left px-3 py-1.5 rounded text-sm flex items-center justify-between ${
                      actiefId === s.id ? "bg-burgundy text-creme" : "hover:bg-surface-2"
                    }`}
                  >
                    {s.naam}
                    {s.status === "concept" && <span className="pill concept border border-dashed border-muted text-[0.65rem]">concept</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {actief && (
          <div className="grid gap-4 max-w-2xl">
            <h2 className="wordmark text-2xl text-midnight">{actief.naam}</h2>
            <label className="field">
              Status
              <select value={status} onChange={(e) => setStatus(e.target.value as SkillStatus)}>
                <option value="live">Live (klanten zien deze tool)</option>
                <option value="concept">Concept (nog niet zichtbaar)</option>
              </select>
            </label>
            <label className="field">
              Korte omschrijving (&ldquo;wat&rdquo; — wat de klant ziet op de kaart)
              <input value={wat} onChange={(e) => setWat(e.target.value)} />
            </label>
            <label className="field">
              Voorbeeldvraag
              <input value={voorbeeld} onChange={(e) => setVoorbeeld(e.target.value)} />
            </label>
            <label className="field">
              Instructie (systeemprompt — de klant ziet dit nooit, versie {actief.huidige_versie})
              <textarea value={instructie} onChange={(e) => setInstructie(e.target.value)} className="min-h-[320px] font-mono text-xs" />
            </label>
            {melding && <p className="small text-burgundy">{melding}</p>}
            <button onClick={opslaan} disabled={bezig} className="btn gold justify-center self-start px-8">
              {bezig ? "Bezig..." : `Opslaan als versie ${actief.huidige_versie + 1}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
