import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { PostForm } from "@/components/PostForm";

export const Route = createFileRoute("/admin/posts/new")({
  component: () => (
    <AdminShell>
      <h1 className="font-display text-4xl mb-8">nueva publicación</h1>
      <PostForm />
    </AdminShell>
  ),
});
