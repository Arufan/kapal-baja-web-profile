CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS admin_sessions_user_idx ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON admin_sessions(expires_at);

CREATE TABLE IF NOT EXISTS login_attempts (
  attempt_key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_until TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS login_attempts_last_idx ON login_attempts(last_attempt);

CREATE TABLE IF NOT EXISTS site_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  history TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL DEFAULT '',
  member_form_url TEXT NOT NULL DEFAULT '',
  loan_form_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ,
  location TEXT NOT NULL,
  registration_url TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS events_start_idx ON events(start_at);
CREATE INDEX IF NOT EXISTS events_status_idx ON events(status);

CREATE TABLE IF NOT EXISTS divisions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  coordinator TEXT NOT NULL DEFAULT '',
  icon_key TEXT NOT NULL DEFAULT 'mountain',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  division TEXT NOT NULL DEFAULT '',
  period TEXT NOT NULL,
  photo_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  seed_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  activity TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'instagram', 'youtube')),
  media_url TEXT NOT NULL DEFAULT '',
  event_date DATE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seed_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS gallery_published_idx ON gallery_items(published, event_date DESC);

INSERT INTO site_settings (
  id, hero_title, hero_subtitle, history, vision, mission,
  instagram_url, youtube_url, email, loan_form_url
) VALUES (
  1,
  'Jelajah lebih jauh. Pulang membawa cerita.',
  'Wadah mahasiswa Universitas Bhayangkara Jakarta Raya untuk belajar, bertumbuh, dan menjaga alam melalui kegiatan penjelajahan.',
  'UKM Kapal Baja tumbuh sebagai keluarga penjelajah alam di Universitas Bhayangkara Jakarta Raya. Ruang ini akan memuat perjalanan organisasi, tonggak penting, serta cerita para anggota dari masa ke masa.',
  'Menjadi organisasi mahasiswa pencinta alam yang tangguh, berpengetahuan, bertanggung jawab, dan bermanfaat bagi lingkungan serta masyarakat.',
  'Membina keterampilan kegiatan alam bebas.|Menumbuhkan kepemimpinan, solidaritas, dan rasa tanggung jawab.|Mengembangkan kegiatan konservasi serta pengabdian masyarakat.|Menjadi ruang belajar yang aman dan inklusif bagi seluruh anggota.',
  'https://www.instagram.com/kapalbaja/',
  'https://www.youtube.com/@kapalbaja',
  'kapalbaja@ubharajaya.ac.id',
  'https://docs.google.com/forms/d/e/1FAIpQLSeSi1mGoa6RDwB0uEfu8E1NTIqfhsXSMce1suyVH7f-J1o0jg/viewform?usp=send_form'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO divisions (name, slug, tagline, description, coordinator, icon_key, sort_order) VALUES
  ('Gunung Hutan', 'gunung-hutan', 'Baca medan, jaga langkah.', 'Belajar navigasi darat, manajemen perjalanan, survival, dan teknik bergerak aman di kawasan gunung serta hutan.', 'Koordinator menyusul', 'mountain', 1),
  ('Panjat Tebing', 'panjat-tebing', 'Teknik, fokus, dan saling percaya.', 'Mengembangkan kemampuan pemanjatan, penggunaan peralatan, teknik pengamanan, serta budaya keselamatan vertikal.', 'Koordinator menyusul', 'carabiner', 2),
  ('Penelusuran Gua', 'penelusuran-gua', 'Masuk dengan ilmu, keluar tanpa jejak.', 'Mempelajari penelusuran horizontal dan vertikal, pemetaan, karakter lorong, serta etika konservasi kawasan karst.', 'Koordinator menyusul', 'cave', 3),
  ('Olahraga Arus Deras', 'olahraga-arus-deras', 'Komunikasi kuat di arus yang berubah.', 'Berlatih membaca sungai, teknik mendayung, rescue dasar, dan pengelolaan risiko kegiatan perairan.', 'Koordinator menyusul', 'waves', 4),
  ('Lingkungan Hidup', 'lingkungan-hidup', 'Merawat tempat kita belajar.', 'Menggerakkan edukasi, konservasi, kampanye minim sampah, dan kegiatan pengabdian yang berpihak pada keberlanjutan.', 'Koordinator menyusul', 'leaf', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO events (title, slug, summary, description, start_at, end_at, location, registration_url, status, featured) VALUES
  ('Latihan Navigasi Darat', 'latihan-navigasi-darat-2026', 'Latihan dasar membaca peta, kompas, dan orientasi medan untuk anggota.', 'Kegiatan latihan bersama yang membahas peta topografi, azimut, resection, serta simulasi lintasan pendek. Detail teknis akan diumumkan pengurus.', '2026-08-16 07:00:00+07', '2026-08-16 16:00:00+07', 'Bekasi — lokasi detail menyusul', '', 'published', TRUE),
  ('Pendidikan Dasar Kapal Baja', 'pendidikan-dasar-kapal-baja-2026', 'Tahap awal pembentukan anggota baru yang tangguh, berilmu, dan bertanggung jawab.', 'Rangkaian pendidikan dasar mencakup materi organisasi, teknik hidup di alam bebas, kebugaran, kerja tim, dan etika lingkungan.', '2026-09-19 06:00:00+07', '2026-09-20 17:00:00+07', 'Jawa Barat — lokasi detail menyusul', '', 'published', FALSE),
  ('Kemah Anggota & Berbagi Cerita', 'kemah-anggota-2026', 'Ruang temu lintas angkatan untuk bertukar pengalaman dan merawat kebersamaan.', 'Kemah santai, forum cerita perjalanan, evaluasi program, dan penyusunan agenda kegiatan berikutnya.', '2026-10-10 14:00:00+07', '2026-10-11 11:00:00+07', 'Lokasi menyusul', '', 'published', FALSE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO board_members (name, role, division, period, sort_order, seed_key) VALUES
  ('Nama Ketua Umum', 'Ketua Umum', 'Badan Pengurus Harian', '2026/2027', 1, 'placeholder-ketua'),
  ('Nama Wakil Ketua', 'Wakil Ketua', 'Badan Pengurus Harian', '2026/2027', 2, 'placeholder-wakil'),
  ('Nama Sekretaris', 'Sekretaris', 'Badan Pengurus Harian', '2026/2027', 3, 'placeholder-sekretaris'),
  ('Nama Bendahara', 'Bendahara', 'Badan Pengurus Harian', '2026/2027', 4, 'placeholder-bendahara'),
  ('Nama Koordinator Operasional', 'Koordinator Operasional', 'Operasional', '2026/2027', 5, 'placeholder-operasional')
ON CONFLICT (seed_key) DO NOTHING;

INSERT INTO gallery_items (title, activity, media_type, media_url, event_date, featured, sort_order, seed_key) VALUES
  ('Jejak perjalanan pertama', 'Dokumentasi placeholder', 'image', '', '2026-07-20', TRUE, 1, 'placeholder-jejak'),
  ('Latihan lintasan', 'Dokumentasi placeholder', 'image', '', '2026-07-06', FALSE, 2, 'placeholder-lintasan'),
  ('Belajar simpul bersama', 'Dokumentasi placeholder', 'image', '', '2026-06-22', FALSE, 3, 'placeholder-simpul'),
  ('Cerita dari basecamp', 'Dokumentasi placeholder', 'image', '', '2026-06-08', FALSE, 4, 'placeholder-basecamp')
ON CONFLICT (seed_key) DO NOTHING;
