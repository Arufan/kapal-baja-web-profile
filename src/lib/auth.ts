import "server-only";

import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import type { AdminUser } from "@/lib/types";

const COOKIE_NAME = "kapal_baja_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const DUMMY_PASSWORD_HASH = "$2b$12$Vi8VK69MxZZn0E4fIr4D4eK5Ybcth4Mzr3SwUgQ5gdVzyySdvfoCO";
let lastAttemptCleanup = 0;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function verifyCredentials(emailValue: string, password: string, clientIdentity: string): Promise<AdminUser | null> {
  const email = emailValue.trim().toLowerCase();
  const attemptKey = createHash("sha256").update(`${email}\0${clientIdentity}`).digest("hex");
  const sql = getDb();
  const [row] = await sql`SELECT id, name, email, role, active, password_hash FROM admin_users WHERE email = ${email}`;

  if (!row) {
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    return null;
  }

  if (Date.now() - lastAttemptCleanup > 60 * 60 * 1000) {
    await sql`DELETE FROM login_attempts WHERE last_attempt < NOW() - INTERVAL '24 hours'`;
    lastAttemptCleanup = Date.now();
  }
  const [attempt] = await sql`SELECT attempts, locked_until FROM login_attempts WHERE attempt_key = ${attemptKey}`;
  if (attempt?.locked_until && new Date(String(attempt.locked_until)) > new Date()) return null;

  const valid = Boolean(row.active) && await bcrypt.compare(password, String(row.password_hash));

  if (!valid) {
    await sql`
      INSERT INTO login_attempts (attempt_key, attempts, last_attempt, locked_until)
      VALUES (${attemptKey}, 1, NOW(), NULL)
      ON CONFLICT (attempt_key) DO UPDATE SET
        attempts = CASE WHEN login_attempts.last_attempt < NOW() - INTERVAL '15 minutes' THEN 1 ELSE login_attempts.attempts + 1 END,
        last_attempt = NOW(),
        locked_until = CASE
          WHEN login_attempts.last_attempt < NOW() - INTERVAL '15 minutes' THEN NULL
          WHEN login_attempts.attempts >= 4 THEN NOW() + INTERVAL '15 minutes'
          ELSE login_attempts.locked_until
        END
    `;
    return null;
  }

  await sql`DELETE FROM login_attempts WHERE attempt_key = ${attemptKey}`;
  return { id: Number(row.id), name: String(row.name), email: String(row.email), role: row.role as AdminUser["role"], active: true };
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  const sql = getDb();
  await sql`DELETE FROM admin_sessions WHERE expires_at < NOW()`;
  await sql`INSERT INTO admin_sessions (token_hash, user_id, expires_at) VALUES (${tokenHash}, ${userId}, ${expiresAt})`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
    priority: "high",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    const sql = getDb();
    await sql`DELETE FROM admin_sessions WHERE token_hash = ${hashToken(token)}`;
  }
  cookieStore.delete(COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const sql = getDb();
  const [row] = await sql`
    SELECT u.id, u.name, u.email, u.role, u.active
    FROM admin_sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)} AND s.expires_at > NOW() AND u.active = TRUE
  `;
  if (!row) return null;
  return { id: Number(row.id), name: String(row.name), email: String(row.email), role: row.role as AdminUser["role"], active: true };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
