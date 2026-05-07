import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PostCard } from "@/components/PostCard";
import { ResourceCard } from "@/components/ResourceCard";
import logo from "@/assets/caos-logo.png";
import plato from "@/assets/caos-plato.png";
import bordado from "@/assets/caos-bordado.png";
import bandeja from "@/assets/caos-bandeja.png";
import mano from "@/assets/caos-mano.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CAOS — Universo creativo en expansión" },
      { name: "description", content: "Cultura filtrada con criterio creativo. Plata sin filtros corporativos." },
      { property: "og:title", content: "CAOS — Universo creativo en expansión" },
      { property: "og:description", content: "Cultura, plata y creatividad sin pedir permiso." },
    ],
  }),
  component: Home,
});

function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("posts").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setPosts(data ?? []));
    supabase.from("resources").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setResources(data ?? []));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteNav />

      {/* HERO */}
      <section className="relative bg-ink text-cream overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-32 min-h-[80vh] flex flex-col items-center justify-center">
          <motion.img
            src={logo}
            alt="CAOS"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-[80%] md:w-[55%] max-w-2xl mx-auto relative z-10"
            style={{ filter: "drop-shadow(0 6px 20px rgba(255,255,255,0.08))" }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-10 text-[10px] md:text-xs tracking-editorial uppercase text-cream/70 text-center"
          >
            universo creativo en expansión
          </motion.p>

          {/* Floating brand photos — desktop only draggable */}
          <motion.img
            src={plato}
            alt=""
            drag
            dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
            initial={{ opacity: 0, rotate: -8 }}
            animate={{ opacity: 1, rotate: -8 }}
            transition={{ delay: 0.8 }}
            className="hidden md:block absolute left-4 top-16 w-44 lg:w-56 paper-shadow-lg cursor-grab active:cursor-grabbing"
            style={{ rotate: "-8deg" }}
          />
          <motion.img
            src={bordado}
            alt=""
            drag
            dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
            initial={{ opacity: 0, rotate: 6 }}
            animate={{ opacity: 1, rotate: 6 }}
            transition={{ delay: 1 }}
            className="hidden md:block absolute right-6 top-32 w-40 lg:w-52 paper-shadow-lg cursor-grab active:cursor-grabbing"
            style={{ rotate: "6deg" }}
          />
          <motion.img
            src={bandeja}
            alt=""
            drag
            dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
            initial={{ opacity: 0, rotate: -4 }}
            animate={{ opacity: 1, rotate: -4 }}
            transition={{ delay: 1.2 }}
            className="hidden md:block absolute right-12 bottom-4 w-44 lg:w-56 paper-shadow-lg cursor-grab active:cursor-grabbing"
            style={{ rotate: "-4deg" }}
          />
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-36">
        <img
          src={mano}
          alt=""
          className="hidden md:block absolute right-0 top-10 w-64 lg:w-80 opacity-90 pointer-events-none"
          style={{ transform: "rotate(4deg)" }}
        />
        <div className="relative max-w-3xl">
          <p className="font-display text-3xl md:text-5xl leading-[1.15]">
            <span className="font-script text-cherry text-7xl md:text-8xl leading-none mr-1 align-text-top">C</span>
            ultura filtrada con criterio creativo. Plata sin filtros corporativos. Lo políticamente incorrecto como punto de partida. Monetizar una vida creativa <em className="text-cherry">sin pedir permiso</em>.
          </p>
          <div className="mt-8 h-px w-24 bg-silver" />
          <p className="mt-4 text-[11px] tracking-editorial uppercase text-muted-foreground">— manifiesto caos</p>
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <h2 className="font-display text-5xl md:text-6xl mb-10">
          <span className="font-script text-cherry text-7xl md:text-8xl">P</span>ublicaciones
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">próximamente, primeras publicaciones.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} rotate={[-1.5, 1, -0.5][i] ?? 0} />
            ))}
          </div>
        )}
      </section>

      {/* RECURSOS PREVIEW */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        <h2 className="font-display text-5xl md:text-6xl mb-10">
          <span className="font-script text-cherry text-7xl md:text-8xl">R</span>ecursos
        </h2>
        {resources.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">pronto, recursos para descargar.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((r) => <ResourceCard key={r.id} resource={r} />)}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
