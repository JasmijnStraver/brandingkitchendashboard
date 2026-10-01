import { requireAdmin } from "@/lib/auth";
import SkillsBeheer from "@/components/keuken/SkillsBeheer";

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();
  const { data: skills } = await supabase.from("skills").select("*").order("course");
  return <SkillsBeheer skills={skills ?? []} />;
}
