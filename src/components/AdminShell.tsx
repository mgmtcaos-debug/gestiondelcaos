import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/caos-logo.png";

export function AdminShell({ children }: { children: ReactNode }) {
  const { session, loading } = useSession();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/admin/login" });
  }, [loading, session, navigate]);

  if (loading || !session) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">cargando…</div>;
  }

  const tab = (to: string, label: string) => {
    const active = loc.pathname === to || (to !== "/admin" && loc.pathname.startsWith(to));
    return (
      <Link to={to} className={`text-[11px] tracking-editorial uppercase px-3 py-1.5 ${active ? "bg-ink text-cream" : "hover:text-cherry"}`}>
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-silver/60 px-5 md:px-10 py-4 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3">
          <img src={logo} alt="CAOS" className="h-7" />
          <span className="text-[11px] tracking-editorial uppercase text-muted-foreground">admin</span>
        </Link>
        <nav className="flex items-center gap-1">
          {tab("/admin", "dashboard")}
          {tab("/admin/posts", "publicaciones")}
          {tab("/admin/recursos", "recursos")}
          {tab("/admin/subscribers", "suscriptores")}
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))}
            className="ml-3 text-[11px] tracking-editorial uppercase border border-ink/40 px-3 py-1.5 hover:bg-ink hover:text-cream">
            salir
          </button>
        </nav>
      </header>
      <main className="px-5 md:px-10 py-10 max-w-6xl mx-auto">{children}</main>
    </div>
  );
}
