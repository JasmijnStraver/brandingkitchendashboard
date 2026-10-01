"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { VragenlijstDeel } from "@/lib/content/questionnaire";

export default function Intake({
  clientId,
  delen,
  startVelden,
  startStap,
}: {
  clientId: string;
  delen: VragenlijstDeel[];
  startVelden: Record<string, string>;
  startStap: number;
}) {
  const router = useRouter();
  const [stap, setStap] = useState(Math.min(startStap, delen.length - 1));
  const [velden, setVelden] = useState<Record<string, string>>(startVelden);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  const deel = delen[stap];

  function setVeld(id: string, value: string) {
    setVelden((v) => ({ ...v, [id]: value }));
  }

  async function bewaarStap(volgendeStap: number, klaar: boolean) {
    setBezig(true);
    setFout("");
    const supabase = createClient();
    const { error } = await supabase
      .from("intake")
      .update({ velden, stap: volgendeStap, klaar, updated_at: new Date().toISOString() })
      .eq("client_id", clientId);
    setBezig(false);
    if (error) {
      setFout("Opslaan lukte niet. Probeer het nog eens.");
      return false;
    }
    return true;
  }

  async function verder() {
    if (stap < delen.length - 1) {
      const ok = await bewaarStap(stap + 1, false);
      if (ok) setStap(stap + 1);
      return;
    }
    const ok = await bewaarStap(stap, true);
    if (ok) router.push("/menu");
  }

  async function terug() {
    if (stap === 0) return;
    await bewaarStap(stap - 1, false);
    setStap(stap - 1);
  }

  async function laterVerder() {
    const ok = await bewaarStap(stap, false);
    if (ok) router.push("/");
  }

  return (
    <div className="max-w-xl">
      <p className="small muted mb-2">
        Deel {stap + 1} van {delen.length}
      </p>
      <h1 className="wordmark text-3xl text-midnight mb-2">{deel.titel}</h1>
      <p className="muted mb-6">{deel.intro}</p>

      <div className="grid gap-5 mb-8">
        {deel.vragen.map((q) => (
          <label key={q.id} className="field">
            {q.l}
            {q.t === "area" && (
              <textarea value={velden[q.id] || ""} onChange={(e) => setVeld(q.id, e.target.value)} placeholder={q.vb} />
            )}
            {q.t === "text" && <input type="text" value={velden[q.id] || ""} onChange={(e) => setVeld(q.id, e.target.value)} placeholder={q.vb} />}
            {q.t === "keuze" && (
              <select value={velden[q.id] || ""} onChange={(e) => setVeld(q.id, e.target.value)}>
                <option value="">Kies...</option>
                {q.opties?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}
            {q.t === "meerkeuze" && (
              <div className="flex flex-wrap gap-2 mt-1">
                {q.opties?.map((o) => {
                  const huidig = (velden[q.id] || "").split(", ").filter(Boolean);
                  const aan = huidig.includes(o);
                  return (
                    <button
                      type="button"
                      key={o}
                      onClick={() => setVeld(q.id, (aan ? huidig.filter((x) => x !== o) : [...huidig, o]).join(", "))}
                      className={`chip-btn text-xs px-3 py-1.5 rounded-full border ${aan ? "bg-burgundy text-creme border-burgundy" : "border-line"}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            )}
          </label>
        ))}
      </div>

      {fout && <p className="text-sm text-pepper mb-4">{fout}</p>}

      <div className="flex gap-3 flex-wrap">
        {stap > 0 && (
          <button onClick={terug} disabled={bezig} className="btn ghost">
            Terug
          </button>
        )}
        <button onClick={verder} disabled={bezig} className="btn gold">
          {stap < delen.length - 1 ? "Volgende" : "Afronden"}
        </button>
        <button onClick={laterVerder} disabled={bezig} className="btn ghost ml-auto">
          Later verder
        </button>
      </div>
    </div>
  );
}
