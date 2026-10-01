import { requireClient } from "@/lib/auth";
import { vragenlijstVoor } from "@/lib/content/questionnaire";
import Intake from "@/components/portal/Intake";

export default async function VragenlijstPage() {
  const { supabase, client } = await requireClient();
  const { data: intake } = await supabase.from("intake").select("*").eq("client_id", client.id).single();
  const delen = vragenlijstVoor(client.pakket, client.extras || []);

  if (intake?.klaar) {
    return (
      <div className="max-w-xl">
        <h1 className="wordmark text-3xl text-midnight mb-3">Je vragenlijst staat</h1>
        <p className="leading-relaxed">Je hebt deze al ingevuld. Wil je iets aanpassen? App of mail naar Jasmijn, dan past zij het voor je aan.</p>
      </div>
    );
  }

  return <Intake clientId={client.id} delen={delen} startVelden={(intake?.velden as Record<string, string>) ?? {}} startStap={intake?.stap ?? 0} />;
}
