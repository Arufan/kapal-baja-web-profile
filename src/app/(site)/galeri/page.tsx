import type { Metadata } from "next";
import { GalleryCard } from "@/components/site/gallery-card";
import { PageHero } from "@/components/site/page-hero";
import { getGallery } from "@/lib/public-data";

export const metadata: Metadata = { title: "Galeri Kegiatan", description: "Dokumentasi kegiatan dan perjalanan UKM Kapal Baja." };

export default async function GalleryPage() {
  const gallery = await getGallery();
  return (
    <>
      <PageHero eyebrow="ARSIP PERJALANAN" title="Cerita yang tertinggal dalam gambar." intro="Foto, video, dan catatan sosial dari latihan, ekspedisi, konservasi, serta kehidupan di basecamp." />
      <section className="content-section"><div className="shell">
        <div className="gallery-note"><span>CATATAN</span><p>Arsip foto kegiatan sedang dihimpun dan akan ditampilkan secara bertahap.</p></div>
        <div className="gallery-grid">{gallery.map((item, index) => <GalleryCard key={item.id} item={item} priority={index < 2} />)}</div>
      </div></section>
    </>
  );
}
