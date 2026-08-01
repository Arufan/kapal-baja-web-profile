import Link from "next/link";
import { Plus } from "lucide-react";

export function AdminPageHeader({ eyebrow, title, copy, addHref }: { eyebrow: string; title: string; copy: string; addHref?: string }) {
  return <header className="admin-page-header"><div><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div>{addHref && <Link className="admin-button admin-button--primary" href={addHref}><Plus size={17} /> Tambah baru</Link>}</header>;
}

export function AdminNotice({ saved, error }: { saved?: string; error?: string }) {
  if (error) return <div className="admin-notice admin-notice--error" role="alert">{decodeURIComponent(error)}</div>;
  if (saved) return <div className="admin-notice" role="status">Perubahan berhasil disimpan.</div>;
  return null;
}
