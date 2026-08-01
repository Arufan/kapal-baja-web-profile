import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { DivisionIcon } from "@/components/site/division-icon";
import { getDivisions } from "@/lib/public-data";

export const metadata: Metadata = { title: "Divisi", description: "Bidang minat dan keterampilan di UKM Kapal Baja." };

export default async function DivisionsPage() {
  const divisions = await getDivisions();
  return (
    <>
      <PageHero eyebrow="BIDANG MINAT" title="Banyak medan, satu keluarga." intro="Pilih bidang yang membuatmu penasaran. Pelajari tekniknya, pahami risikonya, lalu bertumbuh bersama tim." />
      <section className="content-section"><div className="shell division-list">
        {divisions.map((division, index) => (
          <article id={division.slug} key={division.id} className="division-detail">
            <div className="division-detail__number">{String(index + 1).padStart(2, "0")}</div>
            <div className="division-detail__icon"><DivisionIcon name={division.iconKey} size={46} /></div>
            <div><p className="utility-label">{division.tagline}</p><h2>{division.name}</h2><p>{division.description}</p><span>Koordinator · {division.coordinator || "Menyusul"}</span></div>
          </article>
        ))}
      </div></section>
    </>
  );
}
