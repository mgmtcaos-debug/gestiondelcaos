import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/caos-logo.png";

export function SiteNav() {
  const linkCls = "tracking-editorial text-[11px] uppercase hover:text-cherry transition-colors whitespace-nowrap font-sans";
  const location = useLocation();
  const navigate = useNavigate();

  function goInicio(e: React.MouseEvent) {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate({ to: "/" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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

  return (
    <header className="relative z-30 flex items-center justify-between gap-3 px-5 md:px-10 pt-6 pb-2">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img src={logo} alt="CAOS" className="h-7 md:h-9 w-auto" />
      </Link>
      <nav className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar -mx-2 px-2">
        <a href="/" onClick={goInicio} className={linkCls}>inicio</a>
        <Link to="/blog" className={linkCls}>blog</Link>
        <Link to="/recursos" className={linkCls}>recursos</Link>
        <a href="#newsletter" onClick={goContacto} className={linkCls}>contacto</a>
      </nav>
    </header>
  );
}
