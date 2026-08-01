# UKM Kapal Baja — Website Profil

Website resmi Unit Kegiatan Mahasiswa Keluarga Penjelajah Alam Bhayangkara Jakarta Raya. Aplikasi mencakup website publik, event dan galeri dinamis, embed Instagram/YouTube, upload gambar, serta panel pengurus multiakun.

## Fitur

- Beranda, profil, divisi, struktur pengurus, event, galeri, dan halaman bergabung.
- Panel pengurus untuk CRUD event, galeri, divisi, struktur, dan konten utama.
- Akun `admin` dan `editor` dengan sesi tersimpan di database.
- Upload JPG, PNG, WebP, atau AVIF hingga 10 MB.
- Embed post/Reels Instagram publik dan video YouTube.
- PostgreSQL, migrasi otomatis, health check, serta deployment Docker Compose.

## Menjalankan secara lokal

Persyaratan: Node.js 22.13+, pnpm 11.9, dan PostgreSQL.

```bash
cp .env.example .env
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Untuk pengembangan lokal, sesuaikan `DATABASE_URL` dengan PostgreSQL Anda. Ubah seluruh nilai rahasia pada `.env` sebelum migrasi pertama. Akun administrator awal hanya dibuat ketika tabel pengguna masih kosong, sehingga akun bootstrap yang sudah dihapus tidak muncul kembali saat aplikasi restart.

## Validasi

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Deployment Docker

Salin `.env.example` menjadi `.env`, lalu isi:

- `POSTGRES_PASSWORD` dengan kata sandi acak yang kuat.
- `ADMIN_EMAIL` dan `ADMIN_PASSWORD` untuk akun bootstrap pertama.
- `SITE_URL` dengan origin domain HTTPS tanpa path, misalnya `https://kapalbaja.example.id`.

Pastikan jaringan proxy tersedia, lalu jalankan:

```bash
docker network create proxy-net
docker compose up -d --build
```

Perintah pembuatan jaringan cukup dijalankan sekali; abaikan pesan jika jaringan sudah ada. Service web tidak membuka port host. Container bergabung ke jaringan eksternal `proxy-net` agar dapat diteruskan melalui Nginx Proxy Manager dengan upstream `kapal-baja-web:3000`. Volume `kapal_baja_postgres` menyimpan database dan `kapal_baja_uploads` menyimpan media unggahan.

Setelah login pertama, ganti kata sandi dari panel pengguna. `ADMIN_PASSWORD` dapat dikosongkan dari `.env` setelah minimal satu akun admin tersimpan; restart berikutnya tidak membutuhkan kredensial bootstrap.

## Keamanan operasional

- Jangan commit file `.env` atau membagikan kata sandi melalui issue/repository.
- Buat akun terpisah untuk setiap pengurus dan nonaktifkan akun lama.
- Gunakan HTTPS pada domain produksi.
- Atur rate limit pada reverse proxy untuk jalur `/masuk` dan pastikan proxy menimpa header `X-Real-IP`.
- Cadangkan volume PostgreSQL dan media secara berkala.
