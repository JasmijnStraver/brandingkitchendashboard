import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { PORTAAL, STANDAARD_WELKOM } from "@/lib/content/packages";
import { voortgang, huidigeStap } from "@/lib/content/status";

export default async function PortalHome() {
  const { supabase, client } = await requireClient();
  const [{ data: courses }, { data: quiz }, { data: intake }] = await Promise.all([
    supabase.from("client_courses").select("*").eq("client_id", client.id),
    supabase.from("quiz_results").select("client_id").eq("client_id", client.id).maybeSingle(),
    supabase.from("intake").select("klaar").eq("client_id", client.id).maybeSingle(),
  ]);

  const voornaam = (client.naam || "").split(" ")[0];
  const v = voortgang(courses ?? []);
  const stap = huidigeStap(courses ?? [], !!quiz, !!intake?.klaar);
  const quote = PORTAAL.quotes[Math.floor(Math.random() * PORTAAL.quotes.length)];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Studio Crave · {voornaam}</p>
      <h1 className="wordmark text-4xl md:text-5xl text-midnight mb-4">{PORTAAL.welkomKop}</h1>
      <p className="font-accent text-2xl text-burgundy mb-6">&ldquo;{quote}&rdquo;</p>
      <p className="max-w-xl mb-8 leading-relaxed">{client.welkom || STANDAARD_WELKOM}</p>

      <div className="flex flex-wrap gap-3 mb-10">
        {!quiz && (
          <Link href="/quiz" className="btn gold">
            Doe de quiz: welk gerecht ben jij?
          </Link>
        )}
        {quiz && !intake?.klaar && (
          <Link href="/vragenlijst" className="btn gold">
            Vul je vragenlijst in
          </Link>
        )}
        <Link href="/menu" className="btn ghost">
          Naar je menu
        </Link>
      </div>

      <div className="rounded-md border border-line bg-surface p-5 inline-flex flex-col gap-1">
        <span className="small muted">Je staat nu bij</span>
        <span className="wordmark text-2xl text-midnight">{stap}</span>
        {v.totaal > 0 && (
          <span className="small muted">
            {v.klaar} van {v.totaal} gangen afgerond
          </span>
        )}
      </div>
    </div>
  );
}
