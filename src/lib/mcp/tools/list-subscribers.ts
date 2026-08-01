import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "list_subscribers",
  title: "Listar suscriptores",
  description: "List newsletter subscribers with their signup date. Contains personal data.",
  inputSchema: {
    limit: z.number().int().min(1).max(500).optional().describe("Max rows (default 100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("subscribers")
      .select("id,email,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 100);
    if (error) return errorResult(error.message);
    return textResult({ count: data?.length ?? 0, subscribers: data });
  },
});
