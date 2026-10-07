"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { CERTIFICATIONS, COPY } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
export default function Certifications() {
  const [selected, setSelected] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState("idle");
  const current = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || selected === current.current) {
      current.current = selected;
      setDisplayed(selected);
      setPhase("idle");
      return;
    }
    setPhase("out");
    const swap = setTimeout(() => {
      current.current = selected;
      setDisplayed(selected);
      setPhase("in");
    }, 200);
    return () => clearTimeout(swap);
  }, [selected, reduced]);
  const certificate = CERTIFICATIONS[displayed];
  return (
    <section
      id="certifications"
      className="section certifications"
      aria-labelledby="certifications-title"
    >
      <div className="site-container certification-grid">
        <div className="certification-heading">
          <SectionHeading section="certifications" />
          <p className="mono">
            {String(CERTIFICATIONS.length).padStart(2, "0")}{" "}
            {COPY.certifications.count}
          </p>
          <div className="certification-folio" id="certificate-preview">
            <div className="folio-sheet folio-under" aria-hidden="true" />
            <div
              className={`folio-sheet folio-front flip-${phase}`}
              onAnimationEnd={() => setPhase("idle")}
            >
              <div className="folio-top mono">
                <span>{COPY.sections.certifications.tag}</span>
                <span>
                  {String(displayed + 1).padStart(2, "0")} /{" "}
                  {String(CERTIFICATIONS.length).padStart(2, "0")}
                </span>
              </div>
              <span className="folio-mark" aria-hidden="true">
                ✳
              </span>
              <span className="folio-title">{certificate.issuer}</span>
              <p className="folio-course">{certificate.title}</p>
              <span className="folio-distinction">
                {certificate.distinction}
              </span>
              <div className="folio-footer">
                <span className="mono folio-date">{certificate.date}</span>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
            <p
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {certificate.title}, {certificate.issuer}
              {certificate.distinction
                ? `, ${certificate.distinction}`
                : ""}, {certificate.date}
            </p>
          </div>
        </div>
        <ol className="certification-list">
          {CERTIFICATIONS.map((cert, i) => (
            <li
              key={cert.title}
              className="certification-row rv"
              data-selected={selected === i}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setSelected(i);
              }}
              onFocus={() => setSelected(i)}
            >
              <span className="mono certification-index">0{i + 1}</span>
              <div>
                <h3>
                  <button
                    className="certificate-select"
                    aria-pressed={selected === i}
                    aria-controls="certificate-preview"
                    onClick={() => setSelected(i)}
                  >
                    {cert.title}
                  </button>
                </h3>
                <p>
                  {cert.issuer}
                  {cert.distinction ? ` · ${cert.distinction}` : ""}
                </p>
                <span className="mono">{cert.date}</span>
              </div>
              <span className="certification-arrow" aria-hidden="true">
                ↗
              </span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
.certifications {
  background: white;
  border-block: 1px solid var(--line);
}
.certification-grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: clamp(40px, 7vw, 100px);
  align-items: start;
}
.certification-heading {
  position: sticky;
  top: 135px;
}
.certification-heading .section-head {
  margin-bottom: 28px;
}
.certification-heading .section-title {
  max-width: 340px;
}
.certification-heading > p {
  font-size: 10px;
  color: var(--muted-text);
  line-height: 1.8;
}
.certification-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.certification-row {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding: 32px 22px;
  border-bottom: 1px solid var(--line);
  transition: color 0.45s;
  overflow: hidden;
}
.certification-row:before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.6s var(--ease);
}
.certification-row:hover:before,
.certification-row:focus-within:before {
  transform: scaleX(1);
}
.certification-row:hover,
.certification-row:focus-within {
  color: white;
}
.certification-index {
  font-size: 10px;
  padding-top: 5px;
}
.certification-row h3 {
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.025em;
  font-weight: 450;
}
.certification-row p {
  font-size: 12px;
  margin-top: 13px;
  opacity: 0.65;
}
.certification-row div > .mono {
  font-size: 10px;
  display: block;
  margin-top: 20px;
  opacity: 0.65;
}
.certification-arrow {
  margin-left: auto;
  font-size: 25px;
  opacity: 0;
  transform: translate(-12px, 12px);
  transition:
    opacity 0.4s,
    transform 0.5s var(--ease);
}
.certification-row:hover .certification-arrow,
.certification-row:focus-within .certification-arrow {
  opacity: 1;
  transform: none;
}
@media (max-width: 750px) {
  .certification-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .certification-heading {
    position: static;
  }
  .certification-heading .section-title {
    max-width: none;
  }
  .certification-row {
    padding: 27px 10px;
    gap: 15px;
  }
  .certification-row h3 {
    font-size: 21px;
  }
  .certification-arrow {
    font-size: 20px;
  }
}

