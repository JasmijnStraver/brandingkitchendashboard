import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { COURSES, courseTekst, type CourseId } from "@/lib/content/courses";
import { woordenVan, type Profiel } from "@/lib/content/profiel";
import FileList from "@/components/portal/FileList";
import UploadBox from "@/components/portal/UploadBox";
import SkillGrid from "@/components/portal/SkillGrid";

export default async function CourseDetailPage({ params }: { params: { course: string } }) {
  const courseId = params.course as CourseId;
  const content = COURSES[courseId];
  if (!content || courseId === "finale") notFound();

  const { supabase, client } = await requireClient();
  const [{ data: courseRow }, { data: files }, { data: skills }] = await Promise.all([
    supabase.from("client_courses").select("*").eq("client_id", client.id).eq("course", courseId).single(),
    supabase.from("files").select("*").eq("client_id", client.id).eq("course", courseId).order("created_at"),
    supabase.from("skills").select("*").eq("course", courseId).eq("status", "live"),
  ]);

  if (!courseRow) notFound();

  const woorden = woordenVan(client.profiel as Profiel);
  const shoot = !!client.shoot;
  const jasmijnList = shoot && content.jasmijnShoot ? content.jasmijnShoot : content.jasmijn;
  const jijTekst = shoot && content.jijShoot ? content.jijShoot : content.jij;
  const skillIds = new Set(courseRow.skills || []);
  const beschikbareSkills = (skills ?? []).filter((s) => skillIds.has(s.id));

  return (
    <div>
      <p className="small muted mb-1">Course {content.nr}</p>
      <h1 className="wordmark text-4xl text-midnight mb-2">{content.naam}</h1>
      <p className="muted mb-8 max-w-xl">{courseTekst(content.sub, woorden)}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-2">Wat Jasmijn doet</h2>
          <ul className="grid gap-2">
            {jasmijnList.map((p, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-gold">—</span>
                <span>{courseTekst(p, woorden)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-2">Wat jij ermee kunt</h2>
          <p className="leading-relaxed">{courseTekst(jijTekst, woorden)}</p>
          {courseRow.notitie && (
            <div className="mt-4 rounded-md border border-gold/40 bg-surface-2 p-4">
              <p className="small font-semibold text-burgundy mb-1">Notitie van Jasmijn</p>
              <p className="small">{courseRow.notitie}</p>
            </div>
          )}
        </div>
      </div>

      {courseRow.status !== "dicht" && (
        <>
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Je tools</h2>
          <SkillGrid skills={beschikbareSkills} courseId={courseId} className="mb-10" />

          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Bestanden</h2>
          <FileList files={files ?? []} className="mb-10" />

          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted mb-3">Aanleveren</h2>
          <p className="small muted mb-3 max-w-xl">{courseTekst(content.aanleveren, woorden)}</p>
          <UploadBox clientId={client.id} course={courseId} />
        </>
      )}

      {courseRow.status === "dicht" && <p className="muted italic">Deze gang staat nog vergrendeld. Jasmijn geeft 'm vrij als het zover is.</p>}
    </div>
  );
}
