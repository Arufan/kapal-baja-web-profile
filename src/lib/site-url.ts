import "server-only";

import { headers } from "next/headers";

export async function getSiteUrl() {
  const configured = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (configured) {
    try {
      const url = new URL(configured);
      const allowedProtocol = process.env.NODE_ENV === "production" ? url.protocol === "https:" : ["http:", "https:"].includes(url.protocol);
      if (!allowedProtocol || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error();
      return url.origin;
    } catch {
      throw new Error("SITE_URL harus berupa origin HTTPS yang valid tanpa path.");
    }
  }
  if (process.env.NODE_ENV === "production") throw new Error("SITE_URL wajib diatur pada production.");
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  if (!/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host)) return "http://localhost:3000";
  return `http://${host}`;
}
