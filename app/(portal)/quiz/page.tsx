"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { QUIZ, ARCHETYPES, berekenUitslag, type ArchetypeId } from "@/lib/content/archetypes";

export default function QuizPage() {
  const router = useRouter();
  const [stap, setStap] = useState(0);
  const [antwoorden, setAntwoorden] = useState<ArchetypeId[]>([]);
  const [uitslag, setUitslag] = useState<ArchetypeId | null>(null);
  const [opslaan, setOpslaan] = useState(false);
  const [fout, setFout] = useState("");

  async function kies(l: ArchetypeId) {
    const nieuw = [...antwoorden];
    nieuw[stap] = l;
    setAntwoorden(nieuw);
    if (stap < QUIZ.length - 1) {
      setStap(stap + 1);
      return;
    }
    const { uitslag: resultaat, scores } = berekenUitslag(nieuw);
    setOpslaan(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { data: clientRow } = userData.user
      ? await supabase.from("clients").select("id").eq("user_id", userData.user.id).single()
      : { data: null };
    if (clientRow) {
      const { error } = await supabase.from("quiz_results").insert({ client_id: clientRow.id, antwoorden: nieuw, uitslag: resultaat });
      if (error && error.code !== "23505") setFout("Opslaan lukte niet, maar hier is je uitslag alvast.");
    }
    void scores;
    setOpslaan(false);
    setUitslag(resultaat);
  }

  if (uitslag) {
    const a = ARCHETYPES[uitslag];
    return (
      <div className="max-w-xl">
        <p className="small muted uppercase tracking-wide mb-2">{a.badge}</p>
        <h1 className="wordmark text-4xl text-midnight mb-2">{a.naam}</h1>
        <p className="font-accent text-xl text-burgundy mb-6">{a.sub}</p>
        <p className="leading-relaxed mb-5">{a.tekst}</p>
        <div className="grid gap-4 mb-8">
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted mb-1">Hoe het eruitziet</h3>
            <p className="leading-relaxed">{a.looks}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted mb-1">Hoe het klinkt</h3>
            <p className="leading-relaxed">{a.sounds}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted mb-1">Blinde vlek</h3>
            <p className="leading-relaxed">{a.blind}</p>
          </div>
        </div>
        <button className="btn gold" onClick={() => router.push("/vragenlijst")}>
          Verder naar je vragenlijst
        </button>
      </div>
    );
  }

  const q = QUIZ[stap];
  return (
    <div className="max-w-xl">
      <p className="small muted mb-2">
        Vraag {stap + 1} van {QUIZ.length}
      </p>
      <h1 className="wordmark text-3xl text-midnight mb-2">{q.v}</h1>
      <p className="muted mb-6">{q.sub}</p>
      <div className="grid gap-3">
        {q.o.map((o) => (
          <button
            key={o.l}
            onClick={() => kies(o.l)}
            disabled={opslaan}
            className="text-left rounded-md border border-line bg-surface p-4 hover:border-gold transition-colors"
          >
            <p className="mb-1">{o.t}</p>
            <p className="small muted italic">{o.m}</p>
          </button>
        ))}
      </div>
      {fout && <p className="text-sm text-pepper mt-4">{fout}</p>}
    </div>
  );
}
