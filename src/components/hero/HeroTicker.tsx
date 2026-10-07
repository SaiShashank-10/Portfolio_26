"use client";
import { useEffect, useRef, useState } from "react";
import type { gsap } from "gsap";
import { HERO_TICKER } from "@/lib/data";
import { useReducedMotion } from "@/lib/hooks";

export default function HeroTicker() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const visible = useRef(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion();
  const stopped = useRef(false);
  stopped.current = paused || hovered || focused || reduced;

  useEffect(() => {
    if (reduced || !root.current || !track.current || !group.current) return;
    const trackElement = track.current;
    let disposed = false;
    let resize: ResizeObserver | undefined;
    const sync = () =>
      tween.current?.paused(
        stopped.current || !visible.current || document.hidden,
      );
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      sync();
    });
    observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    void import("gsap").then(async ({ gsap }) => {
      await document.fonts.ready;
      if (disposed) return;
      const build = () => {
        const width = group.current?.getBoundingClientRect().width ?? 0;
        if (!width) return;
        const progress = tween.current?.progress() ?? 0;
        tween.current?.kill();
        gsap.set(track.current, { x: 0 });
        tween.current = gsap.to(track.current, {
          x: -width,
          duration: width / 42,
          ease: "none",
          repeat: -1,
          paused: true,
        });
        tween.current.progress(progress);
        sync();
      };
      build();
      resize = new ResizeObserver(build);
      if (group.current) resize.observe(group.current);
    });
    return () => {
      disposed = true;
      observer.disconnect();
      resize?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      tween.current?.kill();
      tween.current = null;
      trackElement.style.transform = "";
    };
  }, [reduced]);

  useEffect(() => {
    tween.current?.paused(
      stopped.current || !visible.current || document.hidden,
    );
  }, [paused, hovered, focused, reduced]);

  return (
    <div
      ref={root}
      className="hero-ticker"
      role="region"
      aria-label={HERO_TICKER.label}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="ticker-heading">
        <span className="ticker-star" aria-hidden="true">
          ✳
        </span>
        <span className="mono">{HERO_TICKER.label}</span>
      </div>
      <ul className="sr-only">
        {HERO_TICKER.items.map((item) => (
          <li key={item.label}>
            {item.kind}: {item.label}
          </li>
        ))}
      </ul>
      <div className="ticker-window" aria-hidden="true">
        <div className="ticker-track" ref={track}>
          {[0, 1].map((copy) => (
            <div
              className="ticker-group"
              ref={copy === 0 ? group : undefined}
              key={copy}
            >
              {HERO_TICKER.items.map((item) => (
                <div className="ticker-item" key={item.label}>
                  <span className="ticker-kind mono">{item.kind}</span>
                  <span
                    className={`ticker-text ${item.kind === "Recognition" ? "ticker-serif" : ""}`}
                  >
                    {item.label}
                  </span>
                  <span className="ticker-dot" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="ticker-toggle"
        data-video-control
        aria-label={paused ? HERO_TICKER.resume : HERO_TICKER.pause}
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          {paused ? (
            <path d="M4 2 12 7 4 12Z" fill="currentColor" />
          ) : (
            <path d="M4 2V12M10 2V12" stroke="currentColor" strokeWidth="1.5" />
          )}
        </svg>
      </button>
      <style>{`
.hero-ticker{position:relative;display:flex;align-items:center;gap:28px;padding:26px var(--gutter);border-block:1px solid var(--line);background:var(--paper);overflow:hidden;isolation:isolate}
.ticker-heading{display:flex;gap:14px;align-items:center;flex:0 0 160px;position:relative;z-index:1}
.ticker-heading .mono{max-width:94px;font-size:9px;line-height:1.7;letter-spacing:.13em}
.ticker-star{font-size:31px;font-weight:300;color:var(--ink-2)}
.ticker-window{min-width:0;flex:1;overflow:hidden;border-left:1px solid var(--line)}
.ticker-track{display:flex;width:max-content;will-change:transform}
.ticker-group{display:flex;align-items:center;flex:none}
.ticker-item{display:grid;grid-template-columns:auto 6px;column-gap:36px;row-gap:6px;align-items:center;flex:none;padding-left:36px}
.ticker-kind{font-size:8px;letter-spacing:.12em;color:var(--muted-text)}
.ticker-text{grid-column:1;white-space:nowrap;font-size:clamp(23px,2.5vw,36px);line-height:1.15;letter-spacing:-.045em}
.ticker-serif{font-family:var(--font-serif);font-style:italic;letter-spacing:-.025em}
.ticker-dot{grid-column:2;grid-row:1/3;width:4px;height:4px;background:var(--ink);border-radius:50%;opacity:.3}
.ticker-toggle{display:grid;place-items:center;flex:none;width:44px;height:44px;border:1px solid var(--line);border-radius:50%;transition:background .35s var(--ease),color .35s var(--ease)}
.ticker-toggle:hover{background:var(--ink);color:var(--paper)}
@media(max-width:680px){.hero-ticker{gap:14px;padding-block:21px;flex-wrap:wrap}.ticker-heading{flex-basis:calc(100% - 58px);order:0}.ticker-heading .mono{max-width:none}.ticker-star{font-size:22px}.ticker-toggle{order:1}.ticker-window{order:2;flex-basis:100%;border-left:0}.ticker-item{padding-left:24px;column-gap:24px}.ticker-text{font-size:27px}}
@media(prefers-reduced-motion:reduce){.hero-ticker{flex-wrap:wrap}.ticker-window{flex-basis:100%;border:0;overflow:visible}.ticker-track{width:100%;transform:none!important;will-change:auto}.ticker-group{flex-wrap:wrap;gap:20px;width:100%}.ticker-group + .ticker-group,.ticker-toggle{display:none}.ticker-item{padding-left:0;display:block;max-width:100%}.ticker-kind,.ticker-text{display:block;white-space:normal}.ticker-kind{margin-bottom:5px}.ticker-dot{display:none}}
`}</style>
    </div>
  );
}
