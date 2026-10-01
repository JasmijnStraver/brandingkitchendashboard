"use client";

import { createClient } from "@/lib/supabase/client";
import type { FileRow } from "@/lib/supabase/types";

function grootte(b: number | null) {
  if (!b) return "";
  return b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} kB`;
}

export default function FileList({ files, className }: { files: FileRow[]; className?: string }) {
  const klaargezet = files.filter((f) => f.soort === "klaargezet" || f.soort === "opgediend");
  const uploads = files.filter((f) => f.soort === "upload");

  async function open(f: FileRow) {
    if (f.canva_url) {
      window.open(f.canva_url, "_blank", "noopener");
      return;
    }
    if (!f.storage_path) return;
    const supabase = createClient();
    await supabase.rpc("log_download", { p_file: f.id });
    const { data } = await supabase.storage.from("klanten").createSignedUrl(f.storage_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  if (!klaargezet.length && !uploads.length) {
    return <p className={`muted small ${className ?? ""}`}>Hier staat nog niets voor deze gang.</p>;
  }

  return (
    <div className={className}>
      {klaargezet.length > 0 && (
        <ul className="grid gap-2 mb-4">
          {klaargezet.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-2.5">
              <span>
                <span className="block">{f.naam}</span>
                {f.notitie && <span className="small muted">{f.notitie}</span>}
              </span>
              <button onClick={() => open(f)} className="btn sm ghost shrink-0">
                {f.canva_url ? "Openen" : "Downloaden"}
              </button>
            </li>
          ))}
        </ul>
      )}
      {uploads.length > 0 && (
        <div>
          <p className="small muted mb-2">Eerder aangeleverd door jou</p>
          <ul className="grid gap-1">
            {uploads.map((f) => (
              <li key={f.id} className="small muted">
                {f.naam} {grootte(f.grootte)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
