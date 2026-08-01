import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "update_post",
  title: "Editar publicación",
  description: "Update fields of an existing CAOS blog post, identified by its slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Slug of the post to update."),
    title: z.string().optional(),
    content: z.string().optional().describe("New markdown body."),
    excerpt: z.string().optional(),
    category: z.string().optional(),
    new_slug: z.string().optional().describe("Change the slug."),
    cover_image_url: z.string().optional(),
    published: z.boolean().optional().describe("Publish or unpublish."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug, new_slug, ...fields }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) patch[key] = value;
    }
    if (new_slug) patch.slug = new_slug;
    const { data, error } = await supabaseForUser(ctx)
      .from("posts")
      .update(patch)
      .eq("slug", slug)
      .select()
      .maybeSingle();
    if (error) return errorResult(error.message);
    if (!data) return errorResult(`No post found with slug "${slug}"`);
    return textResult(data);
  },
});
