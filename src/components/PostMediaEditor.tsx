import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from "./FileUpload";

type Media = {
  id?: string;
  media_type: "image" | "video";
  url: string;
  caption: string | null;
  sort_order: number;
  _new?: boolean;
  _deleted?: boolean;
};

export function PostMediaEditor({ postId }: { postId: string }) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("post_media").select("*").eq("post_id", postId).order("sort_order")
      .then(({ data }) => {
        setItems((data ?? []) as Media[]);
        setLoading(false);
      });
  }, [postId]);

  function add(type: "image" | "video") {
    setItems((prev) => [...prev, { media_type: type, url: "", caption: "", sort_order: prev.length, _new: true }]);
  }

  function update(i: number, patch: Partial<Media>) {
    setItems((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  function remove(i: number) {
    setItems((prev) => {
      const next = [...prev];
      const it = next[i];
      if (it.id) next[i] = { ...it, _deleted: true };
      else next.splice(i, 1);
      return next;
    });
  }

  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const visible = prev.filter((m) => !m._deleted);
      const target = visible[i + dir];
      if (!target) return prev;
      const it = visible[i];
      const a = prev.indexOf(it);
      const b = prev.indexOf(target);
      const next = [...prev];
      [next[a], next[b]] = [next[b], next[a]];
      return next.map((m, idx) => ({ ...m, sort_order: idx }));
    });
  }

  async function saveAll() {
    const toDelete = items.filter((m) => m._deleted && m.id).map((m) => m.id!);
    const toInsert = items
      .filter((m) => !m._deleted && !m.id && m.url)
      .map((m, i) => ({ post_id: postId, media_type: m.media_type, url: m.url, caption: m.caption || null, sort_order: i }));
    const toUpdate = items.filter((m) => !m._deleted && m.id);

    if (toDelete.length) await supabase.from("post_media").delete().in("id", toDelete);
    for (const m of toUpdate) {
      await supabase.from("post_media").update({
        media_type: m.media_type, url: m.url, caption: m.caption, sort_order: m.sort_order,
      }).eq("id", m.id!);
    }
    if (toInsert.length) await supabase.from("post_media").insert(toInsert);

    const { data } = await supabase.from("post_media").select("*").eq("post_id", postId).order("sort_order");
    setItems((data ?? []) as Media[]);
    toast.success("media guardada");
  }

  if (loading) return <p className="text-sm text-muted-foreground">cargando media…</p>;
  const visible = items.filter((m) => !m._deleted);
  const inp = "w-full bg-transparent border border-ink/30 focus:border-cherry outline-none p-2 text-sm";

  return (
    <div className="border-t border-silver/60 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl">media</h3>
        <div className="flex gap-2">
          <button type="button" onClick={() => add("image")} className="text-[11px] uppercase tracking-editorial border border-ink/40 px-3 py-1 hover:bg-ink hover:text-cream">+ imagen</button>
          <button type="button" onClick={() => add("video")} className="text-[11px] uppercase tracking-editorial border border-ink/40 px-3 py-1 hover:bg-ink hover:text-cream">+ video</button>
        </div>
      </div>
      <div className="space-y-3">
        {visible.length === 0 && <p className="text-xs text-muted-foreground italic">sin media todavía.</p>}
        {visible.map((m, i) => {
          const idx = items.indexOf(m);
          return (
            <div key={m.id ?? `new-${idx}`} className="border border-ink/20 p-3 grid md:grid-cols-[1fr_auto] gap-3 items-start">
              <div className="space-y-2">
                <select value={m.media_type} onChange={(e) => update(idx, { media_type: e.target.value as any })} className={inp}>
                  <option value="image">imagen</option>
                  <option value="video">video (youtube/vimeo/mp4)</option>
                </select>
                <FileUpload
                  value={m.url}
                  onChange={(url) => update(idx, { url })}
                  accept={m.media_type === "image" ? "image/*" : "video/*"}
                  folder={`posts/${postId}`}
                />
                <input placeholder="caption (opcional)" value={m.caption ?? ""} onChange={(e) => update(idx, { caption: e.target.value })} className={inp} />
              </div>
              <div className="flex md:flex-col gap-1">
                <button type="button" onClick={() => move(i, -1)} className="text-xs px-2 py-1 border border-ink/30">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="text-xs px-2 py-1 border border-ink/30">↓</button>
                <button type="button" onClick={() => remove(idx)} className="text-xs px-2 py-1 border border-cherry text-cherry">×</button>
              </div>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={saveAll} className="mt-4 bg-ink text-cream px-4 py-2 text-xs uppercase tracking-editorial hover:bg-cherry">
        guardar media
      </button>
    </div>
  );
}
