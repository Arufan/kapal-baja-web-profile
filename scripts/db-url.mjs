export function getDatabaseUrl() {
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
