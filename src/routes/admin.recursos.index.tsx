import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/recursos/")({
  component: ResourcesList,
});

function ResourcesList() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("¿borrar?")) return;
    await supabase.from("resources").delete().eq("id", id);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl">recursos</h1>
        <Link to="/admin/recursos/new" className="bg-ink text-cream px-4 py-2 text-xs uppercase tracking-editorial hover:bg-cherry">
          nuevo recurso
        </Link>
      </div>
      <div className="mt-8 divide-y divide-silver/60 border-y border-silver/60">
        {items.length === 0 && <p className="py-6 text-sm text-muted-foreground italic">sin recursos todavía</p>}
        {items.map((r) => (
          <div key={r.id} className="py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-display text-xl truncate">{r.title}</p>
              <p className="text-[11px] tracking-editorial uppercase text-muted-foreground mt-1">
                {r.requires_email ? "captura email" : "abierto"}
              </p>
            </div>
            <span className={`text-[10px] tracking-editorial uppercase px-2 py-1 ${r.published ? "bg-dusty text-cream" : "bg-silver/60"}`}>
              {r.published ? "publicado" : "borrador"}
            </span>
            <Link to="/admin/recursos/$id" params={{ id: r.id }} className="text-[11px] tracking-editorial uppercase hover:text-cherry">
              editar
            </Link>
            <button onClick={() => del(r.id)} className="text-[11px] tracking-editorial uppercase text-cherry hover:underline">
              borrar
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
