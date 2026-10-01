"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function uitloggen() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  return (
    <button onClick={uitloggen} className={className ?? "text-muted hover:text-burgundy"}>
      Uitloggen
    </button>
  );
}
