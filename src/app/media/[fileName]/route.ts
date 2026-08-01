import { readFile } from "node:fs/promises";
import path from "node:path";
import { safeMediaPath } from "@/lib/uploads";

const contentTypes: Record<string, string> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

export async function GET(_request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  const filePath = safeMediaPath(fileName);
  if (!filePath) return new Response("Not found", { status: 404 });
  try {
    const body = await readFile(filePath);
    return new Response(body, { headers: { "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
