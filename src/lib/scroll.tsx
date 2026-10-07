"use client";
import { useEffect, type ReactNode } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion } from "./hooks";
let engine: Lenis | undefined;
let scrollLocked = false;
export function scrollToTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (engine && !prefersReducedMotion())
    engine.scrollTo(el, { offset: id === "hero" ? 0 : -90, duration: 1.15 });
  else
    el.scrollIntoView({
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
}
export function lockScroll(locked: boolean) {
  scrollLocked = locked;
  if (locked) engine?.stop();
  else engine?.start();
}
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    let disposed = false;
    let generation = 0;
    const q = matchMedia("(prefers-reduced-motion: reduce)");
    const configure = async () => {
      const currentGeneration = ++generation;
      engine?.destroy();
      engine = undefined;
      if (q.matches) return;
      const { default: Lenis } = await import("lenis");
      if (disposed || q.matches || currentGeneration !== generation) return;
      engine = new Lenis({
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        anchors: false,
      });
      if (scrollLocked) engine.stop();
    };
    void configure();
    const anchors = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!link || link.classList.contains("skip-link")) return;
      const id = link.hash.slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToTarget(id);
    };
    document.addEventListener("click", anchors);
    q.addEventListener("change", configure);
    return () => {
      disposed = true;
      q.removeEventListener("change", configure);
      document.removeEventListener("click", anchors);
      engine?.destroy();
      engine = undefined;
    };
  }, []);
  return children;
}
