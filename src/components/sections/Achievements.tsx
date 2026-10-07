"use client";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS, COPY } from "@/lib/data";
import { prefersReducedMotion, useInView, useReducedMotion } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";

function AwardNumber({ value, suffix }: { value: number; suffix: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [number, setNumber] = useState(value);
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setNumber(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span
      ref={ref}
      className="award-number"
      role="img"
      aria-label={`${value}${suffix}`}
    >
      <span aria-hidden="true">
        {number}
        <small>{suffix}</small>
      </span>
    </span>
  );
}
function AwardIcon({ icon }: { icon: string }) {
  return (
    <svg
      width="39"
      height="39"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon === "trophy" ? (
        <>
          <path d="M15 8h18v11c0 7-4 11-9 11s-9-4-9-11V8ZM15 11H8v6c0 6 4 9 9 9M33 11h7v6c0 6-4 9-9 9M24 30v9m-9 2h18M18 39h12" />
          <path d="m24 12 1.8 4 4.2.5-3.1 3 1 4.2-3.9-2.2-3.9 2.2 1-4.2-3.1-3 4.2-.5Z" />
        </>
      ) : (
        <>
          <path d="M24 40C10 38 4 25 13 10M24 40c14-2 20-15 11-30M12 12l-5 1 1 7 5-2m-3 4-5 2 4 6 5-3m0 5-3 5 7 3 3-5M36 12l5 1-1 7-5-2m3 4 5 2-4 6-5-3m0 5 3 5-7 3-3-5" />
          <path d="m24 12 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />
        </>
      )}
    </svg>
  );
}
export default function Achievements() {
  const section = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null),
    progress = useRef<HTMLSpanElement>(null),
    travel = useRef(0),
    reduced = useReducedMotion();
  const [nearest, setNearest] = useState(0);
  useEffect(() => {
    const root = section.current,
      rail = track.current;
    if (!root || !rail) return;
    let raf = 0;
    let centers: number[] = [];
    const update = () => {
      raf = 0;
      const rect = root.getBoundingClientRect();
      const x = Math.max(0, Math.min(travel.current, -rect.top));
      rail.style.transform = reduced ? "none" : `translate3d(${-x}px,0,0)`;
      progress.current?.style.setProperty(
        "transform",
        `scaleX(${travel.current ? x / travel.current : 1})`,
      );
      let distance = Infinity,
        index = 0;
      centers.forEach((center, i) => {
        const d = Math.abs(center - x - innerWidth / 2);
        if (d < distance) {
          distance = d;
          index = i;
        }
      });
      setNearest(index);
    };
    const measure = () => {
      centers = Array.from(
        rail.querySelectorAll<HTMLElement>(".award-card"),
        (card) => card.offsetLeft + card.offsetWidth / 2,
      );
      travel.current = Math.max(
        0,
        rail.scrollWidth -
          innerWidth +
          parseFloat(getComputedStyle(rail).paddingLeft),
      );
      root.style.height = reduced
        ? "auto"
        : `${innerHeight + travel.current}px`;
      update();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    measure();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", measure);
    };
  }, [reduced]);
  const move = (direction: number) => {
    const root = section.current;
    if (!root) return;
    const y = root.getBoundingClientRect().top + scrollY;
    window.scrollTo({
      top:
        y +
        Math.max(
          0,
          Math.min(
            travel.current,
            -root.getBoundingClientRect().top + direction * 520,
          ),
        ),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  return (
    <section
      ref={section}
      id="achievements"
      className="achievements"
      aria-labelledby="achievements-title"
    >
      <div className="achievement-pin">
        <div className="site-container achievement-heading">
          <SectionHeading section="achievements" />
          <div className="achievement-controls">
            <span className="mono">{COPY.achievements.hint}</span>
            <div className="achievement-progress" aria-hidden="true">
              <span ref={progress} />
            </div>
            <button
              aria-label={COPY.achievements.previous}
              onClick={() => move(-1)}
            >
              ←
            </button>
            <button aria-label={COPY.achievements.next} onClick={() => move(1)}>
              →
            </button>
          </div>
        </div>
        <div className="achievement-window">
          <div ref={track} className="award-track">
            {ACHIEVEMENTS.map((award, i) => (
              <article
                className={`award-card ${nearest === i ? "nearest" : ""}`}
                key={award.title}
                tabIndex={0}
                aria-label={award.label}
                onFocus={(e) => {
                  if (reduced) return;
                  const root = section.current,
                    rail = track.current;
                  if (root && rail) {
                    const card = e.currentTarget;
                    const x = Math.max(
                      0,
                      Math.min(
                        travel.current,
                        card.offsetLeft + card.offsetWidth / 2 - innerWidth / 2,
                      ),
                    );
                    window.scrollTo({
                      top: root.getBoundingClientRect().top + scrollY + x,
                      behavior: "instant",
                    });
                  }
                }}
              >
                <div className="award-top">
                  <div className="award-icon">
                    <AwardIcon icon={award.icon} />
                  </div>
                  <p className="award-context">{award.description}</p>
                  <span className="mono">
                    0{i + 1} / 0{ACHIEVEMENTS.length}
                  </span>
                </div>
                <div className="award-bottom">
                  <div className="award-copy">
                    <span className="mono">{award.caption}</span>
                    <h3>{award.title}</h3>
                    <p>{award.detail}</p>
                    <span className="award-date mono">{award.date}</span>
                  </div>
                  <AwardNumber value={award.value} suffix={award.suffix} />
                </div>
              </article>
            ))}
            <div className="award-ending">
              <span>{COPY.achievements.end}</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
.achievements {
  position: relative;
  border-block: 1px solid var(--line);
  height: 130svh;
}
.achievement-pin {
  position: sticky;
  top: 0;
  height: 100svh;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: clip;
  padding-block: 100px 70px;
}
.achievement-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
}
.achievement-heading .section-head {
  margin-bottom: 55px;
}
.achievement-controls {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 65px;
}
.achievement-controls > .mono {
  font-size: 10px;
  color: var(--muted-text);
  white-space: nowrap;
}
.achievement-controls > button {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid #0d0d0d24;
  display: grid;
  place-items: center;
  transition: background 0.3s;
}
.achievement-controls > button:hover {
  background: white;
}
.achievement-progress {
  width: 90px;
  height: 1px;
  background: #d2cfc7;
  margin-inline: 6px;
}
.achievement-progress > span {
  display: block;
  height: 100%;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
}
.achievement-window {
  width: 100%;
  padding-block: 20px 45px;
  overflow: clip;
}
.award-track {
  display: flex;
  gap: 24px;
  width: max-content;
  padding-inline: var(--gutter);
  position: relative;
  will-change: transform;
}
.award-card {
  width: clamp(340px, 40vw, 540px);
  height: clamp(280px, 36vh, 310px);
  border-radius: 28px;
  background: white;
  padding: 28px 32px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 2px #00000002;
  transition:
    translate 0.7s var(--ease),
    box-shadow 0.7s var(--ease);
}
.award-card.nearest {
  translate: 0 -12px;
  box-shadow: 0 23px 45px #00000009;
}
.award-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.award-top > .mono {
  font-size: 10px;
  color: var(--muted-text);
  margin-top: 7px;
}
.award-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: #f2f0ec;
  display: grid;
  place-items: center;
  color: #333;
  transition: box-shadow 0.7s;
}
.nearest .award-icon {
  box-shadow: 0 0 32px #0d0d0d0b;
}
.award-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
}
.award-copy {
  max-width: 290px;
}
.award-copy > .mono {
  font-size: 10px;
  color: var(--muted-text);
}
.award-copy h3 {
  font-size: 23px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.025em;
  margin-block: 10px;
}
.award-copy p {
  font-size: 10px;
  color: var(--muted-text);
  line-height: 1.5;
}
.award-copy > .award-date {
  display: block;
  margin-top: 10px;
  font-size: 10px;
}
.award-number {
  font-size: 85px;
  line-height: 0.85;
  letter-spacing: -0.065em;
  font-weight: 450;
  white-space: nowrap;
}
.award-number small {
  font-size: 27px;
  font-family: var(--font-serif);
  font-style: italic;
  letter-spacing: -0.04em;
  vertical-align: top;
  display: inline-block;
  padding-top: 10px;
}
.award-ending {
  width: 440px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.award-ending > span {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--muted-text);
  font-size: 50px;
  letter-spacing: -0.04em;
}
@media (max-width: 800px) {
  .achievement-heading {
    display: block;
  }
  .achievement-heading .section-head {
    margin-bottom: 25px;
  }
  .achievement-controls {
    margin-bottom: 28px;
  }
  .achievement-progress {
    flex: 1;
    max-width: 200px;
  }
  .achievement-pin {
    min-height: 600px;
    padding-block: 105px 50px;
  }
  .award-track {
    gap: 16px;
  }
  .award-card {
    padding: 25px;
    width: clamp(310px, 86vw, 540px);
    height: 300px;
  }
  .award-copy h3 {
    font-size: 22px;
  }
  .award-number {
    font-size: 72px;
  }
  .award-ending {
    width: 310px;
  }
  .award-ending > span {
    font-size: 40px;
  }
  .award-copy p {
    font-size: 10px;
  }
  .award-icon {
    width: 62px;
    height: 62px;
  }
  .award-bottom {
    gap: 8px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .achievements {
    height: auto !important;
  }
  .achievement-pin {
    position: relative;
    height: auto;
    min-height: 0;
    overflow: visible;
    padding-block: 96px;
  }
  .award-track {
    transform: none !important;
    will-change: auto;
    width: 100%;
    flex-wrap: wrap;
  }
  .award-card {
    width: 100%;
    max-width: 600px;
    margin-inline: auto;
    translate: none !important;
  }
  .award-ending {
    height: 100px;
    width: 100%;
  }
  .achievement-controls {
    display: none;
  }
}

.award-card {
  box-shadow: inset 0 0 0 1px #0d0d0d05;
}
.award-copy h3 {
  font-size: 25px;
  line-height: 1.15;
}
.award-copy p {
  font-size: 12px;
}
.award-copy > .mono {
  font-size: 10px;
  letter-spacing: 0.035em;
}
.award-copy > .award-date {
  font-size: 10px;
}
.award-top > .mono {
  font-size: 10px;
}
.award-number {
  font-size: 90px;
}
.achievement-controls > button {
  height: 44px;
  width: 44px;
}
.award-ending > span {
  font-size: 56px;
}
@media (max-width: 800px) {
  .award-copy h3 {
    font-size: 23px;
  }
  .award-copy p {
    font-size: 11px;
  }
  .award-copy > .mono,
  .award-copy > .award-date {
    font-size: 9px;
  }
  .award-number {
    font-size: 73px;
  }
  .award-card {
    height: 310px;
  }
  .award-ending > span {
    font-size: 43px;
  }
}

.award-card {
  position: relative;
  overflow: hidden;
}
.award-top {
  gap: 18px;
  align-items: center;
}
.award-context {
  font-size: 12px;
  line-height: 1.55;
  color: var(--muted-text);
  max-width: 260px;
}
.award-icon {
  flex-shrink: 0;
}
.award-top > .mono {
  white-space: nowrap;
  align-self: flex-start;
}
.award-bottom {
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
.award-icon {
  border-radius: 50%;
  outline: 1px solid var(--line);
  outline-offset: 5px;
  background: var(--paper);
}
.award-card.nearest .award-icon {
  transform: rotate(-6deg);
}
.award-icon {
  transition:
    transform 0.7s var(--ease),
    box-shadow 0.7s var(--ease);
}
@media (max-width: 800px) {
  .award-top {
    gap: 12px;
  }
  .award-context {
    font-size: 12px;
    line-height: 1.45;
  }
  .award-top > .mono {
    position: absolute;
    top: 19px;
    right: 23px;
    font-size: 8px;
  }
  .award-icon {
    width: 48px;
    height: 48px;
  }
  .award-context {
    padding-top: 10px;
  }
  .award-bottom {
    padding-top: 14px;
  }
  .award-card {
    padding-top: 31px;
  }
}
`}</style>
    </section>
  );
}
