import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  folder?: string;
  label?: string;
};

export function FileUpload({ value, onChange, accept = "image/*,video/*", folder = "uploads", label = "subir archivo" }: Props) {
  const [mode, setMode] = useState<"upload" | "url">(value && !value.includes("supabase") ? "url" : "upload");
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
    });
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast.success("archivo subido");
  }

  const isImage = value && /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i.test(value);

  return (
    <div className="space-y-2">
      <div className="flex gap-1 text-[10px] tracking-editorial uppercase">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-2 py-1 border ${mode === "upload" ? "bg-ink text-cream border-ink" : "border-ink/30"}`}
        >
          subir archivo
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-2 py-1 border ${mode === "url" ? "bg-ink text-cream border-ink" : "border-ink/30"}`}
        >
          pegar URL
        </button>
      </div>

      {mode === "upload" ? (
        <label className="block">
          <input
            type="file"
            accept={accept}
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:border file:border-ink/40 file:bg-cream file:text-xs file:uppercase file:tracking-editorial file:cursor-pointer hover:file:bg-ink hover:file:text-cream"
          />
          {busy && <p className="text-xs text-muted-foreground mt-1">subiendo…</p>}
        </label>
      ) : (
        <input
          placeholder="https://… (youtube, vimeo, archivo)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border border-ink/30 focus:border-cherry outline-none p-2 text-sm"
        />
      )}

      {value && (
        <div className="flex items-center gap-3">
          {isImage ? (
            <img src={value} alt="" className="w-16 h-16 object-cover border border-ink/20" />
          ) : (
            <div className="w-16 h-16 bg-silver/30 flex items-center justify-center text-[10px] uppercase tracking-editorial">archivo</div>
          )}
          <a href={value} target="_blank" rel="noreferrer" className="text-[10px] tracking-editorial uppercase text-muted-foreground hover:text-cherry truncate max-w-xs">
            {value.split("/").pop()}
          </a>
        </div>
      )}
    </div>
  );
}
