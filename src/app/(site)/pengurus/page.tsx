import type { Metadata } from "next";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { getBoardMembers } from "@/lib/public-data";

export const metadata: Metadata = { title: "Struktur Pengurus", description: "Struktur kepengurusan UKM Kapal Baja." };

export default async function BoardPage() {
  const members = await getBoardMembers();
  const period = members[0]?.period ?? "Periode berjalan";
  return (
    <>
      <PageHero eyebrow={`PENGURUS · ${period}`} title="Menjaga arah, merawat keluarga." intro="Pengurus mengelola latihan, komunikasi, peralatan, administrasi, dan ruang belajar agar setiap kegiatan berjalan terarah." />
      <section className="content-section"><div className="shell">
        <div className="board-period"><span>PERIODE AKTIF</span><strong>{period}</strong><p>Nama dan foto saat ini berupa placeholder hingga data resmi dilengkapi.</p></div>
        <div className="board-grid">{members.map((member, index) => <article className={index === 0 ? "board-card board-card--lead" : "board-card"} key={member.id}><div className="board-card__photo">{member.photoUrl ? <Image src={member.photoUrl} alt={member.name} fill sizes="(max-width: 720px) 100vw, 33vw" unoptimized /> : <><UserRound /><span>FOTO<br />MENYUSUL</span></>}</div><div><span>{member.division}</span><h2>{member.name}</h2><p>{member.role}</p></div></article>)}</div>
      </div></section>
    </>
  );
}
