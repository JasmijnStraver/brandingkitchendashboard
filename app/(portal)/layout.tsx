import Link from "next/link";
import Image from "next/image";
import { requireClient } from "@/lib/auth";
import LogoutButton from "@/components/portal/LogoutButton";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { client } = await requireClient();
  const voornaam = (client.naam || "").split(" ")[0];

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-4 border-b border-line max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/brand/sc-monogram-bordeaux.png" alt="" width={28} height={28} />
          <span className="wordmark text-xl text-midnight">Studio Crave</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/menu" className="hover:text-burgundy">
            Menu
          </Link>
          <Link href="/documenten" className="hover:text-burgundy">
            Documenten
          </Link>
          <Link href="/merk" className="hover:text-burgundy">
            Jouw merk
          </Link>
          <span className="muted small">{voornaam}</span>
          <LogoutButton />
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
