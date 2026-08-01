import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/manrope";
import "@fontsource-variable/saira/wdth.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UKM Kapal Baja — Universitas Bhayangkara Jakarta Raya",
    template: "%s — UKM Kapal Baja",
  },
  description: "Website resmi UKM Keluarga Penjelajah Alam Bhayangkara Jakarta Raya: profil, kegiatan, galeri, dan informasi keanggotaan.",
  keywords: ["Kapal Baja", "UKM", "pencinta alam", "Ubhara Jaya", "outdoor", "mahasiswa"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "UKM Kapal Baja",
    title: "UKM Kapal Baja — Jelajah lebih jauh",
    description: "Keluarga Penjelajah Alam Bhayangkara Jakarta Raya.",
    images: [{ url: "/og.png", width: 1732, height: 909, alt: "UKM Kapal Baja — Jelajah lebih jauh" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/logo-kapal-baja.png", apple: "/logo-kapal-baja.png" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body>
        <Script id="welcome-preflight" strategy="beforeInteractive">{`
          try {
            if (sessionStorage.getItem("kapal-baja-welcome-seen") === "1" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
              document.documentElement.classList.add("welcome-suppressed");
            }
          } catch (_) {}
        `}</Script>
        {children}
      </body>
    </html>
  );
}
