import type { MetadataRoute } from "next";
import { getEvents } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getSiteUrl();
  const paths = ["", "/tentang", "/pengurus", "/divisi", "/galeri", "/event", "/bergabung"];
  const staticEntries = paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: path ? "weekly" as const : "daily" as const, priority: path ? 0.8 : 1 }));
  const eventEntries = (await getEvents()).map((event) => ({ url: `${base}/event/${event.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }));
  return [...staticEntries, ...eventEntries];
}
