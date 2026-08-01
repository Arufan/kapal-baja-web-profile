import "server-only";

import { cache } from "react";
import { getDb } from "@/lib/db";
import { fallbackBoard, fallbackDivisions, fallbackEvents, fallbackGallery, fallbackSettings } from "@/lib/fallback-data";
import type { BoardMember, Division, EventItem, GalleryItem, SiteSettings } from "@/lib/types";

function date(value: unknown) {
  return value instanceof Date ? value : new Date(String(value));
}

function dateOnly(value: unknown) {
  const parsed = date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const sql = getDb();
    const [row] = await sql`SELECT * FROM site_settings WHERE id = 1`;
    if (!row) return fallbackSettings;
    return {
      heroTitle: String(row.hero_title), heroSubtitle: String(row.hero_subtitle), history: String(row.history),
      vision: String(row.vision), mission: String(row.mission).split("|").filter(Boolean), instagramUrl: String(row.instagram_url),
      youtubeUrl: String(row.youtube_url), email: String(row.email), whatsapp: String(row.whatsapp),
      memberFormUrl: String(row.member_form_url), loanFormUrl: String(row.loan_form_url),
    };
  } catch (error) {
    console.warn("Menggunakan pengaturan fallback:", error instanceof Error ? error.message : error);
    return fallbackSettings;
  }
});

export const getEvents = cache(async (includeDrafts = false): Promise<EventItem[]> => {
  try {
    const sql = getDb();
    const rows = includeDrafts
      ? await sql`SELECT * FROM events ORDER BY start_at ASC`
      : await sql`SELECT * FROM events WHERE status = 'published' ORDER BY start_at ASC`;
    return rows.map((row) => ({
      id: Number(row.id), title: String(row.title), slug: String(row.slug), summary: String(row.summary),
      description: String(row.description), startAt: date(row.start_at), endAt: row.end_at ? date(row.end_at) : null,
      location: String(row.location), registrationUrl: String(row.registration_url), coverImageUrl: String(row.cover_image_url),
      status: row.status as EventItem["status"], featured: Boolean(row.featured),
    }));
  } catch (error) {
    console.warn("Menggunakan event fallback:", error instanceof Error ? error.message : error);
    return fallbackEvents;
  }
});

export const getDivisions = cache(async (includeInactive = false): Promise<Division[]> => {
  try {
    const sql = getDb();
    const rows = includeInactive
      ? await sql`SELECT * FROM divisions ORDER BY sort_order, name`
      : await sql`SELECT * FROM divisions WHERE active = TRUE ORDER BY sort_order, name`;
    return rows.map((row) => ({
      id: Number(row.id), name: String(row.name), slug: String(row.slug), tagline: String(row.tagline),
      description: String(row.description), coordinator: String(row.coordinator), iconKey: String(row.icon_key),
      sortOrder: Number(row.sort_order), active: Boolean(row.active),
    }));
  } catch (error) {
    console.warn("Menggunakan divisi fallback:", error instanceof Error ? error.message : error);
    return fallbackDivisions;
  }
});

export const getBoardMembers = cache(async (includeInactive = false): Promise<BoardMember[]> => {
  try {
    const sql = getDb();
    const rows = includeInactive
      ? await sql`SELECT * FROM board_members ORDER BY period DESC, sort_order, name`
      : await sql`SELECT * FROM board_members WHERE active = TRUE ORDER BY period DESC, sort_order, name`;
    return rows.map((row) => ({
      id: Number(row.id), name: String(row.name), role: String(row.role), division: String(row.division),
      period: String(row.period), photoUrl: String(row.photo_url), sortOrder: Number(row.sort_order), active: Boolean(row.active),
    }));
  } catch (error) {
    console.warn("Menggunakan pengurus fallback:", error instanceof Error ? error.message : error);
    return fallbackBoard;
  }
});

export const getGallery = cache(async (includeUnpublished = false): Promise<GalleryItem[]> => {
  try {
    const sql = getDb();
    const rows = includeUnpublished
      ? await sql`SELECT * FROM gallery_items ORDER BY sort_order, event_date DESC NULLS LAST, created_at DESC`
      : await sql`SELECT * FROM gallery_items WHERE published = TRUE ORDER BY sort_order, event_date DESC NULLS LAST, created_at DESC`;
    return rows.map((row) => ({
      id: Number(row.id), title: String(row.title), activity: String(row.activity), mediaType: row.media_type as GalleryItem["mediaType"],
      mediaUrl: String(row.media_url), eventDate: row.event_date ? dateOnly(row.event_date) : null,
      featured: Boolean(row.featured), published: Boolean(row.published), sortOrder: Number(row.sort_order),
    }));
  } catch (error) {
    console.warn("Menggunakan galeri fallback:", error instanceof Error ? error.message : error);
    return fallbackGallery;
  }
});
