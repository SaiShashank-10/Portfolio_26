"use client";
import { useEffect, useState } from "react";
import { COPY, PROJECTS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
import TechLogo from "../ui/TechLogo";
import ProjectIllustration from "../ui/ProjectIllustration";

export default function Work() {
  const [active, setActive] = useState(PROJECTS[0].id);
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
      <div className="project-index rv" aria-label={COPY.sections.work.tag}>
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
              onMouseEnter={() => {
                // A layout shift beneath a stationary mouse must not steal keyboard focus.
                if (!document.activeElement?.closest(".project-panel"))
                  setActive(project.id);
              }}
              onPointerMove={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  (event.movementX || event.movementY)
                )
                  setActive(project.id);
              }}
              onFocus={() => setActive(project.id)}
            >
              <button
                className="project-spine"
                aria-expanded={isActive}
                aria-controls={`project-${project.id}`}
                aria-label={`${COPY.work.expand}: ${project.title}`}
                onClick={() => setActive(project.id)}
              >
                <span className="mono">{project.index}</span>
                <h3>{project.title}</h3>
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
                        {project.index} / {project.kicker}
                      </p>
                      <h3>{project.title}</h3>
                      <p className="project-date mono">{project.dates}</p>
                      <p className="project-description">
                        {project.description}
                      </p>
                      <ul className="project-features">
                        {project.features.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                      <div className="project-tech">
                        {project.tech.map((t) => (
                          <span className="pill" key={t}>
                            <TechLogo name={t} size={12} />
                            {t}
                          </span>
                        ))}
                      </div>
                      <a
                        className="project-github button"
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {COPY.work.github}
                      </a>
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
.work {
  border-top: 1px solid var(--line);
}
.work-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}
.work-count {
  white-space: nowrap;
  font-size: 10px;
  margin-bottom: 25px;
  color: var(--muted-text);
}
.project-gallery {
  display: flex;
  gap: 10px;
  height: min(78svh, 600px);
  min-height: 565px;
}
.project-panel {
  position: relative;
  flex: 1;
  min-width: 64px;
  border-radius: 23px;
  background: #eae7e1;
  box-shadow: inset 0 0 0 1px #0d0d0d0c;
  overflow: hidden;
  transition:
    flex 0.9s var(--ease),
    background 0.5s;
}
.project-panel:nth-child(even) {
  background: #eeece7;
}
.project-panel.expanded {
  flex: 10;
  background: white;
}
.project-spine {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 27px 0;
  position: absolute;
  inset: 0;
  transition: opacity 0.3s;
}
.project-spine > .mono {
  font-size: 10px;
  color: var(--muted-text);
}
.project-spine h3 {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-size: 19px;
  font-weight: 450;
  letter-spacing: -0.025em;
  white-space: nowrap;
}
.project-plus {
  font-size: 25px;
  transition: transform 0.5s var(--ease);
  font-weight: 300;
}
.project-spine:hover .project-plus {
  transform: rotate(90deg);
}
.expanded .project-spine {
  opacity: 0;
  pointer-events: none;
}
.expanded .project-spine:focus-visible {
  opacity: 1;
  pointer-events: auto;
  height: 44px;
  width: 44px;
  right: 12px;
  left: auto;
  top: 8px;
  padding: 0;
  z-index: 3;
}
.expanded .project-spine:focus-visible h3,
.expanded .project-spine:focus-visible .mono {
  display: none;
}
.project-detail {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 18px;
  padding: 34px;
  min-width: 680px;
  height: 100%;
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
}
.expanded .project-detail {
  opacity: 1;
  transition: opacity 0.65s 0.25s;
  pointer-events: auto;
}
.project-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
.project-kicker {
  font-size: 10px;
  line-height: 1.6;
  color: var(--muted-text);
  letter-spacing: 0.045em;
}
.project-copy h3 {
  font-size: clamp(32px, 3.1vw, 46px);
  letter-spacing: -0.04em;
  line-height: 1;
  margin: 24px 0 10px;
  font-weight: 550;
}
.project-date {
  font-size: 10px;
  color: var(--muted-text);
}
.project-description {
  font-size: 12px;
  line-height: 1.65;
  margin-top: 22px;
  color: var(--ink-2);
}
.project-features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 15px;
  list-style: none;
  padding: 0;
  margin: 22px 0;
  font-size: 10px;
  line-height: 1.5;
  color: var(--ink-2);
}
.project-features li {
  position: relative;
  padding-left: 10px;
}
.project-features li:before {
  content: "·";
  position: absolute;
  left: 0;
  font-size: 17px;
  line-height: 12px;
}
.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 20px;
}
.project-tech .pill {
  font-size: 10px;
  padding: 5px 7px;
  gap: 5px;
}
.project-github {
  font-size: 10px;
  min-height: 40px;
  padding: 10px 15px;
  margin-top: auto;
  gap: 5px;
}
.project-visual {
  min-width: 0;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 1s var(--ease);
}
.expanded .project-visual {
  clip-path: inset(0);
  transition-delay: 0.3s;
}
@media (min-width: 1600px) {
  .project-panel.expanded {
    flex: 9;
  }
  .project-detail {
    padding: 40px;
    gap: 26px;
  }
  .project-description {
    font-size: 13px;
  }
  .project-features {
    font-size: 10px;
  }
}
@media (max-width: 1199px) {
  .project-gallery {
    gap: 7px;
  }
  .project-panel {
    min-width: 50px;
  }
  .project-detail {
    min-width: 570px;
    padding: 28px;
    gap: 8px;
    grid-template-columns: 1.35fr 1fr;
  }
  .project-spine h3 {
    font-size: 16px;
  }
  .project-description {
    font-size: 11px;
  }
  .project-copy h3 {
    font-size: 34px;
  }
  .project-features {
    font-size: 10px;
    gap: 9px;
  }
  .project-tech .pill {
    font-size: 10px;
  }
}
@media (max-width: 950px) {
  .project-gallery {
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 0;
    gap: 10px;
  }
  .project-panel {
    flex: none;
    min-width: 0;
    min-height: 76px;
    border-radius: 20px;
  }
  .project-panel.expanded {
    flex: none;
    min-height: 600px;
  }
  .project-spine {
    position: relative;
    height: 76px;
    flex-direction: row;
    padding: 0 24px;
    gap: 20px;
  }
  .project-spine h3 {
    writing-mode: horizontal-tb;
    transform: none;
    white-space: normal;
    font-size: 19px;
    margin-right: auto;
    text-align: left;
  }
  .expanded .project-spine {
    position: absolute;
    width: 44px;
    height: 44px;
    top: 15px;
    right: 15px;
    left: auto;
    padding: 0;
  }
  .project-detail {
    display: none;
    min-width: 0;
    min-height: 600px;
    height: auto;
    padding: 35px;
    grid-template-columns: 1.3fr 1fr;
  }
  .expanded .project-detail {
    display: grid;
  }
  .project-description {
    font-size: 13px;
  }
  .project-features {
    font-size: 10px;
  }
  .project-tech .pill {
    font-size: 10px;
  }
  .project-visual {
    align-self: center;
  }
  .project-copy h3 {
    font-size: 40px;
  }
  .project-kicker,
  .project-date {
    font-size: 10px;
  }
  .project-github {
    margin-top: 15px;
    font-size: 11px;
  }
}
@media (max-width: 600px) {
  .work-header {
    display: block;
  }
  .work-count {
    display: none;
  }
  .project-panel.expanded {
    min-height: 0;
  }
  .project-detail,
  .expanded .project-detail {
    grid-template-columns: 1fr;
    padding: 27px;
    gap: 10px;
  }
  .project-copy h3 {
    font-size: 39px;
    margin-top: 20px;
  }
  .project-description {
    font-size: 13px;
    line-height: 1.7;
  }
  .project-features {
    font-size: 10px;
    gap: 13px;
  }
  .project-tech {
    margin-bottom: 12px;
  }
  .project-visual {
    width: 100%;
    padding-top: 10px;
  }
  .project-illustration {
    padding: 15px 10px 0;
  }
  .mock-window {
    max-width: 320px;
    width: 100%;
    margin-inline: auto;
  }
  .mock-content {
    min-height: 240px;
  }
  .project-spine h3 {
    font-size: 17px;
  }
  .project-spine {
    padding-inline: 22px;
    gap: 15px;
  }
  .project-spine > .mono {
    font-size: 10px;
  }
  .project-panel:not(.expanded) {
    min-height: 74px;
  }
}

