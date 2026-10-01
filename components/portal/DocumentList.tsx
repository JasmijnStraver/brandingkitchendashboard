"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DocumentRow } from "@/lib/supabase/types";

function datum(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

export default function DocumentList({ documents }: { documents: DocumentRow[] }) {
  const router = useRouter();
  const [open, setOpen] = useState<DocumentRow | null>(null);
  const [akkoord, setAkkoord] = useState(false);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function teken() {
    if (!open) return;
    setBezig(true);
    setFout("");
    const supabase = createClient();
    const { error } = await supabase.rpc("sign_document", { p_doc: open.id });
    setBezig(false);
    if (error) {
      setFout("Dit lukte niet. Probeer het opnieuw.");
      return;
    }
    setOpen(null);
    setAkkoord(false);
    router.refresh();
  }

  if (!documents.length) return <p className="muted small">Hier staat nog niets voor je klaar.</p>;

  return (
    <div>
      <ul className="grid gap-2">
        {documents.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-3">
            <span>
              <span className="block">{d.titel}</span>
              <span className="small muted">
                {d.type}
                {d.status === "getekend" && d.getekend_op ? ` · getekend op ${datum(d.getekend_op)}` : ""}
              </span>
            </span>
            {d.status === "te-tekenen" ? (
              <button className="btn sm gold shrink-0" onClick={() => setOpen(d)}>
                Bekijken en akkoord geven
              </button>
            ) : (
              <span className="pill klaar shrink-0">{d.status === "getekend" ? "Getekend" : "Info"}</span>
            )}
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 bg-midnight/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-bg w-full max-w-lg rounded-md p-6 shadow-xl">
            <h3 className="wordmark text-2xl text-midnight mb-3">{open.titel}</h3>
            <p className="small muted mb-4">
              Het volledige document deelt Jasmijn met je via e-mail of je opslag. Geef hier akkoord zodra je het hebt gelezen.
            </p>
            <label className="flex items-start gap-2 text-sm mb-4 cursor-pointer">
              <input id="akkoord" type="checkbox" checked={akkoord} onChange={(e) => setAkkoord(e.target.checked)} className="mt-1" />
              Ik heb dit document gelezen en ga akkoord.
            </label>
            {fout && <p className="text-sm text-pepper mb-3">{fout}</p>}
            <div className="flex gap-3">
              <button className="btn gold" disabled={!akkoord || bezig} onClick={teken}>
                {bezig ? "Bezig..." : "Akkoord geven"}
              </button>
              <button className="btn ghost" onClick={() => setOpen(null)}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
