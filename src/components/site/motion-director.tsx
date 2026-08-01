"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const revealGroups = [
  [".trail-section", "trail"],
  [".section-heading", "heading"],
  [".page-hero__inner > *", "heading"],
  [".intro-grid > *", "copy"],
  [".division-tile", "card"],
  [".event-row", "row"],
  [".gallery-card", "card"],
  [".join-banner__grid > *", "copy"],
  [".history-grid > *", "copy"],
  [".vision-grid > *", "copy"],
  [".values-grid article", "card"],
  [".division-detail", "row"],
  [".board-card", "card"],
  [".event-card", "row"],
  [".join-option", "card"],
  [".contact-grid > *", "copy"],
  [".event-detail__facts, .event-detail__content", "copy"],
] as const;

export function MotionDirector() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observed = new Set<HTMLElement>();
    const reveal = (element: HTMLElement) => element.classList.add("is-in-view");

    for (const [selector, kind] of revealGroups) {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        if (observed.has(element)) return;
        observed.add(element);
        element.dataset.motionReveal = kind;
        element.style.setProperty("--motion-delay", `${Math.min(index, 5) * 65}ms`);
      });
    }

    let observer: IntersectionObserver | null = null;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let active = false;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const parallaxEnabled = finePointer && window.innerWidth > 860;

    const renderParallax = () => {
      frame = 0;
      const mobileFactor = parallaxEnabled ? 1 : 0;
      const scroll = Math.min(window.scrollY, 1200);
      const x = pointerX * mobileFactor;
      const y = pointerY * mobileFactor;

      root.style.setProperty("--parallax-near", `${scroll * 0.07 * mobileFactor}px`);
      root.style.setProperty("--parallax-far", `${scroll * 0.032 * mobileFactor}px`);
      root.style.setProperty("--pointer-x", `${x}px`);
      root.style.setProperty("--pointer-y", `${y}px`);
      root.style.setProperty("--pointer-x-reverse", `${x * -0.55}px`);
      root.style.setProperty("--pointer-y-reverse", `${y * -0.55}px`);
    };

    const scheduleParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(renderParallax);
    };

    const handlePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 18;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 14;
      scheduleParallax();
    };

    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      scheduleParallax();
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target instanceof HTMLElement
        ? event.target.closest<HTMLElement>("[data-motion-reveal]")
        : null;
      if (!target) return;
      reveal(target);
      observer?.unobserve(target);
    };

    const startMotion = () => {
      if (active) return;
      active = true;
      observed.forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 1.05 && bounds.bottom > 0) reveal(element);
      });
      root.classList.add("motion-enabled");

      observer = "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              reveal(entry.target as HTMLElement);
              observer?.unobserve(entry.target);
            });
          }, { threshold: 0.01, rootMargin: "0px 0px -7% 0px" })
        : null;

      observed.forEach((element) => {
        if (element.classList.contains("is-in-view")) return;
        if (observer) observer.observe(element);
        else reveal(element);
      });
      document.addEventListener("focusin", handleFocus, true);
      if (parallaxEnabled) {
        window.addEventListener("scroll", scheduleParallax, { passive: true });
        window.addEventListener("resize", scheduleParallax, { passive: true });
        window.addEventListener("pointermove", handlePointer, { passive: true });
        document.documentElement.addEventListener("mouseleave", resetPointer);
        scheduleParallax();
      }
    };

    const stopMotion = () => {
      if (!active) return;
      active = false;
      observer?.disconnect();
      observer = null;
      document.removeEventListener("focusin", handleFocus, true);
      if (parallaxEnabled) {
        window.removeEventListener("scroll", scheduleParallax);
        window.removeEventListener("resize", scheduleParallax);
        window.removeEventListener("pointermove", handlePointer);
        document.documentElement.removeEventListener("mouseleave", resetPointer);
      }
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      observed.forEach(reveal);
      root.classList.remove("motion-enabled");
      root.style.setProperty("--parallax-near", "0px");
      root.style.setProperty("--parallax-far", "0px");
      root.style.setProperty("--pointer-x", "0px");
      root.style.setProperty("--pointer-y", "0px");
      root.style.setProperty("--pointer-x-reverse", "0px");
      root.style.setProperty("--pointer-y-reverse", "0px");
    };

    const syncPreference = () => motionPreference.matches ? stopMotion() : startMotion();
    motionPreference.addEventListener("change", syncPreference);
    syncPreference();

    return () => {
      motionPreference.removeEventListener("change", syncPreference);
      stopMotion();
    };
  }, [pathname]);

  return null;
}
