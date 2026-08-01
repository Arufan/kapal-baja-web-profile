"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { destroySession, requireAdmin, requireUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { normalizeInstagramUrl, getYouTubeEmbedUrl, slugify } from "@/lib/format";
import { deleteStoredImage, saveImage } from "@/lib/uploads";

const required = (label: string, max = 300) => z.string().trim().min(1, `${label} wajib diisi.`).max(max, `${label} terlalu panjang.`);
const httpsUrl = z.string().trim().max(2000).refine((value) => {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}, "Gunakan URL HTTPS yang valid.");
const hostUrl = (hosts: string[], pathPrefix?: string) => z.string().trim().max(2000).refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname.toLowerCase()) && (!pathPrefix || url.pathname.startsWith(pathPrefix));
  } catch { return false; }
}, "Gunakan URL HTTPS dari layanan yang diizinkan.");
const optionalUrl = z.union([z.literal(""), httpsUrl]);
const fail = (path: string, message: string): never => redirect(`${path}?error=${encodeURIComponent(message)}`);
const idValue = (formData: FormData, path: string) => {
  const raw = String(formData.get("id") ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value <= 0) fail(path, "ID data tidak valid.");
  return value;
};
const bool = (formData: FormData, key: string) => formData.get(key) === "on";
const jakartaDate = (value: string) => value ? new Date(`${value}:00+07:00`) : null;

function refreshPublic(...paths: string[]) {
  for (const path of paths) revalidatePath(path);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
}

export async function logoutAction() {
  await destroySession();
  redirect("/masuk");
}

export async function saveEventAction(formData: FormData) {
  await requireUser();
  const id = idValue(formData, "/admin/event");
  const result = z.object({
    title: required("Judul", 160), summary: required("Ringkasan", 400), description: required("Deskripsi", 5000),
    startAt: required("Waktu mulai", 30), endAt: z.string().max(30), location: required("Lokasi", 250),
    registrationUrl: optionalUrl, status: z.enum(["draft", "published"]),
  }).safeParse({
    title: formData.get("title"), summary: formData.get("summary"), description: formData.get("description"),
    startAt: formData.get("startAt"), endAt: formData.get("endAt"), location: formData.get("location"),
    registrationUrl: formData.get("registrationUrl"), status: formData.get("status"),
  });
  if (!result.success) fail("/admin/event", result.error.issues[0]?.message ?? "Periksa formulir.");
  const data = result.data!;
  const startAt = jakartaDate(data.startAt);
  const endAt = jakartaDate(data.endAt);
  if (!startAt || Number.isNaN(startAt.getTime())) return fail("/admin/event", "Waktu mulai tidak valid.");
  if (endAt && Number.isNaN(endAt.getTime())) fail("/admin/event", "Waktu selesai tidak valid.");
  if (endAt && endAt < startAt) fail("/admin/event", "Waktu selesai tidak boleh mendahului waktu mulai.");
  const sql = getDb();
  const [existing] = id ? await sql`SELECT cover_image_url FROM events WHERE id=${id}` : [];
  if (id && !existing) fail("/admin/event", "Event tidak ditemukan.");
  const previousCover = String(existing?.cover_image_url ?? "");
  let cover = previousCover;
  let uploaded = "";
  const file = formData.get("cover");
  try { if (file instanceof File && file.size) uploaded = cover = await saveImage(file); } catch (error) { fail("/admin/event", error instanceof Error ? error.message : "Gagal menyimpan gambar."); }
  const slug = `${slugify(data.title)}${id ? "" : `-${Date.now().toString(36)}`}`;
  try {
    if (id) await sql`UPDATE events SET title=${data.title}, summary=${data.summary}, description=${data.description}, start_at=${startAt}, end_at=${endAt}, location=${data.location}, registration_url=${data.registrationUrl}, cover_image_url=${cover}, status=${data.status}, featured=${bool(formData,"featured")}, updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO events (title,slug,summary,description,start_at,end_at,location,registration_url,cover_image_url,status,featured) VALUES (${data.title},${slug},${data.summary},${data.description},${startAt},${endAt},${data.location},${data.registrationUrl},${cover},${data.status},${bool(formData,"featured")})`;
  } catch (error) {
    await deleteStoredImage(uploaded);
    throw error;
  }
  if (uploaded && uploaded !== previousCover) await deleteStoredImage(previousCover);
  refreshPublic("/event");
  redirect("/admin/event?saved=1");
}

