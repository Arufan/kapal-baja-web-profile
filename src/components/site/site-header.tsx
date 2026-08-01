"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Mountain, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";

const links = [
  ["Tentang", "/tentang"],
  ["Pengurus", "/pengurus"],
  ["Divisi", "/divisi"],
  ["Galeri", "/galeri"],
  ["Event", "/event"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => menu.current?.removeAttribute("open");
  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Link href="/" className="brand-lockup" aria-label="UKM Kapal Baja — Beranda">
          <Image src="/logo-kapal-baja.png" alt="" width={54} height={54} priority />
          <span>
            <strong>KAPAL BAJA</strong>
            <small>Keluarga Penjelajah Alam</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigasi utama">
          {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
          <Link className="nav-cta" href="/bergabung" aria-current={pathname === "/bergabung" ? "page" : undefined}>Bergabung <Mountain size={15} aria-hidden="true" /></Link>
        </nav>

        <details className="mobile-nav" ref={menu}>
          <summary aria-label="Menu utama">
            <Menu className="menu-open" aria-hidden="true" />
            <X className="menu-close" aria-hidden="true" />
          </summary>
          <nav aria-label="Navigasi seluler">
            {links.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={closeMenu}>{label}</Link>)}
            <Link href="/bergabung" aria-current={pathname === "/bergabung" ? "page" : undefined} onClick={closeMenu}>Bergabung</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
