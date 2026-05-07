import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PostCard } from "@/components/PostCard";

const CATS = ["todas", "cultura", "plata", "creatividad", "sin filtro"];

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "blog — CAOS" },
      { name: "description", content: "Publicaciones sobre cultura, plata y creatividad." },
      { property: "og:title", content: "blog — CAOS" },
      { property: "og:description", content: "Publicaciones sobre cultura, plata y creatividad." },
    ],
  }),
  component: Blog,
});

function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [cat, setCat] = useState("todas");

  useEffect(() => {
    supabase.from("posts").select("*").eq("published", true).order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, []);

  const filtered = cat === "todas" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <h1 className="font-display text-6xl md:text-8xl">
          <span className="font-script text-cherry">B</span>log
        </h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-[11px] tracking-editorial uppercase px-3 py-1.5 border ${cat === c ? "bg-cherry text-cream border-cherry" : "border-ink/40 hover:border-ink"}`}
            >
              {c}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-12 text-sm text-muted-foreground italic">no hay publicaciones todavía.</p>
        ) : (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <PostCard key={p.id} post={p} rotate={[(i % 3) - 1] as any} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
