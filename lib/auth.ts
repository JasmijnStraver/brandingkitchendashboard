import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Client } from "@/lib/supabase/types";

export async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

// Voor klant-pagina's: redirect admins naar hun keuken, en klanten zonder klantaccount naar login.
export async function requireClient(): Promise<{ supabase: ReturnType<typeof createClient>; client: Client }> {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role === "admin") redirect("/keuken");
  const { data: client } = await supabase.from("clients").select("*").eq("user_id", user.id).single();
  if (!client) redirect("/login?fout=geen-klantaccount");
  return { supabase, client };
}

// Voor /keuken: alleen admins door.
export async function requireAdmin() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");
  return { supabase, user };
}
