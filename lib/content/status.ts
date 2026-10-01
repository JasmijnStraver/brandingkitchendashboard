import type { ClientCourse } from "@/lib/supabase/types";
import { COURSES, type CourseId } from "./courses";

export function voortgang(courses: ClientCourse[]) {
  return { klaar: courses.filter((c) => c.status === "klaar").length, totaal: courses.length };
}

export function huidigeStap(courses: ClientCourse[], quizGedaan: boolean, intakeKlaar: boolean): string {
  const v = voortgang(courses);
  if (courses.length && v.klaar === v.totaal) return "Afgerond";
  const bezig = courses.find((c) => c.status === "bezig") || courses.find((c) => c.status === "open");
  if (!bezig && !quizGedaan) return "Quiz";
  if (!bezig && !intakeKlaar) return "Vragenlijst";
  if (bezig) {
    const naam = COURSES[bezig.course as CourseId]?.naam || bezig.course;
    return /^\d/.test(bezig.course) ? `${bezig.course} ${naam}` : naam;
  }
  return "Wacht op vrijgave";
}
