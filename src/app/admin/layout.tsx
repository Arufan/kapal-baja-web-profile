import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/app/admin/actions";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Panel Pengurus", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href="/admin"><Image src="/logo-kapal-baja.png" alt="" width={54} height={54} /><span><strong>KAPAL BAJA</strong><small>PANEL PENGURUS</small></span></Link><AdminNav isAdmin={user.role === "admin"} /><div className="admin-user"><span>{user.name.slice(0,2).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.role}</small></div></div></aside><div className="admin-workspace"><header className="admin-topbar"><p>Basecamp digital · Ubhara Jaya</p><div><Link href="/" target="_blank">Lihat website <ArrowUpRight size={15} /></Link><form action={logoutAction}><button type="submit"><LogOut size={16} /> Keluar</button></form></div></header><main className="admin-main">{children}</main></div></div>;
}
