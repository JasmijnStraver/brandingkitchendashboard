// =====================================================================
// Edge Function: uitnodigen
// Roep je aan vanuit je keuken als je een klant aanmaakt (of opnieuw uitnodigt).
// Supabase verstuurt dan de welkomstmail (template: email-uitnodiging.html)
// met een link waarmee de klant haar wachtwoord aanmaakt.
// Deploy: supabase functions deploy uitnodigen
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = Deno.env.get("PORTAAL_URL") ?? "https://portaal.studiocrave.nl";

Deno.serve(async (req) => {
  // Alleen jij (admin) mag uitnodigen
  const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: isAdmin } = await asUser.rpc("is_admin");
  if (!isAdmin) return new Response("Niet toegestaan", { status: 403 });

  const { client_id } = await req.json();
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: klant } = await admin.from("clients").select("id, naam, email, user_id").eq("id", client_id).single();
  if (!klant) return new Response("Klant niet gevonden", { status: 404 });
  const voornaam = (klant.naam ?? "").split(" ")[0];

  // Nog geen account: uitnodigen. Al een account: een nieuwe link om een wachtwoord te kiezen.
  const { error } = klant.user_id
    ? await admin.auth.resetPasswordForEmail(klant.email, { redirectTo: `${SITE}/wachtwoord` })
    : await admin.auth.admin.inviteUserByEmail(klant.email, { data: { voornaam }, redirectTo: `${SITE}/wachtwoord` });
  if (error) return new Response(JSON.stringify({ fout: error.message }), { status: 400 });

  await admin.from("clients").update({ uitgenodigd: true }).eq("id", klant.id);
  await admin.from("activity").insert({ client_id: klant.id, type: "uitnodiging", tekst: "welkomstmail verstuurd", gelezen: true });
  return new Response(JSON.stringify({ verstuurd: true }), { headers: { "Content-Type": "application/json" } });
});
