import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Media = { id: string; media_type: string; url: string; caption: string | null; sort_order: number };

function getEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch {}
  return null;
}

export function PostMediaGallery({ postId }: { postId: string }) {
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    supabase.from("post_media").select("*").eq("post_id", postId).order("sort_order")
      .then(({ data }) => setMedia((data ?? []) as Media[]));
  }, [postId]);

  if (media.length === 0) return null;

  return (
    <div className="mt-12 space-y-8">
      {media.map((m) => {
        if (m.media_type === "video") {
          const embed = getEmbed(m.url);
          return (
            <figure key={m.id}>
              {embed ? (
                <div className="relative aspect-video paper-shadow">
                  <iframe src={embed} className="absolute inset-0 w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
                </div>
              ) : (
                <video src={m.url} controls className="w-full paper-shadow" />
              )}
              {m.caption && <figcaption className="mt-2 text-[11px] tracking-editorial uppercase text-muted-foreground">{m.caption}</figcaption>}
            </figure>
          );
        }
        return (
          <figure key={m.id}>
            <img src={m.url} alt={m.caption ?? ""} className="w-full paper-shadow" />
            {m.caption && <figcaption className="mt-2 text-[11px] tracking-editorial uppercase text-muted-foreground">{m.caption}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}
