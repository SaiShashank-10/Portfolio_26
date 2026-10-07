"use client";
import { useEffect, useRef, useState } from "react";
import { COPY, PROFILE } from "@/lib/data";
import { withBasePath } from "@/lib/basePath";
import { scrollToTarget } from "@/lib/scroll";
export default function Contact() {
  const [copied, setCopied] = useState(false),
    [failed, setFailed] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  useEffect(() => () => clearTimeout(resetTimer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setFailed(false);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
    }
  };
  const letters = (text: string) =>
    text.split(" ").map((word, i) => (
      <span className="contact-word" key={i}>
        {Array.from(word).map((char, j) => (
          <span
            className="hop-letter"
            key={j}
            aria-hidden="true"
            onPointerEnter={(e) => {
              e.currentTarget.classList.remove("hop");
              void e.currentTarget.offsetWidth;
              e.currentTarget.classList.add("hop");
            }}
          >
            {char}
          </span>
        ))}{" "}
      </span>
    ));
  return (
    <section
      id="contact"
      className="contact section site-container"
      aria-labelledby="contact-title"
    >
      <div className="contact-top">
        <p className="mono tag">
          {COPY.sections.contact.index}
          <span>—</span>
          {COPY.sections.contact.tag}
        </p>
        <div className="hello-badge" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs>
              <path
                id="hello-circle"
                d="M50,50m-35,0a35,35 0 1,1 70,0a35,35 0 1,1-70,0"
              />
            </defs>
            <text>
              <textPath href="#hello-circle" textLength="218">
                {COPY.contact.badge}
              </textPath>
            </text>
          </svg>
          <span>↗</span>
        </div>
      </div>
      <h2
        id="contact-title"
        className="contact-title rv"
        aria-label={`${COPY.sections.contact.title} ${COPY.sections.contact.accent}`}
      >
        <span>{letters(COPY.sections.contact.title)}</span>
        <em>{letters(COPY.sections.contact.accent)}</em>
      </h2>
      <p className="contact-note rv">{COPY.improvements.contactNote}</p>
      <div className="contact-correspondence rv">
        <span className="mono contact-address-label">{COPY.ui.email}</span>
        <div className="contact-email-row">
          <a className="contact-email" href={`mailto:${PROFILE.email}`}>
            {PROFILE.email}
          </a>
          <button className="copy-chip" onClick={copy} aria-live="polite">
            {copied ? COPY.contact.copied : COPY.contact.copy}
          </button>
        </div>
        {failed ? (
          <p className="copy-error" role="status">
            {COPY.contact.failed}
          </p>
        ) : null}
        <div className="contact-links rv">
          <a href={PROFILE.phoneHref}>{PROFILE.phone} ↗</a>
          <div>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              {COPY.ui.github} ↗
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              {COPY.ui.linkedin} ↗
            </a>
            <a href={withBasePath(PROFILE.resume)} download>
              {COPY.ui.resume} ↓
            </a>
          </div>
        </div>
      </div>
      <footer>
        <p>
          © {new Date().getFullYear()} {PROFILE.name}
        </p>
        <span>{COPY.contact.built}</span>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("hero");
          }}
        >
          {COPY.contact.top}
        </a>
      </footer>
      <style>{`
.contact {
  padding-bottom: 25px;
}
.contact-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contact-top .tag {
  margin: 0;
}
.hello-badge {
  width: 105px;
  height: 105px;
  position: relative;
}
.hello-badge > svg {
  width: 100%;
  height: 100%;
  animation: hello-spin 25s linear infinite;
}
.hello-badge text {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  fill: var(--ink-2);
}
.hello-badge > span {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 31px;
  font-weight: 300;
}
.contact-title {
  font-size: clamp(53px, 7.6vw, 111px);
  line-height: 1.05;
  font-weight: 500;
  letter-spacing: -0.055em;
  margin-top: 22px;
  max-width: 1200px;
}
.contact-title > span,
.contact-title > em {
  display: block;
}
.contact-title em {
  color: var(--muted-text);
}
.contact-word {
  display: inline-block;
  white-space: pre;
}
.hop-letter {
  display: inline-block;
  transform-origin: bottom;
}
.hop-letter.hop {
  animation: letter-hop 0.65s var(--ease);
}
.contact-email-row {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 58px;
}
.contact-email {
  font-size: clamp(19px, 2.8vw, 39px);
  letter-spacing: -0.025em;
  border-bottom: 1px solid #99958c;
  padding-bottom: 9px;
  overflow-wrap: anywhere;
  min-width: 0;
}
.copy-chip {
  font-size: 10px;
  border: 1px solid #0d0d0d26;
  border-radius: 99px;
  padding: 9px 15px;
  min-height: 37px;
  white-space: nowrap;
  transition: background 0.3s;
}
.copy-chip:hover {
  background: white;
}
.copy-error {
  font-size: 12px;
  margin-top: 10px;
}
.contact-links {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 38px;
  gap: 22px;
  font-size: 13px;
}
.contact-links > div {
  display: flex;
  gap: 30px;
}
.contact-links a {
  padding-block: 10px;
  border-bottom: 1px solid transparent;
}
.contact-links a:hover {
  border-color: var(--ink);
}
.contact footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-top: 1px solid var(--line);
  margin-top: 115px;
  padding-top: 26px;
  font-size: 10px;
  color: var(--muted-text);
}
.contact footer > a {
  color: var(--ink);
}
@keyframes hello-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes letter-hop {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-13px);
  }
  70% {
    transform: translateY(3px);
  }
}
@media (max-width: 700px) {
  .hello-badge {
    width: 78px;
    height: 78px;
  }
  .contact-top .tag {
    font-size: 10px;
    gap: 10px;
  }
  .contact-title {
    font-size: clamp(49px, 9vw, 68px);
    line-height: 1.08;
    margin-top: 32px;
  }
  .contact-title em {
    max-width: 560px;
  }
  .contact-email-row {
    gap: 12px;
    align-items: flex-start;
    flex-wrap: wrap;
    margin-top: 40px;
  }
  .contact-email {
    font-size: clamp(18px, 4.6vw, 28px);
    letter-spacing: -0.035em;
  }
  .copy-chip {
    font-size: 10px;
    padding: 8px 13px;
    min-height: 33px;
  }
  .contact-links {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 25px;
    gap: 16px;
  }
  .contact-links > div {
    gap: 25px;
  }
  .contact footer {
    flex-wrap: wrap;
    font-size: 10px;
    margin-top: 80px;
    gap: 20px 15px;
  }
  .contact footer > p {
    width: 100%;
  }
  .contact footer > a {
    margin-left: auto;
  }
}

.contact-note {
  font-size: 16px;
  color: var(--muted-text);
  line-height: 1.6;
  margin-top: 28px;
}
.contact-email-row {
  margin-top: 36px;
}
.contact-email {
  transition:
    border-color 0.4s,
    color 0.4s;
}
.contact-email:hover {
  border-color: var(--ink);
  color: var(--ink-2);
}
.copy-chip {
  min-height: 44px;
  font-size: 12px;
  padding-inline: 20px;
}
.contact-links {
  font-size: 15px;
}
.contact-links > div {
  gap: 32px;
}
.contact footer {
  font-size: 12px;
  padding-block: 30px 4px;
}
.contact footer > a {
  min-height: 44px;
  display: flex;
  align-items: center;
}
.contact-links a {
  transition:
    translate 0.4s var(--ease),
    border-color 0.4s;
}
.contact-links a:hover {
  translate: 0 -2px;
}
@media (max-width: 700px) {
  .contact-note {
    font-size: 14px;
    max-width: 290px;
  }
  .contact-links {
    font-size: 14px;
  }
  .contact-email-row {
    margin-top: 30px;
  }
  .contact footer {
    font-size: 11px;
  }
  .contact-email {
    font-size: clamp(18px, 4.6vw, 28px);
  }
}

.contact-correspondence {
  margin-top: 42px;
  background: white;
  border: 1px solid var(--line);
  border-radius: 26px;
  padding: 34px 38px;
  position: relative;
}
.contact-address-label {
  color: var(--muted-text);
}
.contact-correspondence .contact-email-row {
  margin-top: 15px;
  justify-content: space-between;
}
.contact-correspondence .contact-links {
  border-top: 1px solid var(--line);
  padding-top: 20px;
  margin-top: 30px;
}
.contact-email {
  border-color: #c9c5bd;
}
.copy-chip {
  background: var(--paper);
}
.copy-chip:hover {
  background: var(--ink);
  color: white;
}
.contact-title {
  font-size: clamp(56px, 8.2vw, 118px);
}
.hello-badge {
  border: 1px solid var(--line);
  border-radius: 50%;
  padding: 4px;
}
.hello-badge > span {
  font-size: 36px;
}
.contact footer {
  margin-top: 75px;
}
@media (max-width: 700px) {
  .contact-correspondence {
    padding: 25px 20px;
    margin-top: 30px;
  }
  .contact-correspondence .contact-email-row {
    gap: 18px;
  }
  .contact-correspondence .contact-links {
    margin-top: 24px;
    padding-top: 18px;
  }
  .contact-email {
    font-size: clamp(16px, 4.15vw, 25px);
  }
  .contact-links > div {
    gap: 20px;
  }
  .contact-title {
    font-size: clamp(48px, 9vw, 68px);
  }
}
`}</style>
    </section>
  );
}
