"use client";

import { useFormStatus } from "react-dom";
import { LoaderCircle, Save } from "lucide-react";

export function SubmitButton({ label = "Simpan perubahan" }: { label?: string }) {
  const { pending } = useFormStatus();
  return <button className="admin-button admin-button--primary" type="submit" disabled={pending}>{pending ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}{pending ? "Menyimpan…" : label}</button>;
}
