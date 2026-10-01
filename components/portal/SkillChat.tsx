"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SkillRow } from "@/lib/supabase/types";

export default function SkillChat({ skill, onClose }: { skill: SkillRow; onClose: () => void }) {
  const [input, setInput] = useState("");
  const [resultaat, setResultaat] = useState("");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function genereer(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setBezig(true);
    setFout("");
    setResultaat("");
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke("run-skill", { body: { skill_id: skill.id, input } });
    setBezig(false);
    if (error || data?.fout) {
      setFout(data?.fout || "Het lukte even niet. Probeer het opnieuw.");
      return;
    }
    setResultaat(data?.tekst || "");
  }

  return (
    <div className="fixed inset-0 bg-midnight/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
      <div className="bg-bg w-full sm:max-w-xl sm:rounded-md h-[85vh] sm:h-auto sm:max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        <header className="flex items-center justify-between px-5 py-4 bg-midnight text-creme">
          <div>
            <p className="small text-creme/60">{skill.course ? `Course ${skill.course}` : "Tool"}</p>
            <h3 className="wordmark text-2xl">{skill.naam}</h3>
          </div>
          <button onClick={onClose} className="text-creme/70 hover:text-creme text-2xl leading-none px-2" aria-label="Sluiten">
            ×
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="small muted mb-4">{skill.wat}</p>
          {!resultaat && !bezig && <p className="small muted italic">Bijv. &ldquo;{skill.voorbeeld}&rdquo;</p>}
          {bezig && <p className="small muted italic">Aan het schrijven...</p>}
          {resultaat && <div className="whitespace-pre-wrap text-sm leading-relaxed bg-surface border border-line rounded-md p-4">{resultaat}</div>}
          {fout && <p className="text-sm text-pepper mt-3">{fout}</p>}
        </div>
        <form onSubmit={genereer} className="flex gap-2 p-4 border-t border-line">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Vertel waar je mee aan de slag wilt..."
            className="flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm"
          />
          <button type="submit" disabled={bezig} className="btn">
            Stuur
          </button>
        </form>
      </div>
    </div>
  );
}
