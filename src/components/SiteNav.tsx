import { Link } from "@tanstack/react-router";
import logo from "@/assets/caos-logo.png";

export function SiteNav() {
  const linkCls = "tracking-editorial text-[11px] uppercase hover:text-cherry transition-colors";
  return (
    <header className="relative z-30 flex items-center justify-between px-5 md:px-10 pt-6 pb-2">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="CAOS" className="h-7 md:h-9 w-auto" />
      </Link>
      <nav className="flex gap-5 md:gap-8">
        <Link to="/" className={linkCls}>inicio</Link>
        <Link to="/blog" className={linkCls}>blog</Link>
        <Link to="/recursos" className={linkCls}>recursos</Link>
        <Link to="/contacto" className={linkCls}>contacto</Link>
      </nav>
    </header>
  );
}
