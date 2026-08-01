"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createSession, verifyCredentials } from "@/lib/auth";

export type LoginState = { error: string };

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  });
  if (!result.success) return { error: "Isi email dan kata sandi yang valid." };

  let user;
  try {
    const requestHeaders = await headers();
    const forwarded = requestHeaders.get("x-forwarded-for")?.split(",").at(-1);
    const clientIdentity = (requestHeaders.get("x-real-ip") ?? forwarded ?? "unknown").trim().slice(0, 64);
    user = await verifyCredentials(result.data.email, result.data.password, clientIdentity);
  } catch {
    return { error: "Panel belum dapat terhubung ke database." };
  }
  if (!user) return { error: "Email atau kata sandi tidak sesuai. Percobaan berulang dari koneksi yang sama dibatasi sementara." };
  await createSession(user.id);
  redirect("/admin");
}
