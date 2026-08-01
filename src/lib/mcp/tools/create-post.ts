import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";
import { slugify } from "@/lib/auth";

export default defineTool({
  name: "create_post",
  title: "Crear publicación",
  description: "Create a new CAOS blog post. Created as a draft unless published is true.",
  inputSchema: {
    title: z.string().trim().min(1).describe("Post title."),
    content: z.string().describe("Post body in markdown."),
    excerpt: z.string().optional().describe("Short summary shown on cards."),
    category: z.string().optional().describe("Category label."),
    slug: z.string().optional().describe("URL slug; derived from the title when omitted."),
    cover_image_url: z.string().optional().describe("Absolute URL of the cover image."),
    published: z.boolean().optional().describe("Publish immediately (default false)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("posts")
      .insert({
        title: input.title,
        slug: input.slug?.trim() || slugify(input.title),
        content: input.content ?? "",
        excerpt: input.excerpt ?? "",
        ...(input.category ? { category: input.category } : {}),
        cover_image_url: input.cover_image_url ?? null,
        published: input.published ?? false,
      })
      .select()
      .single();
    return error ? errorResult(error.message) : textResult(data);
  },
});
