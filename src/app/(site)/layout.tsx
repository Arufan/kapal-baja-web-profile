import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { MotionDirector } from "@/components/site/motion-director";
import { WelcomeSequence } from "@/components/site/welcome-sequence";
import { getSettings } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <div className="public-site">
      <WelcomeSequence />
      <div className="public-site__frame">
        <a className="skip-link" href="#konten">Lewati ke konten</a>
        <MotionDirector />
        <SiteHeader />
        <main id="konten">{children}</main>
        <SiteFooter settings={settings} />
      </div>
    </div>
  );
}
