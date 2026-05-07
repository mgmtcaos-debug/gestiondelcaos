import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ posts: 0, resources: 0, subs: 0 });

  useEffect(() => {
    (async () => {
      const [a, b, c] = await Promise.all([
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("subscribers").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ posts: a.count ?? 0, resources: b.count ?? 0, subs: c.count ?? 0 });
    })();
  }, []);

  const Stat = ({ n, l, to }: { n: number; l: string; to: string }) => (
    <Link to={to} className="block border border-ink/30 bg-card p-8 hover:border-cherry transition-colors">
      <p className="font-display text-6xl">{n}</p>
      <p className="mt-2 text-[11px] tracking-editorial uppercase">{l}</p>
    </Link>
  );

  return (
    <AdminShell>
      <h1 className="font-display text-5xl">hola, equipo caos</h1>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Stat n={counts.posts} l="publicaciones" to="/admin/posts" />
        <Stat n={counts.resources} l="recursos" to="/admin/recursos" />
        <Stat n={counts.subs} l="suscriptores" to="/admin/subscribers" />
      </div>
    </AdminShell>
  );
}
