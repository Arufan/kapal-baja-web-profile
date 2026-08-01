import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Portal Pengurus", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  let user = null;
  try { user = await getCurrentUser(); } catch { /* Form displays connection errors. */ }
  if (user) redirect("/admin");
  return <main className="login-page"><div className="login-page__brand"><div className="login-terrain" aria-hidden="true" /><Link href="/"><ArrowLeft size={17} /> Kembali ke website</Link><div><Image src="/logo-kapal-baja.png" alt="Logo UKM Kapal Baja" width={150} height={150} priority /><p>PORTAL PENGURUS</p><h1>Kelola kabar dari basecamp.</h1><span>Event, galeri, divisi, struktur, dan informasi organisasi dalam satu tempat.</span></div></div><div className="login-page__panel"><div><p className="utility-label">AKSES TERBATAS</p><h2>Masuk</h2><span>Gunakan akun yang dibuat oleh administrator Kapal Baja.</span><LoginForm /><small>Masalah akses? Hubungi administrator organisasi.</small></div></div></main>;
}
