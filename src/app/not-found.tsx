import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return <main className="not-found"><Compass /><p>404 · JALUR TIDAK DITEMUKAN</p><h1>Kita keluar jalur.</h1><span>Halaman yang dicari tidak tersedia atau telah dipindahkan.</span><Link className="button button--sun" href="/"><ArrowLeft size={17} /> Kembali ke beranda</Link></main>;
}
