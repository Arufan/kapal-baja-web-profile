"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({ label = "Hapus" }: { label?: string }) {
  return <button className="admin-button admin-button--danger" type="submit" onClick={(event) => { if (!window.confirm("Hapus data ini? Tindakan ini tidak dapat dibatalkan.")) event.preventDefault(); }}><Trash2 size={15} /> {label}</button>;
}