export async function deleteEventAction(formData: FormData) {
  await requireUser(); const id = idValue(formData, "/admin/event"); if (!id) fail("/admin/event", "ID event tidak valid.");
  const [deleted] = await getDb()`DELETE FROM events WHERE id=${id} RETURNING cover_image_url`;
  if (!deleted) fail("/admin/event", "Event tidak ditemukan.");
  await deleteStoredImage(String(deleted.cover_image_url ?? ""));
  refreshPublic("/event"); redirect("/admin/event?saved=1");
}

export async function saveDivisionAction(formData: FormData) {
  await requireUser(); const id = idValue(formData, "/admin/divisi");
  const result = z.object({ name: required("Nama",120), tagline: required("Tagline",180), description: required("Deskripsi",3000), coordinator: z.string().trim().max(180), iconKey: z.enum(["mountain","carabiner","cave","waves","leaf","rescue"]), sortOrder: z.coerce.number().int().min(0).max(999) }).safeParse(Object.fromEntries(formData));
  if (!result.success) fail("/admin/divisi", result.error.issues[0]?.message ?? "Periksa formulir.");
  const data = result.data!;
  const sql=getDb(); const slug=`${slugify(data.name)}${id?"":`-${Date.now().toString(36)}`}`;
  if(id) { const [updated]=await sql`UPDATE divisions SET name=${data.name},tagline=${data.tagline},description=${data.description},coordinator=${data.coordinator},icon_key=${data.iconKey},sort_order=${data.sortOrder},active=${bool(formData,"active")},updated_at=NOW() WHERE id=${id} RETURNING id`; if(!updated) fail("/admin/divisi","Divisi tidak ditemukan."); }
  else await sql`INSERT INTO divisions (name,slug,tagline,description,coordinator,icon_key,sort_order,active) VALUES (${data.name},${slug},${data.tagline},${data.description},${data.coordinator},${data.iconKey},${data.sortOrder},${bool(formData,"active")})`;
  refreshPublic("/divisi"); redirect("/admin/divisi?saved=1");
}

export async function deleteDivisionAction(formData: FormData) { await requireUser(); const id=idValue(formData,"/admin/divisi"); if(!id) fail("/admin/divisi","ID divisi tidak valid."); const [deleted]=await getDb()`DELETE FROM divisions WHERE id=${id} RETURNING id`; if(!deleted) fail("/admin/divisi","Divisi tidak ditemukan."); refreshPublic("/divisi"); redirect("/admin/divisi?saved=1"); }

export async function saveBoardMemberAction(formData: FormData) {
  await requireUser(); const id=idValue(formData,"/admin/pengurus");
  const result=z.object({name:required("Nama",160),role:required("Jabatan",160),division:z.string().trim().max(180),period:required("Periode",40),sortOrder:z.coerce.number().int().min(0).max(999)}).safeParse(Object.fromEntries(formData));
  if(!result.success) fail("/admin/pengurus",result.error.issues[0]?.message??"Periksa formulir.");
  const data = result.data!;
  const sql=getDb();
  const [existing] = id ? await sql`SELECT photo_url FROM board_members WHERE id=${id}` : [];
  if (id && !existing) fail("/admin/pengurus", "Data pengurus tidak ditemukan.");
  const previousPhoto=String(existing?.photo_url??"");
  let photo=previousPhoto; let uploaded="";
  const file=formData.get("photo"); try{if(file instanceof File&&file.size) uploaded=photo=await saveImage(file);}catch(error){fail("/admin/pengurus",error instanceof Error?error.message:"Gagal menyimpan foto.");}
  try {
    if(id) await sql`UPDATE board_members SET name=${data.name},role=${data.role},division=${data.division},period=${data.period},photo_url=${photo},sort_order=${data.sortOrder},active=${bool(formData,"active")},updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO board_members (name,role,division,period,photo_url,sort_order,active) VALUES (${data.name},${data.role},${data.division},${data.period},${photo},${data.sortOrder},${bool(formData,"active")})`;
  } catch (error) {
    await deleteStoredImage(uploaded);
    throw error;
  }
  if(uploaded&&uploaded!==previousPhoto) await deleteStoredImage(previousPhoto);
  refreshPublic("/pengurus"); redirect("/admin/pengurus?saved=1");
}

