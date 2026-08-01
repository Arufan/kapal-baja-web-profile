import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";
import { getDatabaseUrl } from "./db-url.mjs";

const databaseUrl = getDatabaseUrl();

const sql = postgres(databaseUrl, { max: 1 });
const migrationsDir = path.join(process.cwd(), "db", "migrations");

try {
  const files = (await fs.readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();
  await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(1262576465, 1111572801)`;
    await tx`CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    for (const file of files) {
      const [existing] = await tx`SELECT version FROM schema_migrations WHERE version = ${file}`;
      if (existing) continue;
      const source = await fs.readFile(path.join(migrationsDir, file), "utf8");
      await tx.unsafe(source);
      await tx`INSERT INTO schema_migrations (version) VALUES (${file}) ON CONFLICT DO NOTHING`;
      console.log(`Applied migration: ${file}`);
    }
  });
} finally {
  await sql.end();
}
