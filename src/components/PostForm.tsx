import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/auth";
import { toast } from "sonner";

const CATS = ["cultura", "plata", "creatividad", "sin filtro"];

export function PostForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", category: "cultura", excerpt: "", content: "",
    cover_image_url: "", published: false,
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("posts").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({
        title: data.title, slug: data.slug, category: data.category,
        excerpt: data.excerpt, content: data.content,
        cover_image_url: data.cover_image_url ?? "", published: data.published,
      });
      setLoading(false);
    });
  }, [id]);

  function update<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "title" && !id && !form.slug) setForm((f) => ({ ...f, slug: slugify(String(v)) }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title), cover_image_url: form.cover_image_url || null };
    const res = id
      ? await supabase.from("posts").update(payload).eq("id", id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("guardado");
    navigate({ to: "/admin/posts" });
  }

  if (loading) return <p className="text-sm text-muted-foreground">cargando…</p>;

  const inp = "w-full mt-1 bg-transparent border border-ink/30 focus:border-cherry outline-none p-2 text-sm";
  const lbl = "text-[11px] tracking-editorial uppercase";

  return (
    <form onSubmit={save} className="space-y-5 max-w-3xl">
      <div>
        <label className={lbl}>título</label>
        <input required value={form.title} onChange={(e) => update("title", e.target.value)} className={inp} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={lbl}>slug</label>
          <input value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className={inp} />
        </div>
        <div>
          <label className={lbl}>categoría</label>
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inp}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className={lbl}>imagen de portada (URL)</label>
        <input value={form.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} className={inp} />
      </div>
      <div>
        <label className={lbl}>extracto</label>
        <textarea rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} className={inp} />
      </div>
      <div>
        <label className={lbl}>contenido (markdown)</label>
        <textarea rows={14} value={form.content} onChange={(e) => update("content", e.target.value)} className={inp + " font-mono"} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
        publicar
      </label>
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-cream px-5 py-2 text-xs uppercase tracking-editorial hover:bg-cherry disabled:opacity-50">
          guardar
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/posts" })} className="border border-ink px-5 py-2 text-xs uppercase tracking-editorial">
          cancelar
        </button>
      </div>
    </form>
  );
}
