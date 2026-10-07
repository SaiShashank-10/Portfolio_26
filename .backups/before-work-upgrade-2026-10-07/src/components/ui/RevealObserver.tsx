"use client";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
export default function RevealObserver() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    document.querySelectorAll(".rv,.rv-mask").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight)
        el.classList.add("rv-pending");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return null;
}
