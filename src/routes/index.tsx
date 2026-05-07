import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
        <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-16 md:py-32 md:min-h-[80vh] flex flex-col items-center justify-center">
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
            className="mt-8 md:mt-10 text-[10px] md:text-xs tracking-editorial uppercase text-cream/70 text-center font-sans"
          >
            universo creativo en expansión
          </motion.p>

          {/* Mobile: draggable scattered images */}
          <MobileDraggable />

          {/* Desktop: floating draggable photos */}
          <DesktopDraggable img={plato} className="left-4 top-16 w-44 lg:w-56" rot="-8deg" delay={0.8} />
          <DesktopDraggable img={bordado} className="right-6 top-32 w-40 lg:w-52" rot="6deg" delay={1} />
          <DesktopDraggable img={bandeja} className="right-12 bottom-4 w-44 lg:w-56" rot="-4deg" delay={1.2} />
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative max-w-5xl mx-auto px-5 md:px-10 py-24 md:py-36">
        <img
          src={mano}
          alt=""
          className="hidden md:block absolute -right-10 top-0 w-64 lg:w-80 opacity-95 pointer-events-none"
          style={{ transform: "rotate(6deg)" }}
        />
        <div className="relative max-w-3xl font-display text-2xl md:text-4xl leading-[1.25] space-y-4">
          <p>
            <span className="font-script text-cherry text-7xl md:text-8xl leading-none mr-1 align-text-top float-left">D</span>
            urante años lo llamaron desorden.
          </p>
          <p>Nosotras aprendimos a llamarlo por su nombre.</p>
          <p>El caos no es lo que pasa cuando perdés el control.</p>
          <p>Es lo que pasa justo antes de que todo tenga sentido.</p>
          <p>Un espacio donde escribimos, opinamos, creamos, invitamos e incomodamos.</p>
          <p>Sin límites fijos. Sin una sola forma. <em className="text-cherry">Sin permiso de nadie.</em></p>
          <p><em>Tomá asiento, la mesa está servida.</em></p>
          <div className="h-px w-24 bg-silver mt-8" />
          <p className="text-[11px] tracking-editorial uppercase text-muted-foreground font-sans not-italic">— manifiesto caos</p>
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
