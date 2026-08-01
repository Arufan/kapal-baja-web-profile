"use client";

import { useEffect } from "react";
import { ExternalLink } from "lucide-react";

declare global {
  interface Window { instgrm?: { Embeds?: { process: () => void } } }
}

export function InstagramEmbed({ url, title }: { url: string; title: string }) {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.instagram.com/embed.js"]');
    if (existing) {
      window.instgrm?.Embeds?.process();
      return;
    }
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.onload = () => window.instgrm?.Embeds?.process();
    document.body.appendChild(script);
  }, [url]);

  return (
    <div className="instagram-frame">
      <blockquote className="instagram-media" data-instgrm-permalink={url} data-instgrm-version="14">
        <a href={url} target="_blank" rel="noreferrer">Lihat {title} di Instagram <ExternalLink size={14} /></a>
      </blockquote>
    </div>
  );
}
