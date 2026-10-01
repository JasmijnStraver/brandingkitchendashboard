import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { PAKKETTEN } from "@/lib/content/packages";
import { huidigeStap } from "@/lib/content/status";

export default async function KeukenOverzicht() {
  const { supabase } = await requireAdmin();
  const { data: clients } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  const { data: activiteit } = await supabase.from("activity").select("*").order("created_at", { ascending: false }).limit(15);
  const { data: allCourses } = await supabase.from("client_courses").select("*");
  const { data: quizzen } = await supabase.from("quiz_results").select("client_id");
  const { data: intakes } = await supabase.from("intake").select("client_id, klaar");

  const naamVan = (id: string) => clients?.find((c) => c.id === id)?.naam ?? "";

  return (
    <div>
      <div className="pagehead flex flex-wrap justify-between gap-4 items-end border-b border-line pb-5 mb-7">
        <div>
          <h1 className="wordmark text-4xl text-midnight">Je keuken</h1>
          <p className="muted small mt-1">{clients?.length ?? 0} klanten</p>
        </div>
        <Link href="/keuken/nieuw" className="btn gold">
          + Nieuwe klant
        </Link>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Klanten</h2>
          <div className="grid gap-2">
            {(clients ?? []).map((c) => {
              const courses = (allCourses ?? []).filter((cc) => cc.client_id === c.id);
              const heeftQuiz = (quizzen ?? []).some((q) => q.client_id === c.id);
              const intake = (intakes ?? []).find((i) => i.client_id === c.id);
              const stap = huidigeStap(courses, heeftQuiz, !!intake?.klaar);
              return (
                <Link
                  key={c.id}
                  href={`/keuken/klanten/${c.id}`}
                  className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-5 py-3 hover:border-gold transition-colors"
                >
                  <span>
                    <span className="block font-semibold">{c.naam}</span>
                    <span className="small muted">
                      {c.bedrijf} · {PAKKETTEN[c.pakket]?.kort}
                    </span>
                  </span>
                  <span className="pill open shrink-0">{stap}</span>
                </Link>
              );
            })}
            {!clients?.length && <p className="muted small">Nog geen klanten. Maak je eerste klant aan.</p>}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Recente activiteit</h2>
          <ul className="grid gap-2">
            {(activiteit ?? []).map((a) => (
              <li key={a.id} className="small rounded-md border border-line bg-surface px-3 py-2">
                <span className="font-semibold">{naamVan(a.client_id)}</span> {a.tekst}
              </li>
            ))}
            {!activiteit?.length && <p className="muted small">Nog geen activiteit.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
