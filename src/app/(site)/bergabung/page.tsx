import type { Metadata } from "next";
import { ArrowUpRight, Instagram, Mail, MessageCircle, PackageOpen, UserPlus, Youtube } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getSettings } from "@/lib/public-data";

export const metadata: Metadata = { title: "Bergabung & Kontak", description: "Cara bergabung, peminjaman alat, dan kontak UKM Kapal Baja." };

export default async function JoinPage() {
  const settings = await getSettings();
  const loanEmbedUrl = new URL(settings.loanFormUrl);
  loanEmbedUrl.search = "";
  loanEmbedUrl.searchParams.set("embedded", "true");
  return (
    <>
      <PageHero eyebrow="MULAI DARI SINI" title="Datang sebagai teman. Bertumbuh sebagai keluarga." intro="Tidak perlu menjadi ahli alam bebas untuk mulai. Yang dibutuhkan adalah rasa ingin tahu, komitmen belajar, dan kemauan menjaga tim." />
      <section className="content-section"><div className="shell join-options">
        <article className="join-option join-option--primary"><UserPlus /><p className="utility-label">ANGGOTA BARU</p><h2>Pendaftaran anggota</h2><p>Formulir resmi sedang disiapkan. Hubungi pengurus atau pantau Instagram untuk jadwal penerimaan berikutnya.</p>{settings.memberFormUrl ? <a className="button button--dark" href={settings.memberFormUrl} target="_blank" rel="noreferrer">Buka formulir <ArrowUpRight size={17} /></a> : <span className="status-chip">FORM SEGERA HADIR</span>}</article>
        <article className="join-option"><PackageOpen /><p className="utility-label">LAYANAN BASECAMP</p><h2>Pinjam alat outdoor</h2><p>Ajukan kebutuhan perlengkapan melalui formulir. Ketersediaan dan persetujuan akan dikonfirmasi pengurus.</p><a className="button button--outline" href={settings.loanFormUrl} target="_blank" rel="noreferrer">Form peminjaman alat <ArrowUpRight size={17} /></a></article>
      </div></section>
      <section className="content-section content-section--pine"><div className="shell contact-grid"><div><p className="utility-label">KONTAK</p><h2>Ada yang ingin ditanyakan?</h2><p>Hubungi kanal resmi kami untuk informasi kegiatan, kolaborasi, atau kunjungan ke basecamp.</p></div><div className="contact-links"><a href={`mailto:${settings.email}`}><Mail /><span><small>EMAIL</small>{settings.email}</span><ArrowUpRight /></a>{settings.whatsapp&&<a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /><span><small>WHATSAPP</small>{settings.whatsapp}</span><ArrowUpRight /></a>}<a href={settings.instagramUrl} target="_blank" rel="noreferrer"><Instagram /><span><small>INSTAGRAM</small>@kapalbaja</span><ArrowUpRight /></a><a href={settings.youtubeUrl} target="_blank" rel="noreferrer"><Youtube /><span><small>YOUTUBE</small>Kapal Baja</span><ArrowUpRight /></a></div></div></section>
      <section className="form-embed-section"><div className="shell"><div className="form-embed-heading"><span>FORM AKTIF</span><h2>Peminjaman alat outdoor</h2><a href={settings.loanFormUrl} target="_blank" rel="noreferrer">Buka di tab baru <ArrowUpRight size={15} /></a></div><iframe src={loanEmbedUrl.toString()} title="Form peminjaman alat outdoor Kapal Baja" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" sandbox="allow-forms allow-scripts allow-same-origin allow-popups">Memuat formulir…</iframe></div></section>
    </>
  );
}
