import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Handshake, Leaf, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { getSettings } from "@/lib/public-data";

export const metadata: Metadata = { title: "Tentang", description: "Sejarah, visi, misi, dan nilai UKM Kapal Baja." };

export default async function AboutPage() {
  const settings = await getSettings();
  const values = [
    [ShieldCheck, "Selamat sebelum hebat", "Setiap keputusan lapangan dimulai dari pengetahuan, persiapan, dan keberanian untuk berhenti bila kondisi tidak aman."],
    [BookOpen, "Belajar tanpa putus", "Keterampilan alam bebas terus berkembang melalui latihan, evaluasi, berbagi pengalaman, dan sikap rendah hati."],
    [Handshake, "Bergerak sebagai tim", "Perjalanan mengajarkan kepercayaan, komunikasi, dan tanggung jawab terhadap setiap orang di dalam kelompok."],
    [Leaf, "Tinggalkan dampak baik", "Kami menghormati ruang yang dijelajahi dan berusaha memberi manfaat bagi lingkungan serta masyarakat."],
  ] as const;
  return (
    <>
      <PageHero eyebrow="PROFIL ORGANISASI" title="Keluarga yang tumbuh di perjalanan." intro="Kapal Baja membentuk mahasiswa yang mampu membaca medan, bekerja dalam tim, dan bertanggung jawab pada alam." />
      <section className="content-section"><div className="shell">
        <SectionHeading pos="01" eyebrow="SEJARAH" title="Dari basecamp, menuju banyak kemungkinan." />
        <div className="history-grid"><div className="history-emblem"><Image src="/logo-kapal-baja.png" alt="Logo UKM Kapal Baja" width={270} height={270} /><span>ARSIP ORGANISASI<br />AKAN DILENGKAPI</span></div><div className="prose-large"><p>{settings.history}</p><p className="placeholder-note">Arsip sejarah organisasi sedang dihimpun dari catatan dan cerita lintas angkatan.</p></div></div>
      </div></section>
      <section className="content-section content-section--pine"><div className="shell vision-grid">
        <div><p className="utility-label">VISI</p><h2>{settings.vision}</h2></div>
        <div><p className="utility-label">MISI</p><ol>{settings.mission.map((mission, index) => <li key={mission}><span>{String(index + 1).padStart(2, "0")}</span><p>{mission}</p></li>)}</ol></div>
      </div></section>
      <section className="content-section"><div className="shell">
        <SectionHeading pos="02" eyebrow="NILAI LAPANGAN" title="Prinsip yang ikut dalam setiap langkah." />
        <div className="values-grid">{values.map(([Icon, title, copy]) => <article key={title}><Icon /><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>
    </>
  );
}
