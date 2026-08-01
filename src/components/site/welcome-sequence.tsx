"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const introKey = "kapal-baja-welcome-seen";

export function WelcomeSequence() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [visible, setVisible] = useState(isHome);
  const skipButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let hasPlayed = false;
    try {
      hasPlayed = window.sessionStorage.getItem(introKey) === "1";
    } catch {
      hasPlayed = false;
    }

    const shouldPlay = isHome
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      && !hasPlayed;

    if (shouldPlay) {
      document.documentElement.classList.remove("welcome-suppressed");
      try {
        window.sessionStorage.setItem(introKey, "1");
      } catch {
        // The intro can still run when storage is unavailable.
      }
    } else {
      document.documentElement.classList.add("welcome-suppressed");
    }

    const visibilityFrame = window.requestAnimationFrame(() => setVisible(shouldPlay));
    return () => window.cancelAnimationFrame(visibilityFrame);
  }, [isHome]);

  useEffect(() => {
    if (!visible || !isHome || document.documentElement.classList.contains("welcome-suppressed")) return;

    const siteFrame = document.querySelector<HTMLElement>(".public-site__frame");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    siteFrame?.setAttribute("inert", "");
    siteFrame?.setAttribute("aria-hidden", "true");
    document.body.classList.add("welcome-active");

    const dismiss = () => setVisible(false);
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
      if (event.key === "Tab") {
        event.preventDefault();
        skipButton.current?.focus();
      }
    };
    const handlePreference = () => {
      if (!motionPreference.matches) return;
      document.documentElement.classList.add("welcome-suppressed");
      dismiss();
    };

    document.addEventListener("keydown", handleKeydown);
    motionPreference.addEventListener("change", handlePreference);
    const focusFrame = window.requestAnimationFrame(() => skipButton.current?.focus());
    const timer = window.setTimeout(dismiss, 3900);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeydown);
      motionPreference.removeEventListener("change", handlePreference);
      siteFrame?.removeAttribute("inert");
      siteFrame?.removeAttribute("aria-hidden");
      document.body.classList.remove("welcome-active");
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus();
    };
  }, [isHome, visible]);

  if (!visible || !isHome) return null;

  return (
    <div className="welcome-sequence" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="welcome-sequence__grid" aria-hidden="true" />
      <div className="welcome-sequence__topline" aria-hidden="true">
        <span>FIELD UNIT / INITIALIZING</span>
        <span>06°14&apos;18&quot;S · 106°59&apos;28&quot;E</span>
      </div>
      <div className="welcome-sequence__core">
        <div className="welcome-sequence__mark" aria-hidden="true">
          <span />
          <Image src="/logo-kapal-baja.png" alt="" width={118} height={118} priority />
        </div>
        <p>UKM KAPAL BAJA · UBHARA JAYA</p>
        <h2 id="welcome-title"><span>SELAMAT</span><span>DATANG</span></h2>
        <div className="welcome-sequence__progress" aria-hidden="true"><i /></div>
        <div className="welcome-sequence__status" aria-hidden="true">
          <span>ORIENTASI MEDAN</span><strong>SELALU SIAP SEDIA</strong><span>AKSES 01</span>
        </div>
      </div>
      <button ref={skipButton} type="button" onClick={() => setVisible(false)}>Lewati intro</button>
    </div>
  );
}
