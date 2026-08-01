import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

export function getUploadDir() {
  return path.join(process.cwd(), "data", "uploads");
}

export async function saveImage(file: File) {
  if (!file.size) return "";
  if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 10 MB.");
  const extension = allowedTypes.get(file.type);
  if (!extension) throw new Error("Format gambar harus JPG, PNG, WebP, atau AVIF.");

  const contents = Buffer.from(await file.arrayBuffer());
  if (!hasValidSignature(contents, file.type)) throw new Error("Isi file tidak sesuai dengan format gambar yang dipilih.");

  const directory = getUploadDir();
  await mkdir(directory, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  await writeFile(path.join(directory, fileName), contents, { flag: "wx" });
  return `/media/${fileName}`;
}

function hasValidSignature(buffer: Buffer, type: string) {
  if (type === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (type === "image/png") return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if (type === "image/webp") return buffer.length > 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (type === "image/avif") return buffer.length > 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp" && ["avif", "avis"].includes(buffer.subarray(8, 12).toString("ascii"));
  return false;
}

export function safeMediaPath(fileName: string) {
  if (!/^[0-9]+-[a-f0-9-]+\.(jpg|jpeg|png|webp|avif)$/i.test(fileName)) return null;
  const directory = getUploadDir();
  const resolved = path.resolve(directory, fileName);
  return resolved.startsWith(`${directory}${path.sep}`) ? resolved : null;
}

export async function deleteStoredImage(mediaUrl: string | null | undefined) {
  const match = mediaUrl?.match(/^\/media\/([^/?#]+)$/);
  if (!match) return;
  const target = safeMediaPath(match[1]);
  if (!target) return;
  try {
    await unlink(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Gagal membersihkan file media terkelola.", error);
    }
  }
}
