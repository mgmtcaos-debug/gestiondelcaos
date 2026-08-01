import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/caos-logo.png";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//") ? s.next : undefined,
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    if (next) { window.location.href = next; return; }
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <Link to="/"><img src={logo} alt="CAOS" className="h-10 mx-auto" /></Link>
        <h1 className="font-display text-3xl text-center mt-6">acceso · caos</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-[11px] tracking-editorial uppercase">email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-transparent border-b border-ink/40 focus:border-cherry outline-none py-2" />
          </div>
          <div>
            <label className="text-[11px] tracking-editorial uppercase">contraseña</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-transparent border-b border-ink/40 focus:border-cherry outline-none py-2" />
          </div>
          <button disabled={loading} className="w-full mt-6 bg-ink text-cream py-3 text-xs uppercase tracking-editorial hover:bg-cherry transition-colors disabled:opacity-50">
            entrar
          </button>
        </form>
      </div>
    </div>
  );
}
