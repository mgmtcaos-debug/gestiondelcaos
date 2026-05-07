import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/caos-logo.png";
import { toast } from "sonner";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("no pudimos sumarte, probá de nuevo");
      return;
    }
    toast.success("bienvenidx al caos");
    setEmail("");
  }

  return (
    <footer id="newsletter" className="border-t border-silver/60 mt-24 px-5 md:px-10 py-14">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h3 className="font-display text-4xl md:text-5xl leading-none">
            entrá al <span className="font-script text-cherry text-6xl md:text-7xl align-baseline">caos</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            newsletter ocasional. cultura, plata, y lo que no se dice en voz alta.
          </p>
          <form onSubmit={subscribe} className="mt-5 flex gap-2 max-w-md">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 bg-transparent border-b border-ink/40 focus:border-cherry outline-none py-2 text-sm"
            />
            <button
              disabled={loading}
              className="text-xs uppercase tracking-editorial border border-ink px-4 py-2 hover:bg-ink hover:text-cream transition-colors disabled:opacity-50"
            >
              sumarme
            </button>
          </form>
        </div>
        <div className="md:text-right">
          <img src={logo} alt="CAOS" className="h-10 md:ml-auto opacity-90" />
          <p className="mt-3 text-[11px] tracking-editorial uppercase text-muted-foreground">
            gestión del caos · universo creativo en expansión
          </p>
          <a
            href="https://instagram.com/gestiondelcaos"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-sm hover:text-cherry"
          >
            @gestiondelcaos
          </a>
          <p className="mt-6 text-[11px] tracking-editorial text-muted-foreground">© CAOS 2026</p>
        </div>
      </div>
    </footer>
  );
}
