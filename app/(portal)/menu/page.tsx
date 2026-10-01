import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { COURSES, COURSE_ORDER, courseTekst } from "@/lib/content/courses";
import { woordenVan, type Profiel } from "@/lib/content/profiel";
import type { CourseStatus } from "@/lib/supabase/types";

const STATUS_LABEL: Record<CourseStatus, string> = { dicht: "Vergrendeld", open: "Open", bezig: "Bezig", klaar: "Afgerond" };

export default async function MenuPage() {
  const { supabase, client } = await requireClient();
  const { data: courses } = await supabase.from("client_courses").select("*").eq("client_id", client.id).order("volgorde");
  const woorden = woordenVan(client.profiel as Profiel);

  const bestaand = new Set((courses ?? []).map((c) => c.course));
  const lijst = COURSE_ORDER.filter((id) => bestaand.has(id) || id === "finale");

  return (
    <div>
      <h1 className="wordmark text-4xl text-midnight mb-2">Je menu</h1>
      <p className="muted mb-8 max-w-xl">De 7-Course Brand Method. Klik een gang open voor wat Jasmijn doet, wat jij ermee kunt, en je tools.</p>
      <div className="grid gap-3">
        {lijst.map((id) => {
          const row = courses?.find((c) => c.course === id);
          const content = COURSES[id];
          const merk = (client.merk as { open?: boolean }) || {};
          const alleKlaar = (courses ?? []).length > 0 && (courses ?? []).every((c) => c.status === "klaar");
          const status: CourseStatus = id === "finale" ? (merk.open || alleKlaar ? "klaar" : "dicht") : row?.status ?? "dicht";
          const dessert = content.dessert;
          return (
            <Link
              key={id}
              href={id === "finale" ? "/merk" : `/menu/${id}`}
              className={`flex items-center gap-4 rounded-md border border-line bg-surface p-5 transition-colors hover:border-gold ${
                status === "dicht" ? "opacity-60" : ""
              }`}
            >
              <span className={`shrink-0 w-11 h-11 rounded-full ${dessert ? "bg-gold text-midnight" : "bg-midnight text-creme"} flex items-center justify-center wordmark`}>
                {content.nr}
              </span>
              <span className="flex-1">
                <h2 className="wordmark text-2xl text-midnight leading-tight">{content.naam}</h2>
                <p className="small muted">{courseTekst(content.sub, woorden)}</p>
              </span>
              <span className={`pill ${status}`}>{STATUS_LABEL[status]}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
