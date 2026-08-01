import "server-only";

import { cache } from "react";
import { getDb } from "@/lib/db";
import type { AdminUser } from "@/lib/types";

export const getAdminUsers = cache(async (): Promise<AdminUser[]> => {
  const rows = await getDb()`SELECT id, name, email, role, active FROM admin_users ORDER BY active DESC, role, name`;
  return rows.map((row) => ({ id: Number(row.id), name: String(row.name), email: String(row.email), role: row.role as AdminUser["role"], active: Boolean(row.active) }));
});

export const getDashboardCounts = cache(async () => {
  const sql = getDb();
  const [events, gallery, divisions, members] = await Promise.all([
    sql`SELECT COUNT(*)::int AS count FROM events`,
    sql`SELECT COUNT(*)::int AS count FROM gallery_items`,
    sql`SELECT COUNT(*)::int AS count FROM divisions WHERE active = TRUE`,
    sql`SELECT COUNT(*)::int AS count FROM board_members WHERE active = TRUE`,
  ]);
  return {
    events: Number(events[0]?.count ?? 0),
    gallery: Number(gallery[0]?.count ?? 0),
    divisions: Number(divisions[0]?.count ?? 0),
    members: Number(members[0]?.count ?? 0),
  };
});
