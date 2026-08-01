import bcrypt from "bcryptjs";
import postgres from "postgres";
import { getDatabaseUrl } from "./db-url.mjs";

const databaseUrl = getDatabaseUrl();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Admin Kapal Baja";

const sql = postgres(databaseUrl, { max: 1 });
try {
  const [result] = await sql`SELECT COUNT(*)::int AS count FROM admin_users`;
  if (Number(result?.count) > 0) process.exitCode = 0;
  else {
    if (!email || !password || password.length < 12) {
      throw new Error("ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 12 karakter) wajib diatur untuk bootstrap pertama.");
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await sql`
        INSERT INTO admin_users (name, email, password_hash, role)
        VALUES (${name}, ${email}, ${passwordHash}, 'admin')
      `;
    console.log(`Created initial admin: ${email}`);
  }
} finally {
  await sql.end();
}
