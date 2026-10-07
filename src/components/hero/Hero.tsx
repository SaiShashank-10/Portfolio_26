"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, COPY } from "@/lib/data";
import { withBasePath } from "@/lib/basePath";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const section = useRef<HTMLElement>(null),
    video = useRef<HTMLVideoElement>(null),
    visible = useRef(true),
    wantSound = useRef(true),
    manualPause = useRef(false),
    playbackRequest = useRef(0);
  const [sound, setSound] = useState(false),
    [blocked, setBlocked] = useState(true),
    [playing, setPlaying] = useState(false),
    [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    const v = video.current,
      el = section.current;
    if (!v || !el) return;
    let alive = true;
    const sync = () => {
      setSound(!v.muted);
      setPlaying(!v.paused);
    };
    const play = async (audible: boolean) => {
      if (!visible.current || manualPause.current || document.hidden) return;
      const request = ++playbackRequest.current;
      v.muted = !audible;
      try {
        await v.play();
        if (!alive || request !== playbackRequest.current) return;
        setBlocked(false);
      } catch {
        if (!alive || request !== playbackRequest.current) return;
        v.muted = true;
        try {
          await v.play();
        } catch {}
        if (!alive || request !== playbackRequest.current) return;
        setBlocked(true);
      }
      if (!visible.current || document.hidden || manualPause.current) v.pause();
      if (alive) sync();
    };
    const unlock = (e: Event) => {
      if (
        e.target instanceof Element &&
        e.target.closest("[data-video-control]")
      )
        return;
      if (visible.current && wantSound.current && !manualPause.current)
        void play(true);
    };
    if (prefersReducedMotion()) {
      manualPause.current = true;
      setBlocked(false);
    } else void play(true);
    const io = new IntersectionObserver(
      (entries) => {
        visible.current = entries[0].intersectionRatio >= 0.35;
        if (visible.current) void play(wantSound.current);
        else {
          playbackRequest.current++;
          v.pause();
          sync();
        }
      },
      { threshold: [0, 0.35, 1] },
    );
    io.observe(el);
    const visibility = () => {
      if (document.hidden) v.pause();
      else if (visible.current) void play(wantSound.current);
    };
    document.addEventListener("visibilitychange", visibility);
    const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => {
      if (motionPreference.matches) {
        manualPause.current = true;
        v.pause();
        setBlocked(false);
      }
    };
    motionPreference.addEventListener("change", motionChanged);
    ["pointerdown", "keydown", "touchend"].forEach((name) =>
      document.addEventListener(name, unlock, { passive: true }),
    );
    v.addEventListener("play", sync);
    v.addEventListener("pause", sync);
    v.addEventListener("volumechange", sync);
    return () => {
      alive = false;
      io.disconnect();
      v.pause();
      document.removeEventListener("visibilitychange", visibility);
      motionPreference.removeEventListener("change", motionChanged);
      ["pointerdown", "keydown", "touchend"].forEach((name) =>
        document.removeEventListener(name, unlock),
      );
      v.removeEventListener("play", sync);
      v.removeEventListener("pause", sync);
      v.removeEventListener("volumechange", sync);
    };
  }, []);
  const toggleSound = async () => {
    const v = video.current;
    if (!v) return;
    playbackRequest.current++;
    if (!v.muted) {
      wantSound.current = false;
      v.muted = true;
      setSound(false);
    } else {
      manualPause.current = false;
      wantSound.current = true;
      v.muted = false;
      try {
        await v.play();
        setSound(true);
        setBlocked(false);
      } catch {
        setBlocked(true);
      }
    }
  };
  const togglePlayback = async () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      manualPause.current = false;
      try {
        await v.play();
        setPlaying(true);
      } catch {
        setBlocked(true);
      }
    } else {
      manualPause.current = true;
      v.pause();
      setPlaying(false);
    }
  };
  return (
    <section
      ref={section}
      id="hero"
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero-stage" aria-hidden="true">
        <span />
        <span />
      </div>
      <span className="hero-ghost" aria-hidden="true">
        {Array.from(PROFILE.firstName.toUpperCase()).map((letter, index) => (
          <span className="hero-ghost-letter" key={`${letter}-${index}`}>
            <span>{letter}</span>
          </span>
        ))}
      </span>
      <div className="hero-film">
        <img
          className="hero-poster"
          src={withBasePath("/hero/poster.webp")}
          alt=""
          aria-hidden="true"
          width="768"
          height="960"
          fetchPriority="high"
        />
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          className={videoReady ? "video-ready" : ""}
          onPlaying={() => setVideoReady(true)}
          poster={withBasePath("/hero/poster.webp")}
          aria-label={PROFILE.videoText}
          aria-describedby="video-description"
        >
          <source src={withBasePath("/hero/hero.webm")} type="video/webm" />
          <source src={withBasePath("/hero/hero.mp4")} type="video/mp4" />
        </video>
      </div>
      <div className="hero-copy">
        <p className="mono hero-eyebrow">
          <span /> {COPY.hero.eyebrow}
        </p>
        <h1 id="hero-title">
          {COPY.hero.headingStart} <br />
          <span>
            <em>{COPY.hero.headingEnd}</em>
          </span>
        </h1>
        <p className="hero-name">{COPY.hero.subtitle}</p>
        <div className="hero-ctas">
          <a
            className="button button-primary"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("work");
            }}
          >
            {COPY.hero.explore}
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="button"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("contact");
            }}
          >
            {COPY.hero.contact}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <a className="hero-resume" href={withBasePath(PROFILE.resume)} download>
          {COPY.hero.resume}
        </a>
      </div>
      <div className="hero-bottom">
        <a
          href="#about"
          className="scroll-cue mono"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("about");
          }}
        >
          <span className="scroll-arrow">↓</span>
          {COPY.hero.scroll}
        </a>
        <dl className="hero-academic">
          <div>
            <dt>{COPY.ui.degree}</dt>
            <dd>{PROFILE.degree}</dd>
          </div>
          <div>
            <dt>{COPY.ui.score}</dt>
            <dd>{PROFILE.cgpa}</dd>
          </div>
          <div>
            <dt>{COPY.ui.graduation}</dt>
            <dd>{PROFILE.graduation}</dd>
          </div>
        </dl>
        <div className="film-controls">
          <button
            data-video-control
            className="motion-control"
            aria-label={playing ? COPY.ui.pause : COPY.ui.play}
            onClick={togglePlayback}
          >
            {playing ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M5 3v10M11 3v10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <span aria-hidden="true">▷</span>
            )}
          </button>
          <button
            data-video-control
            className={`sound-control ${blocked ? "sound-blocked" : ""}`}
            aria-label={sound ? COPY.ui.mute : COPY.ui.unmute}
            aria-pressed={sound}
            onClick={toggleSound}
          >
            <span aria-hidden="true">{sound ? "❚❚" : "▶"}</span>
          </button>
        </div>
      </div>
      <p id="video-description" className="sr-only">
        {PROFILE.videoText}
      </p>
      <style>{`
.hero {
  background: var(--paper);
  position: relative;
  height: max(820px, 100svh);
  max-height: 1120px;
  isolation: isolate;
  overflow: clip;
  min-width: 0;
}
.hero-ghost {
  position: absolute;
  z-index: -2;
  left: 50%;
  top: 12%;
  transform: translateX(-50%);
  font-size: clamp(260px, 39vw, 680px);
  line-height: 0.9;
  letter-spacing: -0.07em;
  font-weight: 650;
  color: transparent;
  -webkit-text-stroke: 1px #0d0d0d17;
  user-select: none;
}
.hero-film {
  position: absolute;
  z-index: -1;
  left: 50%;
  bottom: 25px;
  transform: translateX(-50%);
  height: min(96svh, 1040px);
  aspect-ratio: 768/960;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.hero-poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(1) brightness(1.085);
}
.hero-film video {
  position: relative;
  opacity: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(1) brightness(1.085);
}
.hero-film video.video-ready {
  opacity: 1;
}
.hero-copy {
  position: absolute;
  left: var(--gutter);
  top: 43%;
  max-width: 42%;
  z-index: 2;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 23px;
  font-size: 10px;
  letter-spacing: 0.07em;
}
.hero-eyebrow > span {
  width: 5px;
  height: 5px;
  background: var(--ink);
  border-radius: 50%;
}
.hero h1 {
  font-size: clamp(40px, 4.3vw, 68px);
  font-weight: 550;
  line-height: 1.04;
  letter-spacing: -0.047em;
  white-space: nowrap;
}
.hero h1 em {
  color: var(--ink-2);
}
.hero-name {
  font-size: 14px;
  color: var(--ink-2);
  margin-top: 22px;
}
.hero-ctas {
  display: flex;
  gap: 9px;
  margin-top: 29px;
}
.hero-resume {
  display: inline-block;
  font-size: 12px;
  margin-top: 24px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 4px;
}
.hero-side {
  position: absolute;
  right: var(--gutter);
  top: 48%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: right;
  color: var(--ink-2);
}
.hero-bottom {
  position: absolute;
  bottom: 30px;
  left: var(--gutter);
  right: var(--gutter);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.scroll-cue {
  display: flex;
  align-items: center;
  gap: 15px;
}
.scroll-arrow {
  font-size: 20px;
  animation: scroll-nudge 2.5s var(--ease) infinite;
}
.film-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
.motion-control {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--paper);
}
.sound-control {
  position: relative;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--ink);
  color: white;
  font-size: 13px;
}
.sound-blocked::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid #0d0d0d40;
  border-radius: 50%;
  animation: sound-ping 2s ease-out infinite;
}
@keyframes sound-ping {
  to {
    transform: scale(1.5);
    opacity: 0;
  }
}
@keyframes scroll-nudge {
  50% {
    transform: translateY(5px);
  }
}
@media (min-width: 1600px) {
  .hero-copy {
    left: max(var(--gutter), calc((100vw - 1320px) / 2));
  }
  .hero-side {
    right: max(var(--gutter), calc((100vw - 1320px) / 2));
  }
}
@media (max-width: 1100px) and (min-width: 761px) {
  .hero h1 {
    font-size: 40px;
  }
  .hero-film {
    left: 61%;
  }
  .hero-side {
    top: 23%;
  }
  .hero-copy {
    max-width: 48%;
  }
}
@media (max-width: 760px) {
  .hero {
    height: auto;
    min-height: 960px;
    max-height: none;
    padding-top: 100px;
    padding-bottom: 95px;
    display: flex;
    flex-direction: column;
  }
  .hero-ghost {
    top: 105px;
    font-size: 71vw;
    letter-spacing: -0.06em;
  }
  .hero-film {
    position: relative;
    left: auto;
    bottom: auto;
    transform: none;
    height: 62svh;
    max-height: 570px;
    min-height: 410px;
    align-self: center;
    max-width: 100%;
    margin-top: -5px;
  }
  .hero-copy {
    position: relative;
    left: auto;
    top: auto;
    max-width: none;
    padding-inline: var(--gutter);
    margin-top: 8px;
  }
  .hero-eyebrow {
    font-size: 10px;
    margin-bottom: 15px;
  }
  .hero h1 {
    font-size: clamp(36px, 8.8vw, 62px);
  }
  .hero-name {
    margin-top: 14px;
  }
  .hero-ctas {
    margin-top: 22px;
  }
  .hero-resume {
    margin-top: 20px;
  }
  .hero-side {
    display: none;
  }
  .hero-bottom {
    bottom: 24px;
  }
  .hero-ctas .button {
    padding: 13px 21px;
  }
  .hero .scroll-cue {
    font-size: 10px;
  }
  .hero .film-controls {
    position: absolute;
    right: 0;
    bottom: 340px;
  }
}

.hero-name {
  font-size: 17px;
  letter-spacing: -0.015em;
}
.hero-copy {
  top: 40%;
}
.hero-eyebrow {
  letter-spacing: 0.12em;
}
.hero-side {
  top: 34%;
  width: 208px;
  gap: 13px;
}
.hero-projects {
  margin-top: 24px;
  padding-top: 23px;
  border-top: 1px solid var(--line);
  text-align: left;
}
.hero-projects > span {
  display: block;
  margin-bottom: 12px;
  color: var(--muted-text);
}
.hero-projects > a {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-inter);
  text-transform: none;
  letter-spacing: -0.02em;
  font-size: 17px;
  transition: padding 0.4s var(--ease);
}
.hero-projects > a:hover {
  padding-left: 6px;
}
.hero-projects > a > .mono {
  font-size: 9px;
  color: var(--muted-text);
}
.hero-projects > a > span:last-child {
  margin-left: auto;
}
.hero-resume {
  font-size: 14px;
  padding-block: 8px;
}
.motion-control {
  width: 44px;
  height: 44px;
}
.hero-bottom {
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
@media (min-width: 761px) and (max-width: 1100px) {
  .hero-side {
    top: 20%;
    width: 155px;
  }
  .hero-projects {
    display: none;
  }
}
@media (max-width: 760px) {
  .hero-copy {
    top: auto;
  }
  .hero-name {
    font-size: 16px;
  }
  .hero-resume {
    margin-top: 10px;
  }
  .hero-bottom {
    border-top: 0;
    padding-top: 0;
  }
  .hero h1 {
    line-height: 1.08;
  }
  .hero-eyebrow {
    letter-spacing: 0.07em;
  }
}

.hero:before,
.hero:after {
  content: "";
  position: absolute;
  top: 135px;
  width: 22px;
  height: 22px;
  border-top: 1px solid #0d0d0d25;
  pointer-events: none;
}
.hero:before {
  left: var(--gutter);
  border-left: 1px solid #0d0d0d25;
}
.hero:after {
  right: var(--gutter);
  border-right: 1px solid #0d0d0d25;
}
.hero-projects {
  position: relative;
  padding: 23px 20px 0;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #ffffff42;
}
.hero-projects > a:last-child {
  border-bottom: 0;
}
.hero-projects > a {
  font-size: 16px;
}
.hero-side {
  width: 232px;
}
.hero h1 {
  letter-spacing: -0.06em;
}
.hero-ghost {
  display: flex;
  white-space: nowrap;
  pointer-events: none;
  -webkit-text-stroke-color: #0d0d0d38;
}
.hero-ghost-letter {
  display: block;
  pointer-events: auto;
}
.hero-ghost-letter > span {
  display: block;
  opacity: 0;
  transform: translateY(5px) scale(0.985);
  transform-origin: 50% 65%;
  transition:
    opacity 360ms var(--ease),
    transform 650ms var(--ease);
}
@media (hover: hover) and (pointer: fine) {
  .hero-ghost-letter:hover > span {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-ghost-letter > span {
    transition: none;
    transform: none;
  }
}
.hero-name {
  display: flex;
  align-items: center;
  gap: 14px;
}
.hero-name:before {
  content: "";
  width: 24px;
  height: 1px;
  background: #aaa69e;
}
.film-controls {
  padding: 5px;
  border: 1px solid var(--line);
  border-radius: 50px;
  background: #f4f2eecc;
}
.sound-control {
  transition: transform 0.4s var(--ease);
}
.sound-control:hover {
  transform: scale(1.06);
}
@media (max-width: 1100px) {
  .hero-side {
    width: 155px;
  }
}
@media (max-width: 760px) {
  .hero:before,
  .hero:after {
    top: 116px;
    width: 16px;
    height: 16px;
  }
  .hero .film-controls {
    bottom: 332px;
  }
  .hero-name:before {
    width: 18px;
  }
}

/* Hero composition: portrait stage, editorial title and a quiet project directory. */
.hero-stage {
  position: absolute;
  z-index: -3;
  left: 50%;
  top: 13%;
  bottom: 12%;
  width: clamp(290px, 32vw, 470px);
  transform: translateX(-50%);
  border: 1px solid #0d0d0d09;
  border-radius: 260px 260px 0 0;
  pointer-events: none;
}
.hero-stage > span {
  position: absolute;
  bottom: -4px;
  width: 7px;
  height: 7px;
  border: 1px solid #0d0d0d25;
  background: var(--paper);
  border-radius: 50%;
}
.hero-stage > span:first-child {
  left: -4px;
}
.hero-stage > span:last-child {
  right: -4px;
}
.hero-film {
  height: min(92svh, 1000px);
  bottom: 68px;
}
.hero-copy {
  top: 34%;
  max-width: 41%;
}
.hero h1 {
  font-size: clamp(46px, 5.25vw, 78px);
  font-weight: 550;
  line-height: 0.99;
  letter-spacing: -0.065em;
}
.hero h1 em {
  display: inline-block;
  font-size: 1.16em;
  line-height: 1.12;
  letter-spacing: -0.05em;
  color: var(--ink-2);
}
.hero-eyebrow {
  margin-bottom: 30px;
  letter-spacing: 0.13em;
  color: var(--muted-text);
  font-size: 10px;
}
.hero-eyebrow > span {
  width: 5px;
  height: 5px;
  background: var(--muted-text);
}
.hero-name {
  font-size: 15px;
  line-height: 1.6;
  max-width: 350px;
  margin-top: 27px;
  letter-spacing: -0.01em;
}
.hero-name:before {
  width: 30px;
  flex-shrink: 0;
}
.hero-ctas {
  margin-top: 32px;
  gap: 10px;
}
.hero-ctas .button {
  min-height: 54px;
  padding-inline: 25px;
}
.hero-ctas .button > span {
  transition: transform 0.5s var(--ease);
}
.hero-ctas .button:hover > span {
  transform: translate(3px, -3px);
}
.hero-resume {
  margin-top: 19px;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid var(--line);
  font-size: 12px;
  letter-spacing: 0.01em;
}
.hero-side {
  top: 39%;
  width: clamp(205px, 18vw, 260px);
}
.hero-projects {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: none;
  text-align: left;
}
.hero-projects > .mono {
  padding-bottom: 18px;
  margin-bottom: 0;
  border-bottom: 1px solid var(--line);
  font-size: 9px;
  letter-spacing: 0.12em;
}
.hero-projects > a {
  position: relative;
  padding: 20px 0;
  gap: 13px;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}
.hero-projects > a:last-child {
  border-bottom: 1px solid var(--line);
}
.hero-projects > a:after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s var(--ease);
}
.hero-projects > a:hover:after,
.hero-projects > a:focus-visible:after {
  transform: scaleX(1);
}
.hero-projects > a > .mono {
  padding-top: 4px;
  font-size: 8px;
}
.hero-project-title {
  font-size: 21px;
  letter-spacing: -0.04em;
  line-height: 1.1;
}
.hero-project-title > small {
  display: block;
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--muted-text);
  margin-top: 7px;
  max-width: 180px;
}
.hero-projects > a > span:last-child {
  font-size: 15px;
  transition: transform 0.5s var(--ease);
}
.hero-projects > a:hover > span:last-child {
  transform: translate(2px, -2px);
}
.hero-bottom {
  align-items: center;
  padding-top: 20px;
  bottom: 24px;
}
.hero-academic {
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: var(--paper);
  padding: 9px 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
}
.hero-academic > div + div {
  border-left: 1px solid var(--line);
  padding-left: 25px;
}
.hero-academic dt {
  font-family: var(--font-mono);
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-text);
  margin-bottom: 4px;
  white-space: nowrap;
}
.hero-academic dd {
  margin: 0;
  font-size: 12px;
  letter-spacing: -0.02em;
  white-space: nowrap;
}
.film-controls {
  gap: 7px;
  padding: 5px;
  background: #ffffff8c;
  box-shadow: 0 5px 15px #00000003;
}
@media (min-width: 761px) and (max-width: 1100px) {
  .hero h1 {
    font-size: clamp(40px, 5vw, 55px);
  }
  .hero-copy {
    top: 36%;
    max-width: 46%;
  }
  .hero-side {
    top: 20%;
    width: 155px;
  }
  .hero-academic {
    gap: 18px;
    padding-inline: 15px;
  }
  .hero-academic > div + div {
    padding-left: 15px;
  }
  .hero-name {
    max-width: 290px;
  }
}
@media (max-width: 760px) {
  .hero {
    min-height: 1000px;
    padding-top: 95px;
    padding-bottom: 160px;
  }
  .hero-film {
    height: 62svh;
    bottom: auto;
  }
  .hero-stage {
    top: 125px;
    bottom: auto;
    height: 440px;
    width: 270px;
    border-radius: 150px 150px 0 0;
  }
  .hero-copy {
    top: auto;
    max-width: none;
    margin-top: 24px;
  }
  .hero h1 {
    font-size: clamp(46px, 11.6vw, 76px);
    line-height: 1;
  }
  .hero h1 em {
    font-size: 1.12em;
  }
  .hero-eyebrow {
    font-size: 9px;
    margin-bottom: 22px;
    letter-spacing: 0.09em;
  }
  .hero-name {
    font-size: 14px;
    margin-top: 20px;
    max-width: none;
    gap: 12px;
  }
  .hero-name:before {
    width: 20px;
  }
  .hero-ctas {
    margin-top: 25px;
  }
  .hero-ctas .button {
    min-height: 50px;
    padding-inline: 23px;
  }
  .hero-resume {
    margin-top: 12px;
  }
  .hero-bottom {
    bottom: 24px;
    min-height: 78px;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    align-items: flex-end;
  }
  .hero-academic {
    position: static;
    transform: none;
    background: none;
    border: 0;
    padding: 0;
    gap: 18px;
  }
  .hero-academic > div + div {
    padding-left: 18px;
  }
  .hero-academic dt {
    font-size: 7px;
  }
  .hero-academic dd {
    font-size: 11px;
  }
  .hero .scroll-cue {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 0;
    gap: 0;
  }
  .hero .scroll-arrow {
    font-size: 23px;
  }
  .hero .film-controls {
    position: absolute;
    right: 0;
    bottom: auto;
    top: -78px;
  }
}
`}</style>
    </section>
  );
}
