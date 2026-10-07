"use client";
import { useRef, useState } from "react";
import { COPY, TIMELINE, PROFILE } from "@/lib/data";
import { prefersReducedMotion, useScrollProgress } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";

function MilestoneIcon({ education }: { education: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {education ? (
        <>
          <path d="m3 12 13-6 13 6-13 6-13-6Z M8 15v8c5 4 11 4 16 0v-8M29 12v11" />
          <circle cx="29" cy="25" r="1" />
        </>
      ) : (
        <>
          <circle cx="16" cy="10" r="4" />
          <path d="M9 27v-4a7 7 0 0 1 14 0v4M7 10a3 3 0 1 0 0 6M25 10a3 3 0 1 1 0 6M3 25v-3a5 5 0 0 1 5-5m21 8v-3a5 5 0 0 0-5-5" />
        </>
      )}
    </svg>
  );
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const path = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useScrollProgress(root, () => {
    const el = path.current;
    const section = root.current;
    if (!el || !section) return;
    const rect = el.getBoundingClientRect();
    const stops = Array.from(
      el.querySelectorAll<HTMLElement>(".timeline-stop"),
    );
    // Read all geometry before setting styles, keeping the scroll frame inexpensive.
    const offsets = stops.map((stop) => stop.offsetTop + 30);
    const length = offsets.at(-1) ?? 1;
    const position = innerHeight * 0.35 - rect.top;
    const progress = Math.max(0, Math.min(1, position / length));
    let current = 0;
    offsets.forEach((offset, index) => {
      if (offset <= position + 1) current = index;
    });
    const reduced = prefersReducedMotion();
    section.style.setProperty("--journey-progress", String(progress));
    el.style.setProperty("--spine-length", `${length}px`);
    stops.forEach((stop, index) =>
      stop.classList.toggle("reached", reduced || offsets[index] <= position),
    );
    setActive((previous) => (previous === current ? previous : current));
  });
  const chapter = TIMELINE[active];
  return (
    <section
      ref={root}
      id="experience"
      className="section experience site-container"
      aria-labelledby="experience-title"
    >
      <div className="experience-heading">
        <SectionHeading section="experience" />
        <div className="journey-console rv">
          <div className="journey-current">
            <div className="journey-dial" aria-hidden="true">
              <svg viewBox="0 0 100 100">
                <circle className="dial-track" cx="50" cy="50" r="44" />
                <circle
                  className="dial-progress"
                  cx="50"
                  cy="50"
                  r="44"
                  pathLength="1"
                />
              </svg>
              <span key={active} className="chapter-number">
                {String(active + 1).padStart(2, "0")}
                <small>/ {String(TIMELINE.length).padStart(2, "0")}</small>
              </span>
            </div>
            <div
              className="chapter-caption"
              key={chapter.title + chapter.place}
            >
              <span className="mono">{COPY.timeline.chapter}</span>
              <p>{chapter.kind}</p>
              <span className="chapter-date mono">{chapter.date}</span>
            </div>
          </div>
          <nav className="chapter-nav" aria-label={COPY.timeline.navigate}>
            {TIMELINE.map((entry, index) => (
              <a
                key={entry.place}
                href={`#milestone-${index}`}
                aria-label={`${entry.kind}: ${entry.title}, ${entry.place}`}
                aria-current={active === index ? "step" : undefined}
                title={entry.place}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i aria-hidden="true" />
              </a>
            ))}
          </nav>
          <div className="journey-academic">
            <span>
              {PROFILE.degree}
              <small className="mono">{PROFILE.years}</small>
            </span>
            <span>
              <strong>{PROFILE.cgpa}</strong>
              <small className="mono">{COPY.ui.score}</small>
            </span>
          </div>
        </div>
      </div>
      <div ref={path} className="timeline">
        <div className="timeline-spine" aria-hidden="true">
          <i />
          <span className="timeline-traveller" />
        </div>
        {TIMELINE.map((entry, index) => (
          <article
            id={`milestone-${index}`}
            key={entry.place}
            className={`timeline-stop rv ${active === index ? "is-current" : ""}`}
            aria-labelledby={`milestone-title-${index}`}
          >
            <div className="timeline-dot" aria-hidden="true">
              <span />
            </div>
            <div className="timeline-detail">
              <div className="milestone-top">
                <span className="milestone-icon">
                  <MilestoneIcon education={entry.kind === "Education"} />
                </span>
                <span className="mono timeline-kind">{entry.kind}</span>
                <span className="milestone-index mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="timeline-year mono">{entry.date}</p>
              <h3 id={`milestone-title-${index}`}>{entry.title}</h3>
              <p className="timeline-place">{entry.place}</p>
              <div className="milestone-rule" aria-hidden="true">
                <span />
              </div>
              <p
                className={`timeline-description ${entry.kind === "Education" ? "education-result" : ""}`}
              >
                {entry.detail}
              </p>
            </div>
          </article>
        ))}
        <div className="timeline-next">
          <div>
            <span className="mono">{COPY.timeline.next} —</span>
            <h3>{COPY.timeline.invitation}</h3>
          </div>
          <a className="button" href="#contact">
            {COPY.timeline.link}
          </a>
        </div>
      </div>
      <style>{`
.experience{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.5fr);gap:clamp(40px,7vw,100px);align-items:start}
.experience-heading{position:sticky;top:125px}.experience-heading .section-title{max-width:370px}.experience-heading .section-head{margin-bottom:38px}
.journey-console{max-width:350px;border:1px solid var(--line);border-radius:25px;background:#ffffff65;padding:26px;box-shadow:0 16px 40px #00000003}
.journey-current{display:flex;align-items:center;gap:20px;min-height:105px}.journey-dial{width:100px;height:100px;position:relative;flex-shrink:0}.journey-dial svg{position:absolute;inset:0;fill:none;stroke-width:1}.dial-track{stroke:#0d0d0d18}.dial-progress{stroke:var(--ink);stroke-width:2;stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--journey-progress,0));transform:rotate(-90deg);transform-origin:center;stroke-linecap:round}
.chapter-number{position:absolute;inset:0;display:flex;justify-content:center;align-items:center;flex-direction:column;font-size:36px;line-height:1;letter-spacing:-.05em;animation:chapter-arrive .55s var(--ease) both}.chapter-number small{font-family:var(--font-mono);font-size:8px;letter-spacing:.05em;color:var(--muted-text);margin-top:7px}
.chapter-caption{animation:chapter-arrive .6s var(--ease) both;min-width:0}.chapter-caption > .mono{font-size:8px;letter-spacing:.07em;color:var(--muted-text)}.chapter-caption p{font-size:22px;letter-spacing:-.03em;margin-top:9px}.chapter-date{display:block;font-size:9px;line-height:1.8;color:var(--muted-text);margin-top:6px}
.chapter-nav{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;margin-top:24px;border-top:1px solid var(--line);padding-top:18px}.chapter-nav a{min-height:44px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:9px;font-family:var(--font-mono);font-size:10px;color:var(--muted-text);transition:background .4s var(--ease),color .4s var(--ease)}.chapter-nav i{width:3px;height:3px;border-radius:50%;background:currentColor;opacity:.45}.chapter-nav a[aria-current]{background:var(--ink);color:white}.chapter-nav a:hover:not([aria-current]){background:white;color:var(--ink)}
.journey-academic{display:flex;justify-content:space-between;align-items:center;gap:20px;border-top:1px solid var(--line);margin-top:18px;padding-top:22px}.journey-academic > span:first-child{font-size:15px;letter-spacing:-.02em}.journey-academic small{display:block;font-size:8px;color:var(--muted-text);margin-top:6px}.journey-academic > span:last-child{text-align:right}.journey-academic strong{font-size:34px;line-height:1;font-weight:450;letter-spacing:-.06em}
.timeline{position:relative;padding-left:44px;min-width:0}.timeline-spine{position:absolute;left:7px;top:0;height:var(--spine-length,90%);width:1px;background:#d6d2ca}.timeline-spine > i{display:block;height:100%;width:100%;background:var(--ink);transform:scaleY(var(--journey-progress,0));transform-origin:top}.timeline-traveller{position:absolute;left:-3px;top:calc(var(--journey-progress,0)*100%);width:7px;height:7px;border-radius:50%;background:var(--ink);box-shadow:0 0 0 5px var(--paper)}
.timeline-stop{position:relative;padding-bottom:34px;scroll-margin-top:0}.timeline-dot{position:absolute;left:-42px;top:24px;width:12px;height:12px;border:1px solid #aaa69e;background:var(--paper);border-radius:50%;display:grid;place-items:center;z-index:1;transition:border-color .5s var(--ease)}.timeline-dot:after{content:"";position:absolute;left:11px;top:5px;width:26px;height:1px;background:var(--line)}.timeline-dot > span{width:4px;height:4px;border-radius:50%;background:#aaa69e;transition:background .5s var(--ease),transform .5s var(--ease)}.reached .timeline-dot,.is-current .timeline-dot{border-color:var(--ink)}.reached .timeline-dot > span{background:var(--ink)}.is-current .timeline-dot > span{background:var(--ink);transform:scale(1.5)}.is-current .timeline-dot:before{content:"";position:absolute;inset:-6px;border:1px solid #0d0d0d25;border-radius:50%;animation:milestone-pulse 2.8s var(--ease) infinite}
.timeline-detail{position:relative;border:1px solid #0d0d0d0b;background:#ffffff70;border-radius:27px;padding:30px 34px;transform:translateX(8px);transition:transform .8s var(--ease),background .8s var(--ease),border-color .8s var(--ease),box-shadow .8s var(--ease)}.reached .timeline-detail{transform:none;background:white}.is-current .timeline-detail{transform:translateY(-3px);background:white;border-color:#0d0d0d22;box-shadow:0 22px 50px #00000007}.timeline-detail:hover{border-color:#0d0d0d25;box-shadow:0 18px 42px #00000006}
.milestone-top{display:flex;align-items:center;gap:13px;margin-bottom:25px}.milestone-icon{width:44px;height:44px;border:1px solid var(--line);border-radius:14px;display:grid;place-items:center;color:var(--muted-text);transition:background .6s var(--ease),color .6s var(--ease),transform .8s var(--ease)}.is-current .milestone-icon{background:var(--ink);color:white;transform:rotate(-6deg)}.timeline-kind{font-size:9px;color:var(--muted-text)}.milestone-index{margin-left:auto;font-size:11px;color:var(--muted-text)}.timeline-year{font-size:10px;line-height:1.7;color:var(--muted-text);margin-bottom:12px}.timeline-detail h3{font-size:clamp(26px,2.3vw,35px);line-height:1.1;letter-spacing:-.035em;font-weight:500}.timeline-place{font-size:15px;line-height:1.55;color:var(--ink-2);margin-top:12px;max-width:470px}.milestone-rule{height:1px;background:var(--line);margin-block:23px 19px}.milestone-rule > span{display:block;height:100%;width:100%;background:#0d0d0d60;transform:scaleX(0);transform-origin:left;transition:transform 1.1s var(--ease)}.is-current .milestone-rule > span{transform:scaleX(1)}.timeline-description{font-size:14px;line-height:1.8;color:var(--muted-text)}.education-result{font-family:var(--font-mono);font-size:14px;color:var(--ink)}
.timeline-next{border:1px dashed #aaa69e;border-radius:25px;padding:30px 34px;display:flex;align-items:center;justify-content:space-between;gap:20px;background:#ffffff40;transition:background .5s var(--ease)}.timeline-next:hover{background:white}.timeline-next .mono{color:var(--muted-text);font-size:9px}.timeline-next h3{font-family:var(--font-serif);font-size:39px;font-style:italic;font-weight:400;letter-spacing:-.03em;margin-top:7px}.timeline-next .button{white-space:nowrap;font-size:12px}
@keyframes chapter-arrive{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}@keyframes milestone-pulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.25);opacity:.8}}
@media(max-width:1100px){.experience{grid-template-columns:minmax(0,.9fr) minmax(0,1.3fr);gap:35px}.journey-console{padding:20px}.journey-current{gap:12px}.journey-dial{width:80px;height:80px}.chapter-caption p{font-size:20px}.timeline{padding-left:32px}.timeline-dot{left:-30px}.timeline-dot:after{width:14px}.timeline-detail{padding:26px}.timeline-next{padding:25px;flex-wrap:wrap}}
@media(max-width:750px){.experience{display:block}.experience-heading{position:static}.experience-heading .section-title{max-width:none}.experience-heading .section-head{margin-bottom:28px}.journey-console{max-width:none;margin-bottom:45px;padding:22px}.journey-current{gap:20px}.journey-dial{width:82px;height:82px}.journey-academic{padding-top:18px}.chapter-caption p{font-size:23px}.timeline{padding-left:27px}.timeline-dot{left:-25px}.timeline-dot:after{width:9px}.timeline-detail{padding:24px 22px;border-radius:23px;transform:none}.timeline-stop{padding-bottom:25px}.timeline-detail h3{font-size:28px}.timeline-place{font-size:14px}.milestone-top{margin-bottom:22px}.timeline-next{padding:25px 22px}.timeline-next h3{font-size:35px}}
@media(prefers-reduced-motion:reduce){.chapter-number,.chapter-caption,.is-current .timeline-dot:before{animation:none}.timeline-detail,.is-current .timeline-detail,.milestone-icon,.is-current .milestone-icon{transform:none;transition:none}.timeline-spine > i{transform:scaleY(1)}.timeline-traveller{display:none}.milestone-rule > span{transition:none;transform:none}}
`}</style>
    </section>
  );
}
