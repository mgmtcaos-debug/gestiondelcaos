import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { PostForm } from "@/components/PostForm";
import { PostMediaEditor } from "@/components/PostMediaEditor";

export const Route = createFileRoute("/admin/posts/$id")({
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  return (
    <AdminShell>
      <h1 className="font-display text-4xl mb-8">editar publicación</h1>
      <PostForm id={id} />
      <div className="max-w-3xl">
        <PostMediaEditor postId={id} />
      </div>
    </AdminShell>
  );
}
