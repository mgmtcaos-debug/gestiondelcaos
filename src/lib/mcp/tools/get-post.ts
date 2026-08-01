import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "get_post",
  title: "Ver publicación",
  description: "Get one blog post by slug, including its full markdown content and attached media.",
  inputSchema: { slug: z.string().min(1).describe("The post slug.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const supabase = supabaseForUser(ctx);
    const { data: post, error } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
    if (error) return errorResult(error.message);
    if (!post) return errorResult(`No post found with slug "${slug}"`);
    const { data: media } = await supabase
      .from("post_media")
      .select("id,url,media_type,caption,sort_order")
      .eq("post_id", post.id)
      .order("sort_order");
    return textResult({ ...post, media: media ?? [] });
  },
});
