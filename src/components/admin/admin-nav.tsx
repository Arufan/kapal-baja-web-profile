"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, FileText, Images, LayoutDashboard, Shield, UsersRound } from "lucide-react";

const links = [
  ["Ringkasan", "/admin", LayoutDashboard],
  ["Event", "/admin/event", CalendarDays],
  ["Galeri", "/admin/galeri", Images],
  ["Divisi", "/admin/divisi", Compass],
  ["Pengurus", "/admin/pengurus", UsersRound],
  ["Konten", "/admin/konten", FileText],
  ["Pengguna", "/admin/pengguna", Shield],
] as const;

export function AdminNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="admin-nav" aria-label="Navigasi panel pengurus">
      {links.filter(([label]) => isAdmin || label !== "Pengguna").map(([label, href, Icon]) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} aria-current={active ? "page" : undefined}><Icon size={18} /><span>{label}</span></Link>;
      })}
    </nav>
  );
}
