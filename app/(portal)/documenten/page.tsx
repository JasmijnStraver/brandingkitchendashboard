import { requireClient } from "@/lib/auth";
import DocumentList from "@/components/portal/DocumentList";

export default async function DocumentenPage() {
  const { supabase, client } = await requireClient();
  const { data: documents } = await supabase.from("documents").select("*").eq("client_id", client.id).order("created_at");

  return (
    <div>
      <h1 className="wordmark text-4xl text-midnight mb-2">Documenten</h1>
      <p className="muted mb-8 max-w-xl">Contracten en voorwaarden. Geef akkoord met één klik.</p>
      <DocumentList documents={documents ?? []} />
    </div>
  );
}
