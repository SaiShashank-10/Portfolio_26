"use client";
import { useEffect, useRef, useState } from "react";
import { HERO_PROJECT_INDEX } from "@/lib/data";
import { prefersReducedMotion, useReducedMotion, useInView } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function HeroProjectIndex() {
  const [active, setActive] = useState(0);
  const {ref: section, inView} = useInView<HTMLElement>(0.15);
  const tabs = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const project = HERO_PROJECT_INDEX.projects[active];
  useEffect(() => {
    const container = tabs.current,
      indicator = line.current,
      panel = detail.current;
    if (!container || !indicator || !panel) return;
    let disposed = false;
    let stop = () => {};
    const position = () => {
      const button = container.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      return button
        ? { x: button.offsetLeft, width: button.offsetWidth }
        : { x: 0, width: 0 };
    };
    const place = () => {
      const rect = position();
      indicator.style.transform = `translateX(${rect.x}px)`;
      indicator.style.width = `${rect.width}px`;
    };
    if (!indicator.style.width || prefersReducedMotion()) place();
    if (prefersReducedMotion()) {
      const observer = new ResizeObserver(place);
      observer.observe(container);
      panel.style.opacity = "1";
      panel.style.transform = "none";
      return () => observer.disconnect();
    }
    void import("gsap").then(({ gsap }) => {
      if (disposed) return;
      const move = () =>
        gsap.to(indicator, {
          ...position(),
          duration: 0.65,
          ease: "power3.out",
          overwrite: true,
        });
      move();
      const reveal = gsap.fromTo(
        panel,
        { opacity: 0, y: 9 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
      );
      const observer = new ResizeObserver(move);
      observer.observe(container);
      stop = () => {
        observer.disconnect();
        reveal.kill();
        gsap.killTweensOf(indicator);
      };
    });
    return () => {
      disposed = true;
      stop();
    };
  }, [active, reduced]);
  return (
    <section
      ref={section}
      className={`hero-project-index ${inView ? "is-in" : ""}`}
      aria-labelledby="hero-project-index-title"
    >
      <div className="project-index-inner site-container">
        <header className="project-index-label">
          <h2 id="hero-project-index-title" className="mono">
            {HERO_PROJECT_INDEX.label}
          </h2>
          <span className="project-index-caption">
            {HERO_PROJECT_INDEX.hint}
            <span aria-hidden="true"> ↘</span>
          </span>
        </header>
        <div className="project-index-content">
          <div
            ref={tabs}
            className="hero-project-tabs"
            role="tablist"
            aria-label={HERO_PROJECT_INDEX.label}
          >
            {HERO_PROJECT_INDEX.projects.map((item, index) => (
              <button
                key={item.id}
                id={`hero-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active === index}
                aria-controls="hero-project-panel"
                tabIndex={active === index ? 0 : -1}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setActive(index);
                }}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight") next = (index + 1) % 3;
                  else if (event.key === "ArrowLeft") next = (index + 2) % 3;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = 2;
                  else return;
                  event.preventDefault();
                  tabs.current
                    ?.querySelectorAll<HTMLButtonElement>("button")
                    [next].focus();
                }}
              >
                <span className="mono">{item.index}</span>
                <span className="hero-project-tab-name">{item.title}</span>
              </button>
            ))}
            <span
              ref={line}
              className="hero-project-underline"
              aria-hidden="true"
            />
          </div>
          <div
            id="hero-project-panel"
            role="tabpanel"
            aria-labelledby={`hero-tab-${project.id}`}
            className="hero-project-panel"
          >
            <div ref={detail} className="hero-project-detail">
              <p className="hero-project-kicker">{project.kicker}</p>
              <p className="hero-project-summary">{project.description}</p>
            </div>
            <a
              className="project-index-explore"
              href="#work"
              aria-label={`${HERO_PROJECT_INDEX.explore}: ${project.title}`}
              onClick={(event) => {
                event.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("select-project", { detail: project.id }),
                );
                scrollToTarget("work");
              }}
            >
              <span>{HERO_PROJECT_INDEX.explore}</span>
              <span className="project-explore-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
      <style>{`
.hero-project-index.is-in .hero-project-tabs button{animation:project-choice-enter .7s var(--ease) both}.hero-project-index.is-in .hero-project-tabs button:nth-child(2){animation-delay:70ms}.hero-project-index.is-in .hero-project-tabs button:nth-child(3){animation-delay:140ms}
@keyframes project-choice-enter{from{opacity:0;translate:0 9px}to{opacity:1;translate:0 0}}
.hero-project-index{border-block:1px solid var(--line);background:var(--paper)}
.project-index-inner{display:grid;grid-template-columns:180px minmax(0,1fr);gap:36px;padding-block:36px 40px}
.project-index-label{padding-top:12px}.project-index-label h2{font-size:10px;line-height:1.6;font-weight:400;color:var(--muted-text)}
.project-index-caption{display:block;font-family:var(--font-serif);font-style:italic;font-size:25px;letter-spacing:-.03em;margin-top:13px}.project-index-caption>span{display:inline-block;margin-left:10px;font-size:21px}
.project-index-content{min-width:0}.hero-project-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));position:relative;border-bottom:1px solid var(--line)}
.hero-project-tabs button{display:flex;align-items:baseline;gap:14px;min-width:0;text-align:left;padding:5px 16px 21px 0;min-height:64px;color:var(--muted-text);transition:color .4s var(--ease)}
.hero-project-tabs button>.mono{font-size:9px;letter-spacing:0}.hero-project-tab-name{font-size:clamp(25px,2.65vw,38px);line-height:1.15;letter-spacing:-.05em;transition:transform .5s var(--ease)}
.hero-project-tabs button[aria-selected=true]{color:var(--ink)}.hero-project-tabs button:hover .hero-project-tab-name{transform:translateY(-2px)}
.hero-project-underline{position:absolute;height:2px;background:var(--ink);bottom:-1px;left:0;pointer-events:none}
.hero-project-panel{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:36px;padding-top:23px;min-height:143px}
.hero-project-detail{min-width:0}.hero-project-kicker{font-family:var(--font-serif);font-style:italic;font-size:25px;line-height:1.2;letter-spacing:-.02em;color:var(--ink-2)}
.hero-project-summary{font-size:13px;line-height:1.7;color:var(--muted-text);max-width:680px;margin-top:9px}
.project-index-explore{display:flex;align-items:center;gap:15px;white-space:nowrap;font-size:12px;padding:8px 8px 8px 16px;border:1px solid var(--line);border-radius:99px;min-height:46px;transition:background .4s var(--ease),border-color .4s var(--ease),color .4s var(--ease)}
.project-explore-arrow{display:grid;place-items:center;width:32px;height:32px;background:white;border:1px solid var(--line);border-radius:50%;font-size:16px;transition:transform .4s var(--ease)}
.project-index-explore:is(:hover,:focus-visible){background:var(--ink);border-color:var(--ink);color:white}.project-index-explore:is(:hover,:focus-visible) .project-explore-arrow{color:var(--ink);transform:rotate(45deg)}
@media(max-width:1000px){.project-index-inner{grid-template-columns:140px minmax(0,1fr);gap:24px}.hero-project-panel{gap:20px}.hero-project-tabs button{gap:9px}.hero-project-tab-name{font-size:28px}.hero-project-panel{grid-template-columns:1fr}.project-index-explore{justify-self:start}.hero-project-detail{min-height:110px}}
@media(max-width:600px){.project-index-inner{display:block;padding-block:24px 28px}.project-index-label{display:flex;justify-content:space-between;align-items:center;padding-top:0;margin-bottom:24px}.project-index-caption{font-size:22px;margin-top:0}.hero-project-tabs button{display:block;padding:0 8px 15px 0}.hero-project-tabs button>.mono{display:block;margin-bottom:8px}.hero-project-tab-name{font-size:clamp(23px,6vw,31px)}.hero-project-panel{padding-top:20px;gap:20px}.hero-project-kicker{font-size:24px}.hero-project-summary{font-size:12px}.hero-project-detail{min-height:139px}.project-index-explore{min-height:46px}}
@media(prefers-reduced-motion:reduce){.hero-project-tab-name,.project-index-explore,.project-explore-arrow,.hero-project-tabs button{transition:none!important;transform:none!important}}
`}</style>
    </section>
  );
}
