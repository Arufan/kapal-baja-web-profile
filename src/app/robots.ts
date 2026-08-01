import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = await getSiteUrl();
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/masuk"] }], sitemap: `${base}/sitemap.xml` };
}
