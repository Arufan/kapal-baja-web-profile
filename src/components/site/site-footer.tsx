import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, MessageCircle, Youtube } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div className="footer-identity">
          <div className="footer-logos">
            <Image src="/logo-kapal-baja.png" alt="Logo UKM Kapal Baja" width={88} height={88} />
            <span aria-hidden="true" />
            <Image src="/logo-ubj.png" alt="Logo Universitas Bhayangkara Jakarta Raya" width={76} height={76} />
          </div>
          <p>Unit Kegiatan Mahasiswa<br />Keluarga Penjelajah Alam<br />Bhayangkara Jakarta Raya</p>
        </div>

        <div className="footer-links">
          <p className="utility-label">JALUR CEPAT</p>
          <Link href="/tentang">Tentang organisasi</Link>
          <Link href="/event">Agenda terdekat</Link>
          <Link href="/galeri">Dokumentasi kegiatan</Link>
          <Link href="/bergabung">Cara bergabung</Link>
        </div>

        <div className="footer-contact">
          <p className="utility-label">TEMUI KAMI</p>
          <a href={`mailto:${settings.email}`}><Mail size={17} /> {settings.email}</a>
          {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp <ArrowUpRight size={14} /></a>}
          <a href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={17} /> Instagram <ArrowUpRight size={14} /></a>
          <a href={settings.youtubeUrl} target="_blank" rel="noreferrer"><Youtube size={17} /> YouTube <ArrowUpRight size={14} /></a>
        </div>
      </div>
      <div className="shell footer-base">
        <span>© {new Date().getFullYear()} UKM Kapal Baja</span>
        <span>Ubhara Jaya · Bekasi, Indonesia</span>
        <Link href="/masuk">Portal pengurus</Link>
      </div>
    </footer>
  );
}
