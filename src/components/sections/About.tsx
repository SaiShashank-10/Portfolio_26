"use client";
import { useEffect, useRef, useState } from "react";
import { COPY, PROFILE } from "@/lib/data";
import { prefersReducedMotion, useReducedMotion } from "@/lib/hooks";
import SectionHeading from "../ui/SectionHeading";

export default function About() {
  const reduced = useReducedMotion();
  const cardHovered = useRef(false);
  const [flipped, setFlipped] = useState(false),
    [hover, setHover] = useState(false);
  const hanger = useRef<HTMLDivElement>(null),
    physics = useRef({ angle: 0, velocity: 0, lastX: 0, lastTime: 0 });
  const swing = (impulse = 1.5) => {
    if (!prefersReducedMotion()) physics.current.velocity += impulse;
  };
  useEffect(() => {
    const el = hanger.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--swing", "0deg");
      physics.current.angle = 0;
      physics.current.velocity = 0;
      return;
    }
    let raf = 0,
      visible = false,
      last = 0;
    const tick = (time: number) => {
      if (!visible || document.hidden) return;
      const delta = Math.min((time - last) / 16.67, 2) || 1;
      last = time;
      const p = physics.current;
      if (cardHovered.current) {
        p.velocity = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      const target = el.contains(document.activeElement)
        ? 0
        : Math.sin(time / 1700) * 0.6;
      p.velocity += (target - p.angle) * 0.022 * delta;
      p.velocity *= Math.pow(0.89, delta);
      const limit = innerWidth <= 680 ? 3 : 9;
      p.angle = Math.max(-limit, Math.min(limit, p.angle + p.velocity * delta));
      el.style.setProperty("--swing", `${p.angle}deg`);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        el.closest(".lanyard-column")?.setAttribute(
          "data-visible",
          String(visible),
        );
        cancelAnimationFrame(raf);
        if (visible) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (visible && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  const facts = [
    [COPY.ui.education, PROFILE.degree],
    [COPY.ui.score, PROFILE.cgpa],
    [COPY.ui.community, COPY.about.community],
    [COPY.ui.email, PROFILE.email],
  ];
  return (
    <section
      id="about"
      className="section about site-container"
      aria-labelledby="about-title"
    >
      <SectionHeading section="about" />
      <div className="about-grid">
        <div className="about-intro rv">
          <span className="mono">{COPY.about.greeting}</span>
          <h3>
            {PROFILE.displayName}
            <em>.</em>
          </h3>
          <p>{PROFILE.aboutLine}</p>
          <p className="about-school">{PROFILE.aboutDetail}</p>
          <div className="about-rule" />
          <p className="about-quote">“{PROFILE.quote}”</p>
          <span className="sr-only">{PROFILE.quoteSource}</span>
          <div className="about-links">
            <a className="button button-primary" href={PROFILE.resume} download>
              {COPY.ui.resume} ↓
            </a>
            <a
              className="social-link"
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
            >
              {COPY.ui.github} ↗
            </a>
            <a
              className="social-link"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              {COPY.ui.linkedin} ↗
            </a>
          </div>
        </div>
        <div className="lanyard-column rv">
          <div className="id-orbit" aria-hidden="true">
            <i />
            <span />
          </div>
          <div className="lanyard-anchor" />
          <div
            ref={hanger}
            className="lanyard-hanger"
            onPointerMove={(e) => {
              if (
                e.pointerType !== "mouse" ||
                prefersReducedMotion() ||
                (e.target instanceof Element &&
                  e.target.closest(".lanyard-strap, .id-hover-zone"))
              )
                return;
              const p = physics.current;
              const now = performance.now();
              if (now - p.lastTime < 100)
                p.velocity += Math.max(
                  -1.2,
                  Math.min(1.2, (e.clientX - p.lastX) * 0.04),
                );
              p.lastX = e.clientX;
              p.lastTime = now;
            }}
          >
            <button
              className="lanyard-strap"
              aria-label={COPY.about.drag}
              onPointerDown={(event) => {
                if (prefersReducedMotion()) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                physics.current.lastX = event.clientX;
              }}
              onPointerMove={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId))
                  return;
                swing(
                  Math.max(
                    -1.5,
                    Math.min(
                      1.5,
                      (event.clientX - physics.current.lastX) * 0.07,
                    ),
                  ),
                );
                physics.current.lastX = event.clientX;
              }}
              onPointerUp={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  swing(event.key === "ArrowLeft" ? -1.8 : 1.8);
                }
              }}
              onClick={(event) => {
                if (event.detail === 0) swing();
              }}
            >
              <span aria-hidden="true">
                {PROFILE.name} · {PROFILE.role}
              </span>
            </button>
            <div className="lanyard-clip" aria-hidden="true" />
            <div
              className="id-hover-zone"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  cardHovered.current = true;
                  setHover(true);
                }
              }}
              onPointerLeave={() => {
                cardHovered.current = false;
                setHover(false);
              }}
            >
              <button
                className={`id-card ${flipped || hover ? "is-flipped" : ""}`}
                aria-label={`${PROFILE.name}. ${COPY.about.flip}`}
                aria-pressed={flipped || hover}
                onClick={() => setFlipped((v) => !v)}
              >
                <span
                  className="id-face id-front"
                  aria-hidden={flipped || hover}
                >
                  <span className="id-band mono">
                    {COPY.about.badge}
                    <span>↗</span>
                  </span>
                  <span className="id-photo">
                    <img
                      src="/portrait-bust.webp"
                      alt={PROFILE.portraitAlt}
                      width="128"
                      height="156"
                      loading="lazy"
                    />
                  </span>
                  <span className="id-name">
                    {PROFILE.displayName}
                    <br />
                    {PROFILE.name.split(" ").at(-1)}
                  </span>
                  <span className="id-role">{PROFILE.role}</span>
                  <span className="id-details">
                    <span>
                      {COPY.ui.degree}
                      <b>{PROFILE.degree}</b>
                    </span>
                    <span>
                      {COPY.ui.score}
                      <b>{PROFILE.cgpa}</b>
                    </span>
                    <span>
                      {COPY.ui.graduation}
                      <b>{PROFILE.graduation}</b>
                    </span>
                  </span>
                  <span className="id-bottom">
                    <span className="barcode" aria-hidden="true">
                      {Array.from({ length: 31 }, (_, i) => (
                        <i key={i} style={{ width: i % 3 === 0 ? 3 : 1 }} />
                      ))}
                    </span>
                    <span className="id-sticker" aria-hidden="true">
                      ✳
                    </span>
                  </span>
                </span>
                <span
                  className="id-face id-back"
                  aria-hidden={!(flipped || hover)}
                >
                  <span className="mono">{COPY.about.back}</span>
                  <span className="id-back-title">
                    {PROFILE.displayName}
                    <em>.</em>
                  </span>
                  <span className="id-back-facts">
                    {COPY.about.facts.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </span>
                  <span className="id-found">
                    {COPY.about.found}
                    <br />
                    {PROFILE.email}
                  </span>
                  <span className="id-signature">{COPY.about.signature}</span>
                </span>
              </button>
            </div>
          </div>
          <div
            className="id-controls"
            role="group"
            aria-label={COPY.about.controls}
          >
            <div className="id-face-controls">
              <button
                aria-pressed={!(flipped || hover)}
                onClick={() => {
                  setFlipped(false);
                  setHover(false);
                }}
              >
                {COPY.about.front}
              </button>
              <button
                aria-pressed={flipped || hover}
                onClick={() => {
                  setFlipped(true);
                  setHover(false);
                }}
              >
                {COPY.about.reverse}
              </button>
            </div>
            <button
              className="id-swing-control"
              aria-label={COPY.about.swing}
              onClick={() => swing()}
              disabled={reduced}
            >
              <span aria-hidden="true">↝</span>
            </button>
          </div>
          <p className="mono flip-hint">↻ {COPY.about.flip}</p>
        </div>
        <aside className="quick-facts rv">
          <h3 className="mono">{COPY.about.quickFacts}</h3>
          <dl>
            {facts.map(([label, value], index) => (
              <div key={label}>
                <span className="fact-index mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt className="mono">{label}</dt>
                <dd>
                  {label === COPY.ui.email ? (
                    <a href={`mailto:${value}`}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <span className="about-asterisk" aria-hidden="true">
            ✳
          </span>
        </aside>
      </div>
      <style>{`
.about {
  border-top: 1px solid var(--line);
}
.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px minmax(0, 1fr);
  gap: clamp(25px, 4vw, 65px);
  align-items: stretch;
}
.about-intro {
  padding-top: 55px;
}
.about-intro > h3 {
  font-size: clamp(34px, 3vw, 46px);
  line-height: 1.06;
  letter-spacing: -0.035em;
  margin: 15px 0 25px;
}
.about-intro > h3 em {
  color: var(--muted-text);
}
.about-intro > p {
  font-size: 15px;
  line-height: 1.7;
}
.about-school {
  color: var(--ink-2);
  margin-top: 6px;
  max-width: 290px;
}
.about-rule {
  width: 38px;
  height: 1px;
  background: var(--line);
  margin-block: 28px;
}
.about-intro .about-quote {
  font-family: var(--font-serif);
  font-size: 25px;
  line-height: 1.3;
  color: var(--muted-text);
  max-width: 260px;
}
.about-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-top: 30px;
}
.about-links .button {
  padding: 12px 19px;
}
.social-link {
  font-size: 12px;
  border-bottom: 1px solid var(--line);
  padding-block: 7px;
}
.lanyard-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.lanyard-anchor {
  width: 40px;
  height: 4px;
  border-radius: 5px;
  background: #c7c4bd;
}
.lanyard-hanger {
  transform: rotate(var(--swing, 0deg));
  transform-origin: 50% 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 300px;
}
.lanyard-strap {
  width: 30px;
  height: 56px;
  background: #252525;
  color: #eee;
  overflow: hidden;
  position: relative;
  border-left: 3px solid #444;
  border-right: 3px solid #444;
}
.lanyard-strap span {
  position: absolute;
  writing-mode: vertical-rl;
  font-size: 9px;
  letter-spacing: 0.08em;
  white-space: nowrap;
  left: 7px;
  animation: strap-scroll 14s linear infinite;
}
.lanyard-clip {
  height: 24px;
  width: 19px;
  border: 3px solid #a8a8a8;
  outline: 1px solid #777;
  border-radius: 5px;
  position: relative;
  z-index: 2;
  margin-bottom: -9px;
  background: #ecebea;
}
.id-card {
  position: relative;
  width: 300px;
  height: 404px;
  transform-style: preserve-3d;
  transition: transform 1.1s var(--ease);
  text-align: left;
  border-radius: 20px;
  perspective: 1000px;
}
.id-card.is-flipped {
  transform: rotateY(180deg);
}
.id-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 20px 45px #0000000c,
    0 2px 5px #00000008,
    inset 0 0 0 1px #00000015;
}
.id-band {
  height: 46px;
  background: var(--ink);
  color: white;
  width: 100%;
  padding: 20px 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 9px;
}
.id-photo {
  width: 132px;
  height: 156px;
  border: 4px solid #eee;
  border-radius: 17px;
  overflow: hidden;
  margin-top: 16px;
  box-shadow: 0 0 25px #00000009;
  flex-shrink: 0;
}
.id-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1);
  transition: transform 0.8s var(--ease);
}
.id-card:hover .id-photo img {
  transform: scale(1.06);
}
.id-name {
  text-align: center;
  font-size: 20px;
  line-height: 1.04;
  font-weight: 600;
  letter-spacing: -0.04em;
  margin-top: 12px;
}
.id-role {
  font-size: 9px;
  color: var(--muted-text);
  margin-top: 6px;
}
.id-details {
  display: flex;
  flex-direction: column;
  width: calc(100% - 40px);
  margin-top: 14px;
  gap: 5px;
}
.id-details > span {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9px;
  color: var(--muted-text);
}
.id-details b {
  font-weight: 400;
  color: var(--ink);
}
.id-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 40px);
  margin-top: 12px;
}
.barcode {
  display: flex;
  height: 20px;
  gap: 2px;
}
.barcode i {
  background: var(--ink);
}
.id-sticker {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  border: 1px solid #bbb;
  border-radius: 50%;
  color: #888;
  background: #eee;
}
.id-back {
  transform: rotateY(180deg);
  align-items: flex-start;
  padding: 30px 25px;
}
.id-back-title {
  font-size: 29px;
  font-weight: 550;
  letter-spacing: -0.04em;
  margin-top: 24px;
}
.id-back-facts {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 15px;
  gap: 0;
}
.id-back-facts > span {
  font-size: 11px;
  padding: 11px 0;
  border-bottom: 1px solid var(--line);
}
.id-signature {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 31px;
  align-self: flex-end;
  margin-top: 16px;
}
.id-found {
  font-size: 9px;
  line-height: 1.8;
  color: var(--muted-text);
  margin-top: 10px;
}
.flip-hint {
  font-size: 9px;
  margin-top: 24px;
  color: var(--muted-text);
}
.quick-facts {
  padding-top: 60px;
}
.quick-facts > h3 {
  margin-bottom: 20px;
}
.quick-facts dl {
  margin: 0;
}
.quick-facts dl > div {
  padding-block: 17px;
  border-bottom: 1px solid var(--line);
}
.quick-facts dt {
  font-size: 9px;
  color: var(--muted-text);
  margin-bottom: 8px;
}
.quick-facts dd {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
  overflow-wrap: anywhere;
}
.quick-facts dd > a {
  font-size: 12px;
}
.about-asterisk {
  font-size: 58px;
  display: block;
  color: #bcb9b2;
  margin-top: 30px;
}
@keyframes strap-scroll {
  from {
    transform: translateY(40px);
  }
  to {
    transform: translateY(-280px);
  }
}
@media (max-width: 1050px) {
  .about-grid {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 30px;
  }
  .quick-facts {
    grid-column: 1/-1;
    padding-top: 20px;
  }
  .quick-facts dl {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  .about-asterisk {
    display: none;
  }
}
@media (max-width: 680px) {
  .about-grid {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .about-intro {
    padding-top: 0;
  }
  .about-intro h3 {
    font-size: 40px;
  }
  .about-school,
  .about-intro .about-quote {
    max-width: none;
  }
  .lanyard-column {
    margin-block: 15px;
  }
  .quick-facts {
    padding-top: 0;
  }
  .quick-facts dl {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .quick-facts dd > a {
    font-size: 11px;
  }
  .about .section-head {
    margin-bottom: 40px;
  }
}

.about-intro > p {
  font-size: 16px;
  line-height: 1.75;
}
.about-intro .about-quote {
  font-size: 28px;
  max-width: 290px;
}
.about-links {
  gap: 17px;
}
.social-link {
  font-size: 13px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
.id-card {
  box-shadow: 0 30px 60px #00000006;
}
.id-front {
  background: #fff;
}
.id-photo {
  box-shadow: 0 8px 24px #0000000a;
}
.id-details {
  gap: 6px;
}
.id-name {
  margin-top: 10px;
}
.id-bottom {
  margin-top: 9px;
}
.quick-facts dd {
  font-size: 16px;
}
.quick-facts dd > a {
  font-size: 13px;
}
.flip-hint {
  letter-spacing: 0.045em;
}
.quick-facts dl > div {
  padding-block: 19px;
}
@media (max-width: 680px) {
  .about-intro > h3 {
    font-size: 46px;
  }
  .quick-facts dd {
    font-size: 14px;
  }
  .quick-facts dd > a {
    font-size: 12px;
  }
  .id-card {
    height: 416px;
  }
  .id-details {
    margin-top: 12px;
  }
}

.lanyard-column {
  position: relative;
  isolation: isolate;
}
.lanyard-column:before {
  content: "";
  position: absolute;
  inset: 30px -8px 30px;
  border: 1px solid var(--line);
  border-radius: 160px 160px 28px 28px;
  z-index: -1;
  background: #efede8;
}
.lanyard-column:after {
  content: "";
  position: absolute;
  inset: 46px 8px 46px;
  border: 1px solid #ffffffb3;
  border-radius: 145px 145px 20px 20px;
  z-index: -1;
  pointer-events: none;
}
.quick-facts {
  align-self: center;
  background: #ffffff85;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 28px !important;
  position: relative;
}
.quick-facts > h3 {
  padding-bottom: 8px;
}
.quick-facts dl {
  margin-bottom: 0;
}
.quick-facts dl > div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.about-asterisk {
  position: absolute;
  right: 24px;
  top: 14px;
  margin: 0;
  font-size: 32px;
  color: #aaa69e;
}
.about-rule {
  width: 100%;
  max-width: 240px;
}
.about-intro .about-quote {
  padding-left: 17px;
  border-left: 2px solid #c9c5bd;
}
.id-front {
  box-shadow:
    inset 0 0 0 5px white,
    inset 0 0 0 6px #0d0d0d09;
}
.id-sticker {
  border: 1px solid #bbb7af;
  outline: 3px solid #f4f2ee;
  outline-offset: -6px;
}
@media (max-width: 1050px) {
  .quick-facts {
    width: 100%;
  }
}
@media (max-width: 680px) {
  .lanyard-column {
    padding-block: 12px;
  }
  .lanyard-column:before {
    inset: 25px 0 25px;
  }
  .lanyard-column:after {
    inset: 41px 16px;
  }
  .quick-facts {
    padding: 22px !important;
  }
  .quick-facts dl {
    gap: 12px;
  }
}

/* A paper identity folio with an independently animated hanging badge. */
.about .section-head{max-width:1080px;margin-bottom:66px}
.about-grid{grid-template-columns:minmax(0,1fr) 340px minmax(0,1fr);gap:clamp(30px,4vw,65px)}
.about-intro{padding-top:42px;align-self:center;padding-bottom:42px}
.about-intro > .mono{font-size:9px;color:var(--muted-text);letter-spacing:.12em}
.about-intro > h3{font-size:clamp(38px,3.5vw,52px);font-weight:500;letter-spacing:-.05em;margin-block:18px 27px}
.about-intro > p{font-size:16px;line-height:1.8}
.about-school{max-width:320px;color:var(--muted-text)}
.about-rule{margin-block:29px;width:100%;max-width:280px;transform-origin:left;transition:transform 1.2s var(--ease)}
.about-intro.rv-pending:not(.is-in) .about-rule{transform:scaleX(0)}
.about-intro .about-quote{font-size:31px;line-height:1.25;border-left:0;padding:0;max-width:310px}
.about-links{gap:13px}.about-links .button{width:100%;max-width:165px}.about-links .social-link{font-size:12px;transition:color .4s var(--ease),border-color .4s var(--ease)}.social-link:hover{border-color:var(--ink);color:var(--ink)}
.lanyard-column{min-height:620px;padding-top:18px;align-self:stretch}
.lanyard-column:before{inset:56px -4px 75px;border-radius:170px 170px 28px 28px;background:#efede8}
.lanyard-column:after{inset:70px 10px 90px;border-radius:155px 155px 20px 20px}
.id-orbit{position:absolute;inset:120px -11px 125px;border:1px solid #0d0d0d0a;border-radius:50%;z-index:-1;pointer-events:none;transform:rotate(-18deg)}
.id-orbit > i{position:absolute;inset:0;border-radius:50%;animation:id-orbit-turn 36s linear infinite;animation-play-state:paused}.id-orbit > i:before{content:"";position:absolute;left:50%;top:-3px;width:5px;height:5px;border:1px solid #0d0d0d30;background:var(--paper);border-radius:50%}.lanyard-column[data-visible="true"] .id-orbit > i{animation-play-state:running}
.lanyard-hanger{perspective:1100px}.lanyard-anchor{width:62px;height:5px;box-shadow:0 2px 0 #ffffff80,inset 0 1px 2px #00000015}
.lanyard-strap{width:36px;height:66px;cursor:grab;touch-action:none;border-inline:3px double #777;flex-shrink:0}.lanyard-strap:active{cursor:grabbing}.lanyard-strap span{left:10px}.lanyard-strap:focus-visible{outline-offset:6px}
.lanyard-clip{height:27px;width:21px;box-shadow:inset 0 0 0 2px white,1px 3px 3px #0000001a}
.id-card{height:438px;border-radius:23px;transition:transform 950ms var(--ease);box-shadow:none}
.id-face{border-radius:23px;box-shadow:0 25px 45px #0000000c,0 3px 8px #00000008,inset 0 0 0 1px #00000015}
.id-front{background:#fff}.id-band{height:48px;flex-shrink:0;padding-inline:22px;letter-spacing:.15em}.id-band > span{font-size:15px;opacity:.8}
.id-photo{margin-top:20px;width:140px;height:164px;border:5px solid #f0efeb;border-radius:70px 70px 20px 20px;box-shadow:0 10px 25px #00000008}
.id-name{margin-top:14px;font-size:22px;font-weight:550}.id-role{font-size:10px;margin-top:7px}.id-details{margin-top:16px;gap:7px}.id-details > span{font-size:9px}.id-bottom{margin-top:14px}.barcode{height:22px}.id-sticker{width:31px;height:31px;color:#65635d;transition:transform .8s var(--ease)}.id-card:hover .id-sticker{transform:rotate(90deg)}
.id-back{padding:28px 25px;background:#fbfaf8}.id-back:before{content:"";position:absolute;inset:9px;border:1px solid var(--line);border-radius:16px;pointer-events:none}.id-back-title{font-size:30px;margin-top:22px}.id-back-facts > span{font-size:12px;padding-block:11px}.id-signature{margin-top:18px;font-size:34px}.id-found{font-size:10px;margin-top:auto;padding-top:12px}
.id-controls{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:24px;z-index:2}.id-face-controls{padding:4px;background:#ffffffa6;border:1px solid var(--line);border-radius:99px;display:flex;gap:3px}.id-face-controls button{min-width:72px;min-height:36px;border-radius:99px;padding:8px 14px;font-size:11px;transition:background .4s var(--ease),color .4s var(--ease)}.id-face-controls button[aria-pressed="true"]{background:var(--ink);color:white}.id-face-controls button:hover:not([aria-pressed="true"]){background:var(--soft)}.id-swing-control{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:#ffffffa6;font-size:25px;transition:transform .5s var(--ease),background .5s var(--ease)}.id-swing-control:hover:not(:disabled){transform:rotate(-12deg);background:white}.id-swing-control:disabled{opacity:.4}.flip-hint{margin-top:13px;font-size:8px;letter-spacing:.055em}
.quick-facts{background:transparent;border:0;border-radius:0;box-shadow:none;padding:30px 0!important;align-self:center}.quick-facts > h3{padding-bottom:20px;margin-bottom:0;border-bottom:1px solid var(--line);font-size:10px}.quick-facts dl > div{position:relative;padding:23px 15px 23px 37px;transition:background .5s var(--ease),padding-left .5s var(--ease)}.quick-facts dl > div:hover{background:#ffffff85;padding-left:43px}.quick-facts dl > div:last-child{padding-bottom:23px;border-bottom:1px solid var(--line)}.fact-index{position:absolute;left:0;top:24px;font-size:8px;color:var(--muted-text)}.quick-facts dt{font-size:9px;margin-bottom:9px}.quick-facts dd{font-size:17px;line-height:1.45;letter-spacing:-.015em}.quick-facts dd > a{font-size:13px}.about-asterisk{font-size:25px;right:0;top:19px;color:var(--muted-text);transition:transform 1s var(--ease)}.quick-facts:hover .about-asterisk{transform:rotate(90deg)}
@keyframes id-orbit-turn{to{transform:rotate(360deg)}}
@media(max-width:1050px){.about-grid{grid-template-columns:minmax(0,1fr) 340px;gap:30px}.quick-facts{padding-top:20px!important}.quick-facts dl{gap:20px}.quick-facts dl > div{padding:22px 0 22px 25px}.quick-facts dl > div:hover{padding-left:25px}.quick-facts dd{font-size:15px}.quick-facts dd > a{font-size:12px}}
@media(max-width:680px){.about .section-head{margin-bottom:38px}.about-grid{display:flex;gap:24px}.about-intro{padding:0;align-self:stretch}.about-intro > h3{font-size:46px}.about-intro .about-quote{font-size:29px;max-width:100%}.about-links{gap:22px}.about-links .button{max-width:145px}.lanyard-column{width:100%;max-width:360px;min-height:640px;margin:20px auto 0;padding-top:18px}.lanyard-column:before{inset:55px 0 75px}.lanyard-column:after{inset:70px 14px 90px}.id-orbit{inset:120px 0 125px}.id-card{height:438px}.quick-facts{padding:15px 0!important}.quick-facts dl{gap:0 18px}.quick-facts dl > div{padding-left:24px}.quick-facts dd{font-size:15px}.quick-facts dd > a{font-size:12px}}
@media(prefers-reduced-motion:reduce){.lanyard-hanger{transform:none!important}.id-orbit > i{animation:none}.id-card,.id-photo img,.id-sticker{transition:none}.quick-facts dl > div{transition:none}}

.id-orbit{inset:155px auto auto 50%;width:300px;height:300px;transform:translateX(-50%);overflow:clip}
.id-back{padding:25px}
.id-back-title{line-height:1.1;margin-top:16px}
.id-back-facts > span{line-height:1.4;padding-block:8px}
.id-signature{font-size:31px;line-height:1.1;margin-top:auto;padding-top:12px}
.id-found{margin-top:12px;padding-top:0}

/* Keep the hover target stationary while only its inner card rotates. */
.id-hover-zone{position:relative;width:300px;height:438px;flex-shrink:0;perspective:1200px}
.id-card{display:block;width:100%;height:100%;perspective:none;transform-style:preserve-3d;will-change:transform;transition:transform 850ms cubic-bezier(.4,0,.2,1)}
.id-front{transform:translateZ(.5px)}
.id-back{transform:rotateY(180deg) translateZ(.5px)}
@media(prefers-reduced-motion:reduce){.id-card{transition:none;will-change:auto}}
`}</style>
    </section>
  );
}
