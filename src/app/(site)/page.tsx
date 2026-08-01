import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPin, MoveRight, ShieldCheck } from "lucide-react";
import { GalleryCard } from "@/components/site/gallery-card";
import { SectionHeading } from "@/components/site/section-heading";
import { DivisionIcon } from "@/components/site/division-icon";
import { formatCompactDate, formatEventDate } from "@/lib/format";
import { getDivisions, getEvents, getGallery, getSettings } from "@/lib/public-data";

export default async function HomePage() {
  const [settings, events, divisions, gallery] = await Promise.all([getSettings(), getEvents(), getDivisions(), getGallery()]);
  const now = new Date();
  const upcomingEvents = events.filter((event) => (event.endAt ?? event.startAt) >= now);
  const nextEvent = upcomingEvents.find((event) => event.featured) ?? upcomingEvents[0];

  return (
    <>
      <section className="hero">
        <div className="hero__terrain" aria-hidden="true"><i /><i /><i /></div>
        <div className="shell hero__grid">
          <div className="hero__copy">
            <p className="hero__eyebrow"><span>UKM</span> KELUARGA PENJELAJAH ALAM · UBHARA JAYA</p>
            <h1>{settings.heroTitle}</h1>
            <p className="hero__intro">{settings.heroSubtitle}</p>
            <div className="hero__actions">
              <Link className="button button--sun" href="/bergabung">Mulai perjalanan <ArrowRight size={18} /></Link>
              <Link className="text-link text-link--light" href="/tentang">Kenali Kapal Baja <MoveRight size={18} /></Link>
            </div>
          </div>

          <div className="hero__emblem" aria-label="Identitas UKM Kapal Baja">
            <div className="compass-orbit compass-orbit--outer"><span>U</span><span>T</span><span>S</span><span>B</span></div>
            <div className="compass-orbit compass-orbit--inner" />
            <Image src="/logo-kapal-baja.png" alt="Logo UKM Kapal Baja" width={330} height={330} priority />
            <p className="coordinate coordinate--top">06°14&apos;18&quot;S</p>
            <p className="coordinate coordinate--bottom">106°59&apos;28&quot;E</p>
          </div>
        </div>

        <div className="shell hero__basecamp">
          <div className="basecamp-label"><Compass size={18} /><span>CATATAN<br />LAPANGAN</span></div>
          {nextEvent ? (
            <>
              <div className="event-date-block">
                <strong>{formatCompactDate(nextEvent.startAt).day}</strong>
                <span>{formatCompactDate(nextEvent.startAt).month}</span>
              </div>
              <div className="basecamp-event">
                <p>KEGIATAN TERDEKAT</p><h2>{nextEvent.title}</h2>
              </div>
              <div className="basecamp-location"><MapPin size={16} /><span>{nextEvent.location}</span></div>
              <Link href={`/event/${nextEvent.slug}`} aria-label={`Lihat ${nextEvent.title}`}><ArrowRight /></Link>
            </>
          ) : <p className="basecamp-empty">Agenda baru sedang disiapkan pengurus.</p>}
        </div>
      </section>

      <section className="trail-section intro-section">
        <div className="shell">
          <SectionHeading pos="POS 01" eyebrow="TENTANG KAMI" title="Bukan sekadar naik gunung." copy="Kapal Baja adalah ruang belajar yang dibangun dari rasa ingin tahu, tanggung jawab, dan kepercayaan antaranggota." />
          <div className="intro-grid">
            <blockquote>“Alam adalah ruang kelas. Setiap perjalanan menuntut ilmu, sikap, dan kepedulian.”</blockquote>
            <div>
              <p>{settings.history}</p>
              <Link className="text-link" href="/tentang">Baca kisah organisasi <ArrowRight size={17} /></Link>
            </div>
            <div className="field-principles">
              <span><ShieldCheck size={19} /> Keselamatan</span>
              <span><Compass size={19} /> Pengetahuan</span>
              <span><MapPin size={19} /> Tanggung jawab</span>
            </div>
          </div>
        </div>
      </section>

      <section className="trail-section divisions-preview">
        <div className="shell">
          <SectionHeading pos="POS 02" eyebrow="BIDANG MINAT" title="Temukan medanmu." copy="Setiap divisi punya keterampilan, ritme, dan tantangan yang berbeda. Semuanya bertemu pada budaya belajar yang sama." />
          <div className="division-strip">
            {divisions.slice(0, 5).map((division, index) => (
              <article className="division-tile" key={division.id}>
                <div className="division-tile__top"><span>{String(index + 1).padStart(2, "0")}</span><DivisionIcon name={division.iconKey} /></div>
                <h3>{division.name}</h3><p>{division.tagline}</p>
                <Link href={`/divisi#${division.slug}`} aria-label={`Lihat divisi ${division.name}`}><ArrowRight /></Link>
              </article>
            ))}
          </div>
          <Link className="button button--outline" href="/divisi">Jelajahi semua divisi <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="trail-section upcoming-section">
        <div className="shell">
          <SectionHeading pos="POS 03" eyebrow="AGENDA LAPANGAN" title="Bersiap untuk perjalanan berikutnya." light />
          <div className="events-home">
            {upcomingEvents.slice(0, 3).map((event) => (
              <article className="event-row" key={event.id}>
                <time><strong>{formatCompactDate(event.startAt).day}</strong><span>{formatCompactDate(event.startAt).month}</span></time>
                <div><p>{formatEventDate(event.startAt, event.endAt)}</p><h3>{event.title}</h3><span><MapPin size={15} /> {event.location}</span></div>
                <Link href={`/event/${event.slug}`} aria-label={`Detail ${event.title}`}><ArrowRight /></Link>
              </article>
            ))}
            {!upcomingEvents.length && <p className="events-home__empty">Agenda baru sedang disiapkan pengurus.</p>}
          </div>
          <Link className="text-link text-link--light" href="/event">Lihat seluruh agenda <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="trail-section gallery-preview">
        <div className="shell">
          <SectionHeading pos="POS 04" eyebrow="DOKUMENTASI" title="Jejak yang kami bawa pulang." copy="Catatan visual dari latihan, perjalanan, konservasi, dan perjumpaan yang membentuk keluarga ini." />
          <div className="gallery-grid gallery-grid--preview">
            {gallery.slice(0, 3).map((item, index) => <GalleryCard key={item.id} item={item} priority={index === 0} />)}
          </div>
          <Link className="button button--dark" href="/galeri">Buka arsip kegiatan <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="join-banner">
        <div className="shell join-banner__grid">
          <div><p className="utility-label">POS TERAKHIR · BASECAMP</p><h2>Ilmu dibawa ke medan. Cerita dibawa pulang.</h2></div>
          <div><p>Datang dengan rasa ingin tahu. Pulang dengan keterampilan, cerita, dan keluarga baru.</p><Link className="button button--sun" href="/bergabung">Bergabung dengan Kapal Baja <ArrowRight size={18} /></Link></div>
        </div>
      </section>
    </>
  );
}
