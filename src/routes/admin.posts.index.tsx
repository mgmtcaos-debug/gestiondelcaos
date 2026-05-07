import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/posts/")({
  component: PostsList,
});

function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  async function load() {
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setPosts(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function del(id: string) {
    if (!confirm("¿borrar?")) return;
    await supabase.from("posts").delete().eq("id", id);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl">publicaciones</h1>
        <Link to="/admin/posts/new" className="bg-ink text-cream px-4 py-2 text-xs uppercase tracking-editorial hover:bg-cherry">
          nueva publicación
        </Link>
      </div>
      <div className="mt-8 divide-y divide-silver/60 border-y border-silver/60">
        {posts.length === 0 && <p className="py-6 text-sm text-muted-foreground italic">sin publicaciones todavía</p>}
        {posts.map((p) => (
          <div key={p.id} className="py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-display text-xl truncate">{p.title}</p>
              <p className="text-[11px] tracking-editorial uppercase text-muted-foreground mt-1">
                {p.category} · {new Date(p.created_at).toLocaleDateString("es-AR")}
              </p>
            </div>
            <span className={`text-[10px] tracking-editorial uppercase px-2 py-1 ${p.published ? "bg-dusty text-cream" : "bg-silver/60"}`}>
              {p.published ? "publicado" : "borrador"}
            </span>
            {p.published && (
              <Link to="/blog/$slug" params={{ slug: p.slug }} target="_blank" className="text-[11px] tracking-editorial uppercase hover:text-cherry">
                ver
              </Link>
            )}
            <Link to="/admin/posts/$id" params={{ id: p.id }} className="text-[11px] tracking-editorial uppercase hover:text-cherry">
              editar
            </Link>
            <button onClick={() => del(p.id)} className="text-[11px] tracking-editorial uppercase text-cherry hover:underline">
              borrar
            </button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
