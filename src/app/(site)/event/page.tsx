import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { formatCompactDate, formatEventDate } from "@/lib/format";
import { getEvents } from "@/lib/public-data";

export const metadata: Metadata = { title: "Event Mendatang", description: "Agenda kegiatan dan event UKM Kapal Baja." };

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter((event) => (event.endAt ?? event.startAt) >= new Date());
  return (
    <>
      <PageHero eyebrow="AGENDA LAPANGAN" title="Siapkan waktu. Periksa perlengkapan." intro="Informasi latihan, pendidikan, temu anggota, dan kegiatan publik yang akan datang." />
      <section className="content-section"><div className="shell event-list">
        {upcomingEvents.length ? upcomingEvents.map((event, index) => (
          <article className="event-card" key={event.id}>
            <div className="event-card__index">{String(index + 1).padStart(2, "0")}</div>
            <time><strong>{formatCompactDate(event.startAt).day}</strong><span>{formatCompactDate(event.startAt).month}</span></time>
            <div className="event-card__body"><p className="utility-label">{formatEventDate(event.startAt, event.endAt)}</p><h2>{event.title}</h2><p>{event.summary}</p><span><MapPin size={16} /> {event.location}</span></div>
            <Link href={`/event/${event.slug}`} aria-label={`Buka detail ${event.title}`}><ArrowRight /></Link>
          </article>
        )) : <div className="empty-state"><CalendarDays /><h2>Agenda sedang disiapkan.</h2><p>Kembali lagi setelah pengurus menerbitkan kegiatan berikutnya.</p></div>}
      </div></section>
    </>
  );
}
