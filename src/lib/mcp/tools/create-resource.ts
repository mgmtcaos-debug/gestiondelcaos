import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, supabaseForUser, textResult } from "../supabase";

export default defineTool({
  name: "create_resource",
  title: "Crear recurso",
  description: "Create a downloadable CAOS resource pointing at an already hosted file URL.",
  inputSchema: {
    title: z.string().trim().min(1),
    file_url: z.string().min(1).describe("Absolute URL of the downloadable file."),
    description: z.string().optional(),
    cover_image_url: z.string().optional(),
    requires_email: z.boolean().optional().describe("Ask visitors for their email before download."),
    published: z.boolean().optional().describe("Publish immediately (default false)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return errorResult("Not authenticated");
    const { data, error } = await supabaseForUser(ctx)
      .from("resources")
      .insert({
        title: input.title,
        file_url: input.file_url,
        description: input.description ?? "",
        cover_image_url: input.cover_image_url ?? null,
        requires_email: input.requires_email ?? false,
        published: input.published ?? false,
      })
      .select()
      .single();
    return error ? errorResult(error.message) : textResult(data);
  },
});