export async function deleteBoardMemberAction(formData: FormData) { await requireUser(); const id=idValue(formData,"/admin/pengurus"); if(!id) fail("/admin/pengurus","ID pengurus tidak valid."); const [deleted]=await getDb()`DELETE FROM board_members WHERE id=${id} RETURNING photo_url`; if(!deleted) fail("/admin/pengurus","Data pengurus tidak ditemukan."); await deleteStoredImage(String(deleted.photo_url??"")); refreshPublic("/pengurus"); redirect("/admin/pengurus?saved=1"); }

export async function saveGalleryAction(formData: FormData) {
  await requireUser(); const id=idValue(formData,"/admin/galeri");
  const result=z.object({title:required("Judul",180),activity:required("Kegiatan",220),mediaType:z.enum(["image","instagram","youtube"]),mediaUrl:z.string().trim().max(1000),eventDate:z.string().max(10),sortOrder:z.coerce.number().int().min(0).max(999)}).safeParse(Object.fromEntries(formData));
  if(!result.success) fail("/admin/galeri",result.error.issues[0]?.message??"Periksa formulir.");
  const data = result.data!;
  const sql=getDb();
  const [existing] = id ? await sql`SELECT media_type, media_url FROM gallery_items WHERE id=${id}` : [];
  if(id&&!existing) fail("/admin/galeri","Media galeri tidak ditemukan.");
  const previousImage=existing?.media_type==="image"?String(existing.media_url??""):"";
  let mediaUrl=data.mediaType==="image"?previousImage:data.mediaUrl;
  if(data.mediaType==="instagram" && mediaUrl && !normalizeInstagramUrl(mediaUrl)) fail("/admin/galeri","Gunakan URL post atau Reels Instagram publik.");
  if(data.mediaType==="youtube" && mediaUrl && !getYouTubeEmbedUrl(mediaUrl)) fail("/admin/galeri","URL video YouTube tidak valid.");
  const eventDate=data.eventDate||null;
  if(eventDate){const parsed=new Date(`${eventDate}T00:00:00Z`);if(!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)||Number.isNaN(parsed.getTime())||parsed.toISOString().slice(0,10)!==eventDate) fail("/admin/galeri","Tanggal kegiatan tidak valid.");}
  let uploaded=""; const file=formData.get("image"); try{if(data.mediaType==="image"&&file instanceof File&&file.size) uploaded=mediaUrl=await saveImage(file);}catch(error){fail("/admin/galeri",error instanceof Error?error.message:"Gagal menyimpan gambar.");}
  if(data.mediaType==="image"&&!mediaUrl) fail("/admin/galeri","Unggah gambar untuk media galeri ini.");
  if(data.mediaType!=="image"&&!mediaUrl) fail("/admin/galeri","URL media wajib diisi.");
  try {
    if(id) await sql`UPDATE gallery_items SET title=${data.title},activity=${data.activity},media_type=${data.mediaType},media_url=${mediaUrl},event_date=${eventDate},featured=${bool(formData,"featured")},published=${bool(formData,"published")},sort_order=${data.sortOrder},updated_at=NOW() WHERE id=${id}`;
    else await sql`INSERT INTO gallery_items (title,activity,media_type,media_url,event_date,featured,published,sort_order) VALUES (${data.title},${data.activity},${data.mediaType},${mediaUrl},${eventDate},${bool(formData,"featured")},${bool(formData,"published")},${data.sortOrder})`;
  } catch (error) {
    await deleteStoredImage(uploaded);
    throw error;
  }
  if(previousImage&&previousImage!==mediaUrl) await deleteStoredImage(previousImage);
  refreshPublic("/galeri"); redirect("/admin/galeri?saved=1");
}

export async function deleteGalleryAction(formData: FormData) { await requireUser(); const id=idValue(formData,"/admin/galeri"); if(!id) fail("/admin/galeri","ID media tidak valid."); const [deleted]=await getDb()`DELETE FROM gallery_items WHERE id=${id} RETURNING media_type,media_url`; if(!deleted) fail("/admin/galeri","Media galeri tidak ditemukan."); if(deleted.media_type==="image") await deleteStoredImage(String(deleted.media_url??"")); refreshPublic("/galeri"); redirect("/admin/galeri?saved=1"); }