.certification-row {
  padding-block: 35px;
}
.certification-row h3 {
  font-size: 25px;
  font-weight: 450;
}
.certification-row p {
  font-size: 14px;
  line-height: 1.5;
}
.certification-heading > p {
  max-width: 270px;
  font-size: 10px;
  line-height: 1.9;
}
.certification-row div > .mono {
  font-size: 10px;
}
.certification-row:hover .certification-arrow,
.certification-row:focus-within .certification-arrow {
  translate: 2px -2px;
}
@media (max-width: 750px) {
  .certification-row h3 {
    font-size: 22px;
  }
  .certification-row {
    padding: 30px 14px;
  }
  .certification-row p {
    font-size: 13px;
  }
}

 .certification-folio {
  position: relative;
  width: min(100%, 320px);
  height: 315px;
  margin: 46px 0 0 12px;
  perspective: 1100px;
}
.folio-sheet {position:absolute;inset:0;background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:26px;box-shadow:0 18px 38px #00000008}
.folio-under {transform:rotate(-6deg);background:#e9e6e0;transition:transform .7s var(--ease)}
.certification-folio:has(.flip-out) .folio-under {transform:rotate(-9deg) translateY(3px)}
.folio-front {display:flex;flex-direction:column;align-items:flex-start;backface-visibility:hidden;transform-origin:50% 50%;transition:transform 200ms cubic-bezier(.55,0,1,.45);transform:rotateY(0deg)}
.folio-front.flip-out {transform:rotateY(90deg)}
.folio-front.flip-in {animation:certificate-turn-in 430ms var(--ease) both;transition:none}
@keyframes certificate-turn-in {from{transform:rotateY(-90deg)}to{transform:rotateY(0deg)}}
.folio-top {display:flex;justify-content:space-between;width:100%;gap:12px;font-size:8px;color:var(--muted-text)}
.folio-mark {font-size:35px;line-height:1;margin:23px 0 12px}
.folio-title {font-size:16px;letter-spacing:-.02em;color:var(--muted-text)}
.folio-course {font-size:25px;line-height:1.12;letter-spacing:-.035em;margin-top:8px;max-width:260px}
.folio-distinction {font-size:12px;margin-top:13px;color:var(--ink-2);min-height:17px}
.folio-footer {margin-top:auto;width:100%;display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--line);padding-top:14px}
.folio-date {font-size:9px;color:var(--muted-text)}
.certification-row {border-radius:4px;min-height:185px}
.certification-row h3 {max-width:400px}
.certificate-select {text-align:left;font:inherit}
.certificate-select:after {content:"";position:absolute;inset:0}
.certificate-select:focus-visible {outline:none}
.certification-row:has(:focus-visible){outline:2px solid var(--ink);outline-offset:5px}
.certification-row[data-selected="true"]:before{transform:scaleX(1)}
.certification-row[data-selected="true"]{color:white}
.certification-row[data-selected="true"] .certification-arrow {opacity:1;transform:none}
.certification-row > div {transition:translate .6s var(--ease)}
.certification-row:hover > div,.certification-row:focus-within > div{translate:7px 0}
@media(max-width:750px){
.certification-folio{display:block;width:min(100% - 18px,320px);height:300px;margin:32px auto 12px}
.certification-row{min-height:170px}
.folio-sheet{padding:23px}
.folio-course{font-size:24px}
}
@media(prefers-reduced-motion:reduce){
.folio-front,.folio-front.flip-out,.folio-front.flip-in{animation:none;transition:none;transform:none}
.folio-under{transition:none}
}
`}</style>
    </section>
  );
}
