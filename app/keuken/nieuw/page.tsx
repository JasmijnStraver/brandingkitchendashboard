"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PAKKETTEN } from "@/lib/content/packages";
import type { Pakket } from "@/lib/supabase/types";

export default function NieuweKlantPage() {
  const router = useRouter();
  const [naam, setNaam] = useState("");
  const [bedrijf, setBedrijf] = useState("");
  const [email, setEmail] = useState("");
  const [pakket, setPakket] = useState<Pakket>("dwy");
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function aanmaken(e: React.FormEvent) {
    e.preventDefault();
    if (!naam || !/^\S+@\S+\.\S+$/.test(email)) {
      setFout("Vul een naam en een geldig e-mailadres in.");
      return;
    }
    setBezig(true);
    setFout("");
    const supabase = createClient();
    const { data: nieuw, error } = await supabase
      .from("clients")
      .insert({ naam, bedrijf, email: email.toLowerCase().trim(), pakket })
      .select()
      .single();
    if (error || !nieuw) {
      setBezig(false);
      setFout(error?.code === "23505" ? "Dit e-mailadres hoort al bij een klant." : "Aanmaken lukte niet.");
      return;
    }
    const { error: uitnodigenError } = await supabase.functions.invoke("uitnodigen", { body: { client_id: nieuw.id } });
    setBezig(false);
    if (uitnodigenError) {
      router.push(`/keuken/klanten/${nieuw.id}`);
      return;
    }
    router.push(`/keuken/klanten/${nieuw.id}`);
  }

  return (
    <div className="max-w-lg">
      <h1 className="wordmark text-4xl text-midnight mb-6">Nieuwe klant</h1>
      <form onSubmit={aanmaken} className="panel bg-surface border border-line rounded-md p-6 grid gap-4">
        <label className="field">
          Naam
          <input value={naam} onChange={(e) => setNaam(e.target.value)} required />
        </label>
        <label className="field">
          Bedrijf
          <input value={bedrijf} onChange={(e) => setBedrijf(e.target.value)} />
        </label>
        <label className="field">
          E-mailadres
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="field">
          Pakket
          <select value={pakket} onChange={(e) => setPakket(e.target.value as Pakket)}>
            {Object.entries(PAKKETTEN).map(([id, p]) => (
              <option key={id} value={id}>
                {p.naam}
              </option>
            ))}
          </select>
        </label>
        {fout && <p className="text-sm text-pepper">{fout}</p>}
        <button type="submit" disabled={bezig} className="btn gold justify-center">
          {bezig ? "Bezig..." : "Aanmaken en uitnodigen"}
        </button>
      </form>
    </div>
  );
}
