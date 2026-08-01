import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/caos-logo.png";

type OAuthDetails = {
  client?: { name?: string } | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};

export const Route = createFileRoute("/.lovable/oauth/consent")({

  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Falta authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/admin/login", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const details = data as OAuthDetails | null;
    const immediate = details?.redirect_url ?? details?.redirect_to;
    if (immediate && !details?.client) throw redirect({ href: immediate });
    return details;
  },

  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center px-5 text-center">
      <p className="text-sm text-muted-foreground">
        No se pudo cargar esta solicitud de autorización: {String((error as Error)?.message ?? error)}
      </p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientName = details?.client?.name ?? "esta aplicación";

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await supabase.auth.oauth.approveAuthorization(authorization_id)
      : await supabase.auth.oauth.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("El servidor de autorización no devolvió una redirección.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm text-center">
        <img src={logo} alt="CAOS" className="h-10 mx-auto" />
        <h1 className="font-display text-3xl mt-6">conectar {clientName}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {clientName} podrá leer y publicar contenido de CAOS en tu nombre: publicaciones, recursos y
          suscriptores.
        </p>
        {error && (
          <p role="alert" className="mt-4 text-xs text-cherry">
            {error}
          </p>
        )}
        <div className="mt-8 flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 border border-ink/40 py-3 text-xs uppercase tracking-editorial hover:bg-ink hover:text-cream disabled:opacity-50"
          >
            rechazar
          </button>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 bg-ink text-cream py-3 text-xs uppercase tracking-editorial hover:bg-cherry transition-colors disabled:opacity-50"
          >
            autorizar
          </button>
        </div>
      </div>
    </main>
  );
}
