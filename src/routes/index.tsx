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
        <HeroCollage />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="pb-12 md:pb-16 text-[10px] md:text-xs tracking-editorial uppercase text-cream/70 text-center font-sans"
        >
          universo creativo en expansión
        </motion.p>
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

function DesktopDraggable({ img, className, rot, delay }: { img: string; className: string; rot: string; delay: number }) {
  return (
    <motion.img
      src={img}
      alt=""
      drag
      dragMomentum={false}
      dragConstraints={{ left: -150, right: 150, top: -80, bottom: 80 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`hidden md:block absolute paper-shadow-lg cursor-grab active:cursor-grabbing ${className}`}
      style={{ rotate: rot, touchAction: "none", userSelect: "none" }}
      draggable={false}
    />
  );
}

function MobileDraggable() {
  const ref = useRef<HTMLDivElement>(null);
  const items = [
    { src: plato, top: "8%", left: "5%", w: "w-24", rot: "-8deg" },
    { src: bordado, top: "20%", right: "8%", w: "w-28", rot: "10deg" },
    { src: bandeja, bottom: "8%", left: "15%", w: "w-32", rot: "-4deg" },
  ];
  return (
    <div className="md:hidden w-full mt-8">
      <div
        ref={ref}
        className="relative w-full h-[55vh] overflow-hidden"
      >
        {items.map((it, i) => (
          <motion.div
            key={i}
            drag
            dragMomentum={false}
            dragConstraints={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className={`absolute ${it.w} cursor-grab active:cursor-grabbing`}
            style={{
              top: it.top,
              left: it.left,
              right: it.right,
              bottom: it.bottom,
              rotate: it.rot,
              touchAction: "none",
              userSelect: "none",
            } as any}
          >
            <img src={it.src} alt="" className="w-full paper-shadow-lg pointer-events-none select-none" draggable={false} />
          </motion.div>
        ))}
      </div>
      <p className="text-center mt-3 text-[11px] text-silver tracking-wide font-sans">arrastrá las imágenes ✦</p>
    </div>
  );
}