.work-browse {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 45px;
}
.work-browse > .mono {
  margin-right: 10px;
  color: var(--muted-text);
}
.work-gallery-hint {
  margin-top: 23px;
  color: var(--muted-text);
  letter-spacing: 0.035em;
}
.project-description {
  font-size: 14px;
  line-height: 1.65;
}
.project-features {
  font-size: 11px;
  gap: 11px 17px;
  margin-block: 19px;
}
.project-tech .pill {
  font-size: 9px;
  padding: 6px 8px;
}
.project-kicker {
  font-size: 9px;
  line-height: 1.6;
}
.project-date {
  font-size: 10px;
}
.project-github {
  font-size: 12px;
  min-height: 44px;
}
.project-copy h3 {
  font-weight: 550;
}
.project-spine h3 {
  font-size: 21px;
}
.project-panel.expanded {
  box-shadow:
    inset 0 0 0 1px var(--line),
    0 18px 40px #00000004;
}
.project-gallery {
  gap: 12px;
}
.project-visual {
  animation: project-unveil 0.9s var(--ease) both;
}
.project-copy {
  animation: project-text-in 0.7s var(--ease) both;
}
@keyframes project-unveil {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0);
  }
}
@keyframes project-text-in {
  from {
    opacity: 0;
    translate: 0 8px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}
@media (min-width: 951px) and (max-width: 1199px) {
  .project-detail {
    grid-template-columns: 1fr;
    padding: 28px;
    min-width: 0;
  }
  .project-visual {
    display: none;
  }
  .project-description {
    font-size: 14px;
  }
  .project-features {
    font-size: 12px;
  }
  .project-tech .pill {
    font-size: 10px;
  }
  .project-spine h3 {
    font-size: 17px;
  }
}
@media (max-width: 950px) {
  .project-description {
    font-size: 15px;
  }
  .project-features {
    font-size: 12px;
  }
  .project-tech .pill {
    font-size: 10px;
  }
  .project-gallery {
    gap: 12px;
  }
  .project-github {
    font-size: 13px;
  }
  .work-gallery-hint {
    display: none;
  }
}
@media (max-width: 600px) {
  .work-header {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
  }
  .work-header .section-head {
    width: 100%;
    margin-bottom: 28px;
  }
  .work-browse {
    margin-bottom: 25px;
  }
  .project-copy h3 {
    font-size: 40px;
  }
  .project-description {
    font-size: 14px;
  }
  .project-features {
    font-size: 11px;
  }
  .project-tech .pill {
    font-size: 9px;
  }
  .project-spine h3 {
    font-size: 19px;
  }
  .project-detail,
  .expanded .project-detail {
    padding: 26px;
  }
  .project-gallery {
    gap: 12px;
  }
}

.project-index {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border-block: 1px solid var(--line);
  margin-bottom: 24px;
}
.project-index button {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 14px;
  text-align: left;
  font-size: 13px;
  transition: background 0.4s var(--ease);
}
.project-index button + button {
  border-left: 1px solid var(--line);
}
.project-index button[aria-pressed="true"] {
  background: white;
}
.project-index button > .mono {
  color: var(--muted-text);
  font-size: 9px;
}
.project-index button > span:last-child {
  margin-left: auto;
  transition: transform 0.4s var(--ease);
}
.project-index button:hover > span:last-child {
  transform: translate(2px, -2px);
}
.project-panel.expanded {
  box-shadow:
    inset 0 0 0 1px #0d0d0d12,
    0 18px 45px #0d0d0d06;
}
.project-kicker {
  border-bottom: 1px solid var(--line);
  padding-bottom: 13px;
}
.project-features li {
  position: relative;
}
@media (max-width: 950px) {
  .project-index {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scrollbar-width: thin;
  }
  .project-index button {
    flex: 0 0 auto;
    scroll-snap-align: start;
    padding: 16px;
    min-height: 55px;
  }
  .project-index button > span:nth-child(2) {
    white-space: nowrap;
  }
}
`}</style>
    </section>
  );
}
