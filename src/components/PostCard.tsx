import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  cover_image_url?: string | null;
};

export function PostCard({ post, rotate = 0 }: { post: Post; rotate?: number }) {
  const date = new Date(post.created_at).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  });
  return (
    <motion.div
      initial={{ rotate, y: 0 }}
      whileHover={{ rotate: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-card paper-shadow p-6 md:p-7"
    >
      <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
        {post.cover_image_url && (
          <img src={post.cover_image_url} alt="" className="w-full h-48 object-cover mb-4" />
        )}
        <span className="inline-block text-[10px] tracking-editorial uppercase bg-cherry text-cream px-2 py-1">
          {post.category}
        </span>
        <h3 className="font-display text-2xl md:text-3xl mt-3 leading-tight">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <p className="mt-4 text-[11px] tracking-editorial uppercase text-muted-foreground">{date}</p>
      </Link>
    </motion.div>
  );
}
