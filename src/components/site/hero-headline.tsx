"use client";

import { useEffect, useMemo, useState } from "react";

const rotatingWords = ["Cerita", "Pengalaman", "Pelajaran", "Kenangan", "Dokumentasi"] as const;

type TypingFrame = {
  wordIndex: number;
  characterCount: number;
  deleting: boolean;
  firstHold: boolean;
};

function getHeadlinePrefix(title: string) {
  const cleanTitle = title.trim();
  const storyEnding = cleanTitle.match(/^(.*)\s+cerita[.!?]?$/i);
  if (storyEnding?.[1]) return storyEnding[1];

  const lastSpace = cleanTitle.lastIndexOf(" ");
  return lastSpace > 0 ? cleanTitle.slice(0, lastSpace) : cleanTitle;
}

export function HeroHeadline({ title }: { title: string }) {
  const prefix = useMemo(() => getHeadlinePrefix(title), [title]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [frame, setFrame] = useState<TypingFrame>({
    wordIndex: 0,
    characterCount: rotatingWords[0].length,
    deleting: false,
    firstHold: true,
  });

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(motionPreference.matches);
      if (motionPreference.matches) {
        setFrame({ wordIndex: 0, characterCount: rotatingWords[0].length, deleting: false, firstHold: true });
      }
    };
    const preferenceFrame = window.requestAnimationFrame(syncPreference);
    motionPreference.addEventListener("change", syncPreference);

    return () => {
      window.cancelAnimationFrame(preferenceFrame);
      motionPreference.removeEventListener("change", syncPreference);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const word = rotatingWords[frame.wordIndex];
    const isComplete = frame.characterCount === word.length;
    const isEmpty = frame.characterCount === 0;
    const delay = isComplete && !frame.deleting
      ? frame.firstHold ? 5600 : 1750
      : isEmpty && frame.deleting
        ? 280
        : frame.deleting
          ? 48
          : 82;

    const timer = window.setTimeout(() => {
      setFrame((current) => {
        const currentWord = rotatingWords[current.wordIndex];
        if (!current.deleting && current.characterCount === currentWord.length) {
          return { ...current, deleting: true, firstHold: false };
        }
        if (current.deleting && current.characterCount === 0) {
          return {
            wordIndex: (current.wordIndex + 1) % rotatingWords.length,
            characterCount: 0,
            deleting: false,
            firstHold: false,
          };
        }
        return {
          ...current,
          characterCount: current.characterCount + (current.deleting ? -1 : 1),
        };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [frame, reducedMotion]);

  const activeWord = rotatingWords[frame.wordIndex];
  const typedWord = activeWord.slice(0, frame.characterCount);
  const accessibleTitle = `${prefix} ${rotatingWords.join(", ")}`;

  return (
    <h1
      className="hero-title"
      aria-label={accessibleTitle}
    >
      <span aria-hidden="true">{prefix}</span>
      <span className="hero-title__rotator" aria-hidden="true">
        <span>{typedWord || "\u00a0"}</span>
        <i />
      </span>
    </h1>
  );
}
