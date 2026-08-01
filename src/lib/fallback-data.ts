import type { BoardMember, Division, EventItem, GalleryItem, SiteSettings } from "@/lib/types";

export const fallbackSettings: SiteSettings = {
  heroTitle: "Jelajah lebih jauh. Pulang membawa cerita.",
  heroSubtitle: "Wadah mahasiswa Universitas Bhayangkara Jakarta Raya untuk belajar, bertumbuh, dan menjaga alam melalui kegiatan penjelajahan.",
  history: "UKM Kapal Baja tumbuh sebagai keluarga penjelajah alam di Universitas Bhayangkara Jakarta Raya. Ruang ini akan memuat perjalanan organisasi, tonggak penting, serta cerita para anggota dari masa ke masa.",
  vision: "Menjadi organisasi mahasiswa pencinta alam yang tangguh, berpengetahuan, bertanggung jawab, dan bermanfaat bagi lingkungan serta masyarakat.",
  mission: [
    "Membina keterampilan kegiatan alam bebas.",
    "Menumbuhkan kepemimpinan, solidaritas, dan rasa tanggung jawab.",
    "Mengembangkan kegiatan konservasi serta pengabdian masyarakat.",
    "Menjadi ruang belajar yang aman dan inklusif bagi seluruh anggota.",
  ],
  instagramUrl: "https://www.instagram.com/kapalbaja/",
  youtubeUrl: "https://www.youtube.com/@kapalbaja",
  email: "kapalbaja@ubharajaya.ac.id",
  whatsapp: "",
  memberFormUrl: "",
  loanFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeSi1mGoa6RDwB0uEfu8E1NTIqfhsXSMce1suyVH7f-J1o0jg/viewform?usp=send_form",
};

export const fallbackEvents: EventItem[] = [
  {
    id: 1,
    title: "Latihan Navigasi Darat",
    slug: "latihan-navigasi-darat-2026",
    summary: "Latihan dasar membaca peta, kompas, dan orientasi medan untuk anggota.",
    description: "Kegiatan latihan bersama yang membahas peta topografi, azimut, resection, serta simulasi lintasan pendek.",
    startAt: new Date("2026-08-16T07:00:00+07:00"),
    endAt: new Date("2026-08-16T16:00:00+07:00"),
    location: "Bekasi — lokasi detail menyusul",
    registrationUrl: "",
    coverImageUrl: "",
    status: "published",
    featured: true,
  },
  {
    id: 2,
    title: "Pendidikan Dasar Kapal Baja",
    slug: "pendidikan-dasar-kapal-baja-2026",
    summary: "Tahap awal pembentukan anggota baru yang tangguh, berilmu, dan bertanggung jawab.",
    description: "Rangkaian pendidikan dasar mencakup materi organisasi, teknik hidup di alam bebas, kebugaran, kerja tim, dan etika lingkungan.",
    startAt: new Date("2026-09-19T06:00:00+07:00"),
    endAt: new Date("2026-09-20T17:00:00+07:00"),
    location: "Jawa Barat — lokasi detail menyusul",
    registrationUrl: "",
    coverImageUrl: "",
    status: "published",
    featured: false,
  },
];

export const fallbackDivisions: Division[] = [
  { id: 1, name: "Gunung Hutan", slug: "gunung-hutan", tagline: "Baca medan, jaga langkah.", description: "Belajar navigasi darat, manajemen perjalanan, survival, dan teknik bergerak aman di kawasan gunung serta hutan.", coordinator: "Koordinator menyusul", iconKey: "mountain", sortOrder: 1, active: true },
  { id: 2, name: "Panjat Tebing", slug: "panjat-tebing", tagline: "Teknik, fokus, dan saling percaya.", description: "Mengembangkan kemampuan pemanjatan, penggunaan peralatan, teknik pengamanan, serta budaya keselamatan vertikal.", coordinator: "Koordinator menyusul", iconKey: "carabiner", sortOrder: 2, active: true },
  { id: 3, name: "Penelusuran Gua", slug: "penelusuran-gua", tagline: "Masuk dengan ilmu, keluar tanpa jejak.", description: "Mempelajari penelusuran horizontal dan vertikal, pemetaan, karakter lorong, serta etika konservasi kawasan karst.", coordinator: "Koordinator menyusul", iconKey: "cave", sortOrder: 3, active: true },
  { id: 4, name: "Olahraga Arus Deras", slug: "olahraga-arus-deras", tagline: "Komunikasi kuat di arus yang berubah.", description: "Berlatih membaca sungai, teknik mendayung, rescue dasar, dan pengelolaan risiko kegiatan perairan.", coordinator: "Koordinator menyusul", iconKey: "waves", sortOrder: 4, active: true },
  { id: 5, name: "Lingkungan Hidup", slug: "lingkungan-hidup", tagline: "Merawat tempat kita belajar.", description: "Menggerakkan edukasi, konservasi, kampanye minim sampah, dan kegiatan pengabdian yang berpihak pada keberlanjutan.", coordinator: "Koordinator menyusul", iconKey: "leaf", sortOrder: 5, active: true },
];

export const fallbackBoard: BoardMember[] = [
  { id: 1, name: "Nama Ketua Umum", role: "Ketua Umum", division: "Badan Pengurus Harian", period: "2026/2027", photoUrl: "", sortOrder: 1, active: true },
  { id: 2, name: "Nama Wakil Ketua", role: "Wakil Ketua", division: "Badan Pengurus Harian", period: "2026/2027", photoUrl: "", sortOrder: 2, active: true },
  { id: 3, name: "Nama Sekretaris", role: "Sekretaris", division: "Badan Pengurus Harian", period: "2026/2027", photoUrl: "", sortOrder: 3, active: true },
  { id: 4, name: "Nama Bendahara", role: "Bendahara", division: "Badan Pengurus Harian", period: "2026/2027", photoUrl: "", sortOrder: 4, active: true },
];

export const fallbackGallery: GalleryItem[] = [
  { id: 1, title: "Jejak perjalanan pertama", activity: "Dokumentasi placeholder", mediaType: "image", mediaUrl: "", eventDate: "2026-07-20", featured: true, published: true, sortOrder: 1 },
  { id: 2, title: "Latihan lintasan", activity: "Dokumentasi placeholder", mediaType: "image", mediaUrl: "", eventDate: "2026-07-06", featured: false, published: true, sortOrder: 2 },
  { id: 3, title: "Belajar simpul bersama", activity: "Dokumentasi placeholder", mediaType: "image", mediaUrl: "", eventDate: "2026-06-22", featured: false, published: true, sortOrder: 3 },
  { id: 4, title: "Cerita dari basecamp", activity: "Dokumentasi placeholder", mediaType: "image", mediaUrl: "", eventDate: "2026-06-08", featured: false, published: true, sortOrder: 4 },
];
