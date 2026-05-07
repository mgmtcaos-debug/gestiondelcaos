import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Resource = {
  id: string;
  title: string;
  description: string;
  file_url: string;
  cover_image_url?: string | null;
  requires_email: boolean;
};

export function ResourceCard({ resource }: { resource: Resource }) {
  const [revealed, setRevealed] = useState(!resource.requires_email);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email });
    setLoading(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("hubo un error");
      return;
    }
    setRevealed(true);
    toast.success("listo, descargá");
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="border border-ink/30 bg-cream/50 p-6 hover:border-dusty transition-colors"
    >
      {resource.cover_image_url && (
        <img src={resource.cover_image_url} alt="" className="w-full h-40 object-cover mb-4" />
      )}
      <h3 className="font-display text-2xl leading-tight">{resource.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{resource.description}</p>
      {revealed ? (
        <a
          href={resource.file_url}
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-5 text-xs tracking-editorial uppercase border border-ink px-4 py-2 hover:bg-dusty hover:text-cream hover:border-dusty transition-colors"
        >
          descargar
        </a>
      ) : (
        <form onSubmit={unlock} className="mt-5 space-y-2">
          <p className="text-xs text-muted-foreground">dejá tu mail para acceder</p>
          <div className="flex gap-2">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="flex-1 bg-transparent border-b border-ink/40 focus:border-cherry outline-none py-1 text-sm"
            />
            <button
              disabled={loading}
              className="text-[11px] tracking-editorial uppercase border border-ink px-3 py-1.5 hover:bg-ink hover:text-cream"
            >
              acceder
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
