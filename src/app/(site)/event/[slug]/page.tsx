import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { formatEventDateTime } from "@/lib/format";
import { getEvents } from "@/lib/public-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = (await getEvents()).find((item) => item.slug === slug);
  return event ? { title: event.title, description: event.summary, openGraph: event.coverImageUrl ? { images: [event.coverImageUrl] } : undefined } : { title: "Event tidak ditemukan" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = (await getEvents()).find((item) => item.slug === slug);
  if (!event) notFound();
  return (
    <article className="event-detail">
      <div className="event-detail__hero">{event.coverImageUrl&&<Image className="event-detail__cover" src={event.coverImageUrl} alt="" fill priority unoptimized sizes="100vw"/>}<div className="shell"><Link href="/event" className="back-link"><ArrowLeft size={17} /> Kembali ke agenda</Link><p className="utility-label">AGENDA KAPAL BAJA</p><h1>{event.title}</h1><p>{event.summary}</p></div></div>
      <div className="shell event-detail__grid"><div className="event-detail__facts"><div><CalendarDays /><span>WAKTU</span><strong>{formatEventDateTime(event.startAt, event.endAt)}</strong></div><div><MapPin /><span>LOKASI</span><strong>{event.location}</strong></div></div><div className="event-detail__content"><p>{event.description}</p><div className="field-notice"><strong>Periksa kembali informasi kegiatan.</strong><span>Detail teknis, perlengkapan, dan titik kumpul dapat berubah mengikuti keputusan pengurus.</span></div>{event.registrationUrl ? <a className="button button--sun" href={event.registrationUrl} target="_blank" rel="noreferrer">Buka formulir pendaftaran <ArrowUpRight size={17} /></a> : <span className="button button--disabled">Pendaftaran belum dibuka</span>}</div></div>
    </article>
  );
}
