import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { PostMediaGallery } from "@/components/PostMediaGallery";

export const Route = createFileRoute("/blog/$slug")({
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()
      .then(({ data }) => { setPost(data); setLoading(false); });
  }, [slug]);

  return (
    <div className="min-h-screen">
      <SiteNav />
      <article className="max-w-3xl mx-auto px-5 md:px-10 py-16">
        <Link to="/blog" className="text-[11px] tracking-editorial uppercase text-muted-foreground hover:text-cherry">← blog</Link>
        {loading ? (
          <p className="mt-12 text-sm text-muted-foreground">cargando…</p>
        ) : !post ? (
          <p className="mt-12 font-display text-3xl">no encontrada</p>
        ) : (
          <>
            <span className="inline-block mt-6 text-[10px] tracking-editorial uppercase bg-cherry text-cream px-2 py-1">
              {post.category}
            </span>
            <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.05]">{post.title}</h1>
            <p className="mt-3 text-[11px] tracking-editorial uppercase text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            {post.cover_image_url && (
              <img src={post.cover_image_url} alt="" className="mt-8 w-full paper-shadow" />
            )}
            <div className="mt-10 prose prose-lg max-w-none font-sans text-base leading-relaxed
              prose-headings:font-display prose-headings:text-ink
              prose-p:text-ink prose-a:text-dusty prose-strong:text-cherry">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            <PostMediaGallery postId={post.id} />
          </>
        )}
      </article>
      <SiteFooter />
    </div>
  );
}
