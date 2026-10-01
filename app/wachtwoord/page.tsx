"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WachtwoordPage() {
  const router = useRouter();
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [klaar, setKlaar] = useState(false);
  const [bezig, setBezig] = useState(false);

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    if (wachtwoord.length < 8) {
      setFout("Kies een wachtwoord van minstens 8 tekens.");
      return;
    }
    setFout("");
    setBezig(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: wachtwoord });
    setBezig(false);
    if (error) {
      setFout("Dit lukte niet. Vraag Jasmijn om een nieuwe uitnodigingslink.");
      return;
    }
    setKlaar(true);
    setTimeout(() => {
      router.replace("/");
      router.refresh();
    }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <form onSubmit={opslaan} className="w-full max-w-sm bg-surface border border-line rounded-md p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Studio Crave</p>
        <h1 className="wordmark text-3xl text-midnight mb-6">Kies je wachtwoord</h1>
        <label className="field mb-4">
          Nieuw wachtwoord
          <input type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} autoComplete="new-password" required />
        </label>
        {fout && <p className="text-sm text-pepper mb-4">{fout}</p>}
        {klaar && <p className="text-sm text-burgundy mb-4">Opgeslagen. Je gaat zo naar je keuken...</p>}
        <button type="submit" disabled={bezig} className="btn w-full justify-center">
          {bezig ? "Bezig..." : "Opslaan en inloggen"}
        </button>
      </form>
    </div>
  );
}
