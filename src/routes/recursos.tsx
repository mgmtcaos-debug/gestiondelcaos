import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ResourceCard } from "@/components/ResourceCard";

export const Route = createFileRoute("/recursos")({
  head: () => ({
    meta: [
      { title: "recursos — CAOS" },
      { name: "description", content: "Descargas gratis para vivir de tu creatividad." },
      { property: "og:title", content: "recursos — CAOS" },
      { property: "og:description", content: "Descargas gratis para vivir de tu creatividad." },
    ],
  }),
  component: Recursos,
});

function Recursos() {
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("resources").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setResources(data ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <h1 className="font-display text-6xl md:text-8xl">
          <span className="font-script text-cherry">R</span>ecursos
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">descargas gratuitas. herramientas, plantillas y archivos para acompañarte.</p>
        {resources.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground italic">próximamente.</p>
        ) : (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {resources.map((r) => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
