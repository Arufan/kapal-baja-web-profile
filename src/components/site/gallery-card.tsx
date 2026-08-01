import Image from "next/image";
import { ArrowUpRight, ImageIcon, Instagram, Play } from "lucide-react";
import { getYouTubeEmbedUrl, normalizeInstagramUrl } from "@/lib/format";
import type { GalleryItem } from "@/lib/types";
import { InstagramEmbed } from "@/components/site/instagram-embed";

export function GalleryCard({ item, priority = false }: { item: GalleryItem; priority?: boolean }) {
  const year = item.eventDate ? new Intl.DateTimeFormat("id-ID", { month: "short", year: "numeric" }).format(new Date(`${item.eventDate}T12:00:00`)) : "Arsip kegiatan";

  if (item.mediaType === "instagram") {
    const url = normalizeInstagramUrl(item.mediaUrl);
    return (
      <article className="gallery-card gallery-card--embed">
        {url ? <InstagramEmbed url={url} title={item.title} /> : <MediaPlaceholder icon="instagram" />}
        <GalleryCaption item={item} meta={year} />
      </article>
    );
  }

  if (item.mediaType === "youtube") {
    const embed = getYouTubeEmbedUrl(item.mediaUrl);
    return (
      <article className="gallery-card gallery-card--video">
        <div className="gallery-card__media">
          {embed ? <iframe src={embed} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <MediaPlaceholder icon="video" />}
        </div>
        <GalleryCaption item={item} meta={year} />
      </article>
    );
  }

  return (
    <article className={`gallery-card${item.featured ? " gallery-card--featured" : ""}`}>
      <div className="gallery-card__media">
        {item.mediaUrl ? (
          <Image src={item.mediaUrl} alt={item.title} fill sizes="(max-width: 720px) 100vw, 50vw" priority={priority} unoptimized />
        ) : <MediaPlaceholder icon="image" />}
      </div>
      <GalleryCaption item={item} meta={year} />
    </article>
  );
}

function MediaPlaceholder({ icon }: { icon: "image" | "instagram" | "video" }) {
  return (
    <div className="media-placeholder">
      <span className="contour contour--one" />
      <span className="contour contour--two" />
      {icon === "instagram" ? <Instagram aria-hidden="true" /> : icon === "video" ? <Play aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
      <small>MEDIA KEGIATAN<br />SEGERA HADIR</small>
    </div>
  );
}

function GalleryCaption({ item, meta }: { item: GalleryItem; meta: string }) {
  return (
    <div className="gallery-card__caption">
      <div><span>{meta}</span><h3>{item.title}</h3><p>{item.activity}</p></div>
      {item.mediaUrl && <a href={item.mediaUrl} target="_blank" rel="noreferrer" aria-label={`Buka ${item.title}`}><ArrowUpRight size={19} /></a>}
    </div>
  );
}
