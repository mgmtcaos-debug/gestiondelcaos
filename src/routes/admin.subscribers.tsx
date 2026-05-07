import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/subscribers")({
  component: Subs,
});

function Subs() {
  const [rows, setRows] = useState<{ id: string; email: string; created_at: string }[]>([]);

  useEffect(() => {
    supabase.from("subscribers").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);

  function exportCsv() {
    const csv = ["email,fecha", ...rows.map((r) => `${r.email},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "caos-subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl">suscriptores</h1>
        <button onClick={exportCsv} className="text-xs uppercase tracking-editorial border border-ink px-4 py-2 hover:bg-ink hover:text-cream">
          exportar csv
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{rows.length} en total</p>
      <table className="w-full text-sm border-t border-silver/60">
        <thead>
          <tr className="text-left text-[11px] tracking-editorial uppercase text-muted-foreground">
            <th className="py-2">email</th>
            <th className="py-2">fecha</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-silver/40">
              <td className="py-2">{r.email}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString("es-AR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
