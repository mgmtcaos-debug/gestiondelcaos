import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { ResourceForm } from "@/components/ResourceForm";

export const Route = createFileRoute("/admin/recursos/new")({
  component: () => (
    <AdminShell>
      <h1 className="font-display text-4xl mb-8">nuevo recurso</h1>
      <ResourceForm />
    </AdminShell>
  ),
});
