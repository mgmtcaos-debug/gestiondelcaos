import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { ResourceForm } from "@/components/ResourceForm";

export const Route = createFileRoute("/admin/recursos/$id")({
  component: EditResource,
});

function EditResource() {
  const { id } = Route.useParams();
  return (
    <AdminShell>
      <h1 className="font-display text-4xl mb-8">editar recurso</h1>
      <ResourceForm id={id} />
    </AdminShell>
  );
}
