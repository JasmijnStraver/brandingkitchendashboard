"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);

  async function inloggen(e: React.FormEvent) {
    e.preventDefault();
    setFout("");
    setBezig(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
    setBezig(false);
    if (error) {
      setFout("E-mailadres of wachtwoord klopt niet. Check je uitnodigingsmail, of vraag Jasmijn om een nieuwe link.");
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-bg">
      <form onSubmit={inloggen} className="w-full max-w-sm bg-surface border border-line rounded-md p-8 shadow-sm">
        <Image src="/brand/sc-monogram-bordeaux.png" alt="" width={40} height={40} className="mb-4" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted font-medium mb-2">Studio Crave</p>
        <h1 className="wordmark text-4xl text-midnight mb-6">Klantportaal</h1>
        <label className="field mb-4">
          E-mailadres
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </label>
        <label className="field mb-4">
          Wachtwoord
          <input type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} autoComplete="current-password" required />
        </label>
        {fout && <p className="text-sm text-pepper mb-4">{fout}</p>}
        <button type="submit" disabled={bezig} className="btn w-full justify-center">
          {bezig ? "Bezig..." : "Aan tafel"}
        </button>
        <p className="small muted mt-4">
          Nog geen wachtwoord? Check je uitnodigingsmail van Studio Crave, of app/mail naar{" "}
          <a href="mailto:info@studiocrave.nl" className="underline">
            info@studiocrave.nl
          </a>
          .
        </p>
      </form>
    </div>
  );
}
