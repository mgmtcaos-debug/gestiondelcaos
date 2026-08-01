import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_posts",
  title: "Listar publicaciones",
  description: "List blog posts of CAOS, optionally filtered by published state or category.",
  inputSchema: {
    published: z.boolean().optional().describe("Filter by published state."),
    category: z.string().optional().describe("Filter by category."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ published, category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    let query = supabaseForUser(ctx)
      .from("posts")
      .select("id,title,slug,category,excerpt,published,created_at,updated_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (typeof published === "boolean") query = query.eq("published", published);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    return error ? errorResult(error.message) : textResult(data);
  },
});
