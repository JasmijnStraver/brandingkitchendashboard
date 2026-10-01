"use client";

import { useState } from "react";
import type { SkillRow } from "@/lib/supabase/types";
import SkillChat from "./SkillChat";

export default function SkillGrid({ skills, className }: { skills: SkillRow[]; courseId?: string; className?: string }) {
  const [actief, setActief] = useState<SkillRow | null>(null);

  if (!skills.length) {
    return <p className={`muted small ${className ?? ""}`}>Nog geen tools vrijgegeven voor deze gang.</p>;
  }

  return (
    <div className={className}>
      <div className="grid sm:grid-cols-2 gap-3">
        {skills.map((s) => (
          <button key={s.id} onClick={() => setActief(s)} className="text-left rounded-md border border-line bg-surface p-4 hover:border-gold transition-colors">
            <h4 className="font-semibold text-midnight mb-1">{s.naam}</h4>
            <p className="small muted">{s.wat}</p>
          </button>
        ))}
      </div>
      {actief && <SkillChat skill={actief} onClose={() => setActief(null)} />}
    </div>
  );
}
