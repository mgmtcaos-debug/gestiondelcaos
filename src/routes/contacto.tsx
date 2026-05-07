import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "contacto — CAOS" },
      { name: "description", content: "Hablemos. @gestiondelcaos en Instagram." },
      { property: "og:title", content: "contacto — CAOS" },
      { property: "og:description", content: "Hablemos. @gestiondelcaos en Instagram." },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="max-w-3xl mx-auto px-5 md:px-10 py-24 md:py-32">
        <h1 className="font-display text-6xl md:text-8xl leading-[1]">
          <span className="font-script text-cherry">H</span>ablemos
        </h1>
        <p className="mt-8 text-lg md:text-xl max-w-xl">
          Escribinos por Instagram. Colaboraciones, consultas, ideas raras, todo bienvenido.
        </p>
        <a
          href="https://instagram.com/gestiondelcaos"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 font-display text-3xl md:text-5xl text-cherry hover:underline"
        >
          @gestiondelcaos →
        </a>
      </section>
      <SiteFooter />
    </div>
  );
}
