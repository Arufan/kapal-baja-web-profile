export function formatEventDate(date: Date, end?: Date | null) {
  const full = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  if (!end) return full.format(date);

  const parts = (value: Date) => Object.fromEntries(
    new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "numeric", year: "numeric", timeZone: "Asia/Jakarta" })
      .formatToParts(value)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  const start = parts(date);
  const finish = parts(end);
  if (start.day === finish.day && start.month === finish.month && start.year === finish.year) return full.format(date);

  if (start.month === finish.month && start.year === finish.year) return `${start.day}–${full.format(end)}`;
  if (start.year === finish.year) {
    const startShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", timeZone: "Asia/Jakarta" }).format(date);
    return `${startShort}–${full.format(end)}`;
  }
  return `${full.format(date)}–${full.format(end)}`;
}

export function formatCompactDate(date: Date) {
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "2-digit", timeZone: "Asia/Jakarta" }).format(date),
    month: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "Asia/Jakarta" }).format(date).toUpperCase(),
  };
}

export function formatEventDateTime(date: Date, end?: Date | null) {
  const time = (value: Date) => new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(value).replace(".", ".");
  const timeRange = end ? `${time(date)}–${time(end)}` : time(date);
  return `${formatEventDate(date, end)} · ${timeRange} WIB`;
}

export function toDateTimeLocal(date: Date | null) {
  if (!date) return "";
  const local = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export function getYouTubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    let id = "";
    const host = url.hostname.toLowerCase();
    if (["youtu.be", "www.youtu.be"].includes(host)) id = url.pathname.slice(1);
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
      id = url.searchParams.get("v") ?? "";
      if (url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] ?? "";
      if (url.pathname.startsWith("/embed/")) id = url.pathname.split("/")[2] ?? "";
    }
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

export function normalizeInstagramUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!["instagram.com", "www.instagram.com"].includes(url.hostname)) return null;
    if (!/^\/(p|reel)\/[A-Za-z0-9_-]+\/?/.test(url.pathname)) return null;
    return `https://www.instagram.com${url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`}`;
  } catch {
    return null;
  }
}
