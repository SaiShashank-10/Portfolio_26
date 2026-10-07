"use client";
import { useEffect, useRef, useState } from "react";
import { COPY, PROJECTS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";
import ProjectIllustration from "../ui/ProjectIllustration";

export default function Work() {
  const [active, setActive] = useState(PROJECTS[0].id);
  const indexRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const index = indexRef.current,
      marker = markerRef.current;
    if (!index || !marker) return;
    const update = () => {
      const selected = index.querySelector<HTMLButtonElement>(
        '[aria-pressed="true"]',
      );
      if (!selected) return;
      marker.style.width = `${selected.offsetWidth}px`;
      marker.style.transform = `translateX(${selected.offsetLeft}px)`;
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(index);
    return () => observer.disconnect();
  }, [active]);
  const activeIndex = PROJECTS.findIndex((project) => project.id === active);
  const advance = (direction: number) =>
    setActive(
      PROJECTS[(activeIndex + direction + PROJECTS.length) % PROJECTS.length]
        .id,
    );
  useEffect(() => {
    const select = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (PROJECTS.some((p) => p.id === id)) setActive(id);
    };
    window.addEventListener("select-project", select);
    return () => window.removeEventListener("select-project", select);
  }, []);
  return (
    <section
      id="work"
      className="section work site-container"
      aria-labelledby="work-title"
    >
      <div className="work-header">
        <SectionHeading section="work" />
        <div className="work-browse">
          <span className="mono" aria-live="polite">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(PROJECTS.length).padStart(2, "0")}
          </span>
          <button
            className="round-control"
            aria-label={COPY.improvements.previousProject}
            onClick={() => advance(-1)}
          >
            ←
          </button>
          <button
            className="round-control"
            aria-label={COPY.improvements.nextProject}
            onClick={() => advance(1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={indexRef}
        className="project-index rv"
        role="group"
        aria-label={COPY.sections.work.tag}
      >
        <span
          ref={markerRef}
          className="project-index-marker"
          aria-hidden="true"
        />
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            aria-pressed={active === project.id}
            onClick={() => setActive(project.id)}
          >
            <span className="mono">{project.index}</span>
            <span>{project.title}</span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div className="project-gallery rv">
        {PROJECTS.map((project) => {
          const isActive = active === project.id;
          return (
            <article
              key={project.id}
              className={`project-panel ${isActive ? "expanded" : ""}`}
              onPointerMove={(event) => {
                // Layout changes must not switch projects beneath a still cursor.
                if (event.pointerType === "mouse" && !isActive) {
                  setActive(project.id);
                }
              }}
            >
              <button
                className="project-spine"
                aria-expanded={isActive}
                aria-controls={`project-${project.id}`}
                aria-label={`${COPY.work.expand}: ${project.title}`}
                onClick={() => {
                  setActive(project.id);
                  if (matchMedia("(min-width: 1101px)").matches) {
                    const index = PROJECTS.findIndex(item => item.id === project.id);
                    indexRef.current?.querySelectorAll<HTMLButtonElement>("button")[index]?.focus({preventScroll: true});
                  }
                }}
              >
                <span className="mono">{project.index}</span>
                <span className="project-spine-title">{project.title}</span>
                <span className="project-plus" aria-hidden="true">
                  ＋
                </span>
              </button>
              <div
                id={`project-${project.id}`}
                className="project-detail"
                inert={!isActive}
                aria-hidden={!isActive}
              >
                {isActive && (
                  <>
                    <div className="project-copy">
                      <p className="mono project-kicker">
                        {COPY.work.caseStudy} {project.index}
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project-subtitle">{project.kicker}</p>
                      <p className="project-date mono">{project.dates}</p>
                      <p className="project-description">
                        {project.description}
                      </p>
                      <ul className="project-features">
                        {project.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <p className="mono project-tech-label">
                        {COPY.work.stack}
                      </p>
                      <div className="project-tech">
                        {project.tech.map((t) => (
                          <span className="pill" key={t}>
                            <TechLogo name={t} size={12} />
                            {t}
                          </span>
                        ))}
                      </div>
                      {project.github && (
                        <a
                          className="project-github button"
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {COPY.work.github}
                        </a>
                      )}
                    </div>
                    <div className="project-visual">
                      <ProjectIllustration project={project} />
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <p className="work-gallery-hint mono">{COPY.improvements.galleryHint}</p>
      <style>{`
.work{border-top:1px solid var(--line)}.work-header{display:flex;align-items:center;justify-content:space-between;gap:24px}
.work-browse{display:flex;align-items:center;gap:10px;margin-bottom:45px}.work-browse>.mono{white-space:nowrap;font-size:10px;color:var(--muted-text);margin-right:12px}
.project-index{position:relative;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-block:1px solid var(--line);margin-bottom:30px}
.project-index button{position:relative;min-width:0;display:flex;align-items:center;gap:10px;padding:20px 12px;text-align:left;font-size:13px;min-height:64px;transition:background .4s var(--ease),color .4s var(--ease)}
.project-index button>.mono{font-size:9px;color:var(--muted-text)}.project-index button>span:last-child{margin-left:auto;transition:transform .45s var(--ease)}
.project-index button:hover>span:last-child{transform:translate(3px,-3px)}.project-index button:hover{background:#ffffff55}.project-index button[aria-pressed=true]{background:#fff}
.project-index-marker{position:absolute;left:0;bottom:-1px;height:2px;background:var(--ink);z-index:2;pointer-events:none;transition:transform .7s var(--ease),width .7s var(--ease)}
.project-gallery{display:flex;align-items:stretch;gap:10px;min-height:620px}
.project-panel{position:relative;flex:0 0 48px;min-width:0;background:#eae7e180;border:1px solid var(--line);border-radius:26px;overflow:hidden;transition:flex .85s var(--ease),background .5s var(--ease),box-shadow .5s var(--ease)}
.project-panel.expanded{flex:1 1 0%;background:white;box-shadow:0 20px 65px #00000006}
.project-spine{position:absolute;inset:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:18px;padding:26px 0;transition:background .4s var(--ease)}
.project-spine>.mono{font-size:9px;color:var(--muted-text)}.project-spine-title{writing-mode:vertical-rl;transform:rotate(180deg);font-size:17px;letter-spacing:-.02em;white-space:nowrap}
.project-plus{font-size:25px;font-weight:300;transition:transform .5s var(--ease)}.project-spine:hover{background:#fff9}.project-spine:hover .project-plus{transform:rotate(90deg)}
.expanded .project-spine{visibility:hidden;pointer-events:none}
.project-detail{display:none;min-width:0;height:100%;padding:28px;gap:24px;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr)}.expanded .project-detail{display:grid}
.project-copy{display:flex;flex-direction:column;align-items:flex-start;min-width:0}
.project-copy>*{animation:work-text-in .65s var(--ease) both;animation-delay:180ms}.project-copy>h3{animation-delay:220ms}.project-copy>.project-description{animation-delay:260ms}.project-copy>.project-features{animation-delay:300ms}.project-copy>.project-tech{animation-delay:340ms}
.project-kicker{font-size:9px;letter-spacing:.1em;color:var(--muted-text);border-bottom:1px solid var(--line);padding-bottom:14px;width:100%}
.project-copy h3{font-size:clamp(34px,3.4vw,52px);line-height:1.02;letter-spacing:-.05em;font-weight:550;margin-top:18px;overflow-wrap:anywhere}
.project-subtitle{font-family:var(--font-serif);font-style:italic;font-size:23px;line-height:1.2;letter-spacing:-.02em;color:var(--ink-2);margin-top:10px}
.project-date{font-size:9px;color:var(--muted-text);line-height:1.6;margin-top:15px;letter-spacing:.025em}
.project-description{font-size:14px;line-height:1.75;color:var(--ink-2);margin-top:18px}
.project-features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 18px;list-style:none;padding:0;margin-block:18px;font-size:11px;line-height:1.65;color:var(--ink-2);width:100%}
.project-features li{padding-top:10px;border-top:1px solid var(--line)}
.project-tech-label{font-size:9px;color:var(--muted-text);margin-bottom:10px}.project-tech{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;max-width:100%}
.project-tech .pill{font-size:9px;line-height:1.4;padding:7px 8px;background:#f4f2ee66;gap:6px;max-width:100%;overflow-wrap:anywhere}.project-tech .pill img,.project-tech .pill svg{flex:none}
.project-github{margin-top:auto;min-height:46px;padding:12px 19px;font-size:12px;background:var(--ink);color:white;border-color:var(--ink)}
.project-visual{min-width:0;align-self:center;padding:8px 0;animation:work-visual-in .9s var(--ease) 240ms both}
.work-gallery-hint{font-size:9px;line-height:1.7;letter-spacing:.04em;color:var(--muted-text);margin-top:24px}
@keyframes work-text-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes work-visual-in{from{opacity:0;clip-path:inset(0 100% 0 0 round 20px);transform:translateX(10px)}to{opacity:1;clip-path:inset(0 round 20px);transform:none}}
@media(min-width:1101px) and (max-width:1250px){.project-detail{padding:26px;gap:20px;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}.project-gallery{gap:8px}.project-panel{flex-basis:40px}.project-copy h3{font-size:37px}.project-features{gap:10px 12px}.project-description{font-size:13px}}
@media(max-width:1100px){.project-index{display:flex;overflow-x:auto;scrollbar-width:thin}.project-index button{flex:0 0 auto;white-space:nowrap;padding:18px 16px}.project-gallery{display:flex;flex-direction:column;min-height:0;gap:12px}.project-panel,.project-panel.expanded{flex:none;min-height:74px}.project-spine,.expanded .project-spine{position:relative;visibility:visible;pointer-events:auto;display:flex;flex-direction:row;min-height:74px;padding:18px 24px;text-align:left}.project-spine-title{writing-mode:horizontal-tb;transform:none;white-space:normal;font-size:20px;margin-right:auto}.expanded .project-spine{border-bottom:1px solid var(--line)}.expanded .project-plus{transform:rotate(45deg)}.project-detail{height:auto;padding:30px;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:30px}.project-copy h3{font-size:44px}.project-visual{padding:10px 0}.project-gallery .project-panel.expanded{box-shadow:0 14px 40px #00000004}}
@media(max-width:680px){.work-header{flex-wrap:wrap;gap:0}.work-header .section-head{width:100%;margin-bottom:28px}.work-browse{margin-bottom:26px}.project-index{margin-bottom:20px}.project-index button{font-size:12px;min-height:56px;padding:16px 14px}.project-detail{grid-template-columns:1fr;padding:24px;gap:32px}.project-copy h3{font-size:40px}.project-spine,.expanded .project-spine{padding:18px 20px;gap:13px}.project-spine-title{font-size:19px}.project-subtitle{font-size:24px}.project-features{font-size:11px}.project-description{font-size:14px}.project-tech .pill{font-size:9px}.project-visual{padding:8px 0;max-width:420px;width:100%;justify-self:center}.project-github{margin-top:0}.work-gallery-hint{font-size:9px}}
@media(prefers-reduced-motion:reduce){.project-panel,.project-index-marker,.project-index button,.project-plus{transition:none}.project-copy>*,.project-visual{animation:none}}
`}</style>
    </section>
  );
}
