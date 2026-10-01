"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UploadBox({ clientId, course }: { clientId: string; course: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState("");

  async function uploaden(files: FileList | null) {
    if (!files || !files.length) return;
    setBezig(true);
    setFout("");
    const supabase = createClient();
    for (const file of Array.from(files)) {
      const path = `${clientId}/${course}/uploads/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("klanten").upload(path, file);
      if (uploadError) {
        setFout(`${file.name} uploaden lukte niet.`);
        continue;
      }
      await supabase.from("files").insert({
        client_id: clientId,
        course,
        soort: "upload",
        naam: file.name,
        storage_path: path,
        grootte: file.size,
      });
    }
    setBezig(false);
    router.refresh();
  }

  return (
    <div
      className="rounded-md border border-dashed border-line p-5 text-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        uploaden(e.dataTransfer.files);
      }}
    >
      <p className="small muted mb-2">Sleep bestanden hierheen, of</p>
      <button className="btn sm ghost" onClick={() => inputRef.current?.click()} disabled={bezig}>
        {bezig ? "Bezig..." : "Kies bestanden"}
      </button>
      <input ref={inputRef} type="file" multiple hidden onChange={(e) => uploaden(e.target.files)} />
      {fout && <p className="text-sm text-pepper mt-2">{fout}</p>}
    </div>
  );
}
