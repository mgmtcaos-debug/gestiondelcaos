import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/caos-logo.png";

export function SiteNav() {
  const linkCls = "tracking-editorial text-[11px] uppercase hover:text-cherry transition-colors whitespace-nowrap font-sans";
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function goInicio(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(false);
    if (location.pathname !== "/") {
      navigate({ to: "/" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goContacto(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(false);
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

  const links = (
    <>
      <a href="/" onClick={goInicio} className={linkCls}>inicio</a>
      <Link to="/blog" onClick={() => setOpen(false)} className={linkCls}>blog</Link>
      <Link to="/recursos" onClick={() => setOpen(false)} className={linkCls}>recursos</Link>
      <a href="#newsletter" onClick={goContacto} className={linkCls}>contacto</a>
    </>
  );

  return (
    <header className="relative z-30 px-5 md:px-10 pt-6 pb-2">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="CAOS" className="h-7 md:h-9 w-auto" />
        </Link>
        <nav className="hidden md:flex gap-8">{links}</nav>
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "cerrar menú" : "abrir menú"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-ink/10 pt-4">
          {links}
        </nav>
      )}
    </header>
  );
}
