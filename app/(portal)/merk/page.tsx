import { requireClient } from "@/lib/auth";
import FileList from "@/components/portal/FileList";

interface Merk {
  open?: boolean;
  boodschap?: string;
  kleuren?: { naam: string; hex: string }[];
  fonts?: { naam: string; rol: string }[];
  templates?: { naam: string; url: string }[];
}

export default async function MerkPage() {
  const { supabase, client } = await requireClient();
  const { data: courses } = await supabase.from("client_courses").select("status").eq("client_id", client.id);
  const { data: files } = await supabase.from("files").select("*").eq("client_id", client.id).eq("course", "finale");

  const merk = (client.merk as Merk) || {};
  const alleKlaar = (courses ?? []).length > 0 && (courses ?? []).every((c) => c.status === "klaar");
  const open = !!merk.open || alleKlaar;

  if (!open) {
    return (
      <div className="max-w-xl">
        <h1 className="wordmark text-4xl text-midnight mb-3">Signature Dish</h1>
        <p className="muted leading-relaxed">
          Het dessert: je hele merk op één bord. Dit gaat open zodra je alle gangen hebt doorlopen, of eerder als Jasmijn dat voor je openzet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="small muted mb-1">✦ Signature Dish</p>
      <h1 className="wordmark text-4xl text-midnight mb-2">Jouw merk</h1>
      {merk.boodschap && <p className="leading-relaxed max-w-xl mb-8">{merk.boodschap}</p>}

      {!!merk.kleuren?.length && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Kleuren</h2>
          <div className="flex flex-wrap gap-3">
            {merk.kleuren.map((k) => (
              <div key={k.hex} className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
                <span className="w-6 h-6 rounded-full border border-line" style={{ background: k.hex }} />
                <span className="small">
                  {k.naam} · {k.hex}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!!merk.fonts?.length && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Lettertypen</h2>
          <ul className="grid gap-1">
            {merk.fonts.map((f) => (
              <li key={f.naam} className="small">
                {f.naam} — {f.rol}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!!merk.templates?.length && (
        <div className="mb-8">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Templates</h2>
          <div className="flex flex-wrap gap-2">
            {merk.templates.map((t) => (
              <a key={t.naam} href={t.url} target="_blank" rel="noopener" className="btn sm ghost">
                {t.naam}
              </a>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Eindbestanden</h2>
      <FileList files={files ?? []} />
    </div>
  );
}
