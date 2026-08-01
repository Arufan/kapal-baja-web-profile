import "server-only";

import postgres, { type Sql } from "postgres";

const globalForDb = globalThis as unknown as { kapalBajaSql?: Sql };

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? "5432";
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  if (!host || !name || !user || password === undefined) throw new Error("Konfigurasi database belum lengkap.");
  if (!/^[a-z0-9.-]+$/i.test(host) || !/^\d{1,5}$/.test(port)) throw new Error("Host atau port database tidak valid.");
  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(name)}`;
}

export function getDb(): Sql {
  const databaseUrl = getDatabaseUrl();

  if (!globalForDb.kapalBajaSql) {
    globalForDb.kapalBajaSql = postgres(databaseUrl, {
      max: process.env.NODE_ENV === "production" ? 10 : 3,
      idle_timeout: 20,
      connect_timeout: 10,
      transform: { undefined: null },
    });
  }

  return globalForDb.kapalBajaSql;
}
