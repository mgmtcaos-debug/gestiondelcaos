import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Nueva contraseña · CAOS" },
      { name: "description", content: "Restablecé la contraseña de acceso al panel de CAOS." },
      { property: "og:title", content: "Nueva contraseña · CAOS" },
      { property: "og:description", content: "Restablecé la contraseña de acceso al panel de CAOS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Mínimo 8 caracteres"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Contraseña actualizada");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <h1 className="font-display text-3xl text-center">nueva contraseña</h1>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="nueva contraseña"
          className="w-full mt-6 bg-transparent border-b border-ink/40 focus:border-cherry outline-none py-2" />
        <button disabled={loading} className="w-full bg-ink text-cream py-3 text-xs uppercase tracking-editorial hover:bg-cherry transition-colors disabled:opacity-50">
          guardar
        </button>
      </form>
    </div>
  );
}
