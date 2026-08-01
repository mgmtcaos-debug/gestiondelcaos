import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_resources",
  title: "Listar recursos",
  description: "List the free downloadable resources of CAOS.",
  inputSchema: {
    published: z.boolean().optional().describe("Filter by published state."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ published, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    let query = supabaseForUser(ctx)
      .from("resources")
      .select("id,title,description,file_url,cover_image_url,requires_email,published,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (typeof published === "boolean") query = query.eq("published", published);
    const { data, error } = await query;
    return error ? errorResult(error.message) : textResult(data);
  },
});
