import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, BookOpen, Download, Mail } from "lucide-react";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  function goContacto(e: React.MouseEvent) {
    e.preventDefault();
    const scroll = () => {
      const el = document.getElementById("newsletter");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    };
    if (location.pathname !== "/") {
      navigate({ to: "/" });
      setTimeout(scroll, 250);
    } else scroll();
  }

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const item = "flex flex-col items-center justify-center gap-1 flex-1 py-2 text-[10px] tracking-editorial uppercase";
  const activeColor = "text-cherry";
  const inactive = "text-ink";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream border-t border-ink/15"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-stretch">
        <Link to="/" className={`${item} ${isActive("/") ? activeColor : inactive}`}>
          <Home className="w-5 h-5" />
          <span>inicio</span>
        </Link>
        <Link to="/blog" className={`${item} ${isActive("/blog") ? activeColor : inactive}`}>
          <BookOpen className="w-5 h-5" />
          <span>blog</span>
        </Link>
        <Link to="/recursos" className={`${item} ${isActive("/recursos") ? activeColor : inactive}`}>
          <Download className="w-5 h-5" />
          <span>recursos</span>
        </Link>
        <a href="#newsletter" onClick={goContacto} className={`${item} ${inactive}`}>
          <Mail className="w-5 h-5" />
          <span>contacto</span>
        </a>
      </div>
    </nav>
  );
}
