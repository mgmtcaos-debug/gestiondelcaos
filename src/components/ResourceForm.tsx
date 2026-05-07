import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ResourceForm({ id }: { id?: string }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", file_url: "", cover_image_url: "",
    requires_email: false, published: false,
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("resources").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({
        title: data.title, description: data.description, file_url: data.file_url,
        cover_image_url: data.cover_image_url ?? "",
        requires_email: data.requires_email, published: data.published,
      });
      setLoading(false);
    });
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, cover_image_url: form.cover_image_url || null };
    const res = id
      ? await supabase.from("resources").update(payload).eq("id", id)
      : await supabase.from("resources").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("guardado");
    navigate({ to: "/admin/recursos" });
  }

  if (loading) return <p className="text-sm text-muted-foreground">cargando…</p>;

  const inp = "w-full mt-1 bg-transparent border border-ink/30 focus:border-cherry outline-none p-2 text-sm";
  const lbl = "text-[11px] tracking-editorial uppercase";

  return (
    <form onSubmit={save} className="space-y-5 max-w-3xl">
      <div>
        <label className={lbl}>título</label>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} />
      </div>
      <div>
        <label className={lbl}>descripción</label>
        <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inp} />
      </div>
      <div>
        <label className={lbl}>URL del archivo</label>
        <input required value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} className={inp} />
      </div>
      <div>
        <label className={lbl}>imagen de portada (URL)</label>
        <input value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className={inp} />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.requires_email} onChange={(e) => setForm({ ...form, requires_email: e.target.checked })} />
          requiere email
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
          publicar
        </label>
      </div>
      <div className="flex gap-3">
        <button disabled={saving} className="bg-ink text-cream px-5 py-2 text-xs uppercase tracking-editorial hover:bg-cherry disabled:opacity-50">
          guardar
        </button>
        <button type="button" onClick={() => navigate({ to: "/admin/recursos" })} className="border border-ink px-5 py-2 text-xs uppercase tracking-editorial">
          cancelar
        </button>
      </div>
    </form>
  );
}