export async function saveSettingsAction(formData: FormData) {
  await requireUser();
  const result=z.object({
    heroTitle:required("Judul hero",240),heroSubtitle:required("Deskripsi hero",600),history:required("Sejarah",8000),vision:required("Visi",2000),mission:required("Misi",5000),
    instagramUrl:hostUrl(["instagram.com","www.instagram.com"]),
    youtubeUrl:hostUrl(["youtube.com","www.youtube.com","m.youtube.com","youtu.be"]),
    email:z.email().max(254),
    whatsapp:z.union([z.literal(""),z.string().trim().regex(/^\d{8,15}$/, "Nomor WhatsApp harus berupa 8–15 digit dengan kode negara.")]),
    memberFormUrl:optionalUrl,
    loanFormUrl:hostUrl(["docs.google.com"],"/forms/"),
  }).safeParse(Object.fromEntries(formData));
  if(!result.success) fail("/admin/konten",result.error.issues[0]?.message??"Periksa formulir.");
  const data = result.data!;
  await getDb()`UPDATE site_settings SET hero_title=${data.heroTitle},hero_subtitle=${data.heroSubtitle},history=${data.history},vision=${data.vision},mission=${data.mission.split("\n").map(s=>s.trim()).filter(Boolean).join("|")},instagram_url=${data.instagramUrl},youtube_url=${data.youtubeUrl},email=${data.email},whatsapp=${data.whatsapp},member_form_url=${data.memberFormUrl},loan_form_url=${data.loanFormUrl},updated_at=NOW() WHERE id=1`;
  refreshPublic("/tentang","/bergabung"); redirect("/admin/konten?saved=1");
}

export async function saveAdminUserAction(formData: FormData) {
  const current=await requireAdmin(); const id=idValue(formData,"/admin/pengguna");
  const result=z.object({name:required("Nama",160),email:z.email(),role:z.enum(["admin","editor"]),password:z.string().max(200)}).safeParse(Object.fromEntries(formData));
  if(!result.success) fail("/admin/pengguna",result.error.issues[0]?.message??"Periksa formulir.");
  const data = result.data!;
  if(!id&&data.password.length<12) fail("/admin/pengguna","Kata sandi pengguna baru minimal 12 karakter.");
  if(id===current.id&&(!bool(formData,"active")||data.role!=="admin")) fail("/admin/pengguna","Anda tidak dapat menonaktifkan atau menurunkan role akun sendiri.");
  const sql=getDb();
  try{
    if(id){
      let updated;
      if(data.password){if(data.password.length<12) fail("/admin/pengguna","Kata sandi minimal 12 karakter."); const hash=await bcrypt.hash(data.password,12); [updated]=await sql`UPDATE admin_users SET name=${data.name},email=${data.email.toLowerCase()},role=${data.role},active=${bool(formData,"active")},password_hash=${hash},updated_at=NOW() WHERE id=${id} RETURNING id`;}
      else [updated]=await sql`UPDATE admin_users SET name=${data.name},email=${data.email.toLowerCase()},role=${data.role},active=${bool(formData,"active")},updated_at=NOW() WHERE id=${id} RETURNING id`;
      if(!updated) fail("/admin/pengguna","Akun tidak ditemukan.");
      if(data.password||!bool(formData,"active")) await sql`DELETE FROM admin_sessions WHERE user_id=${id}`;
    } else {const hash=await bcrypt.hash(data.password,12); await sql`INSERT INTO admin_users (name,email,password_hash,role,active) VALUES (${data.name},${data.email.toLowerCase()},${hash},${data.role},${bool(formData,"active")})`;}
  }catch(error){if(error&&typeof error==="object"&&"code" in error&&(error as {code?:string}).code==="23505") fail("/admin/pengguna","Email sudah digunakan akun lain."); throw error;}
  revalidatePath("/admin/pengguna"); redirect("/admin/pengguna?saved=1");
}

export async function deleteAdminUserAction(formData: FormData) {
  const current=await requireAdmin(); const id=idValue(formData,"/admin/pengguna"); if(!id) fail("/admin/pengguna","ID pengguna tidak valid."); if(id===current.id) fail("/admin/pengguna","Anda tidak dapat menghapus akun sendiri.");
  const sql=getDb(); const [target]=await sql`SELECT role,active FROM admin_users WHERE id=${id}`; if(!target) fail("/admin/pengguna","Akun tidak ditemukan."); if(target.role==="admin"&&target.active){const [count]=await sql`SELECT COUNT(*)::int AS count FROM admin_users WHERE role='admin' AND active=TRUE`; if(Number(count?.count)<=1) fail("/admin/pengguna","Administrator aktif terakhir tidak dapat dihapus.");}
  const [deleted]=await sql`DELETE FROM admin_users WHERE id=${id} RETURNING id`; if(!deleted) fail("/admin/pengguna","Akun tidak ditemukan."); revalidatePath("/admin/pengguna"); redirect("/admin/pengguna?saved=1");
}
